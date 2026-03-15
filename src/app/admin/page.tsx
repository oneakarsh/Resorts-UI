'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { resortAPI, bookingAPI, userAPI, dashboardAPI } from '@/lib/api';
import { formatRupee } from '@/lib/formatRupee';
import { 
  Hotel, 
  BookOnline, 
  People, 
  AccountBalanceWallet,
  Dashboard as DashboardIcon,
  ChatBubble,
  Add,
  Edit,
  Delete,
  Search,
  CheckCircle,
  Cancel
} from '@mui/icons-material';
import { CircularProgress } from '@mui/material';
import { useRouter } from 'next/navigation';
import dayjs from 'dayjs';

export default function AdminDashboard() {
  const [tab, setTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    resorts: [] as any[],
    bookings: [] as any[],
    users: [] as any[],
    stats: null as any
  });
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return;
    if (status !== 'authenticated' || !session) {
      router.push('/login');
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        const token = session.accessToken;
        const [resortsRes, bookingsRes, statsRes, usersRes] = await Promise.all([
          resortAPI.getAll({}, token),
          bookingAPI.getAllAdmin(token),
          dashboardAPI.getSuperAdminStats(token),
          userAPI.getPropertyOwners(token)
        ]);

        setData({
          resorts: resortsRes.data?.data || resortsRes.data || [],
          bookings: bookingsRes.data?.data || bookingsRes.data || [],
          stats: statsRes.data?.data || statsRes.data || null,
          users: usersRes.data?.data || usersRes.data || []
        });
      } catch (error) {
        console.error("Failed to fetch admin data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [session, status, router]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <CircularProgress size={40} sx={{ color: '#FF385C' }} />
      </div>
    );
  }

  const statsCards = [
    { title: 'Total Revenue', value: formatRupee(data.stats?.totalRevenue || 0), icon: <AccountBalanceWallet className="text-purple-600" />, color: 'bg-purple-50' },
    { title: 'Total Resorts', value: data.stats?.totalResorts || 0, icon: <Hotel className="text-blue-600" />, color: 'bg-blue-50' },
    { title: 'Total Bookings', value: data.stats?.totalBookings || 0, icon: <BookOnline className="text-green-600" />, color: 'bg-green-50' },
    { title: 'Active Users', value: data.users.length, icon: <People className="text-orange-600" />, color: 'bg-orange-50' },
  ];

  return (
    <div className="max-w-[1400px] mx-auto px-4 md:px-10 py-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
        <div>
          <h1 className="text-[32px] font-bold text-text-main">Master Console</h1>
          <p className="text-text-muted">Platform-wide management and analytics</p>
        </div>
        <div className="flex gap-2 p-1 bg-bg-offset rounded-2xl overflow-x-auto w-full md:w-auto">
          {[
            { id: 'overview', label: 'Overview', icon: <DashboardIcon sx={{ fontSize: 18 }} /> },
            { id: 'resorts', label: 'Resorts', icon: <Hotel sx={{ fontSize: 18 }} /> },
            { id: 'bookings', label: 'Bookings', icon: <BookOnline sx={{ fontSize: 18 }} /> },
            { id: 'users', label: 'Partners', icon: <People sx={{ fontSize: 18 }} /> },
            { id: 'messages', label: 'Messages', icon: <ChatBubble sx={{ fontSize: 18 }} /> },
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-[14px] font-bold transition-all whitespace-nowrap ${
                tab === t.id ? 'bg-white text-text-main shadow-sm' : 'text-text-muted hover:text-text-main'
              }`}
            >
              {t.icon}
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {tab === 'overview' && (
        <div className="space-y-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {statsCards.map((card, i) => (
              <div key={i} className="bg-white border border-border-light rounded-2xl p-6 shadow-sm">
                <div className={`w-12 h-12 rounded-xl ${card.color} flex items-center justify-center mb-4`}>
                  {card.icon}
                </div>
                <h3 className="text-text-muted text-[14px] font-medium">{card.title}</h3>
                <p className="text-[28px] font-bold text-text-main mt-1">{card.value}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white border border-border-light rounded-3xl p-8">
              <h2 className="text-[20px] font-bold text-text-main mb-6">System Health</h2>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <span className="text-text-muted">API Latency</span>
                  <span className="text-green-600 font-bold">42ms</span>
                </div>
                <div className="w-full bg-border-light h-2 rounded-full overflow-hidden">
                  <div className="bg-green-500 h-full w-[98%]" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-text-muted">Database Load</span>
                  <span className="text-orange-600 font-bold">14%</span>
                </div>
                <div className="w-full bg-border-light h-2 rounded-full overflow-hidden">
                  <div className="bg-orange-500 h-full w-[14%]" />
                </div>
              </div>
            </div>
            <div className="bg-white border border-border-light rounded-3xl p-8">
              <h2 className="text-[20px] font-bold text-text-main mb-6">Quick Actions</h2>
              <div className="grid grid-cols-2 gap-4">
                <button className="p-4 bg-bg-offset rounded-2xl hover:bg-white border border-transparent hover:border-border-main transition-all text-left">
                  <p className="font-bold text-text-main">Audit Logs</p>
                  <p className="text-[12px] text-text-muted">View system-wide activity</p>
                </button>
                <button className="p-4 bg-bg-offset rounded-2xl hover:bg-white border border-transparent hover:border-border-main transition-all text-left">
                  <p className="font-bold text-text-main">Global Settings</p>
                  <p className="text-[12px] text-text-muted">Configure platform fees & SEO</p>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {tab === 'resorts' && (
        <div className="bg-white border border-border-light rounded-2xl overflow-hidden shadow-sm">
          <div className="p-6 border-b border-border-light flex justify-between items-center">
             <h2 className="text-[18px] font-bold text-text-main">All Listings ({data.resorts.length})</h2>
             <button className="flex items-center gap-2 bg-text-main text-white px-5 py-2 rounded-xl text-[14px] font-bold">
               <Add sx={{ fontSize: 18 }} />
               Deploy Resort
             </button>
          </div>
          <table className="w-full text-left">
            <thead className="bg-bg-offset text-text-muted text-[13px] uppercase tracking-wider font-bold">
              <tr>
                <th className="px-6 py-4">Property</th>
                <th className="px-6 py-4">Owner</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4">Performance</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-light text-[14px]">
              {data.resorts.map(resort => (
                <tr key={resort.id} className="hover:bg-bg-offset/40 transition-colors">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-bold text-text-main">{resort.name}</p>
                      <p className="text-text-muted text-[12px]">{resort.location}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-text-muted">{resort.ownerName || 'Unknown'}</td>
                  <td className="px-6 py-4 font-semibold">{formatRupee(resort.pricePerNight)}</td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 bg-green-50 text-green-600 rounded-lg font-bold text-[11px]">8.4/10</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 hover:bg-bg-offset rounded-lg transition-colors"><Edit sx={{ fontSize: 18 }} /></button>
                    <button className="p-2 hover:bg-brand/5 text-brand rounded-lg transition-colors"><Delete sx={{ fontSize: 18 }} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'bookings' && (
        <div className="bg-white border border-border-light rounded-2xl overflow-hidden shadow-sm">
          <div className="p-6 border-b border-border-light">
             <h2 className="text-[18px] font-bold text-text-main">Global Reservations</h2>
          </div>
          <table className="w-full text-left">
            <thead className="bg-bg-offset text-text-muted text-[13px] uppercase tracking-wider font-bold">
              <tr>
                <th className="px-6 py-4">ID</th>
                <th className="px-6 py-4">Guest</th>
                <th className="px-6 py-4">Stay</th>
                <th className="px-6 py-4">Total</th>
                <th className="px-6 py-4">State</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-light text-[14px]">
              {data.bookings.map(booking => (
                <tr key={booking.id} className="hover:bg-bg-offset/40 transition-colors">
                  <td className="px-6 py-4 font-mono text-text-muted">{booking.id.slice(-6)}</td>
                  <td className="px-6 py-4 font-bold text-text-main">{booking.userName}</td>
                  <td className="px-6 py-4 text-text-muted">
                    {dayjs(booking.checkInDate).format('MMM D')} - {dayjs(booking.checkOutDate).format('MMM D')}
                  </td>
                  <td className="px-6 py-4 font-semibold text-text-main">{formatRupee(booking.totalPrice)}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                      booking.status === 'confirmed' ? 'bg-green-50 text-green-600' :
                      booking.status === 'pending' ? 'bg-blue-50 text-blue-600' :
                      'bg-bg-offset text-text-muted'
                    }`}>
                      {booking.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button className="p-2 text-text-muted hover:text-text-main transition-colors"><Search sx={{ fontSize: 18 }} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'users' && (
        <div className="bg-white border border-border-light rounded-2xl overflow-hidden shadow-sm">
          <div className="p-6 border-b border-border-light">
             <h2 className="text-[18px] font-bold text-text-main">Partner Management</h2>
          </div>
          <table className="w-full text-left">
            <thead className="bg-bg-offset text-text-muted text-[13px] uppercase tracking-wider font-bold">
              <tr>
                <th className="px-6 py-4">Partner</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Registered</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-light text-[14px]">
              {data.users.map(user => (
                <tr key={user.id} className="hover:bg-bg-offset/40 transition-colors">
                  <td className="px-6 py-4 font-bold text-text-main">{user.name}</td>
                  <td className="px-6 py-4 text-text-muted">{user.email}</td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 bg-bg-offset text-text-main rounded-lg font-bold text-[11px] capitalize">{user.role.replace('_', ' ')}</span>
                  </td>
                  <td className="px-6 py-4 text-text-muted">{dayjs(user.createdAt).format('MMM D, YYYY')}</td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-text-muted hover:text-text-main font-bold underline">Edit</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'messages' && (
        <div className="py-20 text-center bg-bg-offset/30 border-2 border-dashed border-border-light rounded-3xl">
          <ChatBubble className="text-text-muted mb-4" sx={{ fontSize: 40 }} />
          <h2 className="text-[18px] font-bold text-text-main">No platform queries</h2>
          <p className="text-text-muted">Direct messages between guests and owners are not monitored here.</p>
        </div>
      )}
    </div>
  );
}