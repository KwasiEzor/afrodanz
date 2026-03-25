import { beforeEach, describe, expect, it, vi } from 'vitest';
import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { stripe } from '@/lib/stripe';
import { bookEvent, createSubscriptionSession } from './bookings';

vi.mock('@/lib/stripe', () => ({
  stripe: {
    checkout: {
      sessions: {
        create: vi.fn(),
        retrieve: vi.fn(),
        expire: vi.fn(),
      },
    },
  },
}));

describe('bookEvent Server Action', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.NEXT_PUBLIC_APP_URL = 'https://afrodanz.test';
  });

  it('should fail if event is fully booked including pending bookings', async () => {
    vi.mocked(auth).mockResolvedValue({
      user: { id: 'user_1', email: 'test@test.com' },
    } as unknown as Awaited<ReturnType<typeof auth>>);

    vi.mocked(prisma.event.findUnique).mockResolvedValue({
      id: 'event_1',
      capacity: 10,
      price: 2500,
    } as unknown as Awaited<ReturnType<typeof prisma.event.findUnique>>);

    vi.mocked(prisma.booking.findUnique).mockResolvedValue(null);
    vi.mocked(prisma.booking.count).mockResolvedValue(10);

    await expect(bookEvent('event_1')).rejects.toThrow('This event is fully booked');
  });

  it('should reuse an existing open checkout session for an active pending booking', async () => {
    vi.mocked(auth).mockResolvedValue({
      user: { id: 'user_1', email: 'test@test.com' },
    } as unknown as Awaited<ReturnType<typeof auth>>);

    vi.mocked(prisma.event.findUnique).mockResolvedValue({
      id: 'event_1',
      slug: 'workshop',
      title: 'Workshop',
      capacity: 10,
      price: 2500,
      category: 'Workshop',
      location: 'Studio',
    } as unknown as Awaited<ReturnType<typeof prisma.event.findUnique>>);

    vi.mocked(prisma.booking.findUnique).mockResolvedValue({
      id: 'booking_1',
      userId: 'user_1',
      eventId: 'event_1',
      status: 'PENDING',
      stripeCheckoutSessionId: 'cs_existing',
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
    } as unknown as Awaited<ReturnType<typeof prisma.booking.findUnique>>);

    vi.mocked(prisma.booking.count).mockResolvedValue(3);
    vi.mocked(prisma.booking.update).mockResolvedValue({
      id: 'booking_1',
    } as unknown as Awaited<ReturnType<typeof prisma.booking.update>>);

    vi.mocked(stripe.checkout.sessions.retrieve).mockResolvedValue({
      id: 'cs_existing',
      status: 'open',
      url: 'https://checkout.stripe.test/existing',
    } as unknown as Awaited<ReturnType<typeof stripe.checkout.sessions.retrieve>>);

    const result = await bookEvent('event_1');

    expect(result).toEqual({ url: 'https://checkout.stripe.test/existing' });
    expect(stripe.checkout.sessions.create).not.toHaveBeenCalled();
  });

  it('should create a new checkout session and persist the session identifiers', async () => {
    vi.mocked(auth).mockResolvedValue({
      user: { id: 'user_1', email: 'test@test.com' },
    } as unknown as Awaited<ReturnType<typeof auth>>);

    vi.mocked(prisma.event.findUnique).mockResolvedValue({
      id: 'event_1',
      slug: 'workshop',
      title: 'Workshop',
      capacity: 10,
      price: 2500,
      category: 'Workshop',
      location: 'Studio',
    } as unknown as Awaited<ReturnType<typeof prisma.event.findUnique>>);

    vi.mocked(prisma.booking.findUnique).mockResolvedValue(null);
    vi.mocked(prisma.booking.count).mockResolvedValue(0);
    vi.mocked(prisma.booking.create).mockResolvedValue({
      id: 'booking_1',
    } as unknown as Awaited<ReturnType<typeof prisma.booking.create>>);
    vi.mocked(prisma.booking.update).mockResolvedValue({
      id: 'booking_1',
    } as unknown as Awaited<ReturnType<typeof prisma.booking.update>>);

    vi.mocked(stripe.checkout.sessions.create).mockResolvedValue({
      id: 'cs_new',
      url: 'https://checkout.stripe.test/new',
      payment_intent: 'pi_new',
    } as unknown as Awaited<ReturnType<typeof stripe.checkout.sessions.create>>);

    const result = await bookEvent('event_1');

    expect(result).toEqual({ url: 'https://checkout.stripe.test/new' });
    expect(stripe.checkout.sessions.create).toHaveBeenCalledOnce();
    expect(prisma.booking.update).toHaveBeenLastCalledWith({
      where: { id: 'booking_1' },
      data: {
        stripeCheckoutSessionId: 'cs_new',
        stripePaymentIntentId: 'pi_new',
      },
    });
  });

  it('should fall back to localhost checkout redirects when no app URL env is configured in test/dev', async () => {
    delete process.env.NEXT_PUBLIC_APP_URL;

    vi.mocked(auth).mockResolvedValue({
      user: { id: 'user_1', email: 'test@test.com' },
    } as unknown as Awaited<ReturnType<typeof auth>>);

    vi.mocked(prisma.event.findUnique).mockResolvedValue({
      id: 'event_1',
      slug: 'workshop',
      title: 'Workshop',
      capacity: 10,
      price: 2500,
      category: 'Workshop',
      location: 'Studio',
    } as unknown as Awaited<ReturnType<typeof prisma.event.findUnique>>);

    vi.mocked(prisma.booking.findUnique).mockResolvedValue(null);
    vi.mocked(prisma.booking.count).mockResolvedValue(0);
    vi.mocked(prisma.booking.create).mockResolvedValue({
      id: 'booking_1',
    } as unknown as Awaited<ReturnType<typeof prisma.booking.create>>);
    vi.mocked(prisma.booking.update).mockResolvedValue({
      id: 'booking_1',
    } as unknown as Awaited<ReturnType<typeof prisma.booking.update>>);
    vi.mocked(stripe.checkout.sessions.create).mockResolvedValue({
      id: 'cs_new',
      url: 'https://checkout.stripe.test/new',
      payment_intent: 'pi_new',
    } as unknown as Awaited<ReturnType<typeof stripe.checkout.sessions.create>>);

    await expect(bookEvent('event_1')).resolves.toEqual({
      url: 'https://checkout.stripe.test/new',
    });
    expect(stripe.checkout.sessions.create).toHaveBeenCalledWith(
      expect.objectContaining({
        success_url: 'http://localhost:3000/checkout/success?session_id={CHECKOUT_SESSION_ID}',
        cancel_url: 'http://localhost:3000/events/workshop?booking_canceled=true',
      })
    );
  });
});

describe('createSubscriptionSession', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.NEXT_PUBLIC_APP_URL = 'https://afrodanz.test';
  });

  it('should validate the configured app URL before creating a subscription session', async () => {
    process.env.NEXT_PUBLIC_APP_URL = 'not-a-url';

    vi.mocked(auth).mockResolvedValue({
      user: { id: 'user_1', email: 'test@test.com' },
    } as unknown as Awaited<ReturnType<typeof auth>>);

    await expect(createSubscriptionSession('Basic Dancer')).rejects.toThrow(
      'NEXT_PUBLIC_APP_URL must be a valid absolute URL'
    );
  });
});
