'use server';

import type Stripe from 'stripe';
import { revalidatePath } from 'next/cache';
import prisma from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { stripe } from '@/lib/stripe';
import { getRequiredAppUrl } from '@/lib/app-url';

const BOOKING_HOLD_MS = 15 * 60 * 1000;

type PaidCheckoutPayload = {
  kind: 'paid';
  bookingId: string;
  slug: string;
  title: string;
  category: string;
  location: string;
  price: number;
  userId: string;
  eventId: string;
  expiresAt: Date;
  reusableCheckoutSessionId: string | null;
};

type FreeBookingPayload = {
  kind: 'free';
};

function nextBookingExpiry(from: Date) {
  return new Date(from.getTime() + BOOKING_HOLD_MS);
}

function getPaymentIntentId(session: Stripe.Checkout.Session) {
  if (typeof session.payment_intent === 'string') {
    return session.payment_intent;
  }

  return session.payment_intent?.id ?? null;
}

export async function bookEvent(eventId: string) {
  const session = await auth();

  if (!session?.user) {
    throw new Error('You must be logged in to book an event');
  }

  const userId = session.user.id;
  const now = new Date();

  const checkoutPayload = await prisma.$transaction(async (tx) => {
    const [event, existingBooking] = await Promise.all([
      tx.event.findUnique({
        where: { id: eventId },
      }),
      tx.booking.findUnique({
        where: {
          userId_eventId: {
            userId,
            eventId,
          },
        },
      }),
    ]);

    if (!event) {
      throw new Error('Event not found');
    }

    if (existingBooking?.status === 'PAID') {
      throw new Error('You have already booked this event');
    }

    const activeBookingsCount = await tx.booking.count({
      where: {
        eventId,
        OR: [
          { status: 'PAID' },
          {
            status: 'PENDING',
            expiresAt: {
              gt: now,
            },
          },
        ],
        ...(existingBooking ? { NOT: { id: existingBooking.id } } : {}),
      },
    });

    if (activeBookingsCount >= event.capacity) {
      throw new Error('This event is fully booked');
    }

    if (event.price <= 0) {
      if (existingBooking) {
        await tx.booking.update({
          where: { id: existingBooking.id },
          data: {
            status: 'PAID',
            expiresAt: null,
            stripeCheckoutSessionId: null,
            stripePaymentIntentId: null,
            paidAt: now,
          },
        });
      } else {
        await tx.booking.create({
          data: {
            userId,
            eventId,
            status: 'PAID',
            paidAt: now,
          },
        });
      }

      return { kind: 'free' as const } satisfies FreeBookingPayload;
    }

    const expiresAt = nextBookingExpiry(now);

    const booking = existingBooking
      ? await tx.booking.update({
          where: { id: existingBooking.id },
          data: {
            status: 'PENDING',
            expiresAt,
            paidAt: null,
          },
        })
      : await tx.booking.create({
          data: {
            userId,
            eventId,
            status: 'PENDING',
            expiresAt,
          },
        });

    const reusableCheckoutSessionId =
      existingBooking?.status === 'PENDING' &&
      existingBooking.expiresAt != null &&
      existingBooking.expiresAt > now
        ? existingBooking.stripeCheckoutSessionId
        : null;

    return {
      kind: 'paid' as const,
      bookingId: booking.id,
      slug: event.slug,
      title: event.title,
      category: event.category,
      location: event.location,
      price: event.price,
      userId,
      eventId,
      expiresAt,
      reusableCheckoutSessionId,
    } satisfies PaidCheckoutPayload;
  });

  if (checkoutPayload.kind === 'paid') {
    const appUrl = getRequiredAppUrl();

    if (checkoutPayload.reusableCheckoutSessionId) {
      try {
        const existingSession = await stripe.checkout.sessions.retrieve(
          checkoutPayload.reusableCheckoutSessionId
        );

        if (existingSession.status === 'open' && existingSession.url) {
          return { url: existingSession.url };
        }

        if (existingSession.status === 'open') {
          await stripe.checkout.sessions.expire(existingSession.id);
        }
      } catch (error) {
        console.error('Stripe checkout session reuse failed', {
          bookingId: checkoutPayload.bookingId,
          sessionId: checkoutPayload.reusableCheckoutSessionId,
          error,
        });
      }
    }

    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: checkoutPayload.title,
              description: `${checkoutPayload.category} - ${checkoutPayload.location}`,
            },
            unit_amount: checkoutPayload.price,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      expires_at: Math.floor(checkoutPayload.expiresAt.getTime() / 1000),
      success_url: `${appUrl}/dashboard?booking_success=true`,
      cancel_url: `${appUrl}/events/${checkoutPayload.slug}?booking_canceled=true`,
      client_reference_id: checkoutPayload.bookingId,
      metadata: {
        userId: checkoutPayload.userId,
        eventId: checkoutPayload.eventId,
        bookingId: checkoutPayload.bookingId,
      },
    });

    await prisma.booking.update({
      where: { id: checkoutPayload.bookingId },
      data: {
        stripeCheckoutSessionId: checkoutSession.id,
        stripePaymentIntentId: getPaymentIntentId(checkoutSession),
      },
    });

    if (!checkoutSession.url) {
      throw new Error('Failed to create checkout session');
    }

    return { url: checkoutSession.url };
  }

  revalidatePath('/dashboard');
  return { success: true };
}

const PLAN_AMOUNTS_EUR_CENTS: Record<string, number> = {
  'Basic Dancer': 2900,
  'Pro Performer': 7900,
  'Elite Master': 14900,
};

export async function createSubscriptionSession(planName: string) {
  const session = await auth();

  if (!session?.user) {
    throw new Error('You must be logged in to subscribe');
  }

  const userId = session.user.id;
  const userEmail = session.user.email;

  const unitAmount = PLAN_AMOUNTS_EUR_CENTS[planName];
  if (unitAmount === undefined) {
    throw new Error('Invalid plan selected');
  }

  const appUrl = getRequiredAppUrl();

  const checkoutSession = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'eur',
          product_data: {
            name: planName,
            description: `AfroDanz ${planName} Membership`,
          },
          unit_amount: unitAmount,
          recurring: {
            interval: 'month',
          },
        },
        quantity: 1,
      },
    ],
    mode: 'subscription',
    success_url: `${appUrl}/dashboard?subscription_success=true`,
    cancel_url: `${appUrl}/#pricing`,
    customer_email: userEmail ?? undefined,
    metadata: {
      userId,
      planName,
    },
  });

  return { url: checkoutSession.url };
}
