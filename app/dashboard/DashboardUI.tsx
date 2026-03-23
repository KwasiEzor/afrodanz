'use client';

import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar,
  CheckCircle2,
  Clock3,
  CreditCard,
  ExternalLink,
  LogOut,
  MapPin,
  Settings2,
  Sparkles,
  User2,
  X,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import type { Session } from 'next-auth';
import type { Booking, Event, SubscriptionStatus } from '@prisma/client';

type BookingWithEvent = Booking & { event: Event };
type DashboardTab = 'overview' | 'classes' | 'payments' | 'settings';

interface DashboardUIProps {
  user: Session['user'];
  bookings: BookingWithEvent[];
}

const MEMBER_NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/events', label: 'Events' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
] as const;

function bannerFromSearchParams(searchParams: URLSearchParams): string | null {
  if (searchParams.get('booking_success')) {
    return 'Booking confirmed. Your spot is locked in.';
  }
  if (searchParams.get('subscription_success')) {
    return 'Membership activated. Welcome to the next level.';
  }
  return null;
}

function membershipLabel(status: SubscriptionStatus | null | undefined) {
  switch (status) {
    case 'ACTIVE':
      return 'Active Member';
    case 'PAST_DUE':
      return 'Payment Issue';
    case 'CANCELED':
      return 'Canceled';
    case 'INCOMPLETE':
      return 'Setup Pending';
    default:
      return 'No Membership';
  }
}

const TABS: Array<{ id: DashboardTab; label: string; icon: typeof User2 }> = [
  { id: 'overview', label: 'Overview', icon: User2 },
  { id: 'classes', label: 'My Classes', icon: Calendar },
  { id: 'payments', label: 'Payments', icon: CreditCard },
  { id: 'settings', label: 'Settings', icon: Settings2 },
];

