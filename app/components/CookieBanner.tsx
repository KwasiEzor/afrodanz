'use client';

/* eslint-disable react-hooks/set-state-in-effect */

import { AnimatePresence, motion } from 'framer-motion';
import { Link2 } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import {
  acceptAllCookies,
  getConsent,
  savePreferences,
  type CookieConsent,
} from '@/lib/cookie-consent';
import { useTranslation } from '@/lib/locale-context';

const panelTransition = {
  duration: 0.24,
  ease: [0.22, 1, 0.36, 1],
} as const;

const CATEGORY_KEYS = ['analytics', 'marketing'] as const;
type CategoryKey = (typeof CATEGORY_KEYS)[number];

export function CookieBanner() {
  const t = useTranslation();
  const [consent, setConsent] = useState<CookieConsent | null>(null);
  const [showPanel, setShowPanel] = useState(false);
  const [prefs, setPrefs] = useState<Record<CategoryKey, boolean>>({
    analytics: consent?.categories.analytics ?? false,
    marketing: consent?.categories.marketing ?? false,
  });

  useEffect(() => {
    const stored = getConsent();
    setConsent(stored);
    setPrefs({
      analytics: stored?.categories.analytics ?? false,
      marketing: stored?.categories.marketing ?? false,
    });
  }, []);

  const bannerVisible = !consent;
  const panelVisible = showPanel;

  const handleAcceptAll = () => {
    const updated = acceptAllCookies();
    setConsent(updated);
    setPrefs({
      analytics: true,
      marketing: true,
    });
    setShowPanel(false);
  };

  const handleSave = () => {
    const updated = savePreferences({
      analytics: prefs.analytics,
      marketing: prefs.marketing,
    });
    setConsent(updated);
    setShowPanel(false);
  };

  const toggleCategory = (key: CategoryKey) => {
    setPrefs((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const showManageTrigger = !!consent && !showPanel;

  const prefButtonLabel = useMemo(
    () => (consent ? t('cookieBanner.manageCookies') : t('cookieBanner.setPreferences')),
    [consent, t]
  );

  const categoryLabels: Record<CategoryKey, string> = {
    analytics: t('cookieBanner.analytics'),
    marketing: t('cookieBanner.marketing'),
  };

  return (
    <>
      <AnimatePresence>
        {bannerVisible && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            className="fixed inset-x-4 bottom-6 z-[120] rounded-[1.6rem] border border-white/8 bg-black/80 p-5 text-sm text-slate-200 shadow-2xl backdrop-blur-xl md:inset-x-10"
          >
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <p>
                {t('cookieBanner.bannerText')}{' '}
                <Link href="/privacy" className="font-bold text-white/90 underline">{t('cookieBanner.privacyLink')}</Link>{' '}
                {t('cookieBanner.bannerTextEnd')}
              </p>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={handleAcceptAll}
                  className="site-primary-button rounded-full px-4 py-2 text-xs font-black uppercase tracking-[0.22em] text-white"
                >
                  {t('cookieBanner.acceptAll')}
                </button>
                <button
                  onClick={() => setShowPanel(true)}
                  className="site-outline-button rounded-full px-4 py-2 text-xs font-black uppercase tracking-[0.22em] text-white"
                >
                  {t('cookieBanner.managePreferences')}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {panelVisible && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            transition={panelTransition}
            className="fixed inset-x-4 bottom-6 z-[120] mx-auto max-w-md rounded-[2rem] border border-white/10 bg-black/90 p-6 text-sm text-slate-200 shadow-2xl backdrop-blur-xl md:inset-x-[30%]"
          >
            <div className="flex items-center justify-between">
              <p className="text-xs font-black uppercase tracking-[0.26em] text-white/70">
                {t('cookieBanner.cookiePreferences')}
              </p>
              <button
                onClick={() => setShowPanel(false)}
                className="text-slate-400 underline hover:text-white"
              >
                {t('cookieBanner.close')}
              </button>
            </div>
            <p className="mt-4 text-sm text-slate-300">
              {t('cookieBanner.essentialInfo')}
            </p>
            <div className="mt-6 space-y-4">
              {CATEGORY_KEYS.map((key) => (
                <label
                  key={key}
                  className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3"
                >
                  <span>{categoryLabels[key]}</span>
                  <input
                    type="checkbox"
                    checked={prefs[key]}
                    onChange={() => toggleCategory(key)}
                    className="h-4 w-4 accent-primary"
                  />
                </label>
              ))}
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <button
                onClick={handleAcceptAll}
                className="site-primary-button rounded-full px-4 py-2 text-xs font-black uppercase tracking-[0.22em] text-white"
              >
                {t('cookieBanner.acceptAll')}
              </button>
              <button
                onClick={handleSave}
                className="site-outline-button rounded-full px-4 py-2 text-xs font-black uppercase tracking-[0.22em] text-white"
              >
                {t('cookieBanner.savePreferences')}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {showManageTrigger && (
        <button
          onClick={() => setShowPanel(true)}
          className="fixed bottom-6 right-6 z-[120] flex items-center gap-2 rounded-full border border-white/10 bg-black/60 px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-white shadow-lg backdrop-blur-lg"
        >
          <Link2 className="h-4 w-4" />
          {prefButtonLabel}
        </button>
      )}
    </>
  );
}
