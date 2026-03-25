'use client';

import { motion } from 'framer-motion';
import { CheckCircle2, ArrowRight, Calendar } from 'lucide-react';
import Link from 'next/link';
import { useTranslation } from '@/lib/locale-context';

interface CheckoutSuccessUIProps {
  dashboardUrl: string;
}

export function CheckoutSuccessUI({ dashboardUrl }: CheckoutSuccessUIProps) {
  const t = useTranslation();

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full site-panel p-12 rounded-[3rem] text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
          className="w-24 h-24 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mx-auto mb-8"
        >
          <CheckCircle2 className="w-12 h-12" />
        </motion.div>

        <h1 className="text-4xl font-black mb-4 uppercase tracking-tighter">
          {t('checkout.successTitle')}
        </h1>
        <p className="text-muted text-lg mb-10">
          {t('checkout.successBody')}
        </p>

        <div className="space-y-4">
          <Link
            href={dashboardUrl}
            className="w-full flex items-center justify-center gap-3 py-4 site-primary-button font-black rounded-2xl text-white"
          >
            {t('checkout.goToDashboard')} <ArrowRight className="w-5 h-5" />
          </Link>

          <Link
            href="/events"
            className="w-full flex items-center justify-center gap-3 py-4 site-outline-button font-black rounded-2xl text-white"
          >
            {t('checkout.viewMoreEvents')} <Calendar className="w-5 h-5" />
          </Link>
        </div>

        <p className="mt-12 text-xs text-muted uppercase tracking-widest font-bold opacity-50">
          {t('checkout.tagline')}
        </p>
      </motion.div>
    </div>
  );
}
