import { redirect } from 'next/navigation';
import { stripe } from '@/lib/stripe';
import { CheckoutSuccessUI } from './CheckoutSuccessUI';

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id } = await searchParams;

  if (!session_id) {
    redirect('/dashboard');
  }

  let session;
  try {
    session = await stripe.checkout.sessions.retrieve(session_id);
  } catch {
    redirect('/dashboard');
  }

  const isCompleted = session.status === 'complete';
  const isSubscription = session.mode === 'subscription';

  if (!isCompleted) {
    redirect('/dashboard');
  }

  const successParam = isSubscription
    ? 'subscription_success=true'
    : 'booking_success=true';

  return <CheckoutSuccessUI dashboardUrl={`/dashboard?${successParam}`} />;
}
