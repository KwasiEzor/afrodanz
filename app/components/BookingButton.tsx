'use client';

import { useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { bookEvent } from '@/app/actions/bookings';

interface BookingButtonProps {
  eventId: string;
  hasUser: boolean;
  spotsLeft: number;
  alreadyBooked: boolean;
}

export function BookingButton({
  eventId,
  hasUser,
  spotsLeft,
  alreadyBooked,
}: BookingButtonProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleBooking = async () => {
    if (!hasUser) {
      router.push('/login');
      return;
    }

    setLoading(true);
    try {
      const result = await bookEvent(eventId);
      if (result.url) {
        window.location.href = result.url;
      } else if (result.success) {
        toast.success('Booking successful!');
        router.push('/dashboard?booking_success=true');
      }
    } catch (error: unknown) {
      console.error(error);
      const message = error instanceof Error ? error.message : 'Failed to book event';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  if (alreadyBooked) {
    return (
      <button
        disabled
        className="rounded-full border border-emerald-400/30 bg-emerald-500/14 px-8 py-4 text-sm font-black uppercase tracking-[0.24em] text-emerald-200 opacity-80"
      >
        Already Booked
      </button>
    );
  }

  if (spotsLeft <= 0) {
    return (
      <button
        disabled
        className="rounded-full border border-white/8 bg-white/6 px-8 py-4 text-sm font-black uppercase tracking-[0.24em] text-slate-400 opacity-60"
      >
        Full House
      </button>
    );
  }

  return (
    <button
      onClick={handleBooking}
      disabled={loading}
      className="site-primary-button inline-flex items-center justify-center gap-2 rounded-full px-8 py-4 text-sm font-black uppercase tracking-[0.24em] text-white disabled:opacity-70"
    >
      {loading ? 'Processing' : 'Secure Spot'}
      {!loading && <ArrowUpRight className="h-4 w-4" />}
    </button>
  );
}
