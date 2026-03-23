'use client';

import { motion } from 'framer-motion';
import { Calendar, MapPin, Clock, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { bookEvent } from '@/app/actions/bookings';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';

const euroFormatter = new Intl.NumberFormat('en-GB', {
  style: 'currency',
  currency: 'EUR',
});

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
  title = 'Upcoming Events',
  description = "Don't miss out on our special sessions and workshops.",
  emptyMessage = 'Fresh workshops are on the way. Check back soon.',
}: EventsPreviewProps) {
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const router = useRouter();
  const titleParts = title.split(' ');
  const highlightedWord = titleParts[titleParts.length - 1];
  const leadingTitle = titleParts.slice(0, -1).join(' ');

  async function handleJoin(eventId: string) {
    setLoadingId(eventId);
    try {
      const result = await bookEvent(eventId);
      if (result.url) {
        window.location.href = result.url; // Redirect to Stripe
      } else if (result.success) {
        router.push('/dashboard?booking_success=true');
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Please log in to book events';
      if (message.toLowerCase().includes('logged in')) {
        toast.error('Please log in to secure your spot.');
        router.push('/login');
      } else {
        toast.error(message);
      }
    } finally {
      setLoadingId(null);
    }
  }

  return (
    <section className="py-24 px-4 bg-background">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-black mb-4">
            {title.includes(' ') ? (
              <>
                {leadingTitle}{' '}
                <span className="text-primary italic">{highlightedWord}</span>
              </>
            ) : (
              <span className="text-primary italic">{title}</span>
            )}
          </h2>
          <p className="text-muted text-lg max-w-xl">{description}</p>
        </motion.div>

        {events.length > 0 ? (
          <div className="grid md:grid-cols-3 gap-8">
            {events.map((event, index) => {
              const startsAt = new Date(event.date);

              return (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="group bg-slate-100 dark:bg-slate-900/50 p-8 rounded-3xl border border-transparent hover:border-primary/20 transition-all hover:shadow-2xl hover:shadow-primary/5"
                >
                  <div className="mb-6 flex justify-between items-start">
                    <span className="px-4 py-1 bg-accent/10 text-accent rounded-full text-sm font-bold uppercase tracking-wider">
                      {event.category}
                    </span>
                    <span className="text-2xl font-black text-primary">
                      {euroFormatter.format(event.price / 100)}
                    </span>
                  </div>
                  
                  <Link href={`/events/${event.slug}`} className="block group">
                    <h3 className="text-2xl font-bold mb-6 group-hover:text-primary transition-colors">
                      {event.title}
                    </h3>
                  </Link>
                  
                  <div className="space-y-4 text-muted mb-10">
                    <div className="flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-primary" />
                      <span>
                        {startsAt.toLocaleDateString('en-GB', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Clock className="w-5 h-5 text-primary" />
                      <span>
                        {startsAt.toLocaleTimeString('en-GB', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <MapPin className="w-5 h-5 text-primary" />
                      <span>{event.location}</span>
                    </div>
                  </div>

                  <motion.button
                    onClick={() => handleJoin(event.id)}
                    disabled={loadingId === event.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-4 bg-foreground text-background font-bold rounded-2xl group-hover:bg-primary group-hover:text-white transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {loadingId === event.id ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      'Join Event'
                    )}
                  </motion.button>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="rounded-[2rem] border border-dashed border-slate-200 bg-slate-50 px-8 py-16 text-center text-muted dark:border-slate-800 dark:bg-slate-900/50">
            {emptyMessage}
          </div>
        )}
      </div>
    </section>
  );
}
