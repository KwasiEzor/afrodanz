'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Calendar,
  Edit,
  Euro,
  LayoutDashboard,
  Plus,
  Sparkles,
  Trash,
  UserCheck,
  Users,
  X,
} from 'lucide-react';
import type { BookingStatus } from '@prisma/client';
import {
  CreateEventForm,
  type EditableEventFields,
} from '@/app/components/admin/CreateEventForm';
import { deleteEvent } from '@/app/actions/events';
import { formatPrice, formatDateCompact } from '@/lib/format';
import { useTranslation } from '@/lib/locale-context';

type AdminUserPreview = {
  name: string | null;
  email: string | null;
  image: string | null;
};

type RecentBookingRow = {
  id: string;
  status: BookingStatus;
  createdAt: Date;
  user: Pick<AdminUserPreview, 'name' | 'email'>;
  event: { title: string; price: number };
};

type AdminEventRow = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  date: Date;
  category: string;
  location: string;
  price: number;
  capacity: number;
  image: string | null;
  bookings: Array<{ id: string; createdAt: Date; user: AdminUserPreview }>;
  _count: { bookings: number };
};

interface AdminDashboardUIProps {
  stats: {
    totalMembers: number;
    revenue: number;
    activeEvents: number;
  };
  recentBookings: RecentBookingRow[];
  allEvents: AdminEventRow[];
}

type AdminTab = 'overview' | 'events' | 'bookings';

const TABS: Array<{ id: AdminTab; label: string; icon: typeof LayoutDashboard }> = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'events', label: 'Manage Events', icon: Calendar },
  { id: 'bookings', label: 'Bookings', icon: UserCheck },
];

const ADMIN_NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/events', label: 'Events' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
] as const;

