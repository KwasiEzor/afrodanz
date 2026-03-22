'use server';
import prisma from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { revalidatePath } from 'next/cache';
import { stripe } from '@/lib/stripe';

export async function bookEvent(eventId: string) {
  const session = await auth();

  if (!session?.user) {
    throw new Error('You must be logged in to book an event');
  }

  const userId = session.user.id;

  // 1. Fetch Event Details
  const event = await prisma.event.findUnique({
    where: { id: eventId },
    include: {
      _count: {
        select: { bookings: true }
      }
    }
  });

  if (!event) throw new Error('Event not found');

  // 2. Check Capacity
  if (event._count.bookings >= event.capacity) {
    throw new Error('This event is fully booked');
  }

  // 3. Check if already booked
  const existingBooking = await prisma.booking.findFirst({
    where: {
      userId,
      eventId,
      status: 'PAID'
    }
  });

  if (existingBooking) {
    throw new Error('You have already booked this event');
  }

  // 4. Handle Payment Logic
  // If price > 0, we need to create a Stripe Checkout Session
  if (event.price > 0) {
    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: event.title,
              description: `${event.category} - ${event.location}`,
            },
            unit_amount: event.price,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?booking_success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/?booking_canceled=true`,
      metadata: {
        userId,
        eventId
      }
    });

    return { url: checkoutSession.url };
  }

  // 5. If Free Event (Price = 0)
  await prisma.booking.create({
    data: {
      userId,
      eventId,
      status: 'PAID'
    }
  });

  revalidatePath('/dashboard');
  return { success: true };
}

export async function createSubscriptionSession(planName: string) {
  const session = await auth();

  if (!session?.user) {
    throw new Error('You must be logged in to subscribe');
  }

  const userId = session.user.id;
  const userEmail = session.user.email;

  // Map plan names to (placeholder) price IDs
  const planMap: Record<string, string> = {
    'Basic Dancer': 'price_basic_monthly',
    'Pro Performer': 'price_pro_monthly',
    'Elite Master': 'price_elite_monthly',
  };

  const priceId = planMap[planName];
  if (!priceId) throw new Error('Invalid plan selected');

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
          unit_amount: planName === 'Basic Dancer' ? 2900 : planName === 'Pro Performer' ? 7900 : 14900,
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
    customer_email: userEmail as string,
    metadata: {
      userId,
      planName
    }
  });

  return { url: checkoutSession.url };
}
