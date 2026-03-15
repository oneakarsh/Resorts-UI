'use client';

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { 
  Box, 
  Typography, 
  Paper, 
  Button, 
  Divider, 
  CircularProgress, 
  Snackbar,
  Stack,
  TextField,
  Grid
} from '@mui/material';
import { bookingAPI } from '@/lib/api';
import { formatRupee } from '@/lib/formatRupee';
// Oops, I saw the previous code used next/navigation
import { useSearchParams as useNextSearchParams, useRouter as useNextRouter } from 'next/navigation';

export default function DummyPaymentClient() {
  const searchParams = useNextSearchParams();
  const router = useNextRouter();
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
    return (
      <Box sx={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <CircularProgress sx={{ color: '#0a0a0a' }} />
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 1000, mx: 'auto', px: 2, py: { xs: 4, md: 8 } }}>
      <Grid container spacing={4}>
        {/* Payment Form side */}
        <Grid size={{ xs: 12, md: 7 }}>
          <Typography variant="h4" sx={{ fontWeight: 800, mb: 1, letterSpacing: '-0.04em' }}>Payment</Typography>
          <Typography variant="body1" sx={{ color: '#737373', mb: 5 }}>All transactions are secure and encrypted.</Typography>

          {/* Dummy Credit Card */}
          <Paper 
            elevation={0}
            sx={{ 
              p: 3, 
              mb: 4, 
              borderRadius: 4, 
              background: 'linear-gradient(135deg, #0a0a0a 0%, #404040 100%)',
              color: '#fff',
              position: 'relative',
              overflow: 'hidden',
              minHeight: 200,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6" sx={{ fontWeight: 700, letterSpacing: '0.1em' }}>PLATINUM</Typography>
              <Box sx={{ width: 45, height: 30, bgcolor: 'rgba(255,255,255,0.2)', borderRadius: 1 }} />
            </Box>
            
            <Typography variant="h5" sx={{ letterSpacing: '0.15em', my: 3, fontWeight: 500 }}>
              ****  ****  ****  4242
            </Typography>

            <Box sx={{ display: 'flex', gap: 4 }}>
              <Box>
                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase' }}>Card Holder</Typography>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>{session?.user?.name || 'GUEST USER'}</Typography>
              </Box>
              <Box>
                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase' }}>Expires</Typography>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>12/28</Typography>
              </Box>
            </Box>
          </Paper>

          <Stack spacing={3}>
            <TextField 
              fullWidth 
              label="Card Number" 
              defaultValue="4242 4242 4242 4242"
              disabled
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
            />
            <Grid container spacing={2}>
              <Grid size={{ xs: 8 }}>
                <TextField 
                  fullWidth 
                  label="Name on Card" 
                  defaultValue={session?.user?.name || ''}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />
              </Grid>
              <Grid size={{ xs: 4 }}>
                <TextField 
                  fullWidth 
                  label="CVV" 
                  defaultValue="***"
                  disabled
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />
              </Grid>
            </Grid>
            <Button 
              variant="contained" 
              fullWidth 
              size="large"
              onClick={handlePay}
              disabled={loading}
              sx={{ 
                bgcolor: '#0a0a0a', 
                color: '#fff',
                py: 2,
                borderRadius: 3,
                fontWeight: 700,
                fontSize: '1rem',
                '&:hover': { bgcolor: '#262626' }
              }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : `Pay ${formatRupee(bookingData.totalPrice)}`}
            </Button>
          </Stack>
        </Grid>

        {/* Summary side */}
        <Grid size={{ xs: 12, md: 5 }}>
          <Paper 
            variant="outlined" 
            sx={{ 
              p: 4, 
              borderRadius: 6, 
              borderColor: '#f0f0f0', 
              bgcolor: '#fafafa',
              position: 'sticky',
              top: 100
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 800, mb: 3 }}>Order Summary</Typography>
            
            <Stack spacing={2.5}>
              <Box display="flex" justifyContent="space-between">
                <Typography sx={{ color: '#737373' }}>Resort</Typography>
                <Typography sx={{ fontWeight: 600 }}>{bookingData.resortName}</Typography>
              </Box>
              <Box display="flex" justifyContent="space-between">
                <Typography sx={{ color: '#737373' }}>Stay</Typography>
                <Typography sx={{ fontWeight: 600, textAlign: 'right' }}>
                  {bookingData.checkInDate} <br /> to {bookingData.checkOutDate}
                </Typography>
              </Box>
              <Box display="flex" justifyContent="space-between">
                <Typography sx={{ color: '#737373' }}>Guests</Typography>
                <Typography sx={{ fontWeight: 600 }}>{bookingData.numberOfGuests} Persons</Typography>
              </Box>
              
              <Divider sx={{ my: 1, borderColor: '#e5e5e5' }} />
              
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="h6" sx={{ fontWeight: 800 }}>Total</Typography>
                <Typography variant="h5" sx={{ fontWeight: 900 }}>{formatRupee(bookingData.totalPrice)}</Typography>
              </Box>

              <Typography variant="caption" sx={{ color: '#a3a3a3', textAlign: 'center', mt: 2 }}>
                By clicking pay, you agree to our terms of service and booking policy.
              </Typography>
            </Stack>
          </Paper>
        </Grid>
      </Grid>

      <Snackbar 
        open={snackOpen} 
        message="Payment successful — booking confirmed" 
        autoHideDuration={2000} 
        onClose={() => setSnackOpen(false)} 
      />
    </Box>
  );
}

