'use client';

import React, { useState } from 'react';
import { Star, KeyboardArrowDown } from '@mui/icons-material';
import { formatRupee } from '@/lib/formatRupee';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface BookingWidgetProps {
  price: number;
  rating: number;
  reviewsCount?: number;
  maxGuests: number;
}

export default function BookingWidget({ price, rating, reviewsCount = 124, maxGuests }: BookingWidgetProps) {
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(1);
  const { data: session } = useSession();
  const router = useRouter();
  
  const nights = 5; // Placeholder
  const baseTotal = price * nights;
  const serviceFee = Math.round(baseTotal * 0.12);
  const total = baseTotal + serviceFee;

  const handleReserve = () => {
    if (!session) {
      router.push('/login?callbackUrl=' + window.location.pathname);
      return;
    }
    // Proceed with booking logic here
    alert('Booking would proceed here!');
  };

  return (
    <div className="sticky top-28 bg-white border border-border-light rounded-2xl p-6 shadow-xl w-full max-w-[380px] ml-auto">
      <div className="flex justify-between items-baseline mb-6">
        <div>
          <span className="text-[22px] font-bold text-text-main">{formatRupee(price)}</span>
          <span className="text-[16px] text-text-main font-normal"> night</span>
        </div>
        <div className="flex items-center gap-1">
          <Star sx={{ fontSize: 14 }} className="text-text-main" />
          <span className="text-[14px] font-bold text-text-main">{rating}</span>
          <span className="text-text-muted text-[14px]">·</span>
          <span className="text-text-muted text-[14px] underline cursor-pointer">{reviewsCount} reviews</span>
        </div>
      </div>

      <div className="border border-border-main rounded-xl overflow-hidden mb-4">
        <div className="flex border-b border-border-main">
          <div className="flex-1 p-3 border-r border-border-main hover:bg-bg-offset transition-colors cursor-pointer">
            <label className="block text-[10px] font-black uppercase text-text-main">Check-in</label>
            <input 
              type="text" 
              placeholder="Add date" 
              className="bg-transparent border-none outline-none text-[14px] text-text-muted w-full"
            />
          </div>
          <div className="flex-1 p-3 hover:bg-bg-offset transition-colors cursor-pointer">
            <label className="block text-[10px] font-black uppercase text-text-main">Check-out</label>
            <input 
              type="text" 
              placeholder="Add date" 
              className="bg-transparent border-none outline-none text-[14px] text-text-muted w-full"
            />
          </div>
        </div>
        <div className="p-3 flex justify-between items-center hover:bg-bg-offset transition-colors cursor-pointer relative">
          <div>
            <label className="block text-[10px] font-black uppercase text-text-main">Guests</label>
            <div className="text-[14px] text-text-main">{guests} guest{guests > 1 ? 's' : ''}</div>
          </div>
          <KeyboardArrowDown sx={{ fontSize: 24 }} />
        </div>
      </div>

      <button 
        onClick={handleReserve}
        className="w-full bg-brand text-white py-3.5 rounded-lg font-bold text-[16px] mb-4 hover:bg-brand-dark transition-colors"
      >
        Reserve
      </button>

      <p className="text-center text-[14px] text-text-muted mb-6">You won't be charged yet</p>

      <div className="space-y-4">
        <div className="flex justify-between text-[16px] text-text-main">
          <span className="underline">{formatRupee(price)} x {nights} nights</span>
          <span>{formatRupee(baseTotal)}</span>
        </div>
        <div className="flex justify-between text-[16px] text-text-main">
          <span className="underline">Scaper service fee</span>
          <span>{formatRupee(serviceFee)}</span>
        </div>
        <hr className="border-border-light" />
        <div className="flex justify-between text-[16px] font-bold text-text-main pt-2">
          <span>Total before taxes</span>
          <span>{formatRupee(total)}</span>
        </div>
      </div>
      
      {/* Report Button (Small) */}
      <div className="mt-8 flex justify-center">
        <button className="flex items-center gap-2 text-text-muted text-[14px] font-semibold hover:underline">
          <span>Report this listing</span>
        </button>
      </div>
    </div>
  );
}
