import type { Metadata } from 'next';
import prisma from '@/lib/prisma';
import { EventsList } from '../components/EventsList';
import { isPrismaMissingTableError } from '@/lib/prisma-errors';
import { translate } from '@/lib/i18n';
import { getServerLocale } from '@/lib/locale.server';

const ITEMS_PER_PAGE = 6;

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Events | AfroDanz',
  description: 'Browse the AfroDanz studio calendar. Find Afro dance workshops, intensives and classes near Paris.',
};

export default async function EventsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const locale = await getServerLocale();
  const t = (path: string) => translate(locale, path);
  const resolvedSearchParams = await searchParams;
  const page =
    typeof resolvedSearchParams.page === 'string'
      ? parseInt(resolvedSearchParams.page)
      : 1;
  const category =
    typeof resolvedSearchParams.category === 'string'
      ? resolvedSearchParams.category
      : undefined;
  const search =
    typeof resolvedSearchParams.search === 'string'
      ? resolvedSearchParams.search
      : undefined;

  const where = {
    ...(category && { category }),
    ...(search && {
      OR: [
        { title: { contains: search, mode: 'insensitive' as const } },
        { description: { contains: search, mode: 'insensitive' as const } },
      ],
    }),
  };

  let events: Awaited<ReturnType<typeof prisma.event.findMany>> = [];
  let totalEvents = 0;

  try {
    [events, totalEvents] = await Promise.all([
      prisma.event.findMany({
        where,
        skip: (page - 1) * ITEMS_PER_PAGE,
        take: ITEMS_PER_PAGE,
        orderBy: { date: 'asc' },
      }),
      prisma.event.count({ where }),
    ]);
  } catch (error) {
    if (!isPrismaMissingTableError(error, 'Event')) {
      throw error;
    }
  }

  const totalPages = Math.ceil(totalEvents / ITEMS_PER_PAGE);

  return (
    <div className="min-h-screen pb-24">
      <header className="relative overflow-hidden px-4 pb-18 pt-32 md:px-6 md:pb-24">
        <div className="absolute inset-x-0 top-0 h-full bg-[radial-gradient(circle_at_top_left,rgba(124,58,237,0.24),transparent_28rem),radial-gradient(circle_at_85%_20%,rgba(34,211,238,0.14),transparent_22rem)]" />

        <div className="relative mx-auto max-w-7xl">
          <div className="site-panel overflow-hidden rounded-[2.8rem] px-8 py-12 md:px-14 md:py-16">
            <p className="site-kicker mb-4">{t('events.eventsPage.kicker')}</p>
            <h1 className="site-title max-w-4xl text-4xl font-black uppercase leading-[0.92] text-white md:text-6xl">
              {t('events.eventsPage.title')}{' '}
              <span className="site-highlight">{t('events.eventsPage.titleHighlight')}</span>
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">
              {t('events.eventsPage.description')}
            </p>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <EventsList
          initialEvents={events}
          totalPages={totalPages}
          currentPage={page}
        />
      </div>
    </div>
  );
}
