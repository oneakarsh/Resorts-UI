'use client';

import React, { ReactNode, useEffect, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { Box, Container, Typography, Skeleton, Grid } from '@mui/material';
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

  const pathname = usePathname() ?? '';
  const searchParams = useSearchParams();
  const showResortGrid = pathname === '/' || pathname === '/resorts' || pathname.startsWith('/resorts/');

  useEffect(() => {
    async function fetchResorts() {
      try {
        setLoading(true);
        const params: Record<string, string> = {};
        searchParams.forEach((value, key) => {
          params[key] = value;
        });

        const response = await resortAPI.getAll(undefined, params);
        const payload = response?.data?.data ?? response?.data;
        setResorts(Array.isArray(payload) ? payload : []);
      } catch (error) {
        console.error("Failed to fetch resorts:", error);
      } finally {
        setLoading(false);
      }
    }

    if (showResortGrid) {
      fetchResorts();
    }
  }, [searchParams, showResortGrid]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <Box component="main" sx={{ flexGrow: 1, py: 0, backgroundColor: '#fafafa' }}>
        {children}
        {showResortGrid && (
          <Box sx={{ py: 4, px: 2 }}>
            <Typography variant="h4" component="h2" gutterBottom sx={{ mb: 3, fontWeight: 600 }}>
              Featured Resorts
            </Typography>

            {loading ? (
              <Grid container spacing={3}>
                {Array.from({ length: 6 }).map((_, index) => (
                  <Grid key={index} size={{ xs: 12, sm: 6, md: 4 }}>
                    <Skeleton variant="rectangular" height={300} sx={{ borderRadius: 2 }} />
                    <Skeleton variant="text" sx={{ mt: 1 }} />
                    <Skeleton variant="text" width="60%" />
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Grid container spacing={1.5}>
                {resorts.map((resort, index) => (
                  <Grid key={resort.id ?? resort._id ?? `resort-${index}`} size={{ xs: 12, sm: 6, md: 3 }}>
                    <ResortCard resort={resort} />
                  </Grid>
                ))}
              </Grid>
            )}
          </Box>
        )}
      </Box>
      <Box
        component="footer"
        sx={{
          backgroundColor: '#1976d2',
          color: 'white',
          py: 3,
          mt: 4,
          textAlign: 'center',
        }}
      >
        <Box sx={{ px: 2 }}>
          <Typography variant="body1">
            &copy; 2025 Scaper - Resort Booking System. All rights reserved.
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
