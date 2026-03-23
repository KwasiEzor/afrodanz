'use client';

import { motion } from 'framer-motion';
import { Check, ArrowUpRight } from 'lucide-react';
import { useState } from 'react';
import { createSubscriptionSession } from '@/app/actions/bookings';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

const PLANS = [
  {
    name: 'Basic Dancer',
    price: '€29',
    period: '/month',
    features: [
      '4 classes per month',
      'Main studio access',
      'Member newsletter',
      'Workshop discounts',
    ],
    cta: 'Start Basic',
    popular: false,
  },
  {
    name: 'Pro Performer',
    price: '€79',
    period: '/month',
    features: [
      'Unlimited drop-in classes',
      '2 special workshops included',
      'Outdoor arena access',
      'Priority event booking',
      'Community hub access',
    ],
    cta: 'Go Pro',
    popular: true,
  },
  {
    name: 'Elite Master',
    price: '€149',
    period: '/month',
    features: [
      'All Pro features',
      'Monthly 1:1 mentoring',
      'Exclusive intensive access',
      'Guest choreographer sessions',
      'AfroDanz merch included',
    ],
    cta: 'Unlock Elite',
    popular: false,
  },
];

export function Pricing() {
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const router = useRouter();

  const handleSubscribe = async (planName: string) => {
    setLoadingPlan(planName);
    try {
      const result = await createSubscriptionSession(planName);
      if (result.url) {
        window.location.href = result.url;
      }
    } catch (error: unknown) {
      console.error(error);
      const message = error instanceof Error ? error.message : '';
      if (message.includes('logged in')) {
        toast.error('Please log in to start a membership.');
        router.push('/login');
      } else {
        toast.error('Failed to start subscription. Please try again.');
      }
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <section id="pricing" className="px-4 py-24 md:px-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-14 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="site-kicker mb-4">Membership system</p>
            <h2 className="site-title text-3xl font-black uppercase text-white md:text-5xl">
              Choose Your <span className="site-highlight">Rhythm</span>
            </h2>
            <p className="mt-4 text-lg leading-8 text-slate-400">
              Pick the tier that matches your pace, from weekly training to all-access studio immersion.
            </p>
          </div>
          <div className="site-panel-soft rounded-[1.75rem] px-5 py-4 text-sm leading-6 text-slate-300">
            <p className="font-black uppercase tracking-[0.24em] text-accent">Built for progression</p>
            <p className="mt-2 max-w-sm">
              Each membership is designed around how often you train, book intensives, and show up for community sessions.
            </p>
          </div>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {PLANS.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08 }}
              viewport={{ once: true }}
              className={`relative overflow-hidden rounded-[2.2rem] p-8 ${
                plan.popular ? 'site-panel ring-1 ring-accent/30' : 'site-panel-soft'
              }`}
            >
              {plan.popular && (
                <span className="absolute right-6 top-6 rounded-full border border-accent/25 bg-accent/10 px-4 py-2 text-[0.65rem] font-black uppercase tracking-[0.28em] text-accent">
                  Most Chosen
                </span>
              )}

              <div className="mb-10">
                <p className="text-sm font-black uppercase tracking-[0.24em] text-slate-400">{plan.name}</p>
                <div className="mt-5 flex items-end gap-2">
                  <span className="display-type text-5xl font-black text-white">{plan.price}</span>
                  <span className="pb-2 text-sm font-black uppercase tracking-[0.18em] text-slate-400">
                    {plan.period}
                  </span>
                </div>
              </div>

              <ul className="space-y-4">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-sm text-slate-300">
                    <span className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-primary/18 text-primary">
                      <Check className="h-4 w-4" />
                    </span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <div className="neon-divider my-8" />

              <motion.button
                onClick={() => handleSubscribe(plan.name)}
                disabled={!!loadingPlan}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`flex w-full items-center justify-center gap-2 rounded-full px-6 py-4 text-sm font-black uppercase tracking-[0.24em] text-white ${
                  plan.popular ? 'site-primary-button' : 'site-outline-button'
                } disabled:opacity-50`}
              >
                {loadingPlan === plan.name ? (
                  <span className="animate-pulse">Redirecting</span>
                ) : (
                  <>
                    {plan.cta}
                    <ArrowUpRight className="h-4 w-4" />
                  </>
                )}
              </motion.button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
