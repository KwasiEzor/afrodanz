import { beforeEach, describe, expect, it, vi } from 'vitest';
import prisma from '@/lib/prisma';
import { stripe } from '@/lib/stripe';
import { POST } from './route';

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
    process.env.STRIPE_WEBHOOK_SECRET = 'whsec_test';
  });

  it('should update a pending booking to PAID on checkout.session.completed', async () => {
    const mockEvent = {
      type: 'checkout.session.completed',
      data: {
        object: {
          id: 'cs_live',
          mode: 'payment',
          client_reference_id: 'booking_1',
          metadata: {
            bookingId: 'booking_1',
          },
          payment_status: 'paid',
          payment_intent: 'pi_live',
          amount_total: 2500,
        },
      },
    };

    vi.mocked(stripe.webhooks.constructEvent).mockReturnValue(
      mockEvent as unknown as ReturnType<typeof stripe.webhooks.constructEvent>
    );

    vi.mocked(prisma.booking.findUnique).mockResolvedValue({
      id: 'booking_1',
      status: 'PENDING',
      stripeCheckoutSessionId: 'cs_live',
      event: { price: 2500 },
    } as unknown as Awaited<ReturnType<typeof prisma.booking.findUnique>>);

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
        paidAt: expect.any(Date),
        stripeCheckoutSessionId: 'cs_live',
        stripePaymentIntentId: 'pi_live',
      },
    });
  });

  it('should ignore a completed checkout for a stale session id', async () => {
    const mockEvent = {
      type: 'checkout.session.completed',
      data: {
        object: {
          id: 'cs_stale',
          mode: 'payment',
          client_reference_id: 'booking_1',
          metadata: {
            bookingId: 'booking_1',
          },
          payment_status: 'paid',
          amount_total: 2500,
        },
      },
    };

    vi.mocked(stripe.webhooks.constructEvent).mockReturnValue(
      mockEvent as unknown as ReturnType<typeof stripe.webhooks.constructEvent>
    );

    vi.mocked(prisma.booking.findUnique).mockResolvedValue({
      id: 'booking_1',
      status: 'PENDING',
      stripeCheckoutSessionId: 'cs_current',
      event: { price: 2500 },
    } as unknown as Awaited<ReturnType<typeof prisma.booking.findUnique>>);

    const req = new Request('http://localhost', {
      method: 'POST',
      headers: { 'Stripe-Signature': 'sig' },
      body: JSON.stringify({}),
    });

    const response = await POST(req);

    expect(response.status).toBe(200);
    expect(prisma.booking.update).not.toHaveBeenCalled();
  });

  it('should cancel an expired pending checkout session hold', async () => {
    const mockEvent = {
      type: 'checkout.session.expired',
      data: {
        object: {
          id: 'cs_expired',
          client_reference_id: 'booking_1',
          metadata: {
            bookingId: 'booking_1',
          },
        },
      },
    };

    vi.mocked(stripe.webhooks.constructEvent).mockReturnValue(
      mockEvent as unknown as ReturnType<typeof stripe.webhooks.constructEvent>
    );

    vi.mocked(prisma.booking.findUnique).mockResolvedValue({
      id: 'booking_1',
      status: 'PENDING',
      stripeCheckoutSessionId: 'cs_expired',
    } as unknown as Awaited<ReturnType<typeof prisma.booking.findUnique>>);

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
        status: 'CANCELED',
        expiresAt: null,
        stripeCheckoutSessionId: null,
        stripePaymentIntentId: null,
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
      mockEvent as unknown as ReturnType<typeof stripe.webhooks.constructEvent>
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

  it('should return 500 when STRIPE_WEBHOOK_SECRET is not configured', async () => {
    const original = process.env.STRIPE_WEBHOOK_SECRET;
    delete process.env.STRIPE_WEBHOOK_SECRET;

    const req = new Request('http://localhost', {
      method: 'POST',
      headers: { 'Stripe-Signature': 'sig' },
      body: JSON.stringify({}),
    });

    const response = await POST(req);
    expect(response.status).toBe(500);

    process.env.STRIPE_WEBHOOK_SECRET = original;
  });

  it('should extract subscription and customer ids from object references', async () => {
    const mockEvent = {
      type: 'checkout.session.completed',
      data: {
        object: {
          id: 'cs_sub',
          mode: 'subscription',
          metadata: { userId: 'user_1' },
          subscription: { id: 'sub_obj' },
          customer: { id: 'cus_obj' },
        },
      },
    };

    vi.mocked(stripe.webhooks.constructEvent).mockReturnValue(
      mockEvent as unknown as ReturnType<typeof stripe.webhooks.constructEvent>
    );

    const req = new Request('http://localhost', {
      method: 'POST',
      headers: { 'Stripe-Signature': 'sig' },
      body: JSON.stringify({}),
    });

    const response = await POST(req);
    expect(response.status).toBe(200);

    expect(prisma.user.update).toHaveBeenCalledWith({
      where: { id: 'user_1' },
      data: {
        stripeSubscriptionId: 'sub_obj',
        stripeCustomerId: 'cus_obj',
        subscriptionStatus: 'ACTIVE',
      },
    });
  });
});
