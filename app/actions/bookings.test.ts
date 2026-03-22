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
    (auth as any).mockResolvedValue({ user: { id: 'user_1', email: 'test@test.com' } });
    
    // Mock event with capacity 10 and 9 PAID bookings
    (prisma.event.findUnique as any).mockResolvedValue({
      id: 'event_1',
      title: 'Workshop',
      capacity: 10,
      price: 2500,
      _count: { bookings: 9 }
    });

    // Mock 1 PENDING booking that is recent (not expired)
    (prisma.booking.count as any).mockResolvedValue(1);

    await expect(bookEvent('event_1')).rejects.toThrow('This event is fully booked');
  });

  it('should allow booking if pending bookings are expired', async () => {
     (auth as any).mockResolvedValue({ user: { id: 'user_1', email: 'test@test.com' } });
    
    (prisma.event.findUnique as any).mockResolvedValue({
      id: 'event_1',
      title: 'Workshop',
      capacity: 10,
      price: 2500,
      _count: { bookings: 9 }
    });

    // Mock 0 ACTIVE (PAID or recent PENDING) bookings besides the 9 paid
    (prisma.booking.count as any).mockResolvedValue(0);
    (prisma.booking.findFirst as any).mockResolvedValue(null);
    (prisma.booking.upsert as any).mockResolvedValue({ id: 'booking_1' });
    
    (stripe.checkout.sessions.create as any).mockResolvedValue({ url: 'http://stripe.com' });

    const result = await bookEvent('event_1');
    expect(result.url).toBe('http://stripe.com');
  });
});
