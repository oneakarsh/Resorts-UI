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

      {/* Footer (Simplified for now) */}
      <footer className="bg-bg-offset border-t border-border-light py-10 mt-20">
        <div className="max-w-[1280px] mx-auto px-4 md:px-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
            <div>
              <h4 className="font-bold text-[14px] text-text-main mb-4">Support</h4>
              <ul className="flex flex-col gap-3 text-[14px] text-text-muted">
                <li className="hover:underline cursor-pointer">Help Center</li>
                <li className="hover:underline cursor-pointer">AirCover</li>
                <li className="hover:underline cursor-pointer">Supporting people with disabilities</li>
                <li className="hover:underline cursor-pointer">Cancellation options</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-[14px] text-text-main mb-4">Community</h4>
              <ul className="flex flex-col gap-3 text-[14px] text-text-muted">
                <li className="hover:underline cursor-pointer">Airbnb.org: disaster relief housing</li>
                <li className="hover:underline cursor-pointer">Combating discrimination</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-[14px] text-text-main mb-4">Hosting</h4>
              <ul className="flex flex-col gap-3 text-[14px] text-text-muted">
                <li className="hover:underline cursor-pointer">Airbnb your home</li>
                <li className="hover:underline cursor-pointer">AirCover for Hosts</li>
                <li className="hover:underline cursor-pointer">Hosting resources</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-[14px] text-text-main mb-4">Airbnb</h4>
              <ul className="flex flex-col gap-3 text-[14px] text-text-muted">
                <li className="hover:underline cursor-pointer">Newsroom</li>
                <li className="hover:underline cursor-pointer">Learn about new features</li>
                <li className="hover:underline cursor-pointer">Careers</li>
              </ul>
            </div>
          </div>
          <div className="pt-6 border-t border-border-main flex flex-col md:flex-row justify-between items-center gap-4 text-[14px] text-text-main">
            <div className="flex flex-wrap gap-4">
              <span>© 2026 resortss.in, Inc.</span>
              <span className="hover:underline cursor-pointer">Privacy</span>
              <span className="hover:underline cursor-pointer">Terms</span>
              <span className="hover:underline cursor-pointer">Sitemap</span>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}

