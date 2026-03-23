'use server';
import prisma from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { revalidatePath } from 'next/cache';
import { stripe } from '@/lib/stripe';

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
};

type FreeBookingPayload = {
  kind: 'free';
};

export async function bookEvent(eventId: string) {
  const session = await auth();

  if (!session?.user) {
    throw new Error('You must be logged in to book an event');
  }

  const userId = session.user.id;

  const checkoutPayload = await prisma.$transaction(async (tx) => {
    const event = await tx.event.findUnique({
      where: { id: eventId },
      include: {
        _count: {
          select: {
            bookings: {
              where: { status: 'PAID' },
            },
          },
        },
      },
    });

    if (!event) throw new Error('Event not found');

    const activePendingCount = await tx.booking.count({
      where: {
        eventId,
        status: 'PENDING',
        expiresAt: {
          gt: new Date(),
        },
        NOT: {
          userId,
        },
      },
    });

    const totalActiveBookings = event._count.bookings + activePendingCount;

    if (totalActiveBookings >= event.capacity) {
      throw new Error('This event is fully booked');
    }

    const existingPaidBooking = await tx.booking.findFirst({
      where: {
        userId,
        eventId,
        status: 'PAID',
      },
    });

    if (existingPaidBooking) {
      throw new Error('You have already booked this event');
    }

    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

    const existingPending = await tx.booking.findFirst({
      where: { userId, eventId, status: 'PENDING' },
    });

    const booking = existingPending
      ? await tx.booking.update({
          where: { id: existingPending.id },
          data: { expiresAt },
        })
      : await tx.booking.create({
          data: {
            userId,
            eventId,
            status: 'PENDING',
            expiresAt,
          },
        });

    if (event.price > 0) {
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
      } satisfies PaidCheckoutPayload;
    }

    await tx.booking.update({
      where: { id: booking.id },
      data: {
        status: 'PAID',
        expiresAt: null,
      },
    });

    return { kind: 'free' as const } satisfies FreeBookingPayload;
  });

  if (checkoutPayload.kind === 'paid') {
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
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?booking_success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/events/${checkoutPayload.slug}?booking_canceled=true`,
      metadata: {
        userId: checkoutPayload.userId,
        eventId: checkoutPayload.eventId,
        bookingId: checkoutPayload.bookingId,
      },
    });

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
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?subscription_success=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/#pricing`,
    customer_email: userEmail ?? undefined,
    metadata: {
      userId,
      planName,
    },
  });

  return { url: checkoutSession.url };
}
