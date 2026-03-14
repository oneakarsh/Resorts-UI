'use client';

import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Box,
  CircularProgress,
  Alert,
} from '@mui/material';
import { useSession } from 'next-auth/react';
import { bookingAPI } from '@/lib/api';
import { Booking } from '@/types';

export default function BookingsPage() {
  const { data: session, status } = useSession();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBookings = async () => {
      if (status !== 'authenticated' || !session) return;
      
      try {
        setLoading(true);
        const response = await bookingAPI.getAll(session.accessToken);
        const data = response.data?.data || response.data || [];
        setBookings(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Failed to fetch bookings:', err);
        setError('Failed to load your bookings. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (status === 'authenticated') {
      fetchBookings();
    } else if (status === 'unauthenticated') {
      setLoading(false);
    }
  }, [session, status]);

  if (status === 'loading' || loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (status === 'unauthenticated') {
    return (
      <Container maxWidth="md" sx={{ mt: 8 }}>
        <Alert severity="info">Please sign in to view your bookings.</Alert>
      </Container>
    );
  }

  return (
    <Box sx={{ py: 4, px: 2 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 3, fontWeight: 600 }}>
        My Bookings
      </Typography>

      {error ? (
        <Alert severity="error">{error}</Alert>
      ) : bookings.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 2 }}>
          <Typography variant="h6" color="text.secondary">You haven't made any bookings yet.</Typography>
        </Paper>
      ) : (
        <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
          <Table>
            <TableHead sx={{ bgcolor: '#f8f9fa' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>ID</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Resort</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Check-in</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Check-out</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Guests</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Total Price</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {bookings.map((b) => (
                <TableRow key={b._id || b.id} hover>
                <TableCell sx={{ fontFamily: 'monospace' }}>{(b._id || b.id).slice(-8).toUpperCase()}</TableCell>
                <TableCell sx={{ fontWeight: 500 }}>{b.resortId?.name || 'Resort'}</TableCell>
                <TableCell>{new Date(b.checkIn).toLocaleDateString()}</TableCell>
                <TableCell>{new Date(b.checkOut).toLocaleDateString()}</TableCell>
                <TableCell>{b.guests}</TableCell>
                <TableCell sx={{ fontWeight: 600, color: 'primary.main' }}>
                  ${b.totalPrice}
                </TableCell>
                <TableCell>
                  <Chip 
                    label={b.status} 
                    color={b.status.toLowerCase() === 'confirmed' ? 'success' : b.status.toLowerCase() === 'cancelled' ? 'error' : 'warning'} 
                    size="small" 
                    variant="filled"
                    sx={{ fontWeight: 600, textTransform: 'capitalize' }}
                  />
                </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
}
