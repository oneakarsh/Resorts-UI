'use client';

import React from 'react';
import { Box, Typography, Button, Container } from '@mui/material';
import { useRouter } from 'next/navigation';
import { Home as HomeIcon } from '@mui/icons-material';

export default function NotFound() {
  const router = useRouter();

  return (
    <html lang="en">
      <body>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
            bgcolor: '#ffffff',
            px: 2,
          }}
        >
          <Container maxWidth="sm" sx={{ textAlign: 'center' }}>
            <Typography
              variant="h1"
              sx={{
                fontSize: '120px',
                fontWeight: 700,
                color: '#0a0a0a',
                mb: 2,
                lineHeight: 1,
              }}
            >
              404
            </Typography>

            <Typography
              variant="h4"
              sx={{
                fontWeight: 600,
                color: '#0a0a0a',
                mb: 1.5,
              }}
            >
              Page Not Found
            </Typography>

            <Typography
              variant="body1"
              sx={{
                color: '#737373',
                mb: 4,
                lineHeight: 1.6,
              }}
            >
              Sorry, the page you're looking for doesn't exist. It might have been moved or deleted.
            </Typography>

            <Button
              variant="contained"
              onClick={() => router.push('/')}
              startIcon={<HomeIcon />}
              sx={{
                bgcolor: '#0a0a0a',
                color: '#fff',
                fontWeight: 500,
                py: 1.5,
                px: 3,
                '&:hover': { bgcolor: '#262626' },
              }}
            >
              Go to Home
            </Button>
          </Container>
        </Box>
      </body>
    </html>
  );
}
