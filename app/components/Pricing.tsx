'use client';

import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { useState } from 'react';
import { createSubscriptionSession } from '@/app/actions/bookings';
import { useRouter } from 'next/navigation';

const PLANS = [
  {
    name: 'Basic Dancer',
    price: '€29',
    period: '/month',
    features: [
      '4 Classes per month',
      'Access to Main Studio',
      'Member-only Newsletter',
      'Basic Workshop Discounts'
    ],
    cta: 'Get Started',
    popular: false
  },
  {
    name: 'Pro Performer',
    price: '€79',
    period: '/month',
    features: [
      'Unlimited Drop-in Classes',
      '2 Special Workshops included',
      'Access to Outdoor Arena',
      'Priority Event Booking',
      'Community Hub Access'
    ],
    cta: 'Join Pro',
    popular: true
  },
  {
    name: 'Elite Master',
    price: '€149',
    period: '/month',
    features: [
      'All Pro Features',
      '1-on-1 Monthly Mentoring',
      'Exclusive Intensive Access',
      'Guest Choreographer Q&A',
      'Free AfroDanz Merch'
    ],
    cta: 'Go Elite',
    popular: false
  }
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
        router.push('/login');
      } else {
        alert('Failed to start subscription. Please try again.');
      }
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <section id="pricing" className="py-24 px-4 bg-slate-50 dark:bg-slate-950/50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-black mb-4 uppercase tracking-tight"
          >
            Choose Your <span className="text-primary italic">Rhythm</span>
          </motion.h2>
          <p className="text-muted text-lg max-w-2xl mx-auto">
            Flexible membership plans designed to fit your dance journey, whether you&apos;re a beginner or a pro.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {PLANS.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className={`relative p-8 rounded-3xl border ${
                plan.popular 
                  ? 'bg-white dark:bg-slate-900 border-primary shadow-2xl shadow-primary/10' 
                  : 'bg-white/50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800'
              }`}
            >
              {plan.popular && (
                <span className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary text-white text-xs font-black uppercase tracking-widest rounded-full">
                  Most Popular
                </span>
              )}

              <div className="mb-8">
                <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black">{plan.price}</span>
                  <span className="text-muted font-medium">{plan.period}</span>
                </div>
              </div>

              <ul className="space-y-4 mb-10">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-sm">
                    <Check className="w-5 h-5 text-primary shrink-0" />
                    <span className="text-slate-600 dark:text-slate-400">{feature}</span>
                  </li>
                ))}
              </ul>

              <motion.button
                onClick={() => handleSubscribe(plan.name)}
                disabled={!!loadingPlan}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full py-4 rounded-2xl font-black transition-all flex items-center justify-center gap-2 ${
                  plan.popular 
                    ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                    : 'bg-foreground text-background hover:bg-primary hover:text-white'
                } disabled:opacity-50`}
              >
                {loadingPlan === plan.name ? (
                   <span className="animate-pulse">Redirecting...</span>
                ) : (
                  plan.cta
                )}
              </motion.button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
