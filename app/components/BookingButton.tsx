'use client';

import { useState } from 'react';
import { bookEvent } from '@/app/actions/bookings';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface BookingButtonProps {
  eventId: string;
  hasUser: boolean;
  spotsLeft: number;
  alreadyBooked: boolean;
}

export function BookingButton({ eventId, hasUser, spotsLeft, alreadyBooked }: BookingButtonProps) {
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
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || 'Failed to book event');
    } finally {
      setLoading(false);
    }
  };

  if (alreadyBooked) {
    return (
      <button 
        disabled 
        className="px-12 py-5 bg-green-500 text-white font-black rounded-full opacity-70 text-xl cursor-default"
      >
        Already Booked
      </button>
    );
  }

  if (spotsLeft <= 0) {
    return (
      <button 
        disabled 
        className="px-12 py-5 bg-slate-300 dark:bg-slate-700 text-white font-black rounded-full cursor-not-allowed opacity-50 text-xl"
      >
        Full House
      </button>
    );
  }

  return (
    <button 
      onClick={handleBooking}
      disabled={loading}
      className="px-12 py-5 bg-primary text-white font-black rounded-full shadow-2xl shadow-primary/30 hover:scale-105 active:scale-95 transition-all text-xl disabled:opacity-70 disabled:scale-100"
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Processing...
        </span>
      ) : (
        'Secure Spot'
      )}
    </button>
  );
}
