'use client';

import React, { ReactNode } from 'react';
import { Box, Typography } from '@mui/material';
import Navbar from './Navbar';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: '#fafafa' }}>
      <Navbar />
      <Box component="main" sx={{ flexGrow: 1 }}>
        {children}
      </Box>
      <Box
        component="footer"
        sx={{
          borderTop: '1px solid #e5e5e5',
          py: 4,
          mt: 'auto',
          textAlign: 'center',
          bgcolor: '#fff',
        }}
      >
        <Box sx={{ maxWidth: 1200, mx: 'auto', px: 2 }}>
          <Typography variant="body2" sx={{ color: '#0a0a0a', fontWeight: 600, mb: 1, letterSpacing: '0.05em', textTransform: 'uppercase', fontSize: '0.75rem' }}>
            Scaper
          </Typography>
          <Typography variant="body2" sx={{ color: '#737373', mb: 2 }}>
            Premium resort booking experience.
          </Typography>
          <Typography variant="caption" sx={{ color: '#a3a3a3' }}>
            © {new Date().getFullYear()} Scaper. All rights reserved.
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}

