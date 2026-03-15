'use client';

import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import { resortAPI } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { 
  ChevronLeft,
  AddPhotoAlternate,
  CloudUpload,
  KeyboardArrowRight,
  KeyboardArrowLeft
} from '@mui/icons-material';
import { CircularProgress } from '@mui/material';
import Link from 'next/link';

export default function NewResort() {
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    location: '',
    pricePerNight: '',
    maxGuests: '2',
    amenities: [] as string[],
    images: [] as string[],
  });

  const amenitiesList = [
    'Wifi', 'Kitchen', 'Free parking', 'Pool', 'Air conditioning', 
    'Beach access', 'Gym', 'Workspace', 'TV', 'Dryer'
  ];

  const handleToggleAmenity = (amenity: string) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity) 
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!session?.accessToken) return;
    try {
      setLoading(true);
      const payload = {
        ...formData,
        pricePerNight: Number(formData.pricePerNight),
        maxGuests: Number(formData.maxGuests),
        image: formData.images[0] || 'https://images.unsplash.com/photo-1540553016722-983e48a2cd10?auto=format&fit=crop&w=800&q=80',
      };
      await resortAPI.create(payload, session.accessToken);
      router.push('/dashboard/resorts');
    } catch (error) {
      console.error("Failed to create resort:", error);
      alert('Failed to create resort listing');
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch(step) {
      case 1:
        return (
          <div className="space-y-6 animate-in fade-in duration-500">
            <h2 className="text-[24px] font-bold text-text-main">Basic Information</h2>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[14px] font-semibold text-text-main">Resort Name</label>
                <input 
                  type="text" 
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g. Sunset Paradise Villa" 
                  className="w-full p-4 border border-border-main rounded-xl focus:ring-2 focus:ring-brand outline-none transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[14px] font-semibold text-text-main">Location</label>
                <input 
                  type="text" 
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="e.g. Goa, India" 
                  className="w-full p-4 border border-border-main rounded-xl focus:ring-2 focus:ring-brand outline-none transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[14px] font-semibold text-text-main">Property Description</label>
                <textarea 
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={6}
                  placeholder="Tell guests what makes your property special..." 
                  className="w-full p-4 border border-border-main rounded-xl focus:ring-2 focus:ring-brand outline-none transition-all"
                />
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6 animate-in fade-in duration-500">
            <h2 className="text-[24px] font-bold text-text-main">Details & Pricing</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[14px] font-semibold text-text-main">Price per Night (INR)</label>
                <input 
                  type="number" 
                  name="pricePerNight"
                  value={formData.pricePerNight}
                  onChange={handleInputChange}
                  placeholder="2500" 
                  className="w-full p-4 border border-border-main rounded-xl focus:ring-2 focus:ring-brand outline-none transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[14px] font-semibold text-text-main">Max Guests</label>
                <select 
                  name="maxGuests"
                  value={formData.maxGuests}
                  onChange={handleInputChange}
                  className="w-full p-4 border border-border-main rounded-xl focus:ring-2 focus:ring-brand outline-none transition-all appearance-none bg-white"
                >
                  {[1,2,3,4,5,6,7,8,10,12].map(n => (
                    <option key={n} value={n}>{n} Guests</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="space-y-4 pt-4">
              <h3 className="text-[18px] font-semibold text-text-main">Amenities</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {amenitiesList.map(item => (
                  <button
                    key={item}
                    onClick={() => handleToggleAmenity(item)}
                    className={`p-4 border rounded-xl text-[14px] font-medium transition-all ${
                      formData.amenities.includes(item)
                        ? 'border-text-main bg-bg-offset ring-1 ring-text-main'
                        : 'border-border-main hover:border-text-main bg-white'
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6 animate-in fade-in duration-500">
            <h2 className="text-[24px] font-bold text-text-main">Photos</h2>
            <p className="text-text-muted">High-quality photos help your listing stand out. Add at least one photo.</p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <button className="aspect-square border-2 border-dashed border-border-main rounded-2xl flex flex-col items-center justify-center gap-3 hover:bg-bg-offset transition-all text-text-muted hover:text-text-main">
                <AddPhotoAlternate sx={{ fontSize: 40 }} />
                <span className="font-semibold">Add from Computer</span>
              </button>
              
              <button className="aspect-square border-2 border-dashed border-border-main rounded-2xl flex flex-col items-center justify-center gap-3 hover:bg-bg-offset transition-all text-text-muted hover:text-text-main">
                <CloudUpload sx={{ fontSize: 40 }} />
                <span className="font-semibold">Upload from Cloud</span>
              </button>
            </div>
            
            <div className="p-4 bg-bg-offset rounded-xl text-[14px] text-text-muted">
              Tip: Professional photos can increase your booking rate by up to 40%. Try to include shots of the bedroom, bathroom, and any unique features.
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-white pb-20">
      <div className="max-w-[800px] mx-auto px-4 py-12">
        <Link href="/dashboard/resorts" className="flex items-center gap-2 text-text-muted hover:text-text-main mb-8 font-medium">
          <ChevronLeft />
          Back to Resorts
        </Link>
        
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-[32px] font-bold text-text-main">Step {step} of 3</h1>
          <div className="flex gap-1">
            {[1, 2, 3].map(s => (
              <div key={s} className={`h-2 w-12 rounded-full ${s <= step ? 'bg-text-main' : 'bg-border-light'}`} />
            ))}
          </div>
        </div>

        <div className="min-h-[400px]">
          {renderStep()}
        </div>

        <div className="mt-12 pt-8 border-t border-border-light flex justify-between">
          {step > 1 ? (
            <button 
              onClick={() => setStep(s => s - 1)}
              className="flex items-center gap-2 px-6 py-3 font-bold text-text-main hover:bg-bg-offset rounded-xl transition-all"
            >
              <KeyboardArrowLeft />
              Back
            </button>
          ) : <div />}
          
          {step < 3 ? (
            <button 
              onClick={() => setStep(s => s + 1)}
              className="flex items-center gap-2 bg-text-main text-white px-8 py-3 rounded-xl font-bold hover:bg-opacity-90 transition-all focus:ring-4 focus:ring-bg-offset"
            >
              Next
              <KeyboardArrowRight />
            </button>
          ) : (
            <button 
              onClick={handleSubmit}
              disabled={loading}
              className="bg-brand text-white px-12 py-3 rounded-xl font-bold hover:bg-brand-dark transition-all disabled:opacity-50"
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Publish Listing'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
