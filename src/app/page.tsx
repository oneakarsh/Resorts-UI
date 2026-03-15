'use client';

import React, { useState, useEffect } from 'react';
import { resortAPI } from '@/lib/api';
import { Resort } from '@/types';
import ResortCard from '@/components/ResortCard';
import CategoryFilter from '@/components/CategoryFilter';
import { CircularProgress } from '@mui/material';

export default function Home() {
  const [resorts, setResorts] = useState<Resort[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('Trending');
  const [filters, setFilters] = useState({
    search: '',
    location: '',
  });

  useEffect(() => {
    const fetchResorts = async () => {
      try {
        setLoading(true);
        const params: any = {};
        if (filters.search) params.search = filters.search;
        if (filters.location) params.location = filters.location;
        if (selectedCategory !== 'Trending') params.category = selectedCategory;

        const response = await resortAPI.getAll(params);
        const payload = response?.data?.data ?? response?.data;
        setResorts(Array.isArray(payload) ? payload : []);
      } catch (error) {
        console.error("Failed to fetch resorts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchResorts();
  }, [filters, selectedCategory]);

  return (
    <main className="min-h-screen bg-white">
      {/* Category Filter - Sticky below Navbar */}
      <div className="sticky top-[80px] z-40 bg-white border-b border-border-light shadow-sm">
        <div className="max-w-[1280px] mx-auto px-4 md:px-10">
          <CategoryFilter 
            selectedCategory={selectedCategory} 
            onCategoryChange={setSelectedCategory} 
          />
        </div>
      </div>

      <div className="max-w-[1280px] mx-auto px-4 md:px-10 py-8">
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
            <h3 className="text-xl font-semibold text-text-main mb-2">No results found</h3>
            <p className="text-text-muted mb-6">Try adjusting your search or filters to find what you're looking for.</p>
            <button 
              onClick={() => {
                setFilters({ search: '', location: '' });
                setSelectedCategory('Trending');
              }}
              className="airbnb-button-secondary"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>

    </main>
  );
}

