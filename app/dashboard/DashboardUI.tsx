'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  Calendar, 
  CreditCard, 
  LogOut, 
  Settings,
  Clock,
  MapPin,
  CheckCircle2,
  ChevronRight,
  ShieldCheck,
  Star,
  X
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import type { Session } from 'next-auth';
import type { Booking, Event } from '@prisma/client';

type BookingWithEvent = Booking & { event: Event };

interface DashboardUIProps {
  user: Session['user'];
  bookings: BookingWithEvent[];
}

function bannerFromSearchParams(searchParams: URLSearchParams): string | null {
  if (searchParams.get('booking_success')) {
    return 'Booking successful! We have secured your spot.';
  }
  if (searchParams.get('subscription_success')) {
    return 'Welcome to the tribe! Your subscription is now active.';
  }
  return null;
}

export default function DashboardUI({ user, bookings }: DashboardUIProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const searchParams = useSearchParams();
  const urlBanner = useMemo(
    () => bannerFromSearchParams(searchParams),
    [searchParams]
  );
  const [dismissedBanner, setDismissedBanner] = useState(false);
  const notification = dismissedBanner ? null : urlBanner;

  const stats = [
    { label: 'Next Class', value: bookings[0]?.event.title || 'No classes yet', icon: Calendar },
    { label: 'Membership', value: user.subscriptionStatus || 'Basic', icon: CreditCard },
    { label: 'Total Bookings', value: bookings.length.toString(), icon: User },
  ];

  const upcomingBookings = bookings.filter(b => new Date(b.event.date) > new Date());
  const pastBookings = bookings.filter(b => new Date(b.event.date) <= new Date());

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col md:flex-row">
      {/* Toast Notification */}
      <AnimatePresence>
        {notification && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed bottom-8 right-8 z-[200] p-6 bg-primary text-white rounded-3xl shadow-2xl flex items-center gap-4 max-w-md"
          >
            <CheckCircle2 className="w-8 h-8 shrink-0" />
            <p className="font-bold">{notification}</p>
            <button onClick={() => setDismissedBanner(true)} className="p-2 hover:bg-white/10 rounded-full transition-all">
              <X className="w-5 h-5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Header */}
      <div className="md:hidden p-6 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
        <div className="text-xl font-black uppercase tracking-tight">AFRO <span className="text-primary italic">DANZ</span></div>
        <button onClick={() => {}} className="p-2 bg-slate-100 dark:bg-slate-800 rounded-xl">
           <User className="w-5 h-5" />
        </button>
      </div>

      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 hidden md:flex flex-col p-6">
        <Link href="/" className="text-2xl font-black mb-12 uppercase tracking-tight">AFRO <span className="text-primary italic">DANZ</span></Link>
        
        <nav className="space-y-2 flex-1">
          <button 
            onClick={() => setActiveTab('overview')}
            className={`w-full flex items-center gap-3 px-4 py-3 font-bold rounded-xl transition-all ${
              activeTab === 'overview' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-muted hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <User className="w-5 h-5" /> Overview
          </button>
          <button 
            onClick={() => setActiveTab('classes')}
            className={`w-full flex items-center gap-3 px-4 py-3 font-bold rounded-xl transition-all ${
              activeTab === 'classes' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-muted hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Calendar className="w-5 h-5" /> My Classes
          </button>
          <button 
            onClick={() => setActiveTab('payments')}
            className={`w-full flex items-center gap-3 px-4 py-3 font-bold rounded-xl transition-all ${
              activeTab === 'payments' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-muted hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <CreditCard className="w-5 h-5" /> Payments
          </button>
          <button 
            onClick={() => setActiveTab('settings')}
            className={`w-full flex items-center gap-3 px-4 py-3 font-bold rounded-xl transition-all ${
              activeTab === 'settings' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-muted hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Settings className="w-5 h-5" /> Settings
          </button>
        </nav>

        <form action="/api/auth/signout" method="POST">
          <button type="submit" className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-xl transition-all mt-auto font-bold">
            <LogOut className="w-5 h-5" /> Logout
          </button>
        </form>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 md:p-12 overflow-y-auto">
        <header className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-3xl font-black mb-2 uppercase tracking-tight leading-none">
              Welcome back, <span className="text-primary italic">{user.name?.split(' ')[0] || 'Dancer'}</span>
            </h1>
            <p className="text-muted">You have {upcomingBookings.length} active bookings.</p>
          </div>
          {user.image ? (
            <Image src={user.image} alt="Avatar" width={48} height={48} className="rounded-full shadow-lg border-2 border-white dark:border-slate-800" />
          ) : (
            <div className="w-12 h-12 rounded-full bg-accent afro-gradient shadow-lg" />
          )}
        </header>

        {activeTab === 'overview' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            {/* Stats Grid */}
            <div className="grid md:grid-cols-3 gap-6 mb-12">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800"
                >
                  <div className="p-3 bg-primary/10 w-fit rounded-2xl mb-4">
                    <stat.icon className="w-6 h-6 text-primary" />
                  </div>
                  <p className="text-sm text-muted font-bold uppercase tracking-widest">{stat.label}</p>
                  <h3 className="text-xl font-black mt-1 truncate">{stat.value}</h3>
                </div>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <section className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-100 dark:border-slate-800">
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-xl font-black uppercase tracking-tight">Next Class</h2>
                  <Link href="/events" className="text-primary font-bold text-sm flex items-center gap-1">Explore all <ChevronRight className="w-4 h-4" /></Link>
                </div>
                
                {upcomingBookings.length > 0 ? (
                  <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                    <h3 className="text-xl font-black mb-2 uppercase tracking-tight text-primary italic">{upcomingBookings[0].event.title}</h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 text-sm font-medium">
                        <Clock className="w-4 h-4 text-muted" />
                        {new Date(upcomingBookings[0].event.date).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })}
                      </div>
                      <div className="flex items-center gap-3 text-sm font-medium">
                        <MapPin className="w-4 h-4 text-muted" />
                        {upcomingBookings[0].event.location}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted italic bg-slate-50 dark:bg-slate-800/50 rounded-2xl">
                    No upcoming classes. Ready to start?
                  </div>
                )}
              </section>

              <section className="bg-slate-900 text-white rounded-3xl p-8 shadow-2xl shadow-primary/20 relative overflow-hidden">
                <div className="relative z-10 h-full flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                      <span className="text-xs font-black uppercase tracking-widest text-slate-400">Special Offer</span>
                    </div>
                    <h2 className="text-3xl font-black uppercase tracking-tighter mb-4">Upgrade <br />to <span className="text-primary italic">Pro</span></h2>
                    <p className="text-slate-400 text-sm mb-8 leading-relaxed">Unlock unlimited drop-in classes and get priority access to masterclasses.</p>
                  </div>
                  <Link href="/#pricing" className="w-full py-4 bg-primary text-white font-black rounded-2xl text-center hover:scale-105 transition-all shadow-xl shadow-primary/20">
                    Upgrade Now
                  </Link>
                </div>
                {/* Visual decoration */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2" />
              </section>
            </div>
          </motion.div>
        )}

        {activeTab === 'classes' && (
           <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
             <section className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-100 dark:border-slate-800">
               <h2 className="text-2xl font-black mb-8 uppercase tracking-tight">My Classes</h2>
               
               <div className="space-y-12">
                 <div>
                   <h3 className="text-xs font-black uppercase tracking-widest text-muted mb-6">Upcoming</h3>
                   <div className="space-y-4">
                    {upcomingBookings.length === 0 ? (
                      <div className="p-12 text-center text-muted border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-3xl">No upcoming classes.</div>
                    ) : (
                      upcomingBookings.map((booking) => (
                        <div key={booking.id} className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl flex items-center justify-between group hover:bg-white dark:hover:bg-slate-800 transition-all border border-transparent hover:border-slate-100 dark:hover:border-slate-700">
                          <div className="flex items-center gap-6">
                            <div className="w-16 h-16 bg-white dark:bg-slate-900 rounded-2xl flex flex-col items-center justify-center border border-slate-100 dark:border-slate-800">
                              <span className="text-xs font-black uppercase text-muted tracking-tighter leading-none">{new Date(booking.event.date).toLocaleDateString('en-GB', { month: 'short' })}</span>
                              <span className="text-2xl font-black">{new Date(booking.event.date).getDate()}</span>
                            </div>
                            <div>
                              <h4 className="text-lg font-black uppercase tracking-tight group-hover:text-primary transition-all">{booking.event.title}</h4>
                              <p className="text-sm text-muted">{new Date(booking.event.date).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })} • {booking.event.location}</p>
                            </div>
                          </div>
                          <span className="px-4 py-2 bg-green-500/10 text-green-500 text-xs font-black uppercase tracking-widest rounded-full flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4" /> Booked
                          </span>
                        </div>
                      ))
                    )}
                   </div>
                 </div>

                 <div>
                   <h3 className="text-xs font-black uppercase tracking-widest text-muted mb-6">Past Sessions</h3>
                   <div className="space-y-4">
                    {pastBookings.map((booking) => (
                      <div key={booking.id} className="p-6 opacity-60 grayscale-[0.5] flex items-center justify-between border-b border-slate-100 dark:border-slate-800">
                        <div className="flex items-center gap-6">
                           <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center font-bold text-muted">
                              {new Date(booking.event.date).getDate()}
                           </div>
                           <div>
                              <h4 className="font-bold">{booking.event.title}</h4>
                              <p className="text-xs text-muted">{new Date(booking.event.date).toLocaleDateString()}</p>
                           </div>
                        </div>
                        <span className="text-xs font-bold text-muted uppercase tracking-widest">Completed</span>
                      </div>
                    ))}
                   </div>
                 </div>
               </div>
             </section>
           </motion.div>
        )}

        {activeTab === 'payments' && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
             <section className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-100 dark:border-slate-800">
                <div className="flex justify-between items-center mb-10">
                  <h2 className="text-2xl font-black uppercase tracking-tight">Payment History</h2>
                  <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700">
                    <ShieldCheck className="w-4 h-4 text-green-500" />
                    <span className="text-xs font-black uppercase tracking-widest">Secure Payments</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="grid grid-cols-4 px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-muted border-b border-slate-50 dark:border-slate-800">
                    <div>Date</div>
                    <div>Event</div>
                    <div>Amount</div>
                    <div className="text-right">Receipt</div>
                  </div>
                  {bookings.map((booking) => (
                    <div key={booking.id} className="grid grid-cols-4 px-6 py-6 items-center hover:bg-slate-50 dark:hover:bg-slate-800/30 rounded-2xl transition-all">
                      <div className="text-sm font-medium">{new Date(booking.createdAt).toLocaleDateString()}</div>
                      <div className="text-sm font-black uppercase tracking-tight truncate">{booking.event.title}</div>
                      <div className="text-sm font-black text-primary">€{(booking.event.price / 100).toFixed(2)}</div>
                      <div className="text-right">
                        <button className="text-[10px] font-black uppercase tracking-widest px-3 py-1 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-all">
                          Download PDF
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
             </section>
          </motion.div>
        )}

        {activeTab === 'settings' && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
             <section className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-100 dark:border-slate-800 max-w-2xl">
                <h2 className="text-2xl font-black mb-8 uppercase tracking-tight">Account Settings</h2>
                
                <div className="space-y-8">
                  <div className="space-y-4">
                    <h3 className="text-xs font-black uppercase tracking-widest text-muted">Profile Details</h3>
                    <div className="grid gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted ml-1">Display Name</label>
                        <input disabled value={user.name ?? ''} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border-none rounded-xl text-muted cursor-not-allowed" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted ml-1">Email Address</label>
                        <input disabled value={user.email ?? ''} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border-none rounded-xl text-muted cursor-not-allowed" />
                      </div>
                    </div>
                  </div>

                  <div className="pt-8 border-t border-slate-100 dark:border-slate-800">
                    <h3 className="text-xs font-black uppercase tracking-widest text-muted mb-4">Privacy & Access</h3>
                    <button className="text-sm font-bold text-primary flex items-center gap-2 px-4 py-2 hover:bg-primary/5 rounded-xl transition-all">
                      <Settings className="w-4 h-4" /> Edit Account Information
                    </button>
                  </div>

                  <div className="pt-8 border-t border-slate-100 dark:border-slate-800">
                    <h3 className="text-xs font-black uppercase tracking-widest text-red-500 mb-4">Danger Zone</h3>
                    <button className="text-sm font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 px-4 py-2 rounded-xl transition-all">
                      Request Account Deletion
                    </button>
                  </div>
                </div>
             </section>
          </motion.div>
        )}
      </main>
    </div>
  );
}
