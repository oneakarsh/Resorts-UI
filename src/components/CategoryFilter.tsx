'use client';

import React from 'react';
import { 
  Pool, 
  BeachAccess, 
  Terrain, 
  Cabin, 
  Villa, 
  Surfing, 
  Forest, 
  NaturePeople,
  LocalFireDepartment,
  AcUnit
} from '@mui/icons-material';

const categories = [
  { label: 'Amazing pools', icon: Pool },
  { label: 'Beachfront', icon: BeachAccess },
  { label: 'Mountains', icon: Terrain },
  { label: 'Cabins', icon: Cabin },
  { label: 'Luxury', icon: Villa },
  { label: 'Surfing', icon: Surfing },
  { label: 'Forests', icon: Forest },
  { label: 'Countryside', icon: NaturePeople },
  { label: 'Trending', icon: LocalFireDepartment },
  { label: 'Arctic', icon: AcUnit },
];

interface CategoryFilterProps {
  selectedCategory?: string;
  onCategoryChange: (category: string) => void;
}

export default function CategoryFilter({ selectedCategory, onCategoryChange }: CategoryFilterProps) {
  return (
    <div className="flex items-center gap-8 overflow-x-auto no-scrollbar py-4 px-2">
      {categories.map((cat) => {
        const Icon = cat.icon;
        const isActive = selectedCategory === cat.label;
        
        return (
          <button
            key={cat.label}
            onClick={() => onCategoryChange(cat.label)}
            className={`
              flex flex-col items-center gap-2 min-w-fit cursor-pointer group transition-all
              ${isActive ? 'opacity-100' : 'opacity-60 hover:opacity-100'}
            `}
          >
            <div className={`
              transition-all duration-200 
              ${isActive ? 'text-brand' : 'group-hover:text-text-main'}
            `}>
              <Icon sx={{ fontSize: 26 }} />
            </div>
            <span className={`
              text-[12px] font-medium whitespace-nowrap
              ${isActive ? 'text-text-main' : 'text-text-muted group-hover:text-text-main'}
            `}>
              {cat.label}
            </span>
            <div className={`
              h-[2px] w-full transition-all duration-200
              ${isActive ? 'bg-text-main' : 'bg-transparent group-hover:bg-border-main'}
            `} />
          </button>
        );
      })}
    </div>
  );
}
