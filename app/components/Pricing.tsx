'use client';

import { motion } from 'framer-motion';
import { Check, ArrowUpRight } from 'lucide-react';
import { useState } from 'react';
import { createSubscriptionSession } from '@/app/actions/bookings';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useLocale, useTranslation } from '@/lib/locale-context';
import { getCopy } from '@/lib/i18n';

const PLAN_KEYS = [
  { id: 'basic', price: '€29', period: '/month', popular: false },
  { id: 'pro', price: '€79', period: '/month', popular: true },
  { id: 'elite', price: '€149', period: '/month', popular: false },
] as const;

export function Pricing() {
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const router = useRouter();
  const t = useTranslation();
  const { locale } = useLocale();

  const handleSubscribe = async (planName: string) => {
    setLoadingPlan(planName);
    try {
      const result = await createSubscriptionSession(planName);
      if (result.url) {
        window.location.href = result.url;
      }
    } catch (error: unknown) {
      console.error(error);
      const loginMessage = t('pricing.loginRequired');
      const message = error instanceof Error ? error.message : loginMessage;
      if (message.toLowerCase().includes('logged in')) {
        toast.error(loginMessage);
        router.push('/login');
      } else {
        toast.error(t('pricing.error'));
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
            <p className="site-kicker mb-4">{t('pricing.kicker')}</p>
            <h2 className="site-title text-3xl font-black uppercase text-white md:text-5xl">
              {t('pricing.title').split(' ').slice(0, -1).join(' ')}{' '}
              <span className="site-highlight">{t('pricing.highlight')}</span>
            </h2>
            <p className="mt-4 text-lg leading-8 text-slate-400">
              {t('pricing.description')}
            </p>
          </div>
          <div className="site-panel-soft rounded-[1.75rem] px-5 py-4 text-sm leading-6 text-slate-300">
            <p className="font-black uppercase tracking-[0.24em] text-accent">{t('pricing.subtitle')}</p>
            <p className="mt-2 max-w-sm">{t('pricing.subtitleBody')}</p>
          </div>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {PLAN_KEYS.map((plan, index) => {
            const planName = t(`pricing.plans.${plan.id}.name`);
            const planFeatures =
              (getCopy(locale, `pricing.plans.${plan.id}.features`) ?? []) as string[];
            const planCta = t(`pricing.plans.${plan.id}.cta`);

            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
                viewport={{ once: true }}
                className={`relative overflow-hidden rounded-[2.2rem] p-8 ${
                  plan.popular ? 'site-panel ring-1 ring-accent/30' : 'site-panel-soft'
                }`}
              >
                {plan.popular && (
                  <span className="absolute right-6 top-6 rounded-full border border-accent/25 bg-accent/10 px-4 py-2 text-[0.65rem] font-black uppercase tracking-[0.28em] text-accent">
                    {t('pricing.popular')}
                  </span>
                )}

                <div className="mb-10">
                  <p className="text-sm font-black uppercase tracking-[0.24em] text-slate-400">{planName}</p>
                  <div className="mt-5 flex items-end gap-2">
                    <span className="display-type text-5xl font-black text-white">{plan.price}</span>
                    <span className="pb-2 text-sm font-black uppercase tracking-[0.18em] text-slate-400">
                      {plan.period}
                    </span>
                  </div>
                </div>

                <ul className="space-y-4">
                  {planFeatures.map((feature) => (
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
                  onClick={() => handleSubscribe(planName)}
                  disabled={!!loadingPlan}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`flex w-full items-center justify-center gap-2 rounded-full px-6 py-4 text-sm font-black uppercase tracking-[0.24em] text-white ${
                    plan.popular ? 'site-primary-button' : 'site-outline-button'
                  } disabled:opacity-50`}
                >
                  {loadingPlan === planName ? (
                    <span className="animate-pulse">{t('pricing.redirecting')}</span>
                  ) : (
                    <>
                      {planCta}
                      <ArrowUpRight className="h-4 w-4" />
                    </>
                  )}
                </motion.button>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
