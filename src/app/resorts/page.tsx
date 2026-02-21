'use client';

import React from 'react';
import { Box, Typography } from '@mui/material';

export default function ResortsPage() {
  return (
    <Box sx={{ py: 4, px: 2, maxWidth: 1200, mx: 'auto' }}>
      <Typography
        variant="h5"
        component="h1"
        sx={{ fontWeight: 600, color: '#0a0a0a', mb: 1 }}
      >
        All resorts
      </Typography>
      <Typography variant="body2" sx={{ color: '#737373', mb: 3 }}>
        Browse every resort available on Scaper. Use the filters above to narrow
        down your perfect stay.
      </Typography>
      {/* The actual grid of resorts is rendered by the shared Layout component. */}
    </Box>
  );
}

