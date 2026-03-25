import Link from 'next/link';
import { translate } from '@/lib/i18n';
import { getServerLocale } from '@/lib/locale.server';

export default async function NotFound() {
  const locale = await getServerLocale();
  const t = (path: string) => translate(locale, path);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <div className="site-panel mx-auto max-w-2xl rounded-[2.8rem] px-8 py-16 md:px-14">
        <p className="site-kicker mb-6">{t('notFound.kicker')}</p>
        <p className="display-type text-[8rem] font-black leading-none text-white/10 md:text-[12rem]">
          404
        </p>
        <h1 className="site-title mt-4 text-3xl font-black uppercase text-white md:text-5xl">
          {t('notFound.title')}
        </h1>
        <p className="mx-auto mt-5 max-w-md text-lg leading-8 text-slate-400">
          {t('notFound.description')}
        </p>
        <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
          <Link
            href="/"
            className="site-primary-button inline-flex items-center justify-center rounded-full px-7 py-4 text-sm font-black uppercase tracking-[0.24em] text-white"
          >
            {t('notFound.goHome')}
          </Link>
          <Link
            href="/events"
            className="site-outline-button inline-flex items-center justify-center rounded-full px-7 py-4 text-sm font-black uppercase tracking-[0.24em] text-white"
          >
            {t('notFound.browseEvents')}
          </Link>
        </div>
      </div>
    </div>
  );
}
