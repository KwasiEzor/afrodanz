import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-01-27' as any,
});

export const getStripeSession = async ({ 
  priceId, 
  customerId, 
  successUrl, 
  cancelUrl 
}: { 
  priceId: string, 
  customerId?: string, 
  successUrl: string, 
  cancelUrl: string 
}) => {
  return await stripe.checkout.sessions.create({
    customer: customerId,
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    success_url: successUrl,
    cancel_url: cancelUrl,
  });
};
