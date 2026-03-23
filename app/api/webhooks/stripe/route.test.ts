import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST } from './route';
import prisma from '@/lib/prisma';
import { stripe } from '@/lib/stripe';

vi.mock('@/lib/stripe', () => ({
  stripe: {
    webhooks: {
      constructEvent: vi.fn(),
    },
  },
}));

describe('Stripe Webhook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should update booking to PAID on checkout.session.completed', async () => {
    const mockSession = {
      type: 'checkout.session.completed',
      data: {
        object: {
          metadata: {
            userId: 'user_1',
            eventId: 'event_1',
            bookingId: 'booking_1',
          },
          payment_status: 'paid',
          amount_total: 2500,
        },
      },
    };

    vi.mocked(stripe.webhooks.constructEvent).mockReturnValue(
      mockSession as ReturnType<typeof stripe.webhooks.constructEvent>
    );

    vi.mocked(prisma.booking.findUnique).mockResolvedValue({
      id: 'booking_1',
      event: { price: 2500 },
    } as Awaited<ReturnType<typeof prisma.booking.findUnique>>);

    const req = new Request('http://localhost', {
      method: 'POST',
      headers: { 'Stripe-Signature': 'sig' },
      body: JSON.stringify({}),
    });

    const response = await POST(req);
    expect(response.status).toBe(200);

    expect(prisma.booking.update).toHaveBeenCalledWith({
      where: { id: 'booking_1' },
      data: {
        status: 'PAID',
        expiresAt: null,
      },
    });
  });

  it('should handle customer.subscription.deleted', async () => {
    const mockEvent = {
      type: 'customer.subscription.deleted',
      data: {
        object: {
          id: 'sub_1',
        },
      },
    };

    vi.mocked(stripe.webhooks.constructEvent).mockReturnValue(
      mockEvent as ReturnType<typeof stripe.webhooks.constructEvent>
    );

    const req = new Request('http://localhost', {
      method: 'POST',
      headers: { 'Stripe-Signature': 'sig' },
      body: JSON.stringify({}),
    });

    const response = await POST(req);
    expect(response.status).toBe(200);

    expect(prisma.user.update).toHaveBeenCalledWith({
      where: { stripeSubscriptionId: 'sub_1' },
      data: {
        subscriptionStatus: 'CANCELED',
      },
    });
  });
});
