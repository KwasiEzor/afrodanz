'use client';

import Link from 'next/link';
import { Sparkles } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useTranslation } from '@/lib/locale-context';

const NAV_LINKS = [
  { key: 'footer.nav.home', href: '/' },
  { key: 'footer.nav.events', href: '/events' },
  { key: 'footer.nav.about', href: '/about' },
  { key: 'footer.privacy', href: '/privacy' },
  { key: 'footer.terms', href: '/terms' },
  { key: 'footer.contact', href: '/contact' },
];

export function Footer() {
  const pathname = usePathname();
  const t = useTranslation();

  if (
    pathname.startsWith('/dashboard') ||
    pathname.startsWith('/admin') ||
    pathname === '/login'
  ) {
    return null;
  }

  return (
    <footer className="border-t border-white/6 px-4 py-12 md:px-6">
      <div className="mx-auto max-w-7xl rounded-[2rem] border border-white/6 bg-white/4 px-6 py-8 backdrop-blur-xl">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div className="max-w-sm">
            <Link href="/" className="flex items-center gap-3 text-white">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-accent shadow-lg shadow-primary/20">
                <Sparkles className="h-4 w-4" />
              </span>
              <p className="display-type text-lg font-black uppercase tracking-[0.22em]">
                AfroDanz
              </p>
            </Link>
            <p className="mt-4 text-sm leading-7 text-slate-400">
              {t('footer.description')}
            </p>
          </div>

          <nav className="flex flex-wrap gap-x-6 gap-y-3 text-xs font-black uppercase tracking-[0.24em] text-slate-400">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="hover:text-white"
              >
                {t(link.key)}
              </Link>
            ))}
          </nav>
        </div>

        <div className="mt-8 border-t border-white/6 pt-6 text-center text-sm text-slate-500">
          {t('footer.copyright')}
        </div>
      </div>
    </footer>
  );
}
