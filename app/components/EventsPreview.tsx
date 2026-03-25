'use client';

import { motion } from 'framer-motion';
import { Calendar, MapPin, Clock, Loader2, ArrowUpRight } from 'lucide-react';
import { useState } from 'react';
import { bookEvent } from '@/app/actions/bookings';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';
import { useTranslation } from '@/lib/locale-context';
import { formatPrice, formatDateShort, formatTime } from '@/lib/format';

export type EventPreviewItem = {
  id: string;
  slug: string;
  title: string;
  date: string;
  location: string;
  price: number;
  category: string;
};

interface EventsPreviewProps {
  events: EventPreviewItem[];
  title?: string;
  description?: string;
  emptyMessage?: string;
}

export function EventsPreview({
  events,
  title,
  description,
  emptyMessage,
}: EventsPreviewProps) {
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const router = useRouter();
  const t = useTranslation();
  const resolvedTitle = title ?? t('events.defaultTitle');
  const resolvedDescription = description ?? t('events.description');
  const resolvedEmptyMessage = emptyMessage ?? t('events.empty');
  const titleParts = resolvedTitle.split(' ');
  const highlightedWord = titleParts[titleParts.length - 1];
  const leadingTitle = titleParts.slice(0, -1).join(' ');

  async function handleJoin(eventId: string) {
    setLoadingId(eventId);
    try {
      const result = await bookEvent(eventId);
      if (result.url) {
        window.location.href = result.url;
      } else if (result.success) {
        router.push('/dashboard?booking_success=true');
      }
    } catch (error: unknown) {
      const loginMessage = t('events.loginNeeded');
      const message = error instanceof Error ? error.message : loginMessage;
      if (message.toLowerCase().includes('logged in')) {
        toast.error(loginMessage);
        router.push('/login');
      } else {
        toast.error(message);
      }
    } finally {
      setLoadingId(null);
    }
  }

  return (
    <section className="px-4 py-24 md:px-6">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="mb-14 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between"
        >
          <div className="max-w-2xl">
            <p className="site-kicker mb-4">{t('events.kicker')}</p>
            <h2 className="site-title text-3xl font-black uppercase text-white md:text-5xl">
              {resolvedTitle.includes(' ') ? (
                <>
                  {leadingTitle}{' '}
                  <span className="site-highlight">{highlightedWord}</span>
                </>
              ) : (
                <span className="site-highlight">{resolvedTitle}</span>
              )}
            </h2>
            <p className="mt-4 max-w-xl text-lg leading-8 text-slate-400">{resolvedDescription}</p>
          </div>

          <Link
            href="/events"
            className="site-outline-button inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-xs font-black uppercase tracking-[0.24em] text-white"
          >
            {t('events.browse')}
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </motion.div>

        {events.length > 0 ? (
          <div className="grid gap-8 md:grid-cols-3">
            {events.map((event, index) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03 }}
                  viewport={{ once: true }}
                  className="site-panel group relative flex flex-col overflow-hidden rounded-[2.2rem] p-8"
                >
                  <div className="absolute inset-x-6 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(34,211,238,0.6),transparent)]" />
                  <div className="absolute -right-12 top-10 h-32 w-32 rounded-full bg-primary/18 blur-3xl" />

                  <div className="relative flex flex-1 flex-col">
                    <div className="mb-8 flex items-start justify-between gap-4">
                      <span className="rounded-full border border-accent/20 bg-accent/10 px-4 py-2 text-xs font-black uppercase tracking-[0.24em] text-accent">
                        {event.category}
                      </span>
                      <span className="display-type text-3xl font-black text-white">
                        {formatPrice(event.price)}
                      </span>
                    </div>

                    <Link href={`/events/${event.slug}`} className="block">
                      <h3 className="site-title text-3xl font-black uppercase leading-none text-white transition-colors group-hover:text-accent">
                        {event.title}
                      </h3>
                    </Link>

                    <div className="mt-8 space-y-4 text-sm text-slate-400">
                      <div className="flex items-center gap-3">
                        <Calendar className="h-4 w-4 text-secondary" />
                        <span>
                          {formatDateShort(event.date)}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Clock className="h-4 w-4 text-secondary" />
                        <span>
                          {formatTime(event.date)}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <MapPin className="h-4 w-4 text-secondary" />
                        <span>{event.location}</span>
                      </div>
                    </div>

                    <div className="neon-divider mb-8 mt-auto" />

                    <motion.button
                      onClick={() => handleJoin(event.id)}
                      disabled={loadingId === event.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="site-primary-button flex w-full items-center justify-center gap-2 rounded-full px-6 py-4 text-sm font-black uppercase tracking-[0.24em] text-white disabled:opacity-50"
                    >
                      {loadingId === event.id ? (
                        <>
                          <Loader2 className="h-5 w-5 animate-spin" />
                          {t('events.processing')}
                        </>
                      ) : (
                        <>
                          {t('events.join')}
                          <ArrowUpRight className="h-4 w-4" />
                        </>
                      )}
                    </motion.button>
                  </div>
                </motion.div>
            ))}
          </div>
        ) : (
          <div className="site-panel rounded-[2.4rem] px-8 py-16 text-center text-slate-400">
            {resolvedEmptyMessage}
          </div>
        )}
      </div>
    </section>
  );
}
