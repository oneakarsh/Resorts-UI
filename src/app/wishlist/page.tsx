'use client';

import React from 'react';
import { useWishlist } from '@/context/WishlistContext';
import ResortCard from '@/components/ResortCard';
import Link from 'next/link';

export default function WishlistPage() {
  const { wishlist } = useWishlist();

  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-[1280px] mx-auto px-4 md:px-10 py-12">
        <h1 className="text-[32px] font-bold text-text-main mb-10">Wishlists</h1>

        {wishlist.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 gap-y-10">
            {wishlist.map((resort) => (
              <ResortCard key={resort.id || resort._id} resort={resort} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center max-w-md mx-auto">
            <div className="w-16 h-16 bg-bg-offset rounded-full flex items-center justify-center mb-6">
              <svg 
                viewBox="0 0 32 32" 
                xmlns="http://www.w3.org/2000/svg" 
                className="w-8 h-8 text-text-main"
                aria-hidden="true" 
                role="presentation" 
                focusable="false"
              >
                <path d="m16 28c7-4.733 14-10 14-17 0-1.792-.683-3.583-2.05-4.95-1.367-1.366-3.158-2.05-4.95-2.05-1.791 0-3.583.684-4.949 2.05l-2.051 2.051-2.05-2.051c-1.367-1.366-3.158-2.05-4.95-2.05-1.791 0-3.583.684-4.949 2.05-1.367 1.367-2.051 3.158-2.051 4.95 0 7 7 12.267 14 17z" />
              </svg>
            </div>
            <h2 className="text-[22px] font-semibold text-text-main mb-2">Create your first wishlist</h2>
            <p className="text-text-muted mb-8">
              As you search, click the heart icon to save your favorite resorts and places to stay.
            </p>
            <Link 
              href="/resorts"
              className="px-6 py-3 border border-text-main rounded-xl font-bold text-text-main hover:bg-bg-offset transition-colors"
            >
              Start browsing
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
