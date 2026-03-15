'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { dashboardAPI } from '@/lib/api';
import { formatRupee } from '@/lib/formatRupee';
import { 
  HomeWork, 
  BookOnline, 
  AccountBalanceWallet,
  TrendingUp,
  Add
} from '@mui/icons-material';
import { CircularProgress } from '@mui/material';
import Link from 'next/link';

export default function OwnerDashboard() {
  const { data: session } = useSession();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      if (!session?.accessToken) return;
      try {
        setLoading(true);
        const response = await dashboardAPI.getPropertyOwnerStats(session.accessToken);
        setStats(response.data?.data || response.data);
      } catch (error) {
        console.error("Failed to fetch owner stats:", error);
      } finally {
        setLoading(false);
      }
    };

    if (session) fetchStats();
  }, [session]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <CircularProgress size={40} sx={{ color: '#FF385C' }} />
      </div>
    );
  }

  const cards = [
    {
      title: 'Total Resorts',
      value: stats?.totalResorts || 0,
      icon: <HomeWork className="text-blue-500" />,
      description: 'Your active property listings'
    },
    {
      title: 'Total Bookings',
      value: stats?.totalBookings || 0,
      icon: <BookOnline className="text-green-500" />,
      description: 'Reservations across all resorts'
    },
    {
      title: 'Total Revenue',
      value: formatRupee(stats?.totalRevenue || 0),
      icon: <AccountBalanceWallet className="text-purple-500" />,
      description: 'Earnings before service fees'
    }
  ];

  return (
    <div className="max-w-[1280px] mx-auto px-4 md:px-10 py-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <h1 className="text-[32px] font-bold text-text-main">Dashboard</h1>
          <p className="text-text-muted">Welcome back, {(session?.user as any)?.name}</p>
        </div>
        <Link 
          href="/dashboard/resorts/new"
          className="flex items-center gap-2 bg-text-main text-white px-6 py-3 rounded-xl font-bold hover:bg-opacity-90 transition-all transition-colors"
        >
          <Add />
          Add new resort
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {cards.map((card, i) => (
          <div key={i} className="bg-white border border-border-light rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-bg-offset rounded-xl">
                {card.icon}
              </div>
              <span className="text-[12px] font-bold text-green-600 flex items-center gap-1 bg-green-50 px-2 py-1 rounded-lg">
                <TrendingUp sx={{ fontSize: 14 }} />
                +12%
              </span>
            </div>
            <h3 className="text-text-muted text-[14px] font-medium">{card.title}</h3>
            <p className="text-[28px] font-bold text-text-main mt-1">{card.value}</p>
            <p className="text-[12px] text-text-muted mt-2">{card.description}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Bookings Placeholder */}
        <div className="bg-white border border-border-light rounded-2xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-[20px] font-bold text-text-main">Recent Bookings</h2>
            <Link href="/dashboard/bookings" className="text-brand font-bold text-[14px] hover:underline">View all</Link>
          </div>
          <div className="space-y-4">
            {stats?.recentBookings?.length > 0 ? (
              stats.recentBookings.map((booking: any) => (
                <div key={booking.id} className="flex items-center justify-between py-3 border-b border-border-light last:border-0">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-lg bg-bg-offset" />
                    <div>
                      <p className="font-bold text-[14px] text-text-main">{booking.resortName}</p>
                      <p className="text-[12px] text-text-muted">{booking.userName}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-[14px] text-text-main">{formatRupee(booking.totalPrice)}</p>
                    <p className="text-[12px] text-text-muted">{booking.status}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-text-muted py-10 text-center">No recent bookings found.</p>
            )}
          </div>
        </div>

        {/* Quick Links / Resources */}
        <div className="bg-white border border-border-light rounded-2xl p-6">
          <h2 className="text-[20px] font-bold text-text-main mb-6">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-4">
            <Link href="/dashboard/resorts" className="p-4 bg-bg-offset rounded-xl hover:bg-white border border-transparent hover:border-border-main transition-all group">
              <h4 className="font-bold text-text-main group-hover:text-brand">Manage resorts</h4>
              <p className="text-[12px] text-text-muted">Edit or remove your listings</p>
            </Link>
            <Link href="/dashboard/bookings" className="p-4 bg-bg-offset rounded-xl hover:bg-white border border-transparent hover:border-border-main transition-all group">
              <h4 className="font-bold text-text-main group-hover:text-brand">Booking requests</h4>
              <p className="text-[12px] text-text-muted">Approve or decline stays</p>
            </Link>
            <Link href="/profile" className="p-4 bg-bg-offset rounded-xl hover:bg-white border border-transparent hover:border-border-main transition-all group">
              <h4 className="font-bold text-text-main group-hover:text-brand">Edit profile</h4>
              <p className="text-[12px] text-text-muted">Update your owner details</p>
            </Link>
            <Link href="/messages" className="p-4 bg-bg-offset rounded-xl hover:bg-white border border-transparent hover:border-border-main transition-all group">
              <h4 className="font-bold text-text-main group-hover:text-brand">Messages</h4>
              <p className="text-[12px] text-text-muted">Talk to your guests</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
