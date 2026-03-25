'use client';

import { useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { bookEvent } from '@/app/actions/bookings';
import { useTranslation } from '@/lib/locale-context';

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
  const t = useTranslation();

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
        toast.success(t('booking.success'));
        router.push('/dashboard?booking_success=true');
      }
    } catch (error: unknown) {
      console.error(error);
      const message = error instanceof Error ? error.message : t('booking.failed');
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
        {t('booking.alreadyBooked')}
      </button>
    );
  }

  if (spotsLeft <= 0) {
    return (
      <button
        disabled
        className="rounded-full border border-white/8 bg-white/6 px-8 py-4 text-sm font-black uppercase tracking-[0.24em] text-slate-400 opacity-60"
      >
        {t('booking.fullHouse')}
      </button>
    );
  }

  return (
    <button
      onClick={handleBooking}
      disabled={loading}
      className="site-primary-button inline-flex items-center justify-center gap-2 rounded-full px-8 py-4 text-sm font-black uppercase tracking-[0.24em] text-white disabled:opacity-70"
    >
      {loading ? t('booking.processing') : t('booking.secureSpot')}
      {!loading && <ArrowUpRight className="h-4 w-4" />}
    </button>
  );
}
