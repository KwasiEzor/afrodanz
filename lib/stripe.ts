import Stripe from "stripe"

// Next.js evaluates route modules at build time; a missing env would throw during `next build`.
const secretKey =
  process.env.STRIPE_SECRET_KEY ??
  "sk_test_build_placeholder_replace_in_runtime"

export const stripe = new Stripe(secretKey, {
  typescript: true,
  apiVersion: "2026-02-25.clover",
})

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
