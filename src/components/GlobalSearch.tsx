'use client';

import React, { useState } from 'react';
import { Search, CalendarMonth, People, LocationOn } from '@mui/icons-material';

export default function GlobalSearch() {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className={`
      relative transition-all duration-300 mx-auto
      ${expanded ? 'w-full max-w-[850px]' : 'w-fit'}
    `}>
      {!expanded ? (
        <div 
          onClick={() => setExpanded(true)}
          className="flex items-center gap-4 bg-white border border-border-light rounded-full py-2 px-4 shadow-sm hover:shadow-md transition-all cursor-pointer"
        >
          <button className="text-[14px] font-semibold px-4 border-r border-border-light text-text-main">
            Anywhere
          </button>
          <button className="text-[14px] font-semibold px-4 border-r border-border-light text-text-main">
            Any week
          </button>
          <button className="text-[14px] font-normal px-4 text-text-muted">
            Add guests
          </button>
          <div className="bg-brand p-2 rounded-full text-white">
            <Search sx={{ fontSize: 18 }} />
          </div>
        </div>
      ) : (
        <div className="absolute top-0 left-0 right-0 bg-bg-offset border border-border-light rounded-full flex items-center shadow-xl animate-in fade-in zoom-in duration-200">
          <div className="flex-1 px-8 py-3 hover:bg-white rounded-full cursor-pointer group">
            <div className="text-[12px] font-bold text-text-main">Where</div>
            <input 
              type="text" 
              placeholder="Search destinations" 
              className="bg-transparent border-none outline-none text-[14px] text-text-muted w-full focus:text-text-main"
              autoFocus
            />
          </div>
          
          <div className="h-8 w-[1px] bg-border-main" />
          
          <div className="flex-1 px-8 py-3 hover:bg-white rounded-full cursor-pointer group">
            <div className="text-[12px] font-bold text-text-main">Check in</div>
            <div className="text-[14px] text-text-muted">Add dates</div>
          </div>
          
          <div className="h-8 w-[1px] bg-border-main" />
          
          <div className="flex-1 px-8 py-3 hover:bg-white rounded-full cursor-pointer group">
            <div className="text-[12px] font-bold text-text-main">Check out</div>
            <div className="text-[14px] text-text-muted">Add dates</div>
          </div>
          
          <div className="h-8 w-[1px] bg-border-main" />
          
          <div className="flex-1 px-8 py-3 hover:bg-white rounded-full cursor-pointer flex items-center justify-between group">
            <div>
              <div className="text-[12px] font-bold text-text-main">Who</div>
              <div className="text-[14px] text-text-muted">Add guests</div>
            </div>
            <div className="bg-brand text-white p-4 rounded-full flex items-center gap-2 hover:bg-brand-dark transition-colors">
              <Search sx={{ fontSize: 20 }} />
              <span className="font-bold text-[16px]">Search</span>
            </div>
          </div>
          
          {/* Overlay to close */}
          <div 
            className="fixed inset-0 -z-10 bg-black/5 backdrop-blur-[2px]" 
            onClick={() => setExpanded(false)}
          />
        </div>
      )}
    </div>
  );
}
