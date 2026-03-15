'use client';

import React, { useState, useEffect } from 'react';
import { resortAPI } from '@/lib/api';
import { Resort } from '@/types';
import ResortCard from '@/components/ResortCard';
import ResortFilters from '@/components/ResortFilters';
import { CircularProgress } from '@mui/material';
import { Tune } from '@mui/icons-material';

export default function ResortsPage() {
  const [resorts, setResorts] = useState<Resort[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    location: '',
    priceRange: [0, 100000] as [number, number],
    amenities: [] as string[],
  });

  const fetchResorts = async () => {
    try {
      setLoading(true);
      const params: any = {};
      if (filters.search) params.search = filters.search;
      if (filters.location) params.location = filters.location;
      if (filters.priceRange[0] > 0) params.minPrice = filters.priceRange[0];
      if (filters.priceRange[1] < 100000) params.maxPrice = filters.priceRange[1];
      if (filters.amenities.length > 0) params.amenities = filters.amenities.join(',');

      const response = await resortAPI.getAll(params);
      const payload = response?.data?.data ?? response?.data;
      setResorts(Array.isArray(payload) ? payload : []);
    } catch (error) {
      console.error("Failed to fetch resorts:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResorts();
  }, []);

  const handleApplyFilters = () => {
    fetchResorts();
    setIsFilterOpen(false);
  };

  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-[1280px] mx-auto px-4 md:px-10 py-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h1 className="text-[32px] font-bold text-text-main mb-2">All Resorts</h1>
            <p className="text-text-muted text-[16px]">
              Explore our handpicked collection of {resorts.length} unique stays.
            </p>
          </div>
          
          <button 
            onClick={() => setIsFilterOpen(true)}
            className="flex items-center gap-2 border border-border-main rounded-xl px-5 py-3 hover:border-black transition-all group"
          >
            <Tune sx={{ fontSize: 20 }} className="text-text-main" />
            <span className="text-[14px] font-bold text-text-main">Filters</span>
          </button>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <CircularProgress size={40} sx={{ color: '#FF385C' }} />
            <p className="text-text-muted font-medium">Finding amazing places...</p>
          </div>
        ) : resorts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 gap-y-10">
            {resorts.map((resort) => (
              <ResortCard key={resort.id || resort._id} resort={resort} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <h3 className="text-xl font-semibold text-text-main mb-2">No resorts match these filters</h3>
            <p className="text-text-muted mb-6">Try changing or removing some filters to see more results.</p>
            <button 
              onClick={() => {
                setFilters({
                  search: '',
                  location: '',
                  priceRange: [0, 100000],
                  amenities: [],
                });
                fetchResorts();
              }}
              className="airbnb-button-secondary"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>

      <ResortFilters 
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        search={filters.search}
        onSearchChange={(v) => setFilters(f => ({ ...f, search: v }))}
        location={filters.location}
        onLocationChange={(v) => setFilters(f => ({ ...f, location: v }))}
        priceRange={filters.priceRange}
        onPriceRangeChange={(v) => setFilters(f => ({ ...f, priceRange: v }))}
        amenities={filters.amenities}
        onAmenitiesChange={(v) => setFilters(f => ({ ...f, amenities: v }))}
      />
    </main>
  );
}

