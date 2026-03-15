'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Resort } from '@/types';

interface WishlistContextType {
  wishlist: Resort[];
  toggleWishlist: (resort: Resort) => void;
  isInWishlist: (id: string) => boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [wishlist, setWishlist] = useState<Resort[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('resortss_wishlist');
    if (saved) {
      try {
        setWishlist(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse wishlist from localStorage');
      }
    }
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    localStorage.setItem('resortss_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const toggleWishlist = (resort: Resort) => {
    const id = resort.id || resort._id;
    setWishlist((prev) => {
      const exists = prev.find((item) => (item.id || item._id) === id);
      if (exists) {
        return prev.filter((item) => (item.id || item._id) !== id);
      } else {
        return [...prev, resort];
      }
    });
  };

  const isInWishlist = (id: string) => {
    return wishlist.some((item) => (item.id || item._id) === id);
  };

  return (
    <WishlistContext.Provider value={{ wishlist, toggleWishlist, isInWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}
