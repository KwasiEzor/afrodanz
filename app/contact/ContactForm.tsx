'use client';

import { useState } from 'react';
import { Send, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { sendContactMessage } from '@/app/actions/contact';
import { useTranslation } from '@/lib/locale-context';

export function ContactForm() {
  const t = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    const result = await sendContactMessage(formData);

    if (result.success) {
      setIsSent(true);
      setTimeout(() => setIsSent(false), 5000);
      event.currentTarget.reset();
    }

    setIsSubmitting(false);
  };

  return (
    <div className="site-panel relative overflow-hidden rounded-[2.8rem] p-8 md:p-12">
      <div className="absolute -right-10 top-0 h-52 w-52 rounded-full bg-secondary/18 blur-3xl" />
      <div className="absolute -bottom-10 left-0 h-48 w-48 rounded-full bg-primary/14 blur-3xl" />

      <div className="relative">
        <p className="site-kicker mb-4">{t('contactForm.kicker')}</p>
        <h2 className="site-title text-4xl font-black uppercase text-white">
          {t('contactForm.title')}
        </h2>
      </div>

      <AnimatePresence mode="wait">
        {isSent ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="relative flex flex-col items-center justify-center py-14 text-center"
          >
            <CheckCircle2 className="h-20 w-20 text-emerald-400" />
            <h3 className="mt-5 text-2xl font-black uppercase tracking-[0.2em] text-white">
              {t('contactForm.successTitle')}
            </h3>
            <p className="mt-3 max-w-md text-slate-400">
              {t('contactForm.successBody')}
            </p>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onSubmit={handleSubmit}
            className="relative mt-10 space-y-6"
          >
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-2">
        <label className="text-xs font-black uppercase tracking-[0.24em] text-slate-500">
          {t('contactForm.firstName')}
        </label>
                <input
                  required
                  name="firstName"
                  className="w-full rounded-[1.5rem] border border-white/10 bg-white/5 px-5 py-4 text-white outline-none placeholder:text-slate-500 focus:border-accent/40"
                />
              </div>
              <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-[0.24em] text-slate-500">
                {t('contactForm.lastName')}
              </label>
                <input
                  required
                  name="lastName"
                  className="w-full rounded-[1.5rem] border border-white/10 bg-white/5 px-5 py-4 text-white outline-none placeholder:text-slate-500 focus:border-accent/40"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-[0.24em] text-slate-500">
                {t('contactForm.email')}
              </label>
              <input
                required
                name="email"
                type="email"
                className="w-full rounded-[1.5rem] border border-white/10 bg-white/5 px-5 py-4 text-white outline-none placeholder:text-slate-500 focus:border-accent/40"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-[0.24em] text-slate-500">
                {t('contactForm.message')}
              </label>
              <textarea
                required
                name="message"
                rows={6}
                className="w-full resize-none rounded-[1.75rem] border border-white/10 bg-white/5 px-5 py-4 text-white outline-none placeholder:text-slate-500 focus:border-accent/40"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="site-primary-button inline-flex w-full items-center justify-center gap-3 rounded-full px-6 py-4 text-sm font-black uppercase tracking-[0.24em] text-white disabled:opacity-50"
            >
              {isSubmitting ? t('contactForm.sending') : t('contactForm.send')}
              {!isSubmitting && <Send className="h-4 w-4" />}
            </button>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
