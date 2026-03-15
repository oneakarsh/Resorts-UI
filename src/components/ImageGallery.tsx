'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { GridView, Close, ChevronLeft, ChevronRight } from '@mui/icons-material';

interface ImageGalleryProps {
  images: string[];
}

export default function ImageGallery({ images }: ImageGalleryProps) {
  const [showAll, setShowAll] = useState(false);
  const displayImages = images.slice(0, 5);
  
  // Fill with placeholders if less than 5 images
  const placeholders = [
    'https://images.unsplash.com/photo-1540553016722-983e48a2cd10?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&w=800&q=80',
  ];

  const finalImages = [...displayImages];
  while (finalImages.length < 5) {
    finalImages.push(placeholders[finalImages.length]);
  }

  return (
    <div className="relative">
      <div className="grid grid-cols-4 grid-rows-2 gap-2 h-[300px] md:h-[400px] lg:h-[480px] rounded-2xl overflow-hidden">
        {/* Main large image */}
        <div className="col-span-2 row-span-2 relative cursor-pointer group">
          <Image
            src={finalImages[0]}
            alt="Resort main"
            fill
            className="object-cover transition-all duration-300 group-hover:brightness-90"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
        </div>
        
        {/* Secondary images */}
        <div className="relative cursor-pointer group">
          <Image
            src={finalImages[1]}
            alt="Resort detail"
            fill
            className="object-cover transition-all duration-300 group-hover:brightness-90"
            sizes="25vw"
          />
        </div>
        
        <div className="relative cursor-pointer group rounded-tr-2xl">
          <Image
            src={finalImages[2]}
            alt="Resort detail"
            fill
            className="object-cover transition-all duration-300 group-hover:brightness-90"
            sizes="25vw"
          />
        </div>
        
        <div className="relative cursor-pointer group">
          <Image
            src={finalImages[3]}
            alt="Resort detail"
            fill
            className="object-cover transition-all duration-300 group-hover:brightness-90"
            sizes="25vw"
          />
        </div>
        
        <div className="relative cursor-pointer group rounded-br-2xl">
          <Image
            src={finalImages[4]}
            alt="Resort detail"
            fill
            className="object-cover transition-all duration-300 group-hover:brightness-90"
            sizes="25vw"
          />
        </div>
      </div>

      <button 
        onClick={() => setShowAll(true)}
        className="absolute bottom-6 right-6 flex items-center gap-2 bg-white border border-text-main px-4 py-2 rounded-lg shadow-md hover:bg-bg-offset transition-colors z-10"
      >
        <GridView sx={{ fontSize: 18 }} />
        <span className="text-[14px] font-semibold text-text-main">Show all photos</span>
      </button>

      {/* Fullscreen Gallery Overlay */}
      {showAll && (
        <div className="fixed inset-0 z-[200] bg-white animate-in slide-in-from-bottom duration-300 flex flex-col">
          <div className="flex items-center justify-between p-6">
            <button onClick={() => setShowAll(false)} className="p-2 hover:bg-bg-offset rounded-full transition-colors">
              <ChevronLeft sx={{ fontSize: 28 }} />
            </button>
            <div className="flex gap-4">
              {/* Share/Favorite buttons could go here */}
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto px-4 md:px-0">
            <div className="max-w-[700px] mx-auto space-y-2 py-4">
              {(images.length > 0 ? images : placeholders).map((img, idx) => (
                <div key={idx} className="relative aspect-[3/2] w-full">
                  <Image
                    src={img}
                    alt={`Photo ${idx + 1}`}
                    fill
                    className="object-cover rounded-sm"
                    sizes="(max-width: 1200px) 100vw, 700px"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
