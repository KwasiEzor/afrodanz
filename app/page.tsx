import Link from 'next/link';
import prisma from '@/lib/prisma';
import { ArrowUpRight, CalendarDays, Headphones, Sparkles } from 'lucide-react';
import { Hero } from './components/Hero';
import { EventsPreview, type EventPreviewItem } from './components/EventsPreview';
import { Pricing } from './components/Pricing';
import {
  isPrismaDatabaseUnavailableError,
  isPrismaMissingTableError,
} from '@/lib/prisma-errors';
import { getCopy, translate } from '@/lib/i18n';
import { getServerLocale } from '@/lib/locale.server';

export const revalidate = 60;

export default async function Home() {
  const locale = await getServerLocale();
  const t = (path: string) => translate(locale, path);
  const pillarCopy = (getCopy(locale, 'platform.pillars') ?? []) as Array<{
    label: string;
    body: string;
  }>;
  const pillarIcons = [Sparkles, CalendarDays, Headphones];
  const platformPillars = pillarCopy.map((item, index) => ({
    icon: pillarIcons[index] ?? Sparkles,
    ...item,
  }));

  const getFeaturedEvents = () =>
    prisma.event.findMany({
      where: {
        date: {
          gte: new Date(),
        },
      },
      orderBy: {
        date: 'asc',
      },
      take: 3,
      select: {
        id: true,
        slug: true,
        title: true,
        date: true,
        location: true,
        price: true,
        category: true,
      },
    });

  let featuredEvents: Awaited<ReturnType<typeof getFeaturedEvents>> = [];

  try {
    featuredEvents = await getFeaturedEvents();
  } catch (error) {
    if (
      !isPrismaMissingTableError(error, 'Event') &&
      !isPrismaDatabaseUnavailableError(error)
    ) {
      throw error;
    }
  }

  const previewEvents: EventPreviewItem[] = featuredEvents.map((event) => ({
    ...event,
    date: event.date.toISOString(),
  }));

  return (
    <div className="flex min-h-screen flex-col">
      <Hero />

      <section className="px-4 pb-6 md:px-6">
        <div className="mx-auto grid max-w-7xl gap-6 md:grid-cols-3">
          {platformPillars.map((pillar) => (
            <article key={pillar.label} className="site-panel-soft rounded-[2rem] p-8">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/15 text-primary">
                <pillar.icon className="h-5 w-5" />
              </div>
              <h2 className="display-type text-2xl font-black uppercase text-white">
                {pillar.label}
              </h2>
              <p className="mt-4 text-sm leading-7 text-slate-400">{pillar.body}</p>
            </article>
          ))}
        </div>
      </section>

      <EventsPreview events={previewEvents} />
      <Pricing />

      <section className="px-4 py-24 md:px-6">
        <div className="site-panel relative mx-auto overflow-hidden rounded-[2.8rem] px-8 py-12 md:max-w-7xl md:px-14 md:py-16">
          <div className="absolute -right-14 top-0 h-56 w-56 rounded-full bg-secondary/18 blur-3xl" />
          <div className="absolute bottom-0 left-0 h-40 w-40 rounded-full bg-accent/12 blur-3xl" />

          <div className="relative flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <p className="site-kicker mb-4">{t('membership.kicker')}</p>
              <h2 className="site-title text-3xl font-black uppercase text-white md:text-5xl">
                {t('membership.title')}
                <span className="site-highlight block">{t('membership.highlight')}</span>
              </h2>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">
                {t('membership.description')}
              </p>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row">
              <Link
                href="#pricing"
                className="site-primary-button inline-flex items-center justify-center gap-2 rounded-full px-7 py-4 text-sm font-black uppercase tracking-[0.24em] text-white"
              >
                {t('membership.planButton')}
                <ArrowUpRight className="h-4 w-4" />
              </Link>
              <Link
                href="/contact"
                className="site-outline-button inline-flex items-center justify-center gap-2 rounded-full px-7 py-4 text-sm font-black uppercase tracking-[0.24em] text-white"
              >
                {t('membership.talkButton')}
              </Link>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/6 px-4 py-12 md:px-6">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 rounded-[2rem] border border-white/6 bg-white/4 px-6 py-8 backdrop-blur-xl md:flex-row md:items-center md:justify-between">
          <div>
            <p className="display-type text-2xl font-black uppercase tracking-[0.24em] text-white">
              AfroDanz
            </p>
            <p className="mt-2 text-sm text-slate-400">{t('footer.description')}</p>
          </div>
          <div className="flex flex-wrap gap-6 text-xs font-black uppercase tracking-[0.24em] text-slate-400">
            <Link href="/privacy" className="hover:text-white">{t('footer.privacy')}</Link>
            <Link href="/terms" className="hover:text-white">{t('footer.terms')}</Link>
            <Link href="/contact" className="hover:text-white">{t('footer.contact')}</Link>
          </div>
          <p className="text-sm text-slate-500">{t('footer.copyright')}</p>
        </div>
      </footer>
    </div>
  );
}
