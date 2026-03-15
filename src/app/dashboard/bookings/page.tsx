'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { bookingAPI } from '@/lib/api';
import { formatRupee } from '@/lib/formatRupee';
import { 
  CheckCircle, 
  Cancel,
  Search,
  FilterList,
  BookOnline
} from '@mui/icons-material';
import { CircularProgress } from '@mui/material';
import dayjs from 'dayjs';

interface Booking {
  id: string;
  resortName: string;
  userName: string;
  checkInDate: string;
  checkOutDate: string;
  numberOfGuests: number;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
}

export default function ManageBookings() {
  const { data: session } = useSession();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const fetchBookings = async () => {
      if (!session?.accessToken) return;
      try {
        setLoading(true);
        // Assuming bookingAPI.getAll for an owner returns their properties' bookings
        const response = await bookingAPI.getAll(session.accessToken);
        const data = response.data?.data || response.data;
        setBookings(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Failed to fetch bookings:", error);
      } finally {
        setLoading(false);
      }
    };

    if (session) fetchBookings();
  }, [session]);

  const handleStatusUpdate = async (id: string, status: string) => {
    try {
      await bookingAPI.updateStatus(id, status, session?.accessToken);
      setBookings(prev => prev.map(b => b.id === id ? { ...b, status: status as any } : b));
    } catch (error) {
      alert('Failed to update booking status');
    }
  };

  const filteredBookings = bookings.filter(b => filter === 'all' || b.status === filter);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <CircularProgress size={40} sx={{ color: '#FF385C' }} />
      </div>
    );
  }

  return (
    <div className="max-w-[1280px] mx-auto px-4 md:px-10 py-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
        <div>
          <h1 className="text-[32px] font-bold text-text-main">Reservations</h1>
          <p className="text-text-muted">Manage incoming booking requests and guest stays</p>
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="flex-1 md:w-64 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" sx={{ fontSize: 20 }} />
            <input 
              type="text" 
              placeholder="Search by guest or resort" 
              className="w-full pl-10 pr-4 py-2 bg-white border border-border-main rounded-xl outline-none focus:ring-2 focus:ring-brand transition-all"
            />
          </div>
          <button className="p-2 border border-border-main rounded-xl hover:bg-bg-offset transition-colors">
            <FilterList />
          </button>
        </div>
      </div>

      {/* Status Tabs */}
      <div className="flex gap-8 border-b border-border-light mb-8">
        {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map(s => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`pb-4 px-1 text-[14px] font-bold capitalize transition-all relative ${
              filter === s ? 'text-text-main' : 'text-text-muted hover:text-text-main'
            }`}
          >
            {s}
            {filter === s && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-text-main" />}
          </button>
        ))}
      </div>

      {filteredBookings.length > 0 ? (
        <div className="bg-white border border-border-light rounded-2xl overflow-hidden shadow-sm">
          <table className="w-full text-left">
            <thead className="bg-bg-offset border-b border-border-light">
              <tr>
                <th className="px-6 py-4 font-bold text-[14px] text-text-main">Guest</th>
                <th className="px-6 py-4 font-bold text-[14px] text-text-main">Resort</th>
                <th className="px-6 py-4 font-bold text-[14px] text-text-main">Dates</th>
                <th className="px-6 py-4 font-bold text-[14px] text-text-main">Amount</th>
                <th className="px-6 py-4 font-bold text-[14px] text-text-main">Status</th>
                <th className="px-6 py-4 font-bold text-[14px] text-text-main text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-light">
              {filteredBookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-bg-offset/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-text-main text-white flex items-center justify-center font-bold text-[12px]">
                        {booking.userName.charAt(0)}
                      </div>
                      <span className="font-medium text-text-main">{booking.userName}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-text-main font-medium truncate max-w-[200px]">{booking.resortName}</td>
                  <td className="px-6 py-4 text-text-muted text-[14px]">
                    {dayjs(booking.checkInDate).format('MMM D')} - {dayjs(booking.checkOutDate).format('MMM D, YYYY')}
                  </td>
                  <td className="px-6 py-4 text-text-main font-semibold">{formatRupee(booking.totalPrice)}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-[12px] font-bold uppercase tracking-wider ${
                      booking.status === 'confirmed' ? 'bg-green-50 text-green-600' :
                      booking.status === 'pending' ? 'bg-blue-50 text-blue-600' :
                      'bg-bg-offset text-text-muted'
                    }`}>
                      {booking.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    {booking.status === 'pending' && (
                      <>
                        <button 
                          onClick={() => handleStatusUpdate(booking.id, 'confirmed')}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="Confirm Booking"
                        >
                          <CheckCircle sx={{ fontSize: 20 }} />
                        </button>
                        <button 
                          onClick={() => handleStatusUpdate(booking.id, 'cancelled')}
                          className="p-2 text-brand hover:bg-brand/5 rounded-lg transition-colors"
                          title="Decline Booking"
                        >
                          <Cancel sx={{ fontSize: 20 }} />
                        </button>
                      </>
                    )}
                    <button className="text-[13px] font-bold text-text-muted hover:text-text-main underline px-2">
                      Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="py-20 text-center bg-bg-offset/30 border-2 border-dashed border-border-light rounded-3xl">
          <BookOnline className="text-text-muted mb-4" sx={{ fontSize: 40 }} />
          <h2 className="text-[18px] font-bold text-text-main">No reservations found</h2>
          <p className="text-text-muted">You don't have any bookings matching the current filter.</p>
        </div>
      )}
    </div>
  );
}
