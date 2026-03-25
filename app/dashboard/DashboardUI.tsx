'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar,
  CheckCircle2,
  ChevronDown,
  Clock3,
  CreditCard,
  Eye,
  EyeOff,
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
import { signOut } from 'next-auth/react';
import { toast } from 'sonner';
import type { Session } from 'next-auth';
import type { Booking, Event, SubscriptionStatus } from '@prisma/client';
import { formatPrice, formatDateLong, formatTime, formatMonthShort, formatDateCompact } from '@/lib/format';
import { useTranslation } from '@/lib/locale-context';
import { evaluatePasswordStrength, isPasswordStrongEnough } from '@/lib/password-strength';
import { changePassword } from './actions';

type BookingWithEvent = Booking & { event: Event };
type DashboardTab = 'overview' | 'classes' | 'payments' | 'settings';

interface DashboardUIProps {
  user: Session['user'];
  bookings: BookingWithEvent[];
}

function bannerKeyFromSearchParams(searchParams: URLSearchParams): string | null {
  if (searchParams.get('booking_success')) {
    return 'dashboardBanner.bookingSuccess';
  }
  if (searchParams.get('subscription_success')) {
    return 'dashboardBanner.subscriptionSuccess';
  }
  return null;
}

function membershipLabelKey(status: SubscriptionStatus | null | undefined): string {
  switch (status) {
    case 'ACTIVE':
      return 'dashboardPage.membershipLabels.active';
    case 'PAST_DUE':
      return 'dashboardPage.membershipLabels.pastDue';
    case 'CANCELED':
      return 'dashboardPage.membershipLabels.canceled';
    case 'INCOMPLETE':
      return 'dashboardPage.membershipLabels.incomplete';
    default:
      return 'dashboardPage.membershipLabels.none';
  }
}

const TAB_IDS: DashboardTab[] = ['overview', 'classes', 'payments', 'settings'];
const TAB_ICONS = [User2, Calendar, CreditCard, Settings2] as const;
const TAB_LABEL_KEYS = [
  'dashboardPage.tabs.overview',
  'dashboardPage.tabs.classes',
  'dashboardPage.tabs.payments',
  'dashboardPage.tabs.settings',
] as const;

