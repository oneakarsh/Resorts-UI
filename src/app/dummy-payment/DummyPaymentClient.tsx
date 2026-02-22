'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Box, Typography, Paper, Button, Divider, CircularProgress, Snackbar } from '@mui/material';
import { bookingAPI } from '@/lib/api';
import { formatRupee } from '@/lib/formatRupee';

export default function DummyPaymentClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { data: session, status } = useSession();
  const [bookingData, setBookingData] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [snackOpen, setSnackOpen] = useState(false);

  useEffect(() => {
    const d = searchParams?.get('data');
    if (!d) return;
    try {
      const parsed = JSON.parse(decodeURIComponent(d));
      setBookingData(parsed);
    } catch (e) {
      console.error('Failed to parse booking data', e);
    }
  }, [searchParams]);

  const handlePay = async () => {
    if (status !== 'authenticated' || !session) {
      router.push('/login');
      return;
    }
    if (!bookingData) return;

    try {
      setLoading(true);
      const payload = {
        resortId: bookingData.resortId,
        checkInDate: bookingData.checkInDate,
        checkOutDate: bookingData.checkOutDate,
        numberOfGuests: bookingData.numberOfGuests,
        selectedAmenities: bookingData.selectedAmenities,
        totalPrice: bookingData.totalPrice,
      };
      await bookingAPI.create(payload, session.accessToken);
      setSnackOpen(true);
      setTimeout(() => {
        router.push('/bookings');
      }, 1200);
    } catch (err) {
      console.error('Payment/booking failed', err);
      alert('Payment failed');
    } finally {
      setLoading(false);
    }
  };

  if (!bookingData) {
    return <Box sx={{ py: 6, textAlign: 'center' }}><Typography>Preparing payment...</Typography></Box>;
  }

  return (
    <Box sx={{ maxWidth: 640, mx: 'auto', px: 2, py: 6 }}>
      <Paper variant="outlined" sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>Dummy Payment Gateway</Typography>
        <Typography variant="body2" sx={{ color: '#737373', mb: 2 }}>This is a simulated payment page for development. No real payment is taken.</Typography>

        <Divider sx={{ my: 2 }} />

        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>{bookingData.resortName}</Typography>
        <Typography variant="body2" sx={{ color: '#737373' }}>{bookingData.checkInDate} → {bookingData.checkOutDate}</Typography>
        <Typography variant="body2" sx={{ color: '#737373', mb: 2 }}>Guests: {bookingData.numberOfGuests}</Typography>

        <Typography variant="body2">Amenities: {(bookingData.selectedAmenities || []).join(', ') || 'None'}</Typography>

        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">Total</Typography>
          <Typography variant="h6">{formatRupee(bookingData.totalPrice)}</Typography>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button variant="outlined" onClick={() => router.back()}>Cancel</Button>
          <Button variant="contained" onClick={handlePay} disabled={loading} sx={{ bgcolor: '#0a0a0a', '&:hover': { bgcolor: '#262626' } }}>
            {loading ? <CircularProgress size={18} color="inherit" /> : 'Pay now'}
          </Button>
        </Box>
      </Paper>

      <Snackbar open={snackOpen} message="Payment successful — booking confirmed" autoHideDuration={2000} onClose={() => setSnackOpen(false)} />
    </Box>
  );
}
