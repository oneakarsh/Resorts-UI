'use client';

import React from 'react';
import { Close, Search, Tune } from '@mui/icons-material';

interface ResortFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  location: string;
  onLocationChange: (value: string) => void;
  priceRange: [number, number];
  onPriceRangeChange: (value: [number, number]) => void;
  amenities: string[];
  onAmenitiesChange: (value: string[]) => void;
  isOpen: boolean;
  onClose: () => void;
}

const AVAILABLE_AMENITIES = [
  'WiFi', 'Pool', 'Spa', 'Restaurant', 'Gym', 'Bar', 'Beach', 'Hiking', 'Parking', 'Kitchen', 'AC'
];

export default function ResortFilters({
  search,
  onSearchChange,
  location,
  onLocationChange,
  priceRange,
  onPriceRangeChange,
  amenities,
  onAmenitiesChange,
  isOpen,
  onClose
}: ResortFiltersProps) {
  if (!isOpen) return null;

  const handleToggleAmenity = (amenity: string) => {
    if (amenities.includes(amenity)) {
      onAmenitiesChange(amenities.filter((a) => a !== amenity));
    } else {
      onAmenitiesChange([...amenities, amenity]);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-[780px] rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border-light">
          <button onClick={onClose} className="p-2 hover:bg-bg-offset rounded-full transition-colors">
            <Close sx={{ fontSize: 20 }} />
          </button>
          <h2 className="text-[16px] font-bold text-text-main">Filters</h2>
          <div className="w-10" /> {/* Spacer */}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          {/* Search Section */}
          <section>
            <h3 className="text-[22px] font-semibold text-text-main mb-4">Search</h3>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted">
                <Search sx={{ fontSize: 20 }} />
              </div>
              <input 
                type="text"
                placeholder="Search by name or description..."
                value={search}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-white border border-border-main rounded-xl focus:outline-none focus:ring-2 focus:ring-text-main transition-all font-normal text-text-main"
              />
            </div>
          </section>

          {/* Price Range */}
          <section>
            <h3 className="text-[22px] font-semibold text-text-main mb-2">Price range</h3>
            <p className="text-text-muted mb-6">Nightly prices before fees and taxes</p>
            <div className="flex items-center gap-4">
              <div className="flex-1 p-3 border border-border-main rounded-xl">
                <label className="block text-[12px] text-text-muted">Minimum</label>
                <div className="flex items-center gap-1">
                  <span className="text-text-main">₹</span>
                  <input 
                    type="number" 
                    value={priceRange[0]}
                    onChange={(e) => onPriceRangeChange([parseInt(e.target.value) || 0, priceRange[1]])}
                    className="w-full bg-transparent border-none outline-none text-text-main"
                  />
                </div>
              </div>
              <div className="w-4 h-[1px] bg-border-main" />
              <div className="flex-1 p-3 border border-border-main rounded-xl">
                <label className="block text-[12px] text-text-muted">Maximum</label>
                <div className="flex items-center gap-1">
                  <span className="text-text-main">₹</span>
                  <input 
                    type="number" 
                    value={priceRange[1]}
                    onChange={(e) => onPriceRangeChange([priceRange[0], parseInt(e.target.value) || 0])}
                    className="w-full bg-transparent border-none outline-none text-text-main"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Amenities */}
          <section>
            <h3 className="text-[22px] font-semibold text-text-main mb-6">Amenities</h3>
            <div className="grid grid-cols-2 gap-4">
              {AVAILABLE_AMENITIES.map((amenity) => (
                <label key={amenity} className="flex items-center gap-4 cursor-pointer group">
                  <input 
                    type="checkbox"
                    checked={amenities.includes(amenity)}
                    onChange={() => handleToggleAmenity(amenity)}
                    className="w-6 h-6 rounded border-border-main text-text-main focus:ring-text-main"
                  />
                  <span className="text-[16px] text-text-main group-hover:text-black transition-colors">{amenity}</span>
                </label>
              ))}
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-border-light flex items-center justify-between">
          <button 
            onClick={() => {
              onSearchChange('');
              onLocationChange('');
              onPriceRangeChange([0, 50000]);
              onAmenitiesChange([]);
            }}
            className="text-[16px] font-semibold text-text-main underline hover:bg-bg-offset px-4 py-2 rounded-lg transition-colors"
          >
            Clear all
          </button>
          <button 
            onClick={onClose}
            className="bg-text-main text-white px-8 py-3 rounded-lg font-bold text-[16px] hover:bg-black transition-colors"
          >
            Show resorts
          </button>
        </div>
      </div>
    </div>
  );
}
