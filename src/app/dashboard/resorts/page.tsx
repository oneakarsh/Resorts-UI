'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { resortAPI } from '@/lib/api';
import { formatRupee } from '@/lib/formatRupee';
import { 
  Edit, 
  Delete, 
  Visibility,
  Add,
  HomeWork
} from '@mui/icons-material';
import { CircularProgress } from '@mui/material';
import Link from 'next/link';
import Image from 'next/image';

export default function ManageResorts() {
  const { data: session } = useSession();
  const [resorts, setResorts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResorts = async () => {
      if (!session?.accessToken) return;
      try {
        setLoading(true);
        // Assuming the API returns only owned resorts when token is provided, 
        // or we need to filter. For now, we'll fetch all and filter if needed.
        const response = await resortAPI.getAll({}, session.accessToken);
        const data = response.data?.data || response.data;
        
        // Filter by current user if necessary
        const userResorts = Array.isArray(data) ? data.filter((r: any) => r.ownerId === (session.user as any).id || r.owner === (session.user as any).id) : [];
        setResorts(userResorts);
      } catch (error) {
        console.error("Failed to fetch user resorts:", error);
      } finally {
        setLoading(false);
      }
    };

    if (session) fetchResorts();
  }, [session]);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this resort? This action cannot be undone.')) return;
    try {
      await resortAPI.delete(id, session?.accessToken);
      setResorts(resorts.filter(r => (r.id || r._id) !== id));
    } catch (error) {
      alert('Failed to delete resort');
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <CircularProgress size={40} sx={{ color: '#FF385C' }} />
      </div>
    );
  }

  return (
    <div className="max-w-[1280px] mx-auto px-4 md:px-10 py-10">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-[32px] font-bold text-text-main">Your Resorts</h1>
          <p className="text-text-muted">Manage your property listings and availability</p>
        </div>
        <Link 
          href="/dashboard/resorts/new"
          className="flex items-center gap-2 bg-text-main text-white px-6 py-3 rounded-xl font-bold hover:bg-opacity-90 transition-all"
        >
          <Add />
          Add new resort
        </Link>
      </div>

      {resorts.length > 0 ? (
        <div className="bg-white border border-border-light rounded-2xl overflow-hidden shadow-sm">
          <table className="w-full text-left">
            <thead className="bg-bg-offset border-b border-border-light">
              <tr>
                <th className="px-6 py-4 font-bold text-[14px] text-text-main">Property</th>
                <th className="px-6 py-4 font-bold text-[14px] text-text-main">Location</th>
                <th className="px-6 py-4 font-bold text-[14px] text-text-main">Price</th>
                <th className="px-6 py-4 font-bold text-[14px] text-text-main">Status</th>
                <th className="px-6 py-4 font-bold text-[14px] text-text-main text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-light">
              {resorts.map((resort) => {
                const id = resort.id || resort._id;
                return (
                  <tr key={id} className="hover:bg-bg-offset/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-bg-offset">
                          <Image 
                            src={resort.images?.[0] || resort.image || 'https://images.unsplash.com/photo-1540553016722-983e48a2cd10?auto=format&fit=crop&w=400&q=80'} 
                            alt={resort.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <span className="font-semibold text-text-main">{resort.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-text-muted text-[14px]">{resort.location}</td>
                    <td className="px-6 py-4 text-text-main font-medium">{formatRupee(resort.pricePerNight)}<span className="text-text-muted text-[12px]"> / night</span></td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-green-50 text-green-600 rounded-full text-[12px] font-bold uppercase tracking-wider">
                        Active
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <Link href={`/resorts/${id}`} className="p-2 text-text-muted hover:text-text-main transition-colors inline-block">
                        <Visibility sx={{ fontSize: 20 }} />
                      </Link>
                      <Link href={`/dashboard/resorts/edit/${id}`} className="p-2 text-text-muted hover:text-blue-600 transition-colors inline-block">
                        <Edit sx={{ fontSize: 20 }} />
                      </Link>
                      <button 
                        onClick={() => handleDelete(id)}
                        className="p-2 text-text-muted hover:text-brand transition-colors"
                      >
                        <Delete sx={{ fontSize: 20 }} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="py-20 text-center border-2 border-dashed border-border-light rounded-3xl bg-bg-offset/30">
          <div className="w-16 h-16 bg-bg-offset rounded-full flex items-center justify-center mx-auto mb-6">
            <HomeWork className="text-text-muted" sx={{ fontSize: 32 }} />
          </div>
          <h2 className="text-[22px] font-semibold text-text-main mb-2">No resorts yet</h2>
          <p className="text-text-muted mb-8 max-w-sm mx-auto">
            You haven't listed any resorts. Start by adding your first property to our platform.
          </p>
          <Link 
            href="/dashboard/resorts/new"
            className="inline-block bg-text-main text-white px-8 py-3 rounded-xl font-bold hover:bg-opacity-90 transition-all"
          >
            Add new resort
          </Link>
        </div>
      )}
    </div>
  );
}