export default function DashboardUI({ user, bookings }: DashboardUIProps) {
  const [activeTab, setActiveTab] = useState<DashboardTab>('overview');
  const [dismissedBanner, setDismissedBanner] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const searchParams = useSearchParams();
  const t = useTranslation();

  // Password change state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [changingPassword, setChangingPassword] = useState(false);
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);

  const passwordStrength = evaluatePasswordStrength(newPassword);
  const strengthColors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-500', 'bg-emerald-500'];

  // Close profile dropdown on outside click / Escape
  useEffect(() => {
    if (!profileOpen) return;
    function handleClick(e: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setProfileOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('keydown', handleKey);
    };
  }, [profileOpen]);
  const bannerKey = useMemo(() => bannerKeyFromSearchParams(searchParams), [searchParams]);
  const notification = dismissedBanner || !bannerKey ? null : t(bannerKey);

  const upcomingBookings = bookings.filter((booking) => new Date(booking.event.date) > new Date());
  const pastBookings = bookings.filter((booking) => new Date(booking.event.date) <= new Date());
  const nextBooking = upcomingBookings[0];
  const totalSpent = bookings.reduce((sum, booking) => sum + (booking.event.price ?? 0), 0);

  const stats = [
    {
      label: t('dashboardPage.stats.nextSession'),
      value: nextBooking?.event.title ?? t('dashboardPage.stats.noBookingYet'),
      icon: Calendar,
    },
    {
      label: t('dashboardPage.stats.membership'),
      value: t(membershipLabelKey(user.subscriptionStatus)),
      icon: CreditCard,
    },
    {
      label: t('dashboardPage.stats.totalBookings'),
      value: bookings.length.toString(),
      icon: Sparkles,
    },
  ];

  const handleSignOut = () => {
    signOut({ callbackUrl: '/' });
  };

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
              <p className="text-sm font-black uppercase tracking-[0.2em] text-white">{t('dashboardPage.success')}</p>
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
        <header className="site-panel relative z-50 mb-8 rounded-[2rem] px-5 py-5">
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
                  {t('dashboardPage.memberDashboard')}
                </p>
              </div>
            </Link>

            <div className="flex items-center gap-3">
              <Link
                href="/events"
                className="site-outline-button hidden items-center justify-center gap-2 rounded-full px-5 py-3 text-xs font-black uppercase tracking-[0.22em] text-white sm:inline-flex"
              >
                {t('dashboardPage.browseEvents')}
                <ExternalLink className="h-4 w-4" />
              </Link>

              {/* Profile dropdown */}
              <div ref={profileRef} className="relative">
                <button
                  type="button"
                  onClick={() => setProfileOpen((v) => !v)}
                  className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 py-2 pl-2 pr-3 transition hover:border-primary/30"
                >
                  {user.image ? (
                    <Image
                      src={user.image}
                      alt={user.name || t('dashboardPage.memberAvatar')}
                      width={32}
                      height={32}
                      className="rounded-full border border-white/10 object-cover"
                    />
                  ) : (
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/18 text-white">
                      <User2 className="h-4 w-4" />
                    </div>
                  )}
                  <span className="hidden text-sm font-bold text-white sm:inline">
                    {user.name?.split(' ')[0] || t('dashboardPage.dancer')}
                  </span>
                  <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform ${profileOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {profileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.96 }}
                      transition={{ duration: 0.15 }}
                      className="site-panel absolute right-0 z-50 mt-2 w-64 overflow-hidden rounded-[1.4rem] p-4 shadow-2xl"
                    >
                      <div className="mb-3 flex items-center gap-3">
                        {user.image ? (
                          <Image
                            src={user.image}
                            alt={user.name || t('dashboardPage.memberAvatar')}
                            width={40}
                            height={40}
                            className="rounded-xl border border-white/10 object-cover"
                          />
                        ) : (
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/18 text-white">
                            <User2 className="h-5 w-5" />
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="truncate text-sm font-bold text-white">
                            {user.name || t('dashboardPage.dancer')}
                          </p>
                          <p className="truncate text-xs text-slate-400">{user.email}</p>
                          <p className="mt-0.5 text-[0.65rem] font-bold uppercase tracking-wider text-accent">
                            {t(membershipLabelKey(user.subscriptionStatus))}
                          </p>
                        </div>
                      </div>

                      <div className="my-2 border-t border-white/8" />

                      <nav className="space-y-1">
                        <button
                          type="button"
                          onClick={() => { setActiveTab('overview'); setProfileOpen(false); }}
                          className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm text-slate-300 transition hover:bg-white/6 hover:text-white"
                        >
                          <User2 className="h-4 w-4" />
                          {t('dashboardPage.profileMenu.dashboard')}
                        </button>
                        <Link
                          href="/events"
                          onClick={() => setProfileOpen(false)}
                          className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-slate-300 transition hover:bg-white/6 hover:text-white"
                        >
                          <Calendar className="h-4 w-4" />
                          {t('dashboardPage.profileMenu.events')}
                        </Link>
                        <button
                          type="button"
                          onClick={() => { setActiveTab('settings'); setProfileOpen(false); }}
                          className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm text-slate-300 transition hover:bg-white/6 hover:text-white"
                        >
                          <Settings2 className="h-4 w-4" />
                          {t('dashboardPage.profileMenu.settings')}
                        </button>
                      </nav>

                      <div className="my-2 border-t border-white/8" />

                      <button
                        type="button"
                        onClick={handleSignOut}
                        className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm text-red-400 transition hover:bg-red-500/10"
                      >
                        <LogOut className="h-4 w-4" />
                        {t('dashboardPage.logout')}
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </header>

        <div className="flex flex-col gap-8 lg:flex-row">
          <aside className="site-panel flex min-w-0 flex-col rounded-[2.4rem] p-6 lg:w-72 lg:shrink-0">
            <Link href="/" className="mb-8">
              <p className="site-kicker mb-3">{t('dashboardPage.memberPortal')}</p>
              <h1 className="site-title text-3xl font-black uppercase text-white">
                Afro<span className="site-highlight">Danz</span>
              </h1>
            </Link>

            <div className="site-panel-soft mb-8 rounded-[2rem] p-5">
              <div className="flex items-center gap-4">
                {user.image ? (
                  <Image
                    src={user.image}
                    alt={user.name || t('dashboardPage.memberAvatar')}
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
                    {user.name?.split(' ')[0] || t('dashboardPage.dancer')}
                  </p>
                  <p className="mt-1 text-xs font-bold uppercase tracking-[0.18em] text-accent">
                    {t(membershipLabelKey(user.subscriptionStatus))}
                  </p>
                </div>
              </div>
            </div>

            <nav className="grid gap-2 md:grid-cols-4 lg:grid-cols-1">
              {TAB_IDS.map((tabId, index) => {
                const Icon = TAB_ICONS[index];
                return (
                  <button
                    key={tabId}
                    onClick={() => setActiveTab(tabId)}
                    className={`flex items-center gap-3 rounded-[1.2rem] px-4 py-3 text-left text-sm font-black uppercase tracking-[0.2em] ${
                      activeTab === tabId
                        ? 'site-primary-button text-white'
                        : 'text-slate-400 hover:bg-white/6 hover:text-white'
                    }`}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    <span className="truncate">{t(TAB_LABEL_KEYS[index])}</span>
                  </button>
                );
              })}
            </nav>

            <div className="mt-8 flex flex-col gap-3 lg:hidden">
              <Link
                href="/events"
                className="site-outline-button inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-xs font-black uppercase tracking-[0.22em] text-white"
              >
                {t('dashboardPage.browseEvents')}
                <ExternalLink className="h-4 w-4" />
              </Link>
            </div>
          </aside>

          <div className="flex-1">
            <header className="mb-8 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="site-kicker mb-4">{t('dashboardPage.kicker')}</p>
                <h2 className="site-title text-4xl font-black uppercase text-white md:text-5xl">
                  {t('dashboardPage.welcomeBack')}
                  <span className="site-highlight block">
                    {user.name?.split(' ')[0] || t('dashboardPage.dancer')}
                  </span>
                </h2>
              </div>
              <div className="site-panel-soft rounded-[1.6rem] px-5 py-4 text-sm text-slate-300">
                <p className="font-black uppercase tracking-[0.2em] text-accent">{t('dashboardPage.liveStatus')}</p>
                <p className="mt-2">
                  {upcomingBookings.length} {t('dashboardPage.upcomingBookings')} {t('dashboardPage.and', 'and')} {formatPrice(totalSpent)} {t('dashboardPage.spentSoFar')}
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

              <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr] xl:items-start">
                <section className="site-panel rounded-[2.4rem] p-8">
                  <p className="site-kicker mb-4">{t('dashboardPage.nextUp')}</p>
                  {nextBooking ? (
                    <>
                      <h3 className="site-title text-3xl font-black uppercase text-white">
                        {nextBooking.event.title}
                      </h3>
                      <div className="mt-6 space-y-4 text-sm text-slate-300">
                        <div className="flex items-center gap-3">
                          <Calendar className="h-4 w-4 text-secondary" />
                          <span>{formatDateLong(nextBooking.event.date)}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Clock3 className="h-4 w-4 text-secondary" />
                          <span>{formatTime(nextBooking.event.date)}</span>
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
                        {t('dashboardPage.viewEvent')}
                        <ExternalLink className="h-4 w-4" />
                      </Link>
                    </>
                  ) : (
                    <div className="rounded-[1.8rem] border border-dashed border-white/10 px-6 py-12 text-slate-400">
                      {t('dashboardPage.noActiveBooking')}
                    </div>
                  )}
                </section>

                <section className="site-panel-soft rounded-[2rem] p-6">
                    <p className="site-kicker mb-4">{t('dashboardPage.momentum')}</p>
                    <h3 className="site-title text-2xl font-black uppercase text-white">{t('dashboardPage.keepStreak')}</h3>
                    <p className="mt-4 text-sm leading-7 text-slate-400">
                      {t('dashboardPage.momentumBody')}
                    </p>
                    <div className="mt-6 flex flex-col gap-3">
                      <Link href="/events" className="site-outline-button rounded-full px-5 py-3 text-center text-xs font-black uppercase tracking-[0.22em] text-white">
                        {t('dashboardPage.exploreEvents')}
                      </Link>
                      <Link href="/#pricing" className="site-outline-button rounded-full px-5 py-3 text-center text-xs font-black uppercase tracking-[0.22em] text-white">
                        {t('dashboardPage.reviewPlans')}
                      </Link>
                    </div>
                </section>
              </div>

              <div className="site-panel-soft rounded-[2rem] p-6">
                <p className="site-kicker mb-4">{t('dashboardPage.support')}</p>
                <h3 className="site-title text-2xl font-black uppercase text-white">{t('dashboardPage.needHelp')}</h3>
                <p className="mt-4 text-sm leading-7 text-slate-400">
                  {t('dashboardPage.supportBody')}
                </p>
                <Link
                  href="/contact"
                  className="site-primary-button mt-6 inline-flex rounded-full px-5 py-3 text-xs font-black uppercase tracking-[0.22em] text-white"
                >
                  {t('dashboardPage.contactSupport')}
                </Link>
              </div>
            </motion.div>
          )}

          {activeTab === 'classes' && (
            <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
              <section className="site-panel rounded-[2.4rem] p-8">
                <h3 className="site-title text-3xl font-black uppercase text-white">{t('dashboardPage.myClasses')}</h3>
                <div className="mt-8 space-y-10">
                  <div>
                    <p className="mb-4 text-xs font-black uppercase tracking-[0.22em] text-accent">{t('dashboardPage.upcoming')}</p>
                    <div className="space-y-4">
                      {upcomingBookings.length === 0 ? (
                        <div className="rounded-[1.8rem] border border-dashed border-white/10 px-6 py-12 text-slate-400">
                          {t('dashboardPage.noUpcomingClasses')}
                        </div>
                      ) : (
                        upcomingBookings.map((booking) => (
                          <div key={booking.id} className="site-panel-soft flex flex-col gap-5 rounded-[1.8rem] p-6 md:flex-row md:items-center md:justify-between">
                            <div className="flex items-center gap-5">
                              <div className="flex h-16 w-16 flex-col items-center justify-center rounded-[1.3rem] bg-white/6 text-white">
                                <span className="text-[0.65rem] font-black uppercase tracking-[0.18em] text-slate-400">
                                  {formatMonthShort(booking.event.date)}
                                </span>
                                <span className="text-2xl font-black">{new Date(booking.event.date).getDate()}</span>
                              </div>
                              <div>
                                <h4 className="text-lg font-black uppercase tracking-[0.12em] text-white">
                                  {booking.event.title}
                                </h4>
                                <p className="mt-2 text-sm text-slate-400">
                                  {formatTime(booking.event.date)} • {booking.event.location}
                                </p>
                              </div>
                            </div>
                            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-emerald-300">
                              <CheckCircle2 className="h-4 w-4" />
                              {t('dashboardPage.confirmed')}
                            </span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  <div>
                    <p className="mb-4 text-xs font-black uppercase tracking-[0.22em] text-slate-500">{t('dashboardPage.pastSessions')}</p>
                    <div className="space-y-4">
                      {pastBookings.length === 0 ? (
                        <div className="rounded-[1.8rem] border border-dashed border-white/10 px-6 py-10 text-slate-500">
                          {t('dashboardPage.completedSessionsAppear')}
                        </div>
                      ) : (
                        pastBookings.map((booking) => (
                          <div key={booking.id} className="flex items-center justify-between rounded-[1.6rem] border border-white/6 bg-white/4 px-5 py-4 text-sm text-slate-400">
                            <div>
                              <p className="font-bold text-white">{booking.event.title}</p>
                              <p className="mt-1">{formatDateCompact(booking.event.date)}</p>
                            </div>
                            <span className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">{t('dashboardPage.completed')}</span>
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
                    <h3 className="site-title text-3xl font-black uppercase text-white">{t('dashboardPage.payments')}</h3>
                    <p className="mt-2 text-sm text-slate-400">
                      {t('dashboardPage.paymentsDescription')}
                    </p>
                  </div>
                  <div className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-emerald-300">
                    {t('dashboardPage.securePayments')}
                  </div>
                </div>

                <div className="mt-8 space-y-4">
                  {bookings.length === 0 ? (
                    <div className="rounded-[1.8rem] border border-dashed border-white/10 px-6 py-12 text-slate-400">
                      {t('dashboardPage.noPaymentHistory')}
                    </div>
                  ) : (
                    bookings.map((booking) => (
                      <div key={booking.id} className="site-panel-soft flex flex-col gap-4 rounded-[1.8rem] p-6 md:flex-row md:items-center md:justify-between">
                        <div>
                          <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">
                            {formatDateCompact(booking.createdAt)}
                          </p>
                          <h4 className="mt-2 text-lg font-black uppercase tracking-[0.12em] text-white">
                            {booking.event.title}
                          </h4>
                          <p className="mt-2 text-sm text-slate-400">
                            {t('dashboardPage.receiptManaged')}
                          </p>
                        </div>
                        <div className="text-left md:text-right">
                          <p className="text-2xl font-black text-white">{formatPrice(booking.event.price)}</p>
                          <p className="mt-2 text-xs font-black uppercase tracking-[0.2em] text-accent">{t('dashboardPage.paid')}</p>
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
                <h3 className="site-title text-3xl font-black uppercase text-white">{t('dashboardPage.accountSettings')}</h3>
                <div className="mt-8 grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">
                      {t('dashboardPage.displayName')}
                    </label>
                    <input
                      disabled
                      value={user.name ?? ''}
                      className="w-full cursor-not-allowed rounded-[1.3rem] border border-white/8 bg-white/5 px-4 py-3 text-slate-300"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">
                      {t('dashboardPage.emailAddress')}
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
                    {t('dashboardPage.requestUpdate')}
                  </Link>
                  <Link
                    href="/privacy"
                    className="site-outline-button rounded-full px-6 py-3 text-center text-xs font-black uppercase tracking-[0.22em] text-white"
                  >
                    {t('dashboardPage.privacyPolicy')}
                  </Link>
                  <Link
                    href="/terms"
                    className="site-outline-button rounded-full px-6 py-3 text-center text-xs font-black uppercase tracking-[0.22em] text-white"
                  >
                    {t('dashboardPage.terms')}
                  </Link>
                </div>
              </section>

              {/* Password change section */}
              <section className="site-panel rounded-[2.4rem] p-8">
                <p className="site-kicker mb-4">{t('dashboardPage.settings.securitySection')}</p>
                <h3 className="site-title text-3xl font-black uppercase text-white">{t('dashboardPage.settings.changePassword')}</h3>

                <form
                  className="mt-8 space-y-6"
                  onSubmit={async (e) => {
                    e.preventDefault();
                    if (newPassword !== confirmPassword) {
                      toast.error(t('dashboardPage.settings.passwordMismatch'));
                      return;
                    }
                    if (!isPasswordStrongEnough(newPassword)) {
                      toast.error(t('dashboardPage.settings.passwordTooWeak'));
                      return;
                    }
                    setChangingPassword(true);
                    const fd = new FormData();
                    fd.set('currentPassword', currentPassword);
                    fd.set('newPassword', newPassword);
                    fd.set('confirmPassword', confirmPassword);
                    const result = await changePassword(fd);
                    setChangingPassword(false);
                    if (result.success) {
                      toast.success(t('dashboardPage.settings.passwordSuccess'));
                      setCurrentPassword('');
                      setNewPassword('');
                      setConfirmPassword('');
                    } else {
                      toast.error(t('dashboardPage.settings.passwordError'));
                    }
                  }}
                >
                  {/* Current password */}
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">
                      {t('dashboardPage.settings.currentPassword')}
                    </label>
                    <div className="relative">
                      <input
                        type={showCurrentPw ? 'text' : 'password'}
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="w-full rounded-[1.3rem] border border-white/8 bg-white/5 px-4 py-3 pr-12 text-white placeholder:text-slate-500 focus:border-primary/40 focus:outline-none"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPw((v) => !v)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                      >
                        {showCurrentPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  {/* New password */}
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">
                      {t('dashboardPage.settings.newPassword')}
                    </label>
                    <div className="relative">
                      <input
                        type={showNewPw ? 'text' : 'password'}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full rounded-[1.3rem] border border-white/8 bg-white/5 px-4 py-3 pr-12 text-white placeholder:text-slate-500 focus:border-primary/40 focus:outline-none"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPw((v) => !v)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                      >
                        {showNewPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>

                    {/* Strength meter */}
                    {newPassword.length > 0 && (
                      <div className="space-y-3 pt-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">
                            {t('dashboardPage.settings.passwordStrength')}
                          </span>
                          <span className="text-xs font-bold text-slate-400">{passwordStrength.label}</span>
                        </div>
                        <div className="flex gap-1">
                          {[0, 1, 2, 3, 4].map((i) => (
                            <div
                              key={i}
                              className={`h-1.5 flex-1 rounded-full transition-colors ${
                                i <= passwordStrength.score ? strengthColors[passwordStrength.score] : 'bg-white/10'
                              }`}
                            />
                          ))}
                        </div>
                        <ul className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                          {[
                            { key: 'length', label: t('auth.req8chars') },
                            { key: 'uppercase', label: t('auth.reqUppercase') },
                            { key: 'lowercase', label: t('auth.reqLowercase') },
                            { key: 'number', label: t('auth.reqNumber') },
                            { key: 'symbol', label: t('auth.reqSymbol') },
                          ].map((req) => {
                            const met = passwordStrength.checks[req.key as keyof typeof passwordStrength.checks];
                            return (
                              <li key={req.key} className={`flex items-center gap-1.5 ${met ? 'text-emerald-400' : 'text-slate-500'}`}>
                                <span>{met ? '\u2713' : '\u2717'}</span>
                                {req.label}
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* Confirm new password */}
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">
                      {t('dashboardPage.settings.confirmNewPassword')}
                    </label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full rounded-[1.3rem] border border-white/8 bg-white/5 px-4 py-3 text-white placeholder:text-slate-500 focus:border-primary/40 focus:outline-none"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={changingPassword || !currentPassword || !newPassword || !confirmPassword}
                    className="site-primary-button inline-flex items-center gap-2 rounded-full px-6 py-3 text-xs font-black uppercase tracking-[0.22em] text-white disabled:opacity-50"
                  >
                    {changingPassword
                      ? t('dashboardPage.settings.updatingPassword')
                      : t('dashboardPage.settings.updatePassword')}
                  </button>
                </form>
              </section>
            </motion.div>
          )}
          </div>
        </div>

        <footer className="mt-10 border-t border-white/8 pt-8">
          <div className="flex flex-col gap-4 text-sm text-slate-400 md:flex-row md:items-center md:justify-between">
            <p>{t('dashboardPage.footerDescription')}</p>
            <div className="flex flex-wrap items-center gap-4">
              <Link href="/" className="transition hover:text-white">
                {t('dashboardPage.footerHome')}
              </Link>
              <Link href="/events" className="transition hover:text-white">
                {t('dashboardPage.footerEvents')}
              </Link>
              <Link href="/contact" className="transition hover:text-white">
                {t('dashboardPage.footerSupport')}
              </Link>
              <Link href="/privacy" className="transition hover:text-white">
                {t('dashboardPage.footerPrivacy')}
              </Link>
              <Link href="/terms" className="transition hover:text-white">
                {t('dashboardPage.footerTerms')}
              </Link>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
