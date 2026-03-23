import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Calendar, MapPin, Clock, Users, ArrowLeft, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { EventsPreview } from '@/app/components/EventsPreview';
import { auth } from '@/lib/auth';
import { BookingButton } from '@/app/components/BookingButton';
import { isPrismaMissingTableError } from '@/lib/prisma-errors';

export const dynamic = 'force-dynamic';

export default async function EventDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const session = await auth();
  const { slug } = await params;

  let event: Awaited<ReturnType<typeof prisma.event.findUnique>>;

  try {
    event = await prisma.event.findUnique({
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
  } catch (error) {
    if (isPrismaMissingTableError(error, 'Event')) {
      notFound();
    }

    throw error;
  }

  if (!event) notFound();

  let relatedEvents: Awaited<ReturnType<typeof prisma.event.findMany>> = [];

  try {
    relatedEvents = await prisma.event.findMany({
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
      ...(session?.user?.id
        ? { NOT: { userId: session.user.id } }
        : {}),
    },
  });

  const spotsLeft = event.capacity - event._count.bookings - activePendingOthers;
  const alreadyBooked = session?.user ? event.bookings.some(b => b.userId === session.user?.id) : false;
  const previewEvents = relatedEvents.map((relatedEvent) => ({
    ...relatedEvent,
    date: relatedEvent.date.toISOString(),
  }));

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation */}
      <nav className="fixed top-0 w-full z-50 px-6 py-4 bg-background/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/events" className="flex items-center gap-2 font-bold text-muted hover:text-primary transition-all">
            <ArrowLeft className="w-5 h-5" /> Back to Events
          </Link>
          <div className="text-xl font-black uppercase tracking-tight">AFRO <span className="text-primary italic">DANZ</span></div>
        </div>
      </nav>

      <div className="pt-24 pb-24 px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12">
          {/* Visual Column */}
          <div className="space-y-8">
            <div className="relative aspect-[4/5] rounded-[3rem] overflow-hidden shadow-2xl">
              <Image 
                src={event.image || "/page_facbook_kouami_atelier_danse_africaine.jpg"} 
                alt={event.title} 
                fill 
                className="object-cover"
              />
              <div className="absolute top-6 left-6 px-6 py-2 bg-accent text-white font-black rounded-full uppercase tracking-widest text-sm shadow-xl">
                {event.category}
              </div>
            </div>
            
            <div className="bg-slate-50 dark:bg-slate-900/50 p-8 rounded-[2rem] border border-slate-100 dark:border-slate-800">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><ShieldCheck className="w-6 h-6 text-green-500" /> Safe & Secure Booking</h3>
              <p className="text-muted leading-relaxed">
                Your spot is guaranteed once payment is completed. We use bank-level encryption (SSL) to protect your financial data and transaction history.
              </p>
            </div>
          </div>

          {/* Content Column */}
          <div className="flex flex-col">
            <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-[0.9] mb-8">
              {event.title.split(' ')[0]} <br />
              <span className="text-primary italic">{event.title.split(' ').slice(1).join(' ')}</span>
            </h1>

            <p className="text-xl text-muted leading-relaxed mb-10 font-light">
              {event.description || "Join us for an immersive Afro dance experience. Master the foundations, rhythms, and high-energy choreography in this special session."}
            </p>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-4 mb-10">
              <div className="p-6 bg-slate-50 dark:bg-slate-900 rounded-3xl">
                <Calendar className="w-6 h-6 text-primary mb-3" />
                <p className="text-xs text-muted uppercase font-black tracking-widest mb-1">Date</p>
                <p className="font-bold">{new Date(event.date).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
              </div>
              <div className="p-6 bg-slate-50 dark:bg-slate-900 rounded-3xl">
                <Clock className="w-6 h-6 text-primary mb-3" />
                <p className="text-xs text-muted uppercase font-black tracking-widest mb-1">Time</p>
                <p className="font-bold">{new Date(event.date).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}</p>
              </div>
              <div className="p-6 bg-slate-50 dark:bg-slate-900 rounded-3xl">
                <MapPin className="w-6 h-6 text-primary mb-3" />
                <p className="text-xs text-muted uppercase font-black tracking-widest mb-1">Venue</p>
                <p className="font-bold">{event.location}</p>
              </div>
              <div className="p-6 bg-slate-50 dark:bg-slate-900 rounded-3xl">
                <Users className="w-6 h-6 text-primary mb-3" />
                <p className="text-xs text-muted uppercase font-black tracking-widest mb-1">Spots Left</p>
                <p className="font-bold text-primary">{spotsLeft > 0 ? spotsLeft : 0} / {event.capacity}</p>
              </div>
            </div>

            <div className="mt-auto pt-8 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <p className="text-sm text-muted uppercase font-black tracking-widest">Total Price</p>
                  <p className="text-4xl font-black">€{event.price / 100}</p>
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
      </div>

      {/* More Events */}
      <section className="bg-slate-50 dark:bg-slate-900/30 py-24">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-black uppercase tracking-tight mb-12">Other <span className="text-primary italic">Ateliers</span> You&apos;ll Love</h2>
          <EventsPreview
            events={previewEvents}
            title="More Events"
            description="Keep the momentum going with more upcoming workshops from the studio."
            emptyMessage="This is the last upcoming event on the calendar for now."
          />
        </div>
      </section>
    </div>
  );
}