export default function AdminDashboardUI({
  stats,
  recentBookings,
  allEvents,
}: AdminDashboardUIProps) {
  const t = useTranslation();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<EditableEventFields | null>(null);
  const [viewingAttendees, setViewingAttendees] = useState<AdminEventRow | null>(null);
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');

  const handleDeleteEvent = async (id: string) => {
    if (
      confirm(
        'Are you sure you want to delete this event? This will also delete all associated bookings.'
      )
    ) {
      await deleteEvent(id);
    }
  };

  const statCards = [
    {
      label: 'Members',
      value: stats.totalMembers.toString(),
      icon: Users,
    },
    {
      label: 'Revenue',
      value: formatPrice(stats.revenue),
      icon: Euro,
    },
    {
      label: 'Upcoming Events',
      value: stats.activeEvents.toString(),
      icon: Calendar,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <AnimatePresence>
        {(showCreateModal || editingEvent) && (
          <CreateEventForm
            event={editingEvent}
            onClose={() => {
              setShowCreateModal(false);
              setEditingEvent(null);
            }}
          />
        )}

        {viewingAttendees && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.96, y: 16 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.96, y: 16 }}
              className="site-panel flex max-h-[82vh] w-full max-w-3xl flex-col rounded-[2.6rem]"
            >
              <div className="flex items-center justify-between border-b border-white/8 px-8 py-6">
                <div>
                  <p className="site-kicker mb-3">Attendees</p>
                  <h2 className="site-title text-3xl font-black uppercase text-white">
                    {viewingAttendees.title}
                  </h2>
                  <p className="mt-2 text-sm text-slate-400">
                    {viewingAttendees.bookings.length} confirmed dancers
                  </p>
                </div>
                <button
                  onClick={() => setViewingAttendees(null)}
                  className="rounded-full border border-white/10 bg-white/5 p-3 text-slate-300"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-4 overflow-y-auto px-8 py-6">
                {viewingAttendees.bookings.length === 0 ? (
                  <div className="rounded-[1.8rem] border border-dashed border-white/10 px-6 py-12 text-center text-slate-400">
                    No dancers have booked this event yet.
                  </div>
                ) : (
                  viewingAttendees.bookings.map((booking) => (
                    <div
                      key={booking.id}
                      className="site-panel-soft flex items-center justify-between rounded-[1.8rem] p-5"
                    >
                      <div className="flex items-center gap-4">
                        {booking.user.image ? (
                          <Image
                            src={booking.user.image}
                            alt={booking.user.name || 'Attendee'}
                            width={44}
                            height={44}
                            className="rounded-2xl object-cover"
                          />
                        ) : (
                          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/18 font-bold text-white">
                            {booking.user.name?.[0] || 'U'}
                          </div>
                        )}
                        <div>
                          <p className="font-bold text-white">{booking.user.name || 'Anonymous'}</p>
                          <p className="text-sm text-slate-400">{booking.user.email}</p>
                        </div>
                      </div>
                      <div className="text-right text-sm text-slate-400">
                        <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">
                          Booked On
                        </p>
                        <p className="mt-2">{formatDateCompact(booking.createdAt)}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <header className="site-panel mb-8 rounded-[2rem] px-5 py-5">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-3 text-white">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/18 text-accent">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <p className="display-type text-lg font-black uppercase tracking-[0.22em]">
                  AfroDanz
                </p>
                <p className="text-[0.65rem] font-bold uppercase tracking-[0.22em] text-slate-400">
                  Admin Panel
                </p>
              </div>
            </Link>
          </div>
          <nav className="flex flex-wrap items-center gap-2">
            {ADMIN_NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-full border border-white/8 bg-white/5 px-4 py-2 text-xs font-black uppercase tracking-[0.22em] text-slate-300 transition hover:border-primary/30 hover:text-white"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 pb-16 pt-24 md:px-6 lg:flex-row">
        <aside className="site-panel flex min-w-0 flex-col rounded-[2.4rem] p-6 lg:w-72 lg:shrink-0">
          <div className="mb-8">
            <p className="site-kicker mb-3">Admin control</p>
            <h1 className="site-title text-3xl font-black uppercase text-white">
              Admin<span className="site-highlight">Danz</span>
            </h1>
          </div>

          <nav className="grid gap-2 md:grid-cols-3 lg:grid-cols-1">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 rounded-[1.2rem] px-4 py-3 text-left text-sm font-black uppercase tracking-[0.2em] ${
                  activeTab === tab.id
                    ? 'site-primary-button text-white'
                    : 'text-slate-400 hover:bg-white/6 hover:text-white'
                }`}
              >
                <tab.icon className="h-4 w-4 shrink-0" />
                <span className="truncate">{tab.label}</span>
              </button>
            ))}
          </nav>

          <button
            onClick={() => setShowCreateModal(true)}
            className="site-primary-button mt-8 inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-xs font-black uppercase tracking-[0.22em] text-white"
          >
            <Plus className="h-4 w-4" />
            Create Event
          </button>
        </aside>

        <div className="flex-1">
          <header className="mb-8 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="site-kicker mb-4">Studio operations</p>
              <h2 className="site-title text-4xl font-black uppercase text-white md:text-5xl">
                Control The
                <span className="site-highlight block">Calendar</span>
              </h2>
            </div>
            <div className="site-panel-soft rounded-[1.6rem] px-5 py-4 text-sm text-slate-300">
              <p className="font-black uppercase tracking-[0.2em] text-accent">At a glance</p>
              <p className="mt-2">
                {stats.activeEvents} upcoming events and {recentBookings.length} recent bookings tracked here.
              </p>
            </div>
          </header>

          {activeTab === 'overview' && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
              <div className="grid gap-6 md:grid-cols-3">
                {statCards.map((stat) => (
                  <div key={stat.label} className="site-panel-soft rounded-[2rem] p-6">
                    <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/15 text-primary">
                      <stat.icon className="h-5 w-5" />
                    </div>
                    <p className="text-xs font-black uppercase tracking-[0.22em] text-slate-500">
                      {stat.label}
                    </p>
                    <p className="mt-3 text-2xl font-black text-white">{stat.value}</p>
                  </div>
                ))}
              </div>

              <section className="site-panel rounded-[2.4rem] p-8">
                <div className="mb-6 flex items-center justify-between">
                  <h3 className="site-title text-3xl font-black uppercase text-white">Recent Bookings</h3>
                </div>

                <div className="space-y-4">
                  {recentBookings.length === 0 ? (
                    <div className="rounded-[1.8rem] border border-dashed border-white/10 px-6 py-12 text-center text-slate-400">
                      No bookings yet.
                    </div>
                  ) : (
                    recentBookings.slice(0, 8).map((booking) => (
                      <div
                        key={booking.id}
                        className="site-panel-soft flex flex-col gap-4 rounded-[1.8rem] p-5 md:flex-row md:items-center md:justify-between"
                      >
                        <div>
                          <p className="font-bold text-white">{booking.user.name || 'Anonymous'}</p>
                          <p className="mt-1 text-sm text-slate-400">{booking.user.email}</p>
                        </div>
                        <div>
                          <p className="font-bold text-white">{booking.event.title}</p>
                          <p className="mt-1 text-sm text-slate-400">{formatPrice(booking.event.price)}</p>
                        </div>
                        <div className="text-left md:text-right">
                          <span
                            className={`rounded-full px-3 py-1 text-[0.65rem] font-black uppercase tracking-[0.2em] ${
                              booking.status === 'PAID'
                                ? 'border border-emerald-500/20 bg-emerald-500/10 text-emerald-300'
                                : 'border border-amber-500/20 bg-amber-500/10 text-amber-300'
                            }`}
                          >
                            {booking.status}
                          </span>
                          <p className="mt-2 text-sm text-slate-500">
                            {formatDateCompact(booking.createdAt)}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </section>
            </motion.div>
          )}

          {activeTab === 'events' && (
            <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
              <section className="site-panel rounded-[2.4rem] p-8">
                <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <h3 className="site-title text-3xl font-black uppercase text-white">Manage Events</h3>
                  <button
                    onClick={() => setShowCreateModal(true)}
                    className="site-outline-button rounded-full px-5 py-3 text-xs font-black uppercase tracking-[0.22em] text-white"
                  >
                    New Event
                  </button>
                </div>

                <div className="space-y-4">
                  {allEvents.length === 0 ? (
                    <div className="rounded-[1.8rem] border border-dashed border-white/10 px-6 py-12 text-center text-slate-400">
                      No events created yet.
                    </div>
                  ) : (
                    allEvents.map((event) => (
                      <div
                        key={event.id}
                        className="site-panel-soft flex flex-col gap-5 rounded-[1.8rem] p-5 lg:flex-row lg:items-center lg:justify-between"
                      >
                        <div>
                          <p className="text-xs font-black uppercase tracking-[0.2em] text-accent">{event.category}</p>
                          <h4 className="mt-2 text-xl font-black uppercase tracking-[0.12em] text-white">
                            {event.title}
                          </h4>
                          <p className="mt-2 text-sm text-slate-400">
                            {formatDateCompact(event.date)} • {event.location}
                          </p>
                        </div>
                        <div className="flex flex-col gap-2 text-sm text-slate-400">
                          <p><span className="font-bold text-white">{formatPrice(event.price)}</span></p>
                          <p>{event._count.bookings} / {event.capacity} booked</p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => setViewingAttendees(event)}
                            className="rounded-full border border-accent/20 bg-accent/10 p-3 text-accent"
                            title="View Attendees"
                          >
                            <UserCheck className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => setEditingEvent(event)}
                            className="rounded-full border border-sky-500/20 bg-sky-500/10 p-3 text-sky-300"
                            title="Edit Event"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteEvent(event.id)}
                            className="rounded-full border border-red-500/20 bg-red-500/10 p-3 text-red-300"
                            title="Delete Event"
                          >
                            <Trash className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </section>
            </motion.div>
          )}

          {activeTab === 'bookings' && (
            <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
              <section className="site-panel rounded-[2.4rem] p-8">
                <h3 className="site-title text-3xl font-black uppercase text-white">All Bookings</h3>
                <div className="mt-8 space-y-4">
                  {recentBookings.length === 0 ? (
                    <div className="rounded-[1.8rem] border border-dashed border-white/10 px-6 py-12 text-center text-slate-400">
                      No bookings recorded yet.
                    </div>
                  ) : (
                    recentBookings.map((booking) => (
                      <div
                        key={booking.id}
                        className="site-panel-soft flex flex-col gap-4 rounded-[1.8rem] p-5 md:flex-row md:items-center md:justify-between"
                      >
                        <div>
                          <p className="font-bold text-white">{booking.user.name || 'Anonymous'}</p>
                          <p className="mt-1 text-sm text-slate-400">{booking.user.email}</p>
                        </div>
                        <div>
                          <p className="font-bold text-white">{booking.event.title}</p>
                          <p className="mt-1 text-sm text-slate-400">
                            {formatDateCompact(booking.createdAt)}
                          </p>
                        </div>
                        <span
                          className={`rounded-full px-3 py-1 text-[0.65rem] font-black uppercase tracking-[0.2em] ${
                            booking.status === 'PAID'
                              ? 'border border-emerald-500/20 bg-emerald-500/10 text-emerald-300'
                              : 'border border-amber-500/20 bg-amber-500/10 text-amber-300'
                          }`}
                        >
                          {booking.status}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </section>
            </motion.div>
          )}
        </div>
      </div>

      <footer className="mt-10 border-t border-white/8 pt-8">
        <div className="flex flex-col gap-4 text-sm text-slate-400 md:flex-row md:items-center md:justify-between">
          <p>{t('admin.footerText')}</p>
          <div className="flex flex-wrap items-center gap-4">
            <Link href="/" className="transition hover:text-white">
              {t('admin.footerHome')}
            </Link>
            <Link href="/events" className="transition hover:text-white">
              {t('admin.footerEvents')}
            </Link>
            <Link href="/contact" className="transition hover:text-white">
              {t('admin.footerSupport')}
            </Link>
            <Link href="/privacy" className="transition hover:text-white">
              {t('admin.footerPrivacy')}
            </Link>
            <Link href="/terms" className="transition hover:text-white">
              {t('admin.footerTerms')}
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
