'use client';

import { motion } from 'framer-motion';
import { Calendar, MapPin, Clock, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { bookEvent } from '@/app/actions/bookings';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const EVENTS = [
  {
    id: 'cl1',
    slug: 'amapiano-workshop-march-2026',
    title: 'Amapiano Workshop',
    date: 'March 28, 2026',
    time: '18:00 - 20:00',
    location: 'Main Studio',
    price: '€25',
    category: 'Workshop'
  },
  {
    id: 'cl2',
    slug: 'afrobeats-mastery-april-2026',
    title: 'Afrobeats Mastery',
    date: 'April 02, 2026',
    time: '19:00 - 21:00',
    location: 'Outdoor Arena',
    price: '€20',
    category: 'Class'
  },
  {
    id: 'cl3',
    slug: 'afro-contemporary-april-2026',
    title: 'Afro-Contemporary',
    date: 'April 05, 2026',
    time: '10:00 - 13:00',
    location: 'Main Studio',
    price: '€35',
    category: 'Intensive'
  }
];

export function EventsPreview() {
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const router = useRouter();

  async function handleJoin(eventId: string) {
    setLoadingId(eventId);
    try {
      const result = await bookEvent(eventId);
      if (result.url) {
        window.location.href = result.url; // Redirect to Stripe
      } else if (result.success) {
        router.push('/dashboard?booking_success=true');
      }
    } catch (error: any) {
      alert(error.message || 'Please log in to book events');
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
          <h2 className="text-4xl md:text-5xl font-black mb-4">Upcoming <span className="text-primary italic">Events</span></h2>
          <p className="text-muted text-lg max-w-xl">Don't miss out on our special sessions and workshops.</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {EVENTS.map((event, index) => (
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
                <span className="text-2xl font-black text-primary">{event.price}</span>
              </div>
              
              <Link href={`/events/${event.slug}`} className="block group">
                <h3 className="text-2xl font-bold mb-6 group-hover:text-primary transition-colors">{event.title}</h3>
              </Link>
              
              <div className="space-y-4 text-muted mb-10">
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-primary" />
                  <span>{event.date}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-primary" />
                  <span>{event.time}</span>
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
          ))}
        </div>
      </div>
    </section>
  );
}
