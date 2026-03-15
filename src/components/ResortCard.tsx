'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Favorite, FavoriteBorder, Star } from '@mui/icons-material';
import { Resort } from '@/types';
import { formatRupee } from '@/lib/formatRupee';
import { useWishlist } from '@/context/WishlistContext';

interface ResortCardProps {
  resort: Resort;
}

export default function ResortCard({ resort }: ResortCardProps) {
  const resortId = resort.id || resort._id || '';
  const { isInWishlist, toggleWishlist } = useWishlist();
  const isFavorite = isInWishlist(resortId);
  const imageUrl = (((resort as any).images?.[0]) ?? resort.image) ?? 
    `https://images.unsplash.com/photo-1540553016722-983e48a2cd10?auto=format&fit=crop&w=800&q=80`;

  return (
    <div className="group flex flex-col gap-3 cursor-pointer">
      {/* Image Container */}
      <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-bg-offset">
        <Link href={`/resorts/${resortId}`}>
          <Image
            src={imageUrl}
            alt={resort.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </Link>
        
        {/* Favorite Button */}
        <button 
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleWishlist(resort);
          }}
          className="absolute top-3 right-3 p-1 hover:scale-110 active:scale-90 transition-all z-10"
        >
          {isFavorite ? (
            <Favorite className="text-brand" sx={{ fontSize: 24 }} />
          ) : (
            <FavoriteBorder className="text-white drop-shadow-md" sx={{ fontSize: 24 }} />
          )}
        </button>
      </div>

      {/* Content */}
      <Link href={`/resorts/${resortId}`} className="flex flex-col gap-1">
        <div className="flex items-center justify-between gap-2">
          <h3 className="font-semibold text-[15px] truncate text-text-main">
            {resort.location}
          </h3>
          <div className="flex items-center gap-1 min-w-fit">
            <Star sx={{ fontSize: 14 }} className="text-text-main" />
            <span className="text-[14px] font-normal text-text-main">
              {resort.rating || '4.8'}
            </span>
          </div>
        </div>
        
        <p className="text-[15px] text-text-muted truncate leading-tight">
          {resort.name}
        </p>
        
        <p className="text-[15px] text-text-muted leading-tight">
          Up to {resort.maxGuests} guests
        </p>
        
        <div className="mt-1">
          <span className="font-semibold text-[15px] text-text-main">
            {formatRupee(resort.pricePerNight)}
          </span>
          <span className="text-[15px] text-text-main font-normal"> night</span>
        </div>
      </Link>
    </div>
  );
}
