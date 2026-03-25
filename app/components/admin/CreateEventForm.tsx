'use client';

import { motion } from 'framer-motion';
import { Calendar, Euro, Info, MapPin, Users, X } from 'lucide-react';
import { useState } from 'react';
import type { Event } from '@prisma/client';
import { toast } from 'sonner';
import { createEvent, updateEvent } from '@/app/actions/events';

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

function fieldClass(hasError?: boolean) {
  return `w-full rounded-[1.3rem] border bg-white/5 px-4 py-3 text-white outline-none placeholder:text-slate-500 ${
    hasError ? 'border-red-500/50' : 'border-white/10'
  }`;
}

export function CreateEventForm({ onClose, event }: CreateEventFormProps) {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string[]>>({});

  async function handleSubmit(formEvent: React.FormEvent<HTMLFormElement>) {
    formEvent.preventDefault();
    setLoading(true);
    setErrors({});

    const formData = new FormData(formEvent.currentTarget);
    const result = event
      ? await updateEvent(event.id, formData)
      : await createEvent(formData);

    if (result.success) {
      toast.success(event ? 'Event updated.' : 'Event created.');
      onClose();
    } else if (result.fields) {
      setErrors(result.fields);
      toast.error('Please fix the highlighted fields.');
    } else {
      toast.error(result.error || 'Something went wrong.');
    }

    setLoading(false);
  }

  const defaultDate = event?.date
    ? new Date(event.date).toISOString().slice(0, 16)
    : '';

  return (
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
        className="site-panel w-full max-w-3xl rounded-[2.6rem]"
      >
        <div className="flex items-start justify-between border-b border-white/8 px-8 py-6">
          <div>
            <p className="site-kicker mb-3">{event ? 'Edit event' : 'Create event'}</p>
            <h2 className="site-title text-3xl font-black uppercase text-white">
              {event ? 'Update' : 'Launch'}
              <span className="site-highlight block">Studio Session</span>
            </h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-full border border-white/10 bg-white/5 p-3 text-slate-300"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 px-8 py-8">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="event-title" className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">Title</label>
              <div className="relative">
                <Info className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                <input
                  id="event-title"
                  required
                  name="title"
                  defaultValue={event?.title}
                  placeholder="Afro Fusion Intensive"
                  className={`${fieldClass(!!errors.title)} pl-11`}
                />
              </div>
              {errors.title && <p className="text-xs font-bold text-red-400">{errors.title[0]}</p>}
            </div>

            <div className="space-y-2">
              <label htmlFor="event-category" className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">Category</label>
              <select
                id="event-category"
                name="category"
                defaultValue={event?.category || 'Workshop'}
                className={fieldClass()}
              >
                <option>Workshop</option>
                <option>Class</option>
                <option>Intensive</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="event-description" className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">Description</label>
            <textarea
              id="event-description"
              name="description"
              defaultValue={event?.description ?? ''}
              rows={4}
              placeholder="Shape the session mood, difficulty, and what dancers should expect."
              className={`${fieldClass()} resize-none`}
            />
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="event-date" className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">Date & Time</label>
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                <input
                  id="event-date"
                  required
                  name="date"
                  type="datetime-local"
                  defaultValue={defaultDate}
                  className={`${fieldClass()} pl-11`}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="event-location" className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">Location</label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                <input
                  id="event-location"
                  required
                  name="location"
                  defaultValue={event?.location}
                  placeholder="Main Studio"
                  className={`${fieldClass()} pl-11`}
                />
              </div>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="event-price" className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">Price (€)</label>
              <div className="relative">
                <Euro className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                <input
                  id="event-price"
                  required
                  name="price"
                  type="number"
                  step="0.01"
                  defaultValue={event?.price ? event.price / 100 : ''}
                  placeholder="25"
                  className={`${fieldClass(!!errors.price)} pl-11`}
                />
              </div>
              {errors.price && <p className="text-xs font-bold text-red-400">{errors.price[0]}</p>}
            </div>

            <div className="space-y-2">
              <label htmlFor="event-capacity" className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">Capacity</label>
              <div className="relative">
                <Users className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                <input
                  id="event-capacity"
                  required
                  name="capacity"
                  type="number"
                  defaultValue={event?.capacity}
                  placeholder="30"
                  className={`${fieldClass(!!errors.capacity)} pl-11`}
                />
              </div>
              {errors.capacity && <p className="text-xs font-bold text-red-400">{errors.capacity[0]}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="event-image" className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">Image URL</label>
            <input
              id="event-image"
              name="image"
              defaultValue={event?.image ?? ''}
              placeholder="https://example.com/image.jpg"
              className={fieldClass()}
            />
          </div>

          <div className="flex flex-col gap-3 pt-2 md:flex-row">
            <button
              type="submit"
              disabled={loading}
              className="site-primary-button flex-1 rounded-full px-6 py-4 text-sm font-black uppercase tracking-[0.22em] text-white disabled:opacity-50"
            >
              {loading ? (event ? 'Saving...' : 'Creating...') : event ? 'Update Event' : 'Launch Event'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="site-outline-button rounded-full px-6 py-4 text-sm font-black uppercase tracking-[0.22em] text-white"
            >
              Cancel
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
