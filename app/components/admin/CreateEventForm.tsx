'use client';

import { motion } from 'framer-motion';
import { X, Calendar, MapPin, Euro, Users, Info } from 'lucide-react';
import { useState } from 'react';
import { createEvent, updateEvent } from '@/app/actions/events';
import { toast } from 'sonner';
import type { Event } from '@prisma/client';

export type EditableEventFields = Pick<
  Event,
  | 'id'
  | 'title'
  | 'slug'
  | 'description'
  | 'date'
  | 'location'
  | 'price'
  | 'capacity'
  | 'category'
  | 'image'
>;

interface CreateEventFormProps {
  onClose: () => void;
  event?: EditableEventFields | null;
}

export function CreateEventForm({ onClose, event }: CreateEventFormProps) {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string[]>>({});

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    
    const formData = new FormData(e.currentTarget);
    const result = event 
      ? await updateEvent(event.id, formData)
      : await createEvent(formData);

    if (result.success) {
      toast.success(event ? 'Event updated!' : 'Event created!');
      onClose();
    } else {
      if (result.fields) {
        setErrors(result.fields);
        toast.error('Please check the form for errors');
      } else {
        toast.error(result.error || 'Something went wrong');
      }
    }
    setLoading(false);
  }

  // Format date for datetime-local input
  const defaultDate = event?.date 
    ? new Date(event.date).toISOString().slice(0, 16)
    : "";

  return (
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
        className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl"
      >
        <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50">
          <div>
            <h2 className="text-2xl font-black uppercase tracking-tight">{event ? 'Edit' : 'Create New'} <span className="text-primary italic">Event</span></h2>
            <p className="text-muted text-sm">{event ? 'Modify the details of this event.' : 'Add a workshop, class, or intensive session.'}</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-all"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-muted">Title</label>
              <div className="relative">
                <Info className="absolute left-3 top-3 w-4 h-4 text-muted" />
                <input required name="title" defaultValue={event?.title} placeholder="Amapiano Workshop" className={`w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl ${errors.title ? 'ring-2 ring-red-500' : ''}`} />
              </div>
              {errors.title && <p className="text-xs text-red-500 font-bold">{errors.title[0]}</p>}
            </div>
            
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-muted">Category</label>
              <select name="category" defaultValue={event?.category || "Workshop"} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl appearance-none font-bold">
                <option>Workshop</option>
                <option>Class</option>
                <option>Intensive</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-muted">Description</label>
            <textarea name="description" defaultValue={event?.description ?? ''} rows={3} placeholder="Tell us more about the rhythm..." className="w-full p-4 bg-slate-50 dark:bg-slate-800 border-none rounded-xl resize-none" />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-muted">Date & Time</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 w-4 h-4 text-muted" />
                <input required name="date" type="datetime-local" defaultValue={defaultDate} className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-muted">Location</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 w-4 h-4 text-muted" />
                <input required name="location" defaultValue={event?.location} placeholder="Main Studio" className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl" />
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-muted">Price (€)</label>
              <div className="relative">
                <Euro className="absolute left-3 top-3 w-4 h-4 text-muted" />
                <input required name="price" type="number" step="0.01" defaultValue={event?.price ? event.price / 100 : ""} placeholder="25" className={`w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl ${errors.price ? 'ring-2 ring-red-500' : ''}`} />
              </div>
              {errors.price && <p className="text-xs text-red-500 font-bold">{errors.price[0]}</p>}
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-muted">Capacity</label>
              <div className="relative">
                <Users className="absolute left-3 top-3 w-4 h-4 text-muted" />
                <input required name="capacity" type="number" defaultValue={event?.capacity} placeholder="30" className={`w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl ${errors.capacity ? 'ring-2 ring-red-500' : ''}`} />
              </div>
              {errors.capacity && <p className="text-xs text-red-500 font-bold">{errors.capacity[0]}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-muted">Image URL (Optional)</label>
            <input name="image" defaultValue={event?.image ?? ''} placeholder="https://example.com/image.jpg" className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl" />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-4 bg-primary text-white font-black rounded-2xl shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
          >
            {loading ? (event ? 'Saving...' : 'Creating...') : (event ? 'Update Event' : 'Launch Event')}
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
}
