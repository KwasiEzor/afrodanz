import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import type Stripe from 'stripe';
import { BookingStatus, SubscriptionStatus } from '@prisma/client';
import prisma from '@/lib/prisma';
import { stripe } from '@/lib/stripe';
import { subscriptionStatusFromStripe } from '@/lib/stripe-subscription-status';

function getPaymentIntentId(session: Stripe.Checkout.Session) {
  if (typeof session.payment_intent === 'string') {
    return session.payment_intent;
  }

  return session.payment_intent?.id ?? null;
}

async function markBookingPaid(session: Stripe.Checkout.Session) {
  const bookingId = session.metadata?.bookingId ?? session.client_reference_id;

  if (!bookingId) {
    console.error('Stripe webhook: missing booking identifier', {
      sessionId: session.id,
    });
    return;
  }

  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: { event: true },
  });

  if (!booking) {
    console.error('Stripe webhook: booking not found', bookingId);
    throw new Error(`Booking not found: ${bookingId}`);
  }

  if (booking.status === BookingStatus.PAID) {
    return;
  }

  if (booking.stripeCheckoutSessionId && booking.stripeCheckoutSessionId !== session.id) {
    console.error('Stripe webhook: checkout session mismatch', {
      bookingId,
      expected: booking.stripeCheckoutSessionId,
      got: session.id,
    });
    return;
  }

  if (session.payment_status !== 'paid') {
    return;
  }

  if (
    booking.event.price > 0 &&
    session.amount_total != null &&
    session.amount_total !== booking.event.price
  ) {
    console.error('Stripe webhook: amount mismatch', {
      bookingId,
      expected: booking.event.price,
      got: session.amount_total,
    });
    return;
  }

  await prisma.booking.update({
    where: { id: bookingId },
    data: {
      status: BookingStatus.PAID,
      expiresAt: null,
      paidAt: new Date(),
      stripeCheckoutSessionId: session.id,
      stripePaymentIntentId: getPaymentIntentId(session),
    },
  });
}

async function expireBookingHold(session: Stripe.Checkout.Session) {
  const bookingId = session.metadata?.bookingId ?? session.client_reference_id;

  if (!bookingId) {
    return;
  }

  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
  });

  if (!booking || booking.status !== BookingStatus.PENDING) {
    return;
  }

  if (booking.stripeCheckoutSessionId && booking.stripeCheckoutSessionId !== session.id) {
    return;
  }

  await prisma.booking.update({
    where: { id: bookingId },
    data: {
      status: BookingStatus.CANCELED,
      expiresAt: null,
      stripeCheckoutSessionId: null,
      stripePaymentIntentId: null,
    },
  });
}

export async function POST(req: Request) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error('Stripe webhook: STRIPE_WEBHOOK_SECRET is not configured');
    return new NextResponse('Webhook not configured', { status: 500 });
  }

  const body = await req.text();
  const signature = (await headers()).get('Stripe-Signature');
  if (!signature) {
    return new NextResponse('Missing Stripe-Signature', { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      webhookSecret
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new NextResponse(`Webhook Error: ${message}`, { status: 400 });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;

        if (session.mode === 'payment') {
          await markBookingPaid(session);
        } else if (session.mode === 'subscription') {
          const userId = session.metadata?.userId;

          if (!userId) {
            break;
          }

          const subscriptionId =
            typeof session.subscription === 'string'
              ? session.subscription
              : session.subscription?.id;
          const customerId =
            typeof session.customer === 'string'
              ? session.customer
              : session.customer?.id;

          if (!subscriptionId || !customerId) {
            console.error('Stripe webhook: missing subscription or customer id', {
              sessionId: session.id,
              subscription: session.subscription,
              customer: session.customer,
            });
            break;
          }

          await prisma.user.update({
            where: { id: userId },
            data: {
              stripeSubscriptionId: subscriptionId,
              stripeCustomerId: customerId,
              subscriptionStatus: SubscriptionStatus.ACTIVE,
            },
          });
        }
        break;
      }

      case 'checkout.session.expired': {
        await expireBookingHold(event.data.object as Stripe.Checkout.Session);
        break;
      }

      case 'customer.subscription.deleted': {
        const subscriptionDeleted = event.data.object as Stripe.Subscription;
        await prisma.user.update({
          where: { stripeSubscriptionId: subscriptionDeleted.id },
          data: {
            subscriptionStatus: SubscriptionStatus.CANCELED,
          },
        });
        break;
      }

      case 'customer.subscription.updated': {
        const subscriptionUpdated = event.data.object as Stripe.Subscription;
        const nextStatus = subscriptionStatusFromStripe(subscriptionUpdated.status);
        if (nextStatus) {
          await prisma.user.update({
            where: { stripeSubscriptionId: subscriptionUpdated.id },
            data: {
              subscriptionStatus: nextStatus,
            },
          });
        }
        break;
      }

      case 'invoice.payment_failed': {
        const invoiceFailed = event.data.object as Stripe.Invoice & {
          subscription?: string | Stripe.Subscription | null;
        };
        const subId =
          typeof invoiceFailed.subscription === 'string'
            ? invoiceFailed.subscription
            : invoiceFailed.subscription?.id;
        if (subId) {
          await prisma.user.update({
            where: { stripeSubscriptionId: subId },
            data: {
              subscriptionStatus: SubscriptionStatus.PAST_DUE,
            },
          });
        }
        break;
      }
    }
  } catch (error) {
    console.error('Stripe webhook handler error:', error);
    const message = error instanceof Error ? error.message : 'Internal error';
    return new NextResponse(message, { status: 500 });
  }

  return new NextResponse(null, { status: 200 });
}
