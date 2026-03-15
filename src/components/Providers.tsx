'use client';

import { SessionProvider } from 'next-auth/react';
import MuiProvider from '@/components/MuiProvider';
import { WishlistProvider } from '@/context/WishlistContext';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <WishlistProvider>
        <MuiProvider>
          {children}
        </MuiProvider>
      </WishlistProvider>
    </SessionProvider>
  );
}