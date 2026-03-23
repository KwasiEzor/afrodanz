'use client';

import { motion } from 'framer-motion';
import { CheckCircle2, ArrowRight, Calendar } from 'lucide-react';
import Link from 'next/link';

export default function CheckoutSuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-white dark:bg-slate-900 p-12 rounded-[3rem] shadow-2xl shadow-primary/10 text-center border border-slate-100 dark:border-slate-800"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
          className="w-24 h-24 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mx-auto mb-8"
        >
          <CheckCircle2 className="w-12 h-12" />
        </motion.div>

        <h1 className="text-4xl font-black mb-4 uppercase tracking-tighter">You&apos;re in the <span className="text-primary italic">Rhythm!</span></h1>
        <p className="text-muted text-lg mb-10">
          Your payment was successful. We&apos;ve sent a confirmation email to your inbox.
        </p>

        <div className="space-y-4">
          <Link 
            href="/dashboard"
            className="w-full flex items-center justify-center gap-3 py-4 bg-primary text-white font-black rounded-2xl shadow-xl shadow-primary/20 hover:brightness-110 transition-all"
          >
            Go to Dashboard <ArrowRight className="w-5 h-5" />
          </Link>
          
          <Link 
            href="/events"
            className="w-full flex items-center justify-center gap-3 py-4 bg-slate-100 dark:bg-slate-800 text-foreground font-black rounded-2xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
          >
            View More Events <Calendar className="w-5 h-5" />
          </Link>
        </div>

        <p className="mt-12 text-xs text-muted uppercase tracking-widest font-bold opacity-50">
          Let&apos;s Dance • AfroDanz 2026
        </p>
      </motion.div>
    </div>
  );
}
