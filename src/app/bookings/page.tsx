'use client';

import React from 'react';
import {
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
} from '@mui/material';
import { formatRupee } from '@/lib/formatRupee';

const mockBookings = [
  {
    id: 'BK-001',
    resort: 'Paradise Resort',
    checkIn: '2025-05-01',
    checkOut: '2025-05-07',
    guests: 2,
    total: 3150,
    status: 'confirmed',
  },
  {
    id: 'BK-002',
    resort: 'Forest Retreat',
    checkIn: '2025-06-15',
    checkOut: '2025-06-18',
    guests: 4,
    total: 750,
    status: 'pending',
  },
];

export default function BookingsPage() {
  return (
    <Box sx={{ py: 4, px: 2, maxWidth: 900, mx: 'auto' }}>
      <Typography variant="h5" component="h1" sx={{ mb: 3, fontWeight: 600, color: '#0a0a0a' }}>
        My bookings
      </Typography>

      <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2, borderColor: '#e5e5e5', boxShadow: 'none' }}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ bgcolor: '#fafafa' }}>
              <TableCell sx={{ fontWeight: 600, fontSize: '0.8125rem', color: '#0a0a0a', borderColor: '#e5e5e5' }}>ID</TableCell>
              <TableCell sx={{ fontWeight: 600, fontSize: '0.8125rem', color: '#0a0a0a', borderColor: '#e5e5e5' }}>Resort</TableCell>
              <TableCell sx={{ fontWeight: 600, fontSize: '0.8125rem', color: '#0a0a0a', borderColor: '#e5e5e5' }}>Check-in</TableCell>
              <TableCell sx={{ fontWeight: 600, fontSize: '0.8125rem', color: '#0a0a0a', borderColor: '#e5e5e5' }}>Check-out</TableCell>
              <TableCell sx={{ fontWeight: 600, fontSize: '0.8125rem', color: '#0a0a0a', borderColor: '#e5e5e5' }}>Guests</TableCell>
              <TableCell sx={{ fontWeight: 600, fontSize: '0.8125rem', color: '#0a0a0a', borderColor: '#e5e5e5' }}>Total</TableCell>
              <TableCell sx={{ fontWeight: 600, fontSize: '0.8125rem', color: '#0a0a0a', borderColor: '#e5e5e5' }}>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {mockBookings.map((b) => (
              <TableRow key={b.id} sx={{ '&:hover': { bgcolor: 'rgba(0,0,0,0.02)' } }}>
                <TableCell sx={{ borderColor: '#e5e5e5', fontSize: '0.875rem', fontFamily: 'monospace' }}>{b.id}</TableCell>
                <TableCell sx={{ borderColor: '#e5e5e5', fontSize: '0.875rem' }}>{b.resort}</TableCell>
                <TableCell sx={{ borderColor: '#e5e5e5', fontSize: '0.875rem' }}>{new Date(b.checkIn).toLocaleDateString()}</TableCell>
                <TableCell sx={{ borderColor: '#e5e5e5', fontSize: '0.875rem' }}>{new Date(b.checkOut).toLocaleDateString()}</TableCell>
                <TableCell sx={{ borderColor: '#e5e5e5', fontSize: '0.875rem' }}>{b.guests}</TableCell>
                <TableCell sx={{ borderColor: '#e5e5e5', fontSize: '0.875rem', fontWeight: 500 }}>{formatRupee(b.total)}</TableCell>
                <TableCell sx={{ borderColor: '#e5e5e5' }}>
                  <Chip
                    label={b.status}
                    size="small"
                    variant="outlined"
                    sx={{
                      fontWeight: 500,
                      textTransform: 'capitalize',
                      fontSize: '0.75rem',
                      borderColor: '#e5e5e5',
                      color: b.status === 'confirmed' ? '#16a34a' : '#737373',
                    }}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Typography variant="body2" sx={{ color: '#737373', mt: 2 }}>
        Mock data. Connect to the API to load real bookings.
      </Typography>
    </Box>
  );
}
