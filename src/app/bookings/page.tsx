'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { bookingAPI } from '@/lib/api';
import { formatRupee } from '@/lib/formatRupee';
import Image from 'next/image';
import Link from 'next/link';
import { CircularProgress } from '@mui/material';
import dayjs from 'dayjs';

interface Booking {
  id: string;
  resortId: string;
  resortName: string;
  resortImage?: string;
  resortLocation?: string;
  checkInDate: string;
  checkOutDate: string;
  totalPrice: number;
  status: string;
}

export default function BookingsPage() {
  const { data: session } = useSession();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      if (!session?.accessToken) return;
      try {
        setLoading(true);
        const response = await bookingAPI.getAll(session.accessToken);
        const data = response.data?.data || response.data;
        setBookings(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Failed to fetch bookings:", error);
      } finally {
        setLoading(false);
      }
    };

    if (session) fetchBookings();
  }, [session]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <CircularProgress size={40} sx={{ color: '#FF385C' }} />
        <p className="text-text-muted font-medium">Loading your trips...</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-[1280px] mx-auto px-4 md:px-10 py-12">
        <h1 className="text-[32px] font-bold text-text-main mb-10">Trips</h1>

        {bookings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {bookings.map((booking) => (
              <div key={booking.id} className="group border border-border-light rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="relative aspect-[4/3] w-full">
                  <Image 
                    src={booking.resortImage || 'https://images.unsplash.com/photo-1540553016722-983e48a2cd10?auto=format&fit=crop&w=800&q=80'} 
                    alt={booking.resortName}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-3 right-3">
                    <span className={`px-3 py-1 rounded-full text-[12px] font-bold uppercase tracking-wider bg-white/90 backdrop-blur-sm ${
                      booking.status === 'confirmed' ? 'text-green-600' : 'text-text-muted'
                    }`}>
                      {booking.status}
                    </span>
                  </div>
                </div>
                
                <div className="p-4 space-y-2">
                  <h3 className="font-bold text-[18px] text-text-main truncate">{booking.resortName}</h3>
                  <div className="flex flex-col text-text-muted text-[14px]">
                    <span>{dayjs(booking.checkInDate).format('MMM D')} – {dayjs(booking.checkOutDate).format('MMM D, YYYY')}</span>
                    <span className="font-medium mt-1">{formatRupee(booking.totalPrice)} total</span>
                  </div>
                  
                  <div className="pt-4 flex gap-3">
                    <Link href={`/resorts/${booking.resortId}`} className="flex-1 text-center py-2.5 bg-bg-offset rounded-lg text-[14px] font-bold text-text-main border border-border-main hover:bg-white transition-colors">
                      View Resort
                    </Link>
                    <button className="flex-1 py-2.5 bg-white rounded-lg text-[14px] font-bold text-text-main border border-border-main hover:bg-bg-offset transition-colors">
                      Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-20 border-t border-border-light">
            <h2 className="text-[22px] font-semibold text-text-main mb-2">No trips booked...yet!</h2>
            <p className="text-text-muted text-[16px] mb-8">Time to dust off your bags and start planning your next adventure.</p>
            <Link 
              href="/resorts"
              className="inline-block px-6 py-3 border border-text-main rounded-xl font-bold text-text-main hover:bg-bg-offset transition-colors"
            >
              Start searching
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
