import { Hero } from './components/Hero';
import { EventsPreview } from './components/EventsPreview';
import { Pricing } from './components/Pricing';
import Link from 'next/link';
import prisma from '@/lib/prisma';
import { isPrismaMissingTableError } from '@/lib/prisma-errors';

export default async function Home() {
  let featuredEvents: Awaited<ReturnType<typeof prisma.event.findMany>> = [];

  try {
    featuredEvents = await prisma.event.findMany({
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
  } catch (error) {
    if (!isPrismaMissingTableError(error, 'Event')) {
      throw error;
    }
  }

  const previewEvents = featuredEvents.map((event) => ({
    ...event,
    date: event.date.toISOString(),
  }));

  return (
    <div className="flex min-h-screen flex-col items-center justify-between">
      <Hero />
      <EventsPreview events={previewEvents} />
      <Pricing />
      
      {/* Subscription Section CTA */}
      <section className="py-24 px-4 w-full bg-slate-950 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-[120px] -mr-48 -mt-48" />
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12 relative z-10">
          <div className="max-w-2xl">
            <h2 className="text-4xl md:text-6xl font-black mb-6 leading-none">BECOME A <span className="text-accent italic">MEMBER</span></h2>
            <p className="text-xl text-slate-400 font-light">
              Get unlimited access to all classes, exclusive workshops, and join a community of passionate dancers.
            </p>
          </div>
          <Link href="#pricing" className="px-10 py-5 bg-white text-black font-black rounded-full hover:bg-primary hover:text-white transition-all transform hover:scale-110">
            CHOOSE PLAN
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full py-12 px-4 border-t border-slate-200 dark:border-slate-800 bg-background">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <span className="text-2xl font-black tracking-tighter">AFRO <span className="text-primary">DANZ</span></span>
          <div className="flex gap-8 text-sm font-bold uppercase tracking-widest text-muted">
            <Link href="/privacy" className="hover:text-primary transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-primary transition-colors">Terms</Link>
            <Link href="/contact" className="hover:text-primary transition-colors">Contact</Link>
          </div>
          <p className="text-muted text-sm">© 2026 AfroDanz Studio. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
