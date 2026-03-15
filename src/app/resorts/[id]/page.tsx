'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Star, School, Language, VerifiedUser, Wifi, Pool, Spa, Restaurant, FitnessCenter } from '@mui/icons-material';
import Image from 'next/image';
import { Resort } from '@/types';
import { resortAPI } from '@/lib/api';
import ImageGallery from '@/components/ImageGallery';
import BookingWidget from '@/components/BookingWidget';
import { CircularProgress } from '@mui/material';

export default function ResortDetailPage() {
  const { id } = useParams();
  const [resort, setResort] = useState<Resort | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResort = async () => {
      try {
        setLoading(true);
        const response = await resortAPI.getById(id as string);
        setResort(response.data?.data || response.data);
      } catch (err) {
        console.error('Failed to fetch resort:', err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchResort();
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <CircularProgress size={40} sx={{ color: '#FF385C' }} />
        <p className="text-text-muted font-medium">Loading your paradise...</p>
      </div>
    );
  }

  if (!resort) return <div className="p-20 text-center">Resort not found</div>;

  const images = (resort as any).images || [resort.image];

  return (
    <main className="max-w-[1120px] mx-auto px-4 md:px-10 py-8">
      {/* Header */}
      <section className="mb-6">
        <h1 className="text-[26px] md:text-[32px] font-semibold text-text-main mb-2">{resort.name}</h1>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-[14px]">
            <span className="flex items-center gap-1 font-bold">
              <Star sx={{ fontSize: 14 }} className="text-text-main" />
              {resort.rating || '4.95'}
            </span>
            <span className="text-text-muted">·</span>
            <span className="underline font-semibold cursor-pointer">124 reviews</span>
            <span className="text-text-muted">·</span>
            <span className="font-semibold underline cursor-pointer">{resort.location}</span>
          </div>
          <div className="hidden sm:flex items-center gap-4">
            <button className="flex items-center gap-2 underline font-semibold text-[14px] hover:bg-bg-offset px-2 py-1 rounded-lg">Share</button>
            <button className="flex items-center gap-2 underline font-semibold text-[14px] hover:bg-bg-offset px-2 py-1 rounded-lg">Save</button>
          </div>
        </div>
      </section>

      {/* Gallery */}
      <ImageGallery images={images} />

      {/* Content Layout */}
      <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-8">
          {/* Host Info */}
          <section className="flex items-center justify-between pb-8 border-b border-border-light">
            <div>
              <h2 className="text-[22px] font-semibold text-text-main">Hosted by resortss.in</h2>
              <p className="text-text-muted text-[16px]">{resort.maxGuests} guests · 1 bedroom · 1 bed · 1 bathroom</p>
            </div>
            <div className="relative w-14 h-14 bg-bg-offset rounded-full overflow-hidden">
               <Image src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80" alt="Host" fill className="object-cover" />
               <div className="absolute bottom-0 right-0 bg-brand p-1 rounded-full border-2 border-white">
                 <VerifiedUser sx={{ fontSize: 10, color: '#fff' }} />
               </div>
            </div>
          </section>

          {/* Key Features */}
          <section className="py-8 border-b border-border-light space-y-6">
             <div className="flex items-start gap-4">
               <div className="mt-1 text-text-main"><Pool sx={{ fontSize: 28 }} /></div>
               <div>
                 <h4 className="font-semibold text-text-main text-[16px]">Private pool</h4>
                 <p className="text-text-muted text-[14px]">Guests often search for this popular feature.</p>
               </div>
             </div>
             <div className="flex items-start gap-4">
               <div className="mt-1 text-text-main"><VerifiedUser sx={{ fontSize: 28 }} /></div>
               <div>
                 <h4 className="font-semibold text-text-main text-[16px]">Self check-in</h4>
                 <p className="text-text-muted text-[14px]">Check yourself in with the digital key.</p>
               </div>
             </div>
             <div className="flex items-start gap-4">
               <div className="mt-1 text-text-main"><Language sx={{ fontSize: 28 }} /></div>
               <div>
                 <h4 className="font-semibold text-text-main text-[16px]">Free cancellation for 48 hours</h4>
               </div>
             </div>
          </section>

          {/* Description */}
          <section className="py-8 border-b border-border-light">
            <p className="text-text-main text-[16px] leading-relaxed whitespace-pre-wrap">
              {resort.description}
            </p>
            <button className="mt-4 font-semibold underline text-text-main text-[16px]">Show more</button>
          </section>

          {/* Amenities */}
          <section className="py-8 border-b border-border-light">
            <h3 className="text-[22px] font-semibold text-text-main mb-6">What this place offers</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4">
              {resort.amenities.map(amenity => (
                <div key={amenity} className="flex items-center gap-4 text-text-main text-[16px]">
                  {amenity.toLowerCase().includes('wifi') && <Wifi sx={{ fontSize: 24 }} />}
                  {amenity.toLowerCase().includes('pool') && <Pool sx={{ fontSize: 24 }} />}
                  {amenity.toLowerCase().includes('spa') && <Spa sx={{ fontSize: 24 }} />}
                  {amenity.toLowerCase().includes('restaurant') && <Restaurant sx={{ fontSize: 24 }} />}
                  {amenity.toLowerCase().includes('gym') && <FitnessCenter sx={{ fontSize: 24 }} />}
                  {!(['wifi', 'pool', 'spa', 'restaurant', 'gym'].some(a => amenity.toLowerCase().includes(a))) && <VerifiedUser sx={{ fontSize: 24 }} />}
                  <span>{amenity}</span>
                </div>
              ))}
            </div>
            <button className="mt-8 border border-text-main px-6 py-3 rounded-lg font-bold text-text-main hover:bg-bg-offset transition-colors">
              Show all amenities
            </button>
          </section>
        </div>

        {/* Right Column - Booking Widget */}
        <div className="relative">
          <BookingWidget 
            price={resort.pricePerNight} 
            rating={resort.rating || 4.9} 
            maxGuests={resort.maxGuests}
          />
        </div>
      </div>

      {/* Reviews Section - Simplified placeholder */}
      <section className="mt-12 pt-12 border-t border-border-light">
        <div className="flex items-center gap-2 text-[22px] font-semibold text-text-main mb-8">
          <Star sx={{ fontSize: 22 }} />
          <span>4.95 · 124 reviews</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-20 gap-y-10">
          {[1, 2, 3, 4].map(req => (
            <div key={req} className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-bg-offset rounded-full overflow-hidden relative">
                  <Image src={`https://i.pravatar.cc/150?u=${req}`} alt="User" fill className="object-cover" />
                </div>
                <div>
                  <h4 className="font-semibold text-[16px]">Guest {req}</h4>
                  <p className="text-text-muted text-[14px]">March 2026</p>
                </div>
              </div>
              <p className="text-text-main text-[16px] leading-relaxed">
                Absolutely breathtaking views and world-class service. The attention to detail in the architecture and amenities exceeded all expectations. Will definitely be returning!
              </p>
            </div>
          ))}
        </div>
        <button className="mt-10 border border-text-main px-6 py-3 rounded-lg font-bold text-text-main hover:bg-bg-offset transition-colors">
          Show all 124 reviews
        </button>
      </section>
    </main>
  );
}
