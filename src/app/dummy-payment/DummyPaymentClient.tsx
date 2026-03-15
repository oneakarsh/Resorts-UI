'use client';

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { bookingAPI } from '@/lib/api';
import { formatRupee } from '@/lib/formatRupee';
import Image from 'next/image';
import { Star, ChevronLeft, Lock } from '@mui/icons-material';
import { CircularProgress } from '@mui/material';
import dayjs from 'dayjs';

export default function DummyPaymentClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { data: session } = useSession();
  const [bookingData, setBookingData] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const d = searchParams?.get('data');
    if (!d) return;
    try {
      const parsed = JSON.parse(decodeURIComponent(d));
      setBookingData(parsed);
    } catch (e) {
      console.error('Failed to parse booking data', e);
    }
  }, [searchParams]);

  const handlePay = async () => {
    if (!session?.accessToken || !bookingData) return;
    try {
      setLoading(true);
      const payload = {
        resortId: bookingData.resortId,
        checkInDate: bookingData.checkInDate,
        checkOutDate: bookingData.checkOutDate,
        numberOfGuests: bookingData.numberOfGuests,
        selectedAmenities: bookingData.selectedAmenities,
        totalPrice: bookingData.totalPrice,
      };
      await bookingAPI.create(payload, session.accessToken);
      router.push('/bookings');
    } catch (err) {
      console.error('Payment failed', err);
      alert('Payment simulation failed');
    } finally {
      setLoading(false);
    }
  };

  if (!bookingData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <CircularProgress sx={{ color: '#FF385C' }} />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-white pb-20">
      <div className="max-w-[1120px] mx-auto px-4 md:px-10 py-8 md:py-16">
        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => router.back()} className="p-2 hover:bg-bg-offset rounded-full transition-colors">
            <ChevronLeft sx={{ fontSize: 24 }} />
          </button>
          <h1 className="text-[32px] font-bold text-text-main">Confirm and pay</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          {/* Left: Form */}
          <div className="space-y-10">
            <section className="space-y-6">
              <h2 className="text-[22px] font-semibold text-text-main">Your trip</h2>
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-semibold text-text-main">Dates</h4>
                  <p className="text-text-muted">{dayjs(bookingData.checkInDate).format('MMM D')} – {dayjs(bookingData.checkOutDate).format('MMM D, YYYY')}</p>
                </div>
                <button className="underline font-semibold h-fit hover:text-text-main transition-colors">Edit</button>
              </div>
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-semibold text-text-main">Guests</h4>
                  <p className="text-text-muted">{bookingData.numberOfGuests} guest{bookingData.numberOfGuests > 1 ? 's' : ''}</p>
                </div>
                <button className="underline font-semibold h-fit hover:text-text-main transition-colors">Edit</button>
              </div>
            </section>

            <hr className="border-border-light" />

            <section className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-[22px] font-semibold text-text-main">Pay with</h2>
                <div className="flex gap-2">
                  <div className="w-8 h-5 bg-[#0070ba] rounded-sm" /> 
                  <div className="w-8 h-5 bg-[#f79e1b] rounded-sm" />
                </div>
              </div>
              
              <div className="border border-border-main rounded-xl overflow-hidden">
                <div className="p-4 border-b border-border-main bg-bg-offset flex justify-between items-center cursor-not-allowed">
                  <span className="text-text-main font-medium">Credit or debit card</span>
                  <div className="p-1.5 bg-text-main rounded-full">
                    <div className="w-2 h-2 bg-white rounded-full" />
                  </div>
                </div>
                <div className="p-6 space-y-4">
                  <input 
                    type="text" 
                    placeholder="Card number" 
                    disabled 
                    defaultValue="4242 4242 4242 4242"
                    className="w-full border border-border-main rounded-lg p-3 outline-none text-text-muted cursor-not-allowed"
                  />
                  <div className="flex gap-4">
                    <input type="text" placeholder="Exp: 12/28" disabled className="flex-1 border border-border-main rounded-lg p-3 outline-none text-text-muted cursor-not-allowed" />
                    <input type="text" placeholder="CVV: ***" disabled className="flex-1 border border-border-main rounded-lg p-3 outline-none text-text-muted cursor-not-allowed" />
                  </div>
                </div>
              </div>
            </section>

            <section className="pt-4">
              <button 
                onClick={handlePay}
                disabled={loading}
                className="w-full md:w-fit px-12 py-4 bg-brand text-white font-bold text-[18px] rounded-xl hover:bg-brand-dark transition-all disabled:opacity-50"
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Confirm and pay'}
              </button>
              <p className="mt-4 text-[12px] text-text-muted flex items-center gap-1">
                <Lock sx={{ fontSize: 12 }} /> 
                Secure payment simulation
              </p>
            </section>
          </div>

          {/* Right: Summary Card */}
          <div className="relative">
            <div className="sticky top-28 border border-border-light rounded-3xl p-6 shadow-trip overflow-hidden">
              <div className="flex gap-4 mb-6">
                <div className="relative w-32 aspect-square rounded-xl overflow-hidden bg-bg-offset">
                  <Image 
                    src={bookingData.resortImage || 'https://images.unsplash.com/photo-1540553016722-983e48a2cd10?auto=format&fit=crop&w=400&q=80'} 
                    alt="Resort" 
                    fill 
                    className="object-cover" 
                  />
                </div>
                <div className="flex flex-col justify-between py-1">
                  <div>
                    <span className="text-[12px] text-text-muted block">{bookingData.resortLocation || 'Property'}</span>
                    <h3 className="text-[16px] font-semibold text-text-main leading-tight">{bookingData.resortName}</h3>
                  </div>
                  <div className="flex items-center gap-1 text-[12px]">
                    <Star sx={{ fontSize: 12 }} />
                    <span className="font-bold">4.95</span>
                    <span className="text-text-muted">(124 reviews)</span>
                  </div>
                </div>
              </div>

              <hr className="border-border-light my-6" />

              <h3 className="text-[18px] font-semibold text-text-main mb-6">Price details</h3>
              <div className="space-y-4 text-[16px] text-text-main">
                <div className="flex justify-between">
                  <span className="underline">Total stay</span>
                  <span>{formatRupee(bookingData.totalPrice)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="underline">Service Fee</span>
                  <span>{formatRupee(0)}</span>
                </div>
                <hr className="border-border-light pt-2" />
                <div className="flex justify-between font-bold text-[18px]">
                  <span>Total (INR)</span>
                  <span>{formatRupee(bookingData.totalPrice)}</span>
                </div>
              </div>

              <div className="mt-8 bg-bg-offset p-4 rounded-xl text-[14px] text-text-muted">
                Your reservation won't be confirmed until the host accepts your request. Simulation only.
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
