import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, MapPin, Clock, Users, ArrowLeft, ShieldCheck } from 'lucide-react';
import { auth } from '@/lib/auth';
import {
  EventsPreview,
  type EventPreviewItem,
} from '@/app/components/EventsPreview';
import { BookingButton } from '@/app/components/BookingButton';
import { isPrismaMissingTableError } from '@/lib/prisma-errors';
import { formatDateLong, formatTime, formatPrice } from '@/lib/format';

export const dynamic = 'force-dynamic';

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const session = await auth();
  const { slug } = await params;

  const getEvent = () =>
    prisma.event.findUnique({
      where: { slug },
      include: {
        bookings: {
          where: { status: 'PAID' },
        },
        _count: {
          select: {
            bookings: {
              where: { status: 'PAID' },
            },
          },
        },
      },
    });

  let event: Awaited<ReturnType<typeof getEvent>>;

  try {
    event = await getEvent();
  } catch (error) {
    if (isPrismaMissingTableError(error, 'Event')) {
      notFound();
    }

    throw error;
  }

  if (!event) notFound();

  const getRelatedEvents = () =>
    prisma.event.findMany({
      where: {
        id: {
          not: event.id,
        },
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

  let relatedEvents: Awaited<ReturnType<typeof getRelatedEvents>> = [];

  try {
    relatedEvents = await getRelatedEvents();
  } catch (error) {
    if (!isPrismaMissingTableError(error, 'Event')) {
      throw error;
    }
  }

  const activePendingOthers = await prisma.booking.count({
    where: {
      eventId: event.id,
      status: 'PENDING',
      expiresAt: { gt: new Date() },
      ...(session?.user?.id ? { NOT: { userId: session.user.id } } : {}),
    },
  });

  const spotsLeft = event.capacity - event._count.bookings - activePendingOthers;
  const alreadyBooked = session?.user
    ? event.bookings.some((booking) => booking.userId === session.user?.id)
    : false;
  const previewEvents: EventPreviewItem[] = relatedEvents.map((relatedEvent) => ({
    ...relatedEvent,
    date: relatedEvent.date.toISOString(),
  }));

  return (
    <div className="min-h-screen pb-24 pt-24">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <nav className="mb-8">
          <Link
            href="/events"
            className="site-outline-button inline-flex items-center gap-2 rounded-full px-5 py-3 text-xs font-black uppercase tracking-[0.24em] text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Events
          </Link>
        </nav>

        <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
          <div className="space-y-6">
            <div className="site-image-frame aspect-[0.88] rounded-[2.8rem]">
              <Image
                src={event.image || '/page_facbook_kouami_atelier_danse_africaine.jpg'}
                alt={event.title}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,10,18,0.08),rgba(8,10,18,0.72))]" />
              <div className="absolute left-6 top-6 rounded-full border border-accent/22 bg-accent/10 px-4 py-2 text-xs font-black uppercase tracking-[0.24em] text-accent">
                {event.category}
              </div>
            </div>

            <div className="site-panel rounded-[2rem] p-6">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/14 text-emerald-300">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-lg font-black uppercase tracking-[0.2em] text-white">
                    Secure Booking
                  </h2>
                  <p className="mt-2 text-sm leading-7 text-slate-400">
                    Your place is confirmed when payment completes. Active reservations are protected to stop overselling.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="site-panel rounded-[2.8rem] p-8 md:p-10">
            <p className="site-kicker mb-4">Event spotlight</p>
            <h1 className="site-title text-4xl font-black uppercase leading-[0.92] text-white md:text-6xl">
              {event.title.split(' ')[0]}
              <span className="site-highlight block">
                {event.title.split(' ').slice(1).join(' ') || 'Session'}
              </span>
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
              {event.description ||
                'Join us for an immersive Afro dance experience. Master foundations, musicality, and high-energy choreography in one cinematic studio session.'}
            </p>

            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              <div className="site-panel-soft rounded-[1.8rem] p-5">
                <Calendar className="mb-3 h-5 w-5 text-secondary" />
                <p className="text-xs font-black uppercase tracking-[0.24em] text-slate-500">Date</p>
                <p className="mt-2 font-bold text-white">
                  {formatDateLong(event.date)}
                </p>
              </div>
              <div className="site-panel-soft rounded-[1.8rem] p-5">
                <Clock className="mb-3 h-5 w-5 text-secondary" />
                <p className="text-xs font-black uppercase tracking-[0.24em] text-slate-500">Time</p>
                <p className="mt-2 font-bold text-white">
                  {formatTime(event.date)}
                </p>
              </div>
              <div className="site-panel-soft rounded-[1.8rem] p-5">
                <MapPin className="mb-3 h-5 w-5 text-secondary" />
                <p className="text-xs font-black uppercase tracking-[0.24em] text-slate-500">Venue</p>
                <p className="mt-2 font-bold text-white">{event.location}</p>
              </div>
              <div className="site-panel-soft rounded-[1.8rem] p-5">
                <Users className="mb-3 h-5 w-5 text-secondary" />
                <p className="text-xs font-black uppercase tracking-[0.24em] text-slate-500">Spots Left</p>
                <p className="mt-2 font-bold text-white">
                  {spotsLeft > 0 ? spotsLeft : 0} / {event.capacity}
                </p>
              </div>
            </div>

            <div className="neon-divider my-8" />

            <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.24em] text-slate-500">
                  Total Price
                </p>
                <p className="display-type mt-2 text-5xl font-black text-white">
                  {formatPrice(event.price)}
                </p>
              </div>
              <BookingButton
                eventId={event.id}
                hasUser={!!session?.user}
                spotsLeft={spotsLeft}
                alreadyBooked={alreadyBooked}
              />
            </div>
          </div>
        </div>
      </div>

      <section className="mt-20">
        <EventsPreview
          events={previewEvents}
          title="More Events"
          description="Keep the momentum going with more sessions from the AfroDanz calendar."
          emptyMessage="This is the last upcoming event on the calendar for now."
        />
      </section>
    </div>
  );
}
