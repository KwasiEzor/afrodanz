'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, Menu, X, Sparkles, User, User2 } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import { useLocale, useTranslation } from '@/lib/locale-context';

const NAV_LINKS = [
  { key: 'nav.home', href: '/' },
  { key: 'nav.events', href: '/events' },
  { key: 'nav.about', href: '/about' },
  { key: 'nav.contact', href: '/contact' },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const isAuthenticated = Boolean(session?.user) && status === 'authenticated';
  const { locale, setLocale } = useLocale();
  const t = useTranslation();
  const switchLocale = () => setLocale(locale === 'fr' ? 'en' : 'fr');
  const localeFlag = locale === 'fr' ? '🇬🇧' : '🇫🇷';

  const handleSignOut = () => {
    signOut({ callbackUrl: '/' });
  };

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setScrolled(window.scrollY > 32);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (
    pathname.startsWith('/dashboard') ||
    pathname.startsWith('/admin') ||
    pathname === '/login' ||
    pathname.startsWith('/events/')
  ) {
    return null;
  }

  return (
    <nav
      className={`fixed top-0 z-[100] w-full transition-all duration-500 ${
        scrolled ? 'py-4' : 'py-6'
      }`}
    >
      <div className="mx-auto max-w-7xl px-6">
        <div
          className={`flex items-center justify-between rounded-full px-4 py-3 transition-all duration-500 md:px-6 ${
            scrolled
              ? 'site-panel border border-white/8'
              : 'border border-white/10 bg-black/15 backdrop-blur-md'
          }`}
        >
          <Link href="/" className="flex items-center gap-3 text-white">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-accent shadow-lg shadow-primary/20">
              <Sparkles className="h-4 w-4" />
            </span>
            <div className="leading-none">
              <p className="display-type text-lg font-black uppercase tracking-[0.22em]">
                AfroDanz
              </p>
              <p className="text-[0.65rem] font-bold uppercase tracking-[0.26em] text-slate-400">
                Rhythm Studio
              </p>
            </div>
          </Link>

          <div className="hidden items-center gap-3 md:flex">
            <div className="flex items-center gap-2 rounded-full border border-white/8 bg-white/5 px-3 py-2">
              {NAV_LINKS.map((link) => {
                const isActive = pathname === link.href;

                return (
                  <Link
                    key={link.key}
                    href={link.href}
                    className={`rounded-full px-4 py-2 text-xs font-black uppercase tracking-[0.24em] ${
                      isActive
                        ? 'bg-white text-slate-950 shadow-lg'
                        : 'text-slate-300 hover:text-white'
                    }`}
                  >
                      {t(link.key)}
                  </Link>
                );
              })}
            </div>

            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <Link
                  href="/dashboard"
                  className="site-panel-soft inline-flex items-center justify-center rounded-full px-5 py-3 text-xs font-black uppercase tracking-[0.24em] text-white hover:border-primary/40"
                  aria-label={t('dashboard')}
                >
                  <User2 className="h-4 w-4" />
                  <span className="sr-only">{t('dashboard')}</span>
                </Link>
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="site-outline-button inline-flex items-center justify-center rounded-full px-5 py-3 text-xs font-black uppercase tracking-[0.24em] text-white"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="sr-only">{t('signOut')}</span>
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="site-primary-button inline-flex items-center gap-2 rounded-full px-5 py-3 text-xs font-black uppercase tracking-[0.24em] text-white"
              >
                <User className="h-4 w-4" />
                {t('portal')}
              </Link>
            )}
            <button
              type="button"
              onClick={switchLocale}
              className="rounded-full border border-white/10 px-4 py-3 text-sm font-black uppercase tracking-[0.22em] text-white"
              aria-label={t('languageToggle')}
            >
              {localeFlag}
            </button>
          </div>

          <button
            onClick={() => setIsOpen((open) => !open)}
            className="rounded-full border border-white/10 bg-white/5 p-3 text-white md:hidden"
            aria-label="Toggle navigation menu"
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            className="mx-6 mt-3 rounded-[2rem] border border-white/8 bg-[#0d1120]/96 p-6 shadow-2xl backdrop-blur-xl md:hidden"
          >
            <div className="flex flex-col gap-3">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.key}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="rounded-2xl border border-white/6 bg-white/4 px-5 py-4 text-sm font-black uppercase tracking-[0.24em] text-slate-200"
                >
                  {t(link.key)}
                </Link>
              ))}
              {isAuthenticated ? (
                <>
                  <Link
                    href="/dashboard"
                    onClick={() => setIsOpen(false)}
                    className="site-panel-soft inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-4 text-sm font-black uppercase tracking-[0.24em] text-white"
                  >
                    <User2 className="h-4 w-4" />
                    {t('dashboard')}
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      setIsOpen(false);
                      handleSignOut();
                    }}
                    className="site-outline-button mt-2 inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-4 text-sm font-black uppercase tracking-[0.24em] text-white"
                  >
                    <LogOut className="h-4 w-4" />
                    {t('signOut')}
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setIsOpen(false)}
                  className="site-primary-button mt-2 inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-4 text-sm font-black uppercase tracking-[0.24em] text-white"
                >
                  <User className="h-4 w-4" />
                  {t('portal')}
                </Link>
              )}
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  switchLocale();
                }}
                className="site-outline-button mt-2 inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-4 text-sm font-black uppercase tracking-[0.24em] text-white"
              >
                <span>{localeFlag}</span>
                <span>{t('languageToggle')}</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
