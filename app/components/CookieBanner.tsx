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

const panelTransition = {
  duration: 0.24,
  ease: [0.22, 1, 0.36, 1],
} as const;

const CATEGORY_LABELS = [
  { key: 'analytics', label: 'Analytics cookies' },
  { key: 'marketing', label: 'Marketing cookies' },
] as const;

type CategoryKey = (typeof CATEGORY_LABELS)[number]['key'];

export function CookieBanner() {
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
    () => (consent ? 'Manage cookies' : 'Set preferences'),
    [consent]
  );

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
                We use cookies for essential functionality plus analytics and marketing when you consent. Read
                our <Link href="/privacy" className="font-bold text-white/90 underline">privacy policy</Link>{' '}
                for the details.
              </p>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={handleAcceptAll}
                  className="site-primary-button rounded-full px-4 py-2 text-xs font-black uppercase tracking-[0.22em] text-white"
                >
                  Accept All
                </button>
                <button
                  onClick={() => setShowPanel(true)}
                  className="site-outline-button rounded-full px-4 py-2 text-xs font-black uppercase tracking-[0.22em] text-white"
                >
                  Manage Preferences
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
                Cookie Preferences
              </p>
              <button
                onClick={() => setShowPanel(false)}
                className="text-slate-400 underline hover:text-white"
              >
                Close
              </button>
            </div>
            <p className="mt-4 text-sm text-slate-300">
              Essential cookies are always active. Choose whether to allow analytics or marketing cookies.
            </p>
            <div className="mt-6 space-y-4">
              {CATEGORY_LABELS.map((category) => (
                <label
                  key={category.key}
                  className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3"
                >
                  <span>{category.label}</span>
                  <input
                    type="checkbox"
                    checked={prefs[category.key]}
                    onChange={() => toggleCategory(category.key)}
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
                Accept All
              </button>
              <button
                onClick={handleSave}
                className="site-outline-button rounded-full px-4 py-2 text-xs font-black uppercase tracking-[0.22em] text-white"
              >
                Save Preferences
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
