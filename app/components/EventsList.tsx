'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Loader2, MapPin, Search, ChevronLeft, ChevronRight, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useDeferredValue, useEffect, useState, useTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { formatPrice, formatDateCompact } from '@/lib/format';
import { useTranslation } from '@/lib/locale-context';

interface Event {
  id: string;
  slug: string;
  title: string;
  date: Date;
  location: string;
  price: number;
  category: string;
  image: string | null;
}

interface EventsListProps {
  initialEvents: Event[];
  totalPages: number;
  currentPage: number;
}

export function EventsList({ initialEvents, totalPages, currentPage }: EventsListProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = useTranslation();
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const deferredSearch = useDeferredValue(search);
  const [isPending, startTransition] = useTransition();

  const handleFilterChange = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.set('page', '1');
    startTransition(() => {
      router.push(`/events?${params.toString()}`);
    });
  };

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', page.toString());
    startTransition(() => {
      router.push(`/events?${params.toString()}`);
    });
  };

  useEffect(() => {
    const currentSearch = searchParams.get('search') || '';
    if (deferredSearch === currentSearch) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (deferredSearch) {
        params.set('search', deferredSearch);
      } else {
        params.delete('search');
      }
      params.set('page', '1');
      startTransition(() => {
        router.push(`/events?${params.toString()}`);
      });
    }, 250);

    return () => window.clearTimeout(timeoutId);
  }, [deferredSearch, router, searchParams]);

  return (
    <div className="space-y-12">
      <div className="site-panel grid gap-6 rounded-[2.4rem] p-6 md:grid-cols-[1.4fr_0.7fr] md:p-8">
        <div className="relative">
          <Search className="absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder={t('events.searchPlaceholder')}
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="w-full rounded-full border border-white/8 bg-white/5 py-4 pl-14 pr-5 text-sm text-white outline-none placeholder:text-slate-500 focus:border-accent/40"
          />
        </div>

        <select
          id="category-filter"
          aria-label={t('events.allCategories')}
          defaultValue={searchParams.get('category') || ''}
          onChange={(event) => handleFilterChange('category', event.target.value)}
          className="rounded-full border border-white/8 bg-white/5 px-6 py-4 text-sm font-black uppercase tracking-[0.2em] text-white outline-none"
        >
          <option value="">{t('events.allCategories')}</option>
          <option value="Workshop">Workshop</option>
          <option value="Class">Class</option>
          <option value="Intensive">Intensive</option>
        </select>
      </div>

      {isPending && (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}

      <div className={`grid gap-8 md:grid-cols-2 xl:grid-cols-3${isPending ? ' opacity-50 pointer-events-none' : ''}`}>
        <AnimatePresence mode="popLayout">
          {initialEvents.map((event, index) => (
            <motion.article
              key={event.id}
              layout
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ y: -4, transition: { duration: 0.25 } }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ delay: index * 0.04 }}
              viewport={{ once: true, amount: 0.2 }}
              className="site-panel group overflow-hidden rounded-[2.3rem]"
            >
              <div className="relative min-h-[17rem] overflow-hidden">
                {event.image && (
                  <Image
                    src={event.image}
                    alt={event.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                )}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(124,58,237,0.2),transparent_45%),linear-gradient(180deg,rgba(12,15,26,0.1),rgba(12,15,26,0.82))]" />
                <div className="absolute inset-x-6 top-6 flex items-start justify-between gap-4">
                  <span className="rounded-full border border-accent/22 bg-accent/10 px-4 py-2 text-[0.65rem] font-black uppercase tracking-[0.26em] text-accent backdrop-blur-sm">
                    {event.category}
                  </span>
                  <span className="rounded-full border border-white/10 bg-black/30 px-4 py-2 text-sm font-black text-white backdrop-blur-sm">
                    {formatPrice(event.price)}
                  </span>
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <Link href={`/events/${event.slug}`} className="block">
                    <h2 className="site-title text-3xl font-black uppercase leading-none text-white transition-colors group-hover:text-accent">
                      {event.title}
                    </h2>
                  </Link>
                </div>
              </div>

              <div className="p-6">
                <div className="space-y-4 text-sm text-slate-400">
                  <div className="flex items-center gap-3">
                    <Calendar className="h-4 w-4 text-secondary" />
                    <span>{formatDateCompact(event.date)}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="h-4 w-4 text-secondary" />
                    <span>{event.location}</span>
                  </div>
                </div>

                <div className="neon-divider my-6" />

                <Link
                  href={`/events/${event.slug}`}
                  className="site-outline-button inline-flex w-full items-center justify-center gap-2 rounded-full px-5 py-4 text-sm font-black uppercase tracking-[0.24em] text-white"
                >
                  {t('events.viewDetails')}
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>
            </motion.article>
          ))}
        </AnimatePresence>
      </div>

      {totalPages > 1 && (
        <div className="flex flex-wrap items-center justify-center gap-4 pt-8">
          <button
            disabled={currentPage <= 1}
            onClick={() => handlePageChange(currentPage - 1)}
            className="site-outline-button rounded-full p-3 text-white disabled:opacity-30"
          >
            <ChevronLeft />
          </button>

          <div className="flex gap-2">
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index + 1}
                onClick={() => handlePageChange(index + 1)}
                className={`h-11 w-11 rounded-full text-sm font-black ${
                  currentPage === index + 1
                    ? 'site-primary-button text-white'
                    : 'site-outline-button text-slate-300'
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>

          <button
            disabled={currentPage >= totalPages}
            onClick={() => handlePageChange(currentPage + 1)}
            className="site-outline-button rounded-full p-3 text-white disabled:opacity-30"
          >
            <ChevronRight />
          </button>
        </div>
      )}

      {initialEvents.length === 0 && (
        <div className="site-panel rounded-[2.6rem] px-8 py-20 text-center">
          <p className="text-xl font-light text-slate-400">
            {t('events.noResults')}
          </p>
        </div>
      )}
    </div>
  );
}
