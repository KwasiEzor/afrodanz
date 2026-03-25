import type { Metadata } from 'next';
import Link from 'next/link';
import { translate } from '@/lib/i18n';
import { getServerLocale } from '@/lib/locale.server';

export const metadata: Metadata = {
  title: 'Terms of Service | AfroDanz',
  description: 'Terms and conditions for bookings, memberships, and studio participation at AfroDanz.',
};

export default async function TermsPage() {
  const locale = await getServerLocale();
  const t = (path: string) => translate(locale, path);
  return (
    <div className="min-h-screen px-4 py-32 md:px-6">
      <div className="mx-auto max-w-5xl space-y-10">
        <header className="site-panel rounded-[2.8rem] px-8 py-12 md:px-12">
          <p className="site-kicker mb-4">{t('terms.kicker')}</p>
          <h1 className="site-title text-4xl font-black uppercase text-white md:text-6xl">
            {t('terms.title')}
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">
            {t('terms.description')}
          </p>
        </header>

        <section className="grid gap-8">
          <article className="site-panel-soft rounded-[2rem] p-8">
            <h2 className="display-type text-3xl font-black uppercase text-white">
              {t('terms.sections.bookingsTitle')}
            </h2>
            <p className="mt-4 text-sm leading-7 text-slate-400">{t('terms.sections.bookings')}</p>
          </article>
          <article className="site-panel-soft rounded-[2rem] p-8">
            <h2 className="display-type text-3xl font-black uppercase text-white">
              {t('terms.sections.membershipsTitle')}
            </h2>
            <p className="mt-4 text-sm leading-7 text-slate-400">{t('terms.sections.memberships')}</p>
          </article>
          <article className="site-panel-soft rounded-[2rem] p-8">
            <h2 className="display-type text-3xl font-black uppercase text-white">
              {t('terms.sections.conductTitle')}
            </h2>
            <p className="mt-4 text-sm leading-7 text-slate-400">{t('terms.sections.conduct')}</p>
          </article>
        </section>

        <section className="site-panel rounded-[2.8rem] px-8 py-10 md:px-12">
          <h2 className="site-title text-3xl font-black uppercase text-white md:text-4xl">
            {t('terms.clarification.title')}
          </h2>
          <p className="mt-4 max-w-2xl text-slate-300">
            {t('terms.clarification.description')}
          </p>
          <Link
            href="/contact"
            className="site-primary-button mt-8 inline-flex rounded-full px-6 py-3 text-xs font-black uppercase tracking-[0.24em] text-white"
          >
            {t('terms.clarification.button')}
          </Link>
        </section>
      </div>
    </div>
  );
}
