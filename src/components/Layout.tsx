'use client';

import React, { ReactNode, useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Box, Typography, Skeleton, Grid } from '@mui/material';
import Navbar from './Navbar';
import ResortCard from './ResortCard';
import { Resort } from '@/types';
import { resortAPI } from '@/lib/api';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [resorts, setResorts] = useState<Resort[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchResorts() {
      try {
        setLoading(true);
        const response = await resortAPI.getAll();
        const payload = response?.data?.data ?? response?.data;
        setResorts(Array.isArray(payload) ? payload : []);
      } catch (error) {
        console.error("Failed to fetch resorts:", error);
        setResorts([
          {
            id: '1',
            name: 'Paradise Resort',
            description: 'A luxurious beachfront resort with stunning ocean views.',
            location: 'Maldives',
            latitude: 3.2028,
            longitude: 73.2207,
            pricePerNight: 450,
            amenities: ['WiFi', 'Pool', 'Spa', 'Restaurant'],
            maxGuests: 4,
            rooms: 2,
            images: ['https://via.placeholder.com/400x300?text=Paradise+Resort']
          },
          {
            id: '2',
            name: 'Mountain View Lodge',
            description: 'Cozy mountain retreat with hiking trails and fireplaces.',
            location: 'Switzerland',
            latitude: 46.8182,
            longitude: 8.2275,
            pricePerNight: 320,
            amenities: ['Fireplace', 'Hiking', 'Restaurant', 'Bar'],
            maxGuests: 6,
            rooms: 3,
            images: ['https://via.placeholder.com/400x300?text=Mountain+View+Lodge']
          },
          {
            id: '3',
            name: 'Urban Luxury Hotel',
            description: 'Modern city hotel with rooftop pool and fine dining.',
            location: 'New York',
            latitude: 40.7128,
            longitude: -74.0060,
            pricePerNight: 280,
            amenities: ['Pool', 'Gym', 'Restaurant', 'Bar', 'WiFi'],
            maxGuests: 2,
            rooms: 1,
            images: ['https://via.placeholder.com/400x300?text=Urban+Luxury+Hotel']
          },
          {
            id: '4',
            name: 'Tropical Paradise',
            description: 'Island resort with private beaches and water sports.',
            location: 'Hawaii',
            latitude: 19.8968,
            longitude: -155.5828,
            pricePerNight: 520,
            amenities: ['Beach', 'Water Sports', 'Spa', 'Restaurant'],
            maxGuests: 8,
            rooms: 4,
            images: ['https://via.placeholder.com/400x300?text=Tropical+Paradise']
          },
          {
            id: '5',
            name: 'Desert Oasis',
            description: 'Luxury desert resort with camel rides and traditional dining.',
            location: 'Dubai',
            latitude: 25.2048,
            longitude: 55.2708,
            pricePerNight: 380,
            amenities: ['Camel Rides', 'Pool', 'Restaurant', 'Spa'],
            maxGuests: 4,
            rooms: 2,
            images: ['https://via.placeholder.com/400x300?text=Desert+Oasis']
          },
          {
            id: '6',
            name: 'Forest Retreat',
            description: 'Peaceful forest cabin with nature trails and hot springs.',
            location: 'Canada',
            latitude: 56.1304,
            longitude: -106.3468,
            pricePerNight: 250,
            amenities: ['Hot Springs', 'Hiking', 'Fireplace', 'Restaurant'],
            maxGuests: 4,
            rooms: 2,
            images: ['https://via.placeholder.com/400x300?text=Forest+Retreat']
          }
        ]);
      } finally {
        setLoading(false);
      }
    }

    fetchResorts();
  }, []);

  const pathname = usePathname() ?? '';
  const isHome = pathname === '/';
  const showResortGrid = isHome;

  const featuredCount = 6;
  const featuredResorts = resorts.slice(0, featuredCount);

  const renderResortGrid = (list: Resort[], skeletonCount: number, promoted = false) =>
    loading ? (
      <Grid container spacing={2}>
        {Array.from({ length: skeletonCount }).map((_, index) => (
          <Grid key={index} size={{ xs: 12, sm: 6, md: 4 }}>
            <Skeleton variant="rectangular" height={280} sx={{ borderRadius: 2 }} />
            <Skeleton variant="text" sx={{ mt: 1.5 }} />
            <Skeleton variant="text" width="50%" />
          </Grid>
        ))}
      </Grid>
    ) : (
      <Grid container spacing={2}>
        {list.map((resort, index) => (
          <Grid key={resort.id ?? resort._id ?? `resort-${index}`} size={{ xs: 12, sm: 6, md: 4 }}>
            <ResortCard resort={resort} promoted={promoted} />
          </Grid>
        ))}
      </Grid>
    );

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: '#fafafa' }}>
      <Navbar />
      <Box component="main" sx={{ flexGrow: 1 }}>
        {children}
        {showResortGrid && (
          <Box sx={{ py: 3, px: 2, maxWidth: 1200, mx: 'auto' }}>
            {/* Promoted (featured) resorts on home */}
            <Box sx={{ mb: 3 }}>
              {renderResortGrid(featuredResorts, 6, true)}
            </Box>
            {/* All resorts on home */}
            {renderResortGrid(resorts, 6)}
          </Box>
        )}
      </Box>
      <Box
        component="footer"
        sx={{
          borderTop: '1px solid #e5e5e5',
          py: 2.5,
          mt: 'auto',
          textAlign: 'center',
          bgcolor: '#fff',
        }}
      >
        <Typography variant="body2" sx={{ color: '#737373' }}>
          © {new Date().getFullYear()} Scaper. All rights reserved.
        </Typography>
      </Box>
    </Box>
  );
}