export default function DashboardUI({ user, bookings }: DashboardUIProps) {
  const [activeTab, setActiveTab] = useState<DashboardTab>('overview');
  const [dismissedBanner, setDismissedBanner] = useState(false);
  const searchParams = useSearchParams();
  const urlBanner = useMemo(() => bannerFromSearchParams(searchParams), [searchParams]);
  const notification = dismissedBanner ? null : urlBanner;

  const upcomingBookings = bookings.filter((booking) => new Date(booking.event.date) > new Date());
  const pastBookings = bookings.filter((booking) => new Date(booking.event.date) <= new Date());
  const nextBooking = upcomingBookings[0];
  const totalSpent = bookings.reduce((sum, booking) => sum + booking.event.price, 0);

  const stats = [
    {
      label: 'Next Session',
      value: nextBooking?.event.title ?? 'No booking yet',
      icon: Calendar,
    },
    {
      label: 'Membership',
      value: membershipLabel(user.subscriptionStatus),
      icon: CreditCard,
    },
    {
      label: 'Total Bookings',
      value: bookings.length.toString(),
      icon: Sparkles,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.96 }}
            className="site-panel fixed bottom-6 right-6 z-[120] flex max-w-md items-start gap-4 rounded-[1.8rem] p-5"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-500/14 text-emerald-300">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-black uppercase tracking-[0.2em] text-white">Success</p>
              <p className="mt-2 text-sm leading-6 text-slate-300">{notification}</p>
            </div>
            <button
              onClick={() => setDismissedBanner(true)}
              className="rounded-full border border-white/10 bg-white/5 p-2 text-slate-300"
            >
              <X className="h-4 w-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mx-auto max-w-7xl px-4 pb-16 pt-8 md:px-6">
        <header className="site-panel mb-8 rounded-[2rem] px-5 py-5">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center justify-between gap-4">
              <Link href="/" className="flex items-center gap-3 text-white">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/18 text-accent">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <p className="display-type text-lg font-black uppercase tracking-[0.22em]">
                    AfroDanz
                  </p>
                  <p className="text-[0.65rem] font-bold uppercase tracking-[0.22em] text-slate-400">
                    Member Dashboard
                  </p>
                </div>
              </Link>

              <form action="/api/auth/signout" method="POST" className="lg:hidden">
                <button
                  type="submit"
                  className="inline-flex items-center justify-center rounded-full border border-red-500/20 bg-red-500/10 p-3 text-red-300"
                  aria-label="Logout"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </form>
            </div>

            <nav className="flex flex-wrap items-center gap-2">
              {MEMBER_NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded-full border border-white/8 bg-white/5 px-4 py-2 text-xs font-black uppercase tracking-[0.22em] text-slate-300 transition hover:border-primary/30 hover:text-white"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="hidden lg:flex lg:items-center lg:gap-3">
              <Link
                href="/events"
                className="site-outline-button inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-xs font-black uppercase tracking-[0.22em] text-white"
              >
                Browse Events
                <ExternalLink className="h-4 w-4" />
              </Link>
              <form action="/api/auth/signout" method="POST">
                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-red-500/20 bg-red-500/10 px-5 py-3 text-xs font-black uppercase tracking-[0.22em] text-red-300"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </form>
            </div>
          </div>
        </header>

        <div className="flex flex-col gap-8 lg:flex-row">
          <aside className="site-panel flex flex-col rounded-[2.4rem] p-6 lg:w-72">
            <Link href="/" className="mb-8">
              <p className="site-kicker mb-3">Member portal</p>
              <h1 className="site-title text-3xl font-black uppercase text-white">
                Afro<span className="site-highlight">Danz</span>
              </h1>
            </Link>

            <div className="site-panel-soft mb-8 rounded-[2rem] p-5">
              <div className="flex items-center gap-4">
                {user.image ? (
                  <Image
                    src={user.image}
                    alt={user.name || 'Member avatar'}
                    width={56}
                    height={56}
                    className="rounded-2xl border border-white/10 object-cover"
                  />
                ) : (
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/18 text-white">
                    <User2 className="h-6 w-6" />
                  </div>
                )}
                <div>
                  <p className="font-black uppercase tracking-[0.18em] text-white">
                    {user.name?.split(' ')[0] || 'Dancer'}
                  </p>
                  <p className="mt-1 text-xs font-bold uppercase tracking-[0.18em] text-accent">
                    {membershipLabel(user.subscriptionStatus)}
                  </p>
                </div>
              </div>
            </div>

            <nav className="grid gap-2 md:grid-cols-4 lg:grid-cols-1">
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
                  <tab.icon className="h-4 w-4" />
                  {tab.label}
                </button>
              ))}
            </nav>

            <div className="mt-8 flex flex-col gap-3 lg:hidden">
              <Link
                href="/events"
                className="site-outline-button inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-xs font-black uppercase tracking-[0.22em] text-white"
              >
                Browse Events
                <ExternalLink className="h-4 w-4" />
              </Link>
            </div>
          </aside>

          <div className="flex-1">
            <header className="mb-8 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="site-kicker mb-4">Dashboard</p>
                <h2 className="site-title text-4xl font-black uppercase text-white md:text-5xl">
                  Welcome Back
                  <span className="site-highlight block">
                    {user.name?.split(' ')[0] || 'Dancer'}
                  </span>
                </h2>
              </div>
              <div className="site-panel-soft rounded-[1.6rem] px-5 py-4 text-sm text-slate-300">
                <p className="font-black uppercase tracking-[0.2em] text-accent">Live status</p>
                <p className="mt-2">
                  {upcomingBookings.length} upcoming booking{upcomingBookings.length === 1 ? '' : 's'} and €{(totalSpent / 100).toFixed(2)} spent so far.
                </p>
              </div>
            </header>

          {activeTab === 'overview' && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
              <div className="grid gap-6 md:grid-cols-3">
                {stats.map((stat) => (
                  <div key={stat.label} className="site-panel-soft rounded-[2rem] p-6">
                    <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/15 text-primary">
                      <stat.icon className="h-5 w-5" />
                    </div>
                    <p className="text-xs font-black uppercase tracking-[0.22em] text-slate-500">
                      {stat.label}
                    </p>
                    <p className="mt-3 text-lg font-bold text-white">{stat.value}</p>
                  </div>
                ))}
              </div>

              <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
                <section className="site-panel rounded-[2.4rem] p-8">
                  <p className="site-kicker mb-4">Next up</p>
                  {nextBooking ? (
                    <>
                      <h3 className="site-title text-3xl font-black uppercase text-white">
                        {nextBooking.event.title}
                      </h3>
                      <div className="mt-6 space-y-4 text-sm text-slate-300">
                        <div className="flex items-center gap-3">
                          <Calendar className="h-4 w-4 text-secondary" />
                          <span>{new Date(nextBooking.event.date).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Clock3 className="h-4 w-4 text-secondary" />
                          <span>{new Date(nextBooking.event.date).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <MapPin className="h-4 w-4 text-secondary" />
                          <span>{nextBooking.event.location}</span>
                        </div>
                      </div>
                      <Link
                        href={`/events/${nextBooking.event.slug}`}
                        className="site-primary-button mt-8 inline-flex items-center gap-2 rounded-full px-6 py-3 text-xs font-black uppercase tracking-[0.22em] text-white"
                      >
                        View Event
                        <ExternalLink className="h-4 w-4" />
                      </Link>
                    </>
                  ) : (
                    <div className="rounded-[1.8rem] border border-dashed border-white/10 px-6 py-12 text-slate-400">
                      No active booking yet. Pick your next session from the live event calendar.
                    </div>
                  )}
                </section>

                <section className="space-y-6">
                  <div className="site-panel-soft rounded-[2rem] p-6">
                    <p className="site-kicker mb-4">Momentum</p>
                    <h3 className="site-title text-2xl font-black uppercase text-white">Keep the streak alive</h3>
                    <p className="mt-4 text-sm leading-7 text-slate-400">
                      Book another session or upgrade your membership to get priority access to the next intensive.
                    </p>
                    <div className="mt-6 flex flex-col gap-3">
                      <Link href="/events" className="site-outline-button rounded-full px-5 py-3 text-center text-xs font-black uppercase tracking-[0.22em] text-white">
                        Explore events
                      </Link>
                      <Link href="/#pricing" className="site-outline-button rounded-full px-5 py-3 text-center text-xs font-black uppercase tracking-[0.22em] text-white">
                        Review plans
                      </Link>
                    </div>
                  </div>

                  <div className="site-panel-soft rounded-[2rem] p-6">
                    <p className="site-kicker mb-4">Support</p>
                    <h3 className="site-title text-2xl font-black uppercase text-white">Need help?</h3>
                    <p className="mt-4 text-sm leading-7 text-slate-400">
                      For receipts, membership questions, or account changes, the team can help directly.
                    </p>
                    <Link
                      href="/contact"
                      className="site-primary-button mt-6 inline-flex rounded-full px-5 py-3 text-xs font-black uppercase tracking-[0.22em] text-white"
                    >
                      Contact support
                    </Link>
                  </div>
                </section>
              </div>
            </motion.div>
          )}

          {activeTab === 'classes' && (
            <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
              <section className="site-panel rounded-[2.4rem] p-8">
                <h3 className="site-title text-3xl font-black uppercase text-white">My Classes</h3>
                <div className="mt-8 space-y-10">
                  <div>
                    <p className="mb-4 text-xs font-black uppercase tracking-[0.22em] text-accent">Upcoming</p>
                    <div className="space-y-4">
                      {upcomingBookings.length === 0 ? (
                        <div className="rounded-[1.8rem] border border-dashed border-white/10 px-6 py-12 text-slate-400">
                          No upcoming classes yet.
                        </div>
                      ) : (
                        upcomingBookings.map((booking) => (
                          <div key={booking.id} className="site-panel-soft flex flex-col gap-5 rounded-[1.8rem] p-6 md:flex-row md:items-center md:justify-between">
                            <div className="flex items-center gap-5">
                              <div className="flex h-16 w-16 flex-col items-center justify-center rounded-[1.3rem] bg-white/6 text-white">
                                <span className="text-[0.65rem] font-black uppercase tracking-[0.18em] text-slate-400">
                                  {new Date(booking.event.date).toLocaleDateString('en-GB', { month: 'short' })}
                                </span>
                                <span className="text-2xl font-black">{new Date(booking.event.date).getDate()}</span>
                              </div>
                              <div>
                                <h4 className="text-lg font-black uppercase tracking-[0.12em] text-white">
                                  {booking.event.title}
                                </h4>
                                <p className="mt-2 text-sm text-slate-400">
                                  {new Date(booking.event.date).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })} • {booking.event.location}
                                </p>
                              </div>
                            </div>
                            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-emerald-300">
                              <CheckCircle2 className="h-4 w-4" />
                              Confirmed
                            </span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  <div>
                    <p className="mb-4 text-xs font-black uppercase tracking-[0.22em] text-slate-500">Past Sessions</p>
                    <div className="space-y-4">
                      {pastBookings.length === 0 ? (
                        <div className="rounded-[1.8rem] border border-dashed border-white/10 px-6 py-10 text-slate-500">
                          Your completed sessions will appear here.
                        </div>
                      ) : (
                        pastBookings.map((booking) => (
                          <div key={booking.id} className="flex items-center justify-between rounded-[1.6rem] border border-white/6 bg-white/4 px-5 py-4 text-sm text-slate-400">
                            <div>
                              <p className="font-bold text-white">{booking.event.title}</p>
                              <p className="mt-1">{new Date(booking.event.date).toLocaleDateString('en-GB')}</p>
                            </div>
                            <span className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">Completed</span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </section>
            </motion.div>
          )}

          {activeTab === 'payments' && (
            <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
              <section className="site-panel rounded-[2.4rem] p-8">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <h3 className="site-title text-3xl font-black uppercase text-white">Payments</h3>
                    <p className="mt-2 text-sm text-slate-400">
                      Stripe handles payment confirmation and sends receipts by email after checkout.
                    </p>
                  </div>
                  <div className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-emerald-300">
                    Secure Payments
                  </div>
                </div>

                <div className="mt-8 space-y-4">
                  {bookings.length === 0 ? (
                    <div className="rounded-[1.8rem] border border-dashed border-white/10 px-6 py-12 text-slate-400">
                      No payment history yet.
                    </div>
                  ) : (
                    bookings.map((booking) => (
                      <div key={booking.id} className="site-panel-soft flex flex-col gap-4 rounded-[1.8rem] p-6 md:flex-row md:items-center md:justify-between">
                        <div>
                          <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">
                            {new Date(booking.createdAt).toLocaleDateString('en-GB')}
                          </p>
                          <h4 className="mt-2 text-lg font-black uppercase tracking-[0.12em] text-white">
                            {booking.event.title}
                          </h4>
                          <p className="mt-2 text-sm text-slate-400">
                            Receipt is managed by Stripe and sent to your account email.
                          </p>
                        </div>
                        <div className="text-left md:text-right">
                          <p className="text-2xl font-black text-white">€{(booking.event.price / 100).toFixed(2)}</p>
                          <p className="mt-2 text-xs font-black uppercase tracking-[0.2em] text-accent">Paid</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </section>
            </motion.div>
          )}

          {activeTab === 'settings' && (
            <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
              <section className="site-panel rounded-[2.4rem] p-8">
                <h3 className="site-title text-3xl font-black uppercase text-white">Account Settings</h3>
                <div className="mt-8 grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">
                      Display Name
                    </label>
                    <input
                      disabled
                      value={user.name ?? ''}
                      className="w-full cursor-not-allowed rounded-[1.3rem] border border-white/8 bg-white/5 px-4 py-3 text-slate-300"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">
                      Email Address
                    </label>
                    <input
                      disabled
                      value={user.email ?? ''}
                      className="w-full cursor-not-allowed rounded-[1.3rem] border border-white/8 bg-white/5 px-4 py-3 text-slate-300"
                    />
                  </div>
                </div>

                <div className="neon-divider my-8" />

                <div className="flex flex-col gap-4 md:flex-row">
                  <Link
                    href="/contact"
                    className="site-outline-button rounded-full px-6 py-3 text-center text-xs font-black uppercase tracking-[0.22em] text-white"
                  >
                    Request account update
                  </Link>
                  <Link
                    href="/privacy"
                    className="site-outline-button rounded-full px-6 py-3 text-center text-xs font-black uppercase tracking-[0.22em] text-white"
                  >
                    Privacy policy
                  </Link>
                  <Link
                    href="/terms"
                    className="site-outline-button rounded-full px-6 py-3 text-center text-xs font-black uppercase tracking-[0.22em] text-white"
                  >
                    Terms
                  </Link>
                </div>
              </section>
            </motion.div>
          )}
          </div>
        </div>

        <footer className="mt-10 border-t border-white/8 pt-8">
          <div className="flex flex-col gap-4 text-sm text-slate-400 md:flex-row md:items-center md:justify-between">
            <p>AfroDanz member area for bookings, subscriptions, and account support.</p>
            <div className="flex flex-wrap items-center gap-4">
              <Link href="/" className="transition hover:text-white">
                Home
              </Link>
              <Link href="/events" className="transition hover:text-white">
                Events
              </Link>
              <Link href="/contact" className="transition hover:text-white">
                Support
              </Link>
              <Link href="/privacy" className="transition hover:text-white">
                Privacy
              </Link>
              <Link href="/terms" className="transition hover:text-white">
                Terms
              </Link>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
