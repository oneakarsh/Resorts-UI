'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Language, 
  CurrencyRupee 
} from '@mui/icons-material';

export default function Footer() {
  const sections = [
    {
      title: 'Support',
      links: [
        { label: 'Help Center', href: '#' },
        { label: 'AirCover', href: '#' },
        { label: 'Anti-discrimination', href: '#' },
        { label: 'Disability support', href: '#' },
        { label: 'Cancellation options', href: '#' },
        { label: 'Report neighborhood concern', href: '#' },
      ]
    },
    {
      title: 'Hosting',
      links: [
        { label: 'List your resort', href: '/dashboard/resorts/new' },
        { label: 'AirCover for Hosts', href: '#' },
        { label: 'Hosting resources', href: '#' },
        { label: 'Community forum', href: '#' },
        { label: 'Hosting responsibly', href: '#' },
        { label: 'Join a free Hosting class', href: '#' },
      ]
    },
    {
      title: 'Scaper',
      links: [
        { label: 'Newsroom', href: '#' },
        { label: 'New features', href: '#' },
        { label: 'Careers', href: '#' },
        { label: 'Investors', href: '#' },
        { label: 'Gift cards', href: '#' },
        { label: 'Resortss.in emergency stays', href: '#' },
      ]
    }
  ];

  return (
    <footer className="bg-bg-offset border-t border-border-light pt-12 pb-8">
      <div className="max-w-[1280px] mx-auto px-6 md:px-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 pb-12 border-b border-border-light">
          {sections.map((section, i) => (
            <div key={i} className="space-y-4">
              <h4 className="font-bold text-[14px] text-text-main">{section.title}</h4>
              <ul className="space-y-3">
                {section.links.map((link, j) => (
                  <li key={j}>
                    <Link 
                      href={link.href} 
                      className="text-[14px] text-text-main hover:underline transition-all"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col lg:flex-row justify-between items-center pt-8 gap-4">
          <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4 text-[14px] text-text-main">
            <span>© {new Date().getFullYear()} resortss.in, Inc.</span>
            <span className="hidden md:inline">·</span>
            <Link href="#" className="hover:underline">Privacy</Link>
            <span className="hidden md:inline">·</span>
            <Link href="#" className="hover:underline">Terms</Link>
            <span className="hidden md:inline">·</span>
            <Link href="#" className="hover:underline">Sitemap</Link>
            <span className="hidden md:inline">·</span>
            <Link href="#" className="hover:underline">Company details</Link>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-4 text-[14px] font-bold text-text-main">
              <button className="flex items-center gap-1 hover:bg-white p-2 rounded-lg transition-colors">
                <Language sx={{ fontSize: 18 }} />
                English (IN)
              </button>
              <button className="flex items-center gap-1 hover:bg-white p-2 rounded-lg transition-colors">
                <CurrencyRupee sx={{ fontSize: 18 }} />
                INR
              </button>
            </div>
            
            <div className="flex items-center gap-4 text-text-main">
              <Link href="#" className="hover:text-brand transition-colors"><Facebook sx={{ fontSize: 20 }} /></Link>
              <Link href="#" className="hover:text-brand transition-colors"><Twitter sx={{ fontSize: 20 }} /></Link>
              <Link href="#" className="hover:text-brand transition-colors"><Instagram sx={{ fontSize: 20 }} /></Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
