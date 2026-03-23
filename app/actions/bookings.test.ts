import { describe, it, expect, vi, beforeEach } from 'vitest';
import { bookEvent } from './bookings';
import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { stripe } from '@/lib/stripe';

vi.mock('@/lib/stripe', () => ({
  stripe: {
    checkout: {
      sessions: {
        create: vi.fn(),
      },
    },
  },
}));

describe('bookEvent Server Action', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should fail if event is fully booked including pending bookings', async () => {
    vi.mocked(auth).mockResolvedValue({
      user: { id: 'user_1', email: 'test@test.com' },
    } as Awaited<ReturnType<typeof auth>>);

    vi.mocked(prisma.event.findUnique).mockResolvedValue({
      id: 'event_1',
      title: 'Workshop',
      capacity: 10,
      price: 2500,
      _count: { bookings: 9 },
    } as Awaited<ReturnType<typeof prisma.event.findUnique>>);

    vi.mocked(prisma.booking.count).mockResolvedValue(1);

    await expect(bookEvent('event_1')).rejects.toThrow('This event is fully booked');
  });

  it('should allow booking if pending bookings are expired', async () => {
    vi.mocked(auth).mockResolvedValue({
      user: { id: 'user_1', email: 'test@test.com' },
    } as Awaited<ReturnType<typeof auth>>);

    vi.mocked(prisma.event.findUnique).mockResolvedValue({
      id: 'event_1',
      title: 'Workshop',
      slug: 'workshop',
      capacity: 10,
      price: 2500,
      category: 'Workshop',
      location: 'Studio',
      _count: { bookings: 9 },
    } as Awaited<ReturnType<typeof prisma.event.findUnique>>);

    vi.mocked(prisma.booking.count).mockResolvedValue(0);
    vi.mocked(prisma.booking.findFirst).mockResolvedValue(null);
    vi.mocked(prisma.booking.create).mockResolvedValue({
      id: 'booking_1',
    } as Awaited<ReturnType<typeof prisma.booking.create>>);

    vi.mocked(stripe.checkout.sessions.create).mockResolvedValue({
      url: 'http://stripe.com',
    } as Awaited<ReturnType<typeof stripe.checkout.sessions.create>>);

    const result = await bookEvent('event_1');
    expect(result.url).toBe('http://stripe.com');
  });
});
