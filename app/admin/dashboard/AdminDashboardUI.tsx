'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import {
  LayoutDashboard,
  Users,
  Calendar,
  Euro,
  Plus,
  Edit,
  Trash,
  UserCheck,
  X,
} from 'lucide-react';
import {
  CreateEventForm,
  type EditableEventFields,
} from '@/app/components/admin/CreateEventForm';
import { deleteEvent } from '@/app/actions/events';
import Image from 'next/image';
import type { BookingStatus } from '@prisma/client';

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

export default function AdminDashboardUI({ stats, recentBookings, allEvents }: AdminDashboardUIProps) {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<EditableEventFields | null>(null);
  const [viewingAttendees, setViewingAttendees] = useState<AdminEventRow | null>(null);
  const [activeTab, setActiveTab] = useState('overview');

  const handleDeleteEvent = async (id: string) => {
    if (confirm('Are you sure you want to delete this event? This will also delete all associated bookings.')) {
      await deleteEvent(id);
    }
  };

  const statCards = [
    { label: 'Total Members', value: stats.totalMembers.toString(), change: '+0%', icon: Users },
    { label: 'Revenue (All time)', value: `€${(stats.revenue / 100).toFixed(2)}`, change: '+0%', icon: Euro },
    { label: 'Active Events', value: stats.activeEvents.toString(), change: '0%', icon: Calendar },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex">
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
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[80vh]"
            >
              <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50">
                <div>
                  <h2 className="text-2xl font-black uppercase tracking-tight">Attendees <span className="text-primary italic">List</span></h2>
                  <p className="text-muted text-sm">{viewingAttendees.title} • {viewingAttendees.bookings.length} Dancers</p>
                </div>
                <button 
                  onClick={() => setViewingAttendees(null)}
                  className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-all"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="p-8 overflow-y-auto">
                <div className="space-y-4">
                  {viewingAttendees.bookings.length === 0 ? (
                    <div className="text-center py-12 text-muted italic">No dancers have booked this event yet.</div>
                  ) : (
                    viewingAttendees.bookings.map((booking) => (
                      <div key={booking.id} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                        <div className="flex items-center gap-4">
                          {booking.user.image ? (
                            <Image src={booking.user.image} alt="" width={40} height={40} className="rounded-full" />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                              {booking.user.name?.[0] || 'U'}
                            </div>
                          )}
                          <div>
                            <p className="font-bold">{booking.user.name || 'Anonymous'}</p>
                            <p className="text-xs text-muted">{booking.user.email}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] font-black uppercase tracking-widest text-muted">Booked On</p>
                          <p className="text-xs font-bold">{new Date(booking.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 hidden lg:flex flex-col p-6">
        <div className="text-2xl font-black mb-12 uppercase tracking-tight">
          Admin<span className="text-primary italic">Danz</span>
        </div>
        
        <nav className="space-y-2 flex-1">
          <button 
            onClick={() => setActiveTab('overview')}
            className={`w-full flex items-center gap-3 px-4 py-3 font-bold rounded-xl transition-all ${
              activeTab === 'overview' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-muted hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <LayoutDashboard className="w-5 h-5" /> Overview
          </button>
          <button 
            onClick={() => setActiveTab('events')}
            className={`w-full flex items-center gap-3 px-4 py-3 font-bold rounded-xl transition-all ${
              activeTab === 'events' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-muted hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Calendar className="w-5 h-5" /> Manage Events
          </button>
          <button 
            onClick={() => setActiveTab('bookings')}
            className={`w-full flex items-center gap-3 px-4 py-3 font-bold rounded-xl transition-all ${
              activeTab === 'bookings' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-muted hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <UserCheck className="w-5 h-5" /> Bookings
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-12 overflow-y-auto">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-12">
          <div>
            <h1 className="text-3xl font-black uppercase tracking-tight">
              Admin <span className="text-primary italic">{activeTab === 'overview' ? 'Overview' : activeTab === 'events' ? 'Events' : 'Bookings'}</span>
            </h1>
            <p className="text-muted">Tracking your studio&apos;s heartbeat.</p>
          </div>
          <motion.button 
            onClick={() => setShowCreateModal(true)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-6 py-3 bg-foreground text-background font-black rounded-xl shadow-xl"
          >
            <Plus className="w-5 h-5" /> Create Event
          </motion.button>
        </header>

        {activeTab === 'overview' && (
          <>
            {/* Stats Grid */}
            <div className="grid md:grid-cols-3 gap-6 mb-12">
              {statCards.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-3 bg-primary/10 rounded-2xl">
                      <stat.icon className="w-6 h-6 text-primary" />
                    </div>
                  </div>
                  <p className="text-sm text-muted font-bold uppercase tracking-widest">{stat.label}</p>
                  <h3 className="text-3xl font-black mt-2">{stat.value}</h3>
                </motion.div>
              ))}
            </div>

            {/* Recent Bookings Table */}
            <section className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 overflow-hidden">
              <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                <h2 className="text-xl font-black uppercase tracking-tight">Recent Bookings</h2>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-800/50 text-xs font-black uppercase tracking-widest text-muted">
                      <th className="px-8 py-4">Member</th>
                      <th className="px-8 py-4">Event</th>
                      <th className="px-8 py-4">Amount</th>
                      <th className="px-8 py-4">Status</th>
                      <th className="px-8 py-4">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {recentBookings.map((booking) => (
                      <tr key={booking.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-all">
                        <td className="px-8 py-6">
                          <div className="font-bold">{booking.user.name || 'Anonymous'}</div>
                          <div className="text-xs text-muted">{booking.user.email}</div>
                        </td>
                        <td className="px-8 py-6 font-medium">{booking.event.title}</td>
                        <td className="px-8 py-6 font-black text-primary">€{booking.event.price / 100}</td>
                        <td className="px-8 py-6">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${
                            booking.status === 'PAID' ? 'bg-green-500/10 text-green-500' : 'bg-amber-500/10 text-amber-500'
                          }`}>
                            {booking.status}
                          </span>
                        </td>
                        <td className="px-8 py-6 text-sm text-muted">
                          {new Date(booking.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                    {recentBookings.length === 0 && (
                      <tr>
                        <td colSpan={5} className="px-8 py-12 text-center text-muted">No bookings yet.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          </>
        )}

        {activeTab === 'events' && (
          <section className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 overflow-hidden">
            <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
              <h2 className="text-xl font-black uppercase tracking-tight">Manage Events</h2>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800/50 text-xs font-black uppercase tracking-widest text-muted">
                    <th className="px-8 py-4">Event</th>
                    <th className="px-8 py-4">Date</th>
                    <th className="px-8 py-4">Price</th>
                    <th className="px-8 py-4">Bookings</th>
                    <th className="px-8 py-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {allEvents.map((event) => (
                    <tr key={event.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-all">
                      <td className="px-8 py-6">
                        <div className="font-bold">{event.title}</div>
                        <div className="text-xs text-muted">{event.category} - {event.location}</div>
                      </td>
                      <td className="px-8 py-6 font-medium">{new Date(event.date).toLocaleDateString()}</td>
                      <td className="px-8 py-6 font-black text-primary">€{event.price / 100}</td>
                      <td className="px-8 py-6">
                        <span className="font-bold">{event._count.bookings}</span> / {event.capacity}
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex gap-2">
                          <button 
                            onClick={() => setViewingAttendees(event)}
                            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-primary"
                            title="View Attendees"
                          >
                            <UserCheck className="w-5 h-5" />
                          </button>
                          <button 
                            onClick={() => setEditingEvent(event)}
                            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-blue-500"
                            title="Edit Event"
                          >
                            <Edit className="w-5 h-5" />
                          </button>
                          <button 
                            onClick={() => handleDeleteEvent(event.id)}
                            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-red-500"
                            title="Delete Event"
                          >
                            <Trash className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {allEvents.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-8 py-12 text-center text-muted">No events created yet.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {activeTab === 'bookings' && (
          <section className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 overflow-hidden">
             <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                <h2 className="text-xl font-black uppercase tracking-tight">All Bookings</h2>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-800/50 text-xs font-black uppercase tracking-widest text-muted">
                      <th className="px-8 py-4">Member</th>
                      <th className="px-8 py-4">Event</th>
                      <th className="px-8 py-4">Status</th>
                      <th className="px-8 py-4">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {recentBookings.map((booking) => (
                      <tr key={booking.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-all">
                        <td className="px-8 py-6">
                          <div className="font-bold">{booking.user.name || 'Anonymous'}</div>
                          <div className="text-xs text-muted">{booking.user.email}</div>
                        </td>
                        <td className="px-8 py-6 font-medium">{booking.event.title}</td>
                        <td className="px-8 py-6">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${
                            booking.status === 'PAID' ? 'bg-green-500/10 text-green-500' : 'bg-amber-500/10 text-amber-500'
                          }`}>
                            {booking.status}
                          </span>
                        </td>
                        <td className="px-8 py-6 text-sm text-muted">
                          {new Date(booking.createdAt).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
          </section>
        )}
      </main>
    </div>
  );
}
