'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, RotateCcw, Home } from 'lucide-react';
import { useTranslation } from '@/lib/locale-context';

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslation();

  useEffect(() => {
    console.error('Dashboard error:', error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="site-panel max-w-md w-full rounded-[2.4rem] p-10 text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10 text-red-400">
          <AlertTriangle className="h-8 w-8" />
        </div>
        <h2 className="site-title text-2xl font-black uppercase text-white">
          {t('errors.dashboardUnavailable')}
        </h2>
        <p className="mt-4 text-sm text-slate-400">
          {t('errors.dashboardError')}
        </p>
        <div className="mt-8 flex flex-col gap-3">
          <button
            onClick={reset}
            className="site-primary-button flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-black uppercase tracking-[0.2em] text-white"
          >
            <RotateCcw className="h-4 w-4" />
            {t('errors.tryAgain')}
          </button>
          <Link
            href="/"
            className="site-outline-button flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-black uppercase tracking-[0.2em] text-white"
          >
            <Home className="h-4 w-4" />
            {t('errors.goHome')}
          </Link>
        </div>
      </div>
    </div>
  );
}
