'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, MapPin, Clock, Search, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

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
  const [loading, setLoading] = useState(false);

  const handleFilterChange = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.set('page', '1'); // Reset to first page
    router.push(`/events?${params.toString()}`);
  };

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', page.toString());
    router.push(`/events?${params.toString()}`);
  };

  return (
    <div className="space-y-12">
      {/* Search and Filters */}
      <div className="grid md:grid-cols-3 gap-6 mb-12">
        <div className="relative col-span-2">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
          <input 
            type="text"
            placeholder="Search workshops..."
            defaultValue={searchParams.get('search') || ''}
            onChange={(e) => {
              // Debounce search
              const value = e.target.value;
              const timeoutId = setTimeout(() => handleFilterChange('search', value), 500);
              return () => clearTimeout(timeoutId);
            }}
            className="w-full pl-12 pr-4 py-4 bg-white dark:bg-slate-900 border-none rounded-2xl shadow-sm focus:ring-2 ring-primary/20"
          />
        </div>
        
        <select 
          defaultValue={searchParams.get('category') || ''}
          onChange={(e) => handleFilterChange('category', e.target.value)}
          className="px-6 py-4 bg-white dark:bg-slate-900 border-none rounded-2xl shadow-sm font-bold appearance-none cursor-pointer focus:ring-2 ring-primary/20"
        >
          <option value="">All Categories</option>
          <option value="Workshop">Workshop</option>
          <option value="Class">Class</option>
          <option value="Intensive">Intensive</option>
        </select>
      </div>

      {/* Events Grid */}
      <div className="grid md:grid-cols-3 gap-8">
        <AnimatePresence mode="popLayout">
          {initialEvents.map((event, index) => (
            <motion.div
              key={event.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ delay: index * 0.05 }}
              className="group bg-white dark:bg-slate-900 p-6 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 hover:border-primary/20 transition-all hover:shadow-2xl shadow-primary/5"
            >
              <div className="mb-6 flex justify-between items-start">
                <span className="px-4 py-1 bg-primary/10 text-primary rounded-full text-xs font-black uppercase tracking-widest">
                  {event.category}
                </span>
                <span className="text-xl font-black text-primary italic">€{event.price / 100}</span>
              </div>
              
              <Link href={`/events/${event.slug}`} className="block mb-6">
                <h3 className="text-2xl font-black uppercase tracking-tight group-hover:text-primary transition-colors line-clamp-2 leading-none">
                  {event.title}
                </h3>
              </Link>
              
              <div className="space-y-4 text-sm text-muted mb-8">
                <div className="flex items-center gap-3">
                  <Calendar className="w-4 h-4 text-primary" />
                  <span className="font-medium">{new Date(event.date).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-primary" />
                  <span className="font-medium">{event.location}</span>
                </div>
              </div>

              <Link 
                href={`/events/${event.slug}`}
                className="w-full py-4 bg-slate-50 dark:bg-slate-800 text-foreground font-black rounded-2xl flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all text-sm uppercase tracking-widest"
              >
                View Details
              </Link>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 pt-12">
          <button 
            disabled={currentPage <= 1}
            onClick={() => handlePageChange(currentPage - 1)}
            className="p-3 bg-white dark:bg-slate-900 rounded-xl shadow-sm disabled:opacity-30 transition-all hover:bg-primary hover:text-white"
          >
            <ChevronLeft />
          </button>
          
          <div className="flex gap-2">
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i + 1}
                onClick={() => handlePageChange(i + 1)}
                className={`w-12 h-12 rounded-xl font-black transition-all ${
                  currentPage === i + 1 
                    ? 'bg-primary text-white shadow-lg' 
                    : 'bg-white dark:bg-slate-900 text-muted hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>

          <button 
            disabled={currentPage >= totalPages}
            onClick={() => handlePageChange(currentPage + 1)}
            className="p-3 bg-white dark:bg-slate-900 rounded-xl shadow-sm disabled:opacity-30 transition-all hover:bg-primary hover:text-white"
          >
            <ChevronRight />
          </button>
        </div>
      )}

      {initialEvents.length === 0 && (
        <div className="text-center py-24 bg-white dark:bg-slate-900 rounded-[3rem] border border-dashed border-slate-200 dark:border-slate-800">
          <p className="text-xl text-muted font-light">No workshops found matching your criteria.</p>
        </div>
      )}
    </div>
  );
}
