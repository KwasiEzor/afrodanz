import prisma from '@/lib/prisma';
import { EventsList } from '../components/EventsList';

const ITEMS_PER_PAGE = 6;

export default async function EventsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const page = typeof searchParams.page === 'string' ? parseInt(searchParams.page) : 1;
  const category = typeof searchParams.category === 'string' ? searchParams.category : undefined;
  const search = typeof searchParams.search === 'string' ? searchParams.search : undefined;

  const where = {
    ...(category && { category }),
    ...(search && {
      OR: [
        { title: { contains: search, mode: 'insensitive' as any } },
        { description: { contains: search, mode: 'insensitive' as any } },
      ],
    }),
  };

  const [events, totalEvents] = await Promise.all([
    prisma.event.findMany({
      where,
      skip: (page - 1) * ITEMS_PER_PAGE,
      take: ITEMS_PER_PAGE,
      orderBy: { date: 'asc' },
    }),
    prisma.event.count({ where }),
  ]);

  const totalPages = Math.ceil(totalEvents / ITEMS_PER_PAGE);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-24">
      {/* Hero Header */}
      <header className="relative h-[40vh] flex items-center justify-center text-center px-4 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-primary/80 afro-gradient mix-blend-multiply z-10" />
          <div className="absolute inset-0 bg-black/40 z-20" />
        </div>
        
        <div className="relative z-30 max-w-3xl">
          <h1 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter mb-4 leading-none">
            Find Your <span className="text-accent italic">Beat</span>
          </h1>
          <p className="text-lg text-slate-100/90 font-light max-w-xl mx-auto">
            Discover upcoming workshops and classes. Filter by style, intensity, or search for your favorite session.
          </p>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 -mt-12 relative z-50">
        <EventsList 
          initialEvents={events} 
          totalPages={totalPages} 
          currentPage={page} 
        />
      </div>
    </div>
  );
}
