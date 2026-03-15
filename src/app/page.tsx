'use client';

import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, Grid, Skeleton, Button, Stack } from '@mui/material';
import { resortAPI } from '@/lib/api';
import { Resort } from '@/types';
import ResortCard from '@/components/ResortCard';
import ResortFilters from '@/components/ResortFilters';
import { FilterList } from '@mui/icons-material';

export default function Home() {
  const [resorts, setResorts] = useState<Resort[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    location: '',
    priceRange: [0, 2000] as [number, number],
    amenities: [] as string[],
  });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchResorts = async () => {
      try {
        setLoading(true);
        const params: any = {};
        if (filters.search) params.search = filters.search;
        if (filters.location) params.location = filters.location;
        if (filters.priceRange[0] > 0) params.minRate = filters.priceRange[0];
        if (filters.priceRange[1] < 2000) params.maxRate = filters.priceRange[1];
        if (filters.amenities.length > 0) params.amenities = JSON.stringify(filters.amenities);

        const response = await resortAPI.getAll(params);
        
        const payload = response?.data?.data ?? response?.data;
        let filtered = Array.isArray(payload) ? payload : [];
        
        // Manual filtering for now if API params are not yet in resortAPI.getAll
        if (filters.search) {
          const s = filters.search.toLowerCase();
          filtered = filtered.filter(r => 
            r.name.toLowerCase().includes(s) || 
            r.location.toLowerCase().includes(s) || 
            r.description.toLowerCase().includes(s)
          );
        }
        if (filters.location) {
          filtered = filtered.filter(r => r.location === filters.location);
        }
        if (filters.priceRange[0] > 0 || filters.priceRange[1] < 2000) {
          filtered = filtered.filter(r => 
            r.pricePerNight >= filters.priceRange[0] && 
            r.pricePerNight <= filters.priceRange[1]
          );
        }
        if (filters.amenities.length > 0) {
          filtered = filtered.filter(r => 
            filters.amenities.every(a => r.amenities.includes(a))
          );
        }

        setResorts(filtered);
      } catch (error) {
        console.error("Failed to fetch resorts:", error);
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(fetchResorts, 300);
    return () => clearTimeout(timeoutId);
  }, [filters]);

  return (
    <Box>
      {/* Hero Section */}
      <Box 
        sx={{ 
          pt: { xs: 8, md: 12 }, 
          pb: { xs: 6, md: 8 }, 
          bgcolor: '#fff',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Subtle background detail */}
        <Box 
          sx={{
            position: 'absolute',
            top: -100,
            left: '50%',
            transform: 'translateX(-50%)',
            width: '100%',
            maxWidth: 1200,
            height: 400,
            background: 'radial-gradient(circle at 50% 0%, rgba(10, 10, 10, 0.03) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />

        <Container maxWidth="md">
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4.5rem' },
              fontWeight: 900,
              letterSpacing: '-0.05em',
              color: '#0a0a0a',
              textAlign: 'center',
              lineHeight: 1,
              mb: 3,
              background: 'linear-gradient(180deg, #0a0a0a 0%, #404040 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Your journey to <br />
            tranquility begins here.
          </Typography>
          <Typography
            variant="h5"
            sx={{
              fontSize: { xs: '1rem', md: '1.25rem' },
              color: '#737373',
              textAlign: 'center',
              fontWeight: 500,
              mb: 6,
              maxWidth: 600,
              mx: 'auto',
              lineHeight: 1.6,
              letterSpacing: '-0.01em',
            }}
          >
            Discover handpicked luxury resorts designed for your ultimate comfort. 
            Simple booking, transparent pricing, unforgettable memories.
          </Typography>

          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
            <Button
              variant="contained"
              onClick={() => setShowFilters(!showFilters)}
              startIcon={<FilterList />}
              sx={{
                bgcolor: '#0a0a0a',
                color: '#fff',
                py: 2,
                px: { xs: 4, md: 6 },
                borderRadius: 99,
                fontSize: '0.9375rem',
                textTransform: 'none',
                fontWeight: 700,
                boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                '&:hover': { bgcolor: '#262626', transform: 'translateY(-2px)' },
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
            >
              {showFilters ? 'Hide filters' : 'Show filters'}
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Main Content */}
      <Container maxWidth="lg" sx={{ py: 6 }}>
        {showFilters && (
          <ResortFilters 
            search={filters.search}
            onSearchChange={(v) => setFilters({ ...filters, search: v })}
            location={filters.location}
            onLocationChange={(v) => setFilters({ ...filters, location: v })}
            priceRange={filters.priceRange}
            onPriceRangeChange={(v) => setFilters({ ...filters, priceRange: v })}
            amenities={filters.amenities}
            onAmenitiesChange={(v) => setFilters({ ...filters, amenities: v })}
          />
        )}

        <Box sx={{ mb: 4 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="h5" sx={{ fontWeight: 700, color: '#0a0a0a' }}>
              {resorts.length} {resorts.length === 1 ? 'resort' : 'resorts'} found
            </Typography>
          </Stack>
        </Box>

        <Grid container spacing={3}>
          {loading ? (
            Array.from({ length: 6 }).map((_, index) => (
              <Grid key={index} size={{ xs: 12, sm: 6, md: 4 }}>
                <Skeleton variant="rectangular" height={300} sx={{ borderRadius: 4 }} />
                <Skeleton variant="text" sx={{ mt: 2 }} />
                <Skeleton variant="text" width="60%" />
              </Grid>
            ))
          ) : resorts.length > 0 ? (
            resorts.map((resort) => (
              <Grid key={resort.id || resort._id} size={{ xs: 12, sm: 6, md: 4 }}>
                <ResortCard resort={resort} />
              </Grid>
            ))
          ) : (
            <Grid size={{ xs: 12 }}>
              <Box sx={{ py: 10, textAlign: 'center' }}>
                <Typography variant="h6" color="text.secondary">
                  No resorts match your criteria.
                </Typography>
                <Button 
                  sx={{ mt: 2, color: '#0a0a0a' }}
                  onClick={() => setFilters({ search: '', location: '', priceRange: [0, 2000], amenities: [] })}
                >
                  Clear all filters
                </Button>
              </Box>
            </Grid>
          )}
        </Grid>
      </Container>
    </Box>
  );
}

