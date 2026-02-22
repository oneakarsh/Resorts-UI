'use client';

import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material';

const theme = createTheme({
  palette: {
    primary: {
      main: '#0a0a0a',
      light: '#262626',
      dark: '#000000',
    },
    secondary: {
      main: '#737373',
      light: '#a3a3a3',
      dark: '#525252',
    },
    background: {
      default: '#fafafa',
      paper: '#ffffff',
    },
    text: {
      primary: '#0a0a0a',
      secondary: '#737373',
    },
  },
  typography: {
    fontFamily: '"DM Sans", "Inter", system-ui, sans-serif',
    h1: { fontWeight: 600, letterSpacing: '-0.02em' },
    h2: { fontWeight: 600, letterSpacing: '-0.02em' },
    h3: { fontWeight: 600, letterSpacing: '-0.01em' },
    h4: { fontWeight: 600 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
    button: { textTransform: 'none', fontWeight: 500 },
  },
  shape: {
    borderRadius: 6,
  },
  shadows: [
    'none',
    '0 1px 2px rgba(0,0,0,0.04)',
    '0 1px 3px rgba(0,0,0,0.06)',
    '0 2px 6px rgba(0,0,0,0.06)',
    '0 4px 12px rgba(0,0,0,0.06)',
    '0 8px 24px rgba(0,0,0,0.06)',
    '0 12px 32px rgba(0,0,0,0.06)',
    '0 16px 40px rgba(0,0,0,0.06)',
    '0 20px 48px rgba(0,0,0,0.06)',
    '0 24px 56px rgba(0,0,0,0.06)',
    '0 28px 64px rgba(0,0,0,0.06)',
    '0 32px 72px rgba(0,0,0,0.06)',
    '0 36px 80px rgba(0,0,0,0.06)',
    '0 40px 88px rgba(0,0,0,0.06)',
    '0 44px 96px rgba(0,0,0,0.06)',
    '0 48px 104px rgba(0,0,0,0.06)',
    '0 52px 112px rgba(0,0,0,0.06)',
    '0 56px 120px rgba(0,0,0,0.06)',
    '0 60px 128px rgba(0,0,0,0.06)',
    '0 64px 136px rgba(0,0,0,0.06)',
    '0 68px 144px rgba(0,0,0,0.06)',
    '0 72px 152px rgba(0,0,0,0.06)',
    '0 76px 160px rgba(0,0,0,0.06)',
    '0 80px 168px rgba(0,0,0,0.06)',
    '0 84px 176px rgba(0,0,0,0.06)',
  ],
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 6,
          fontWeight: 500,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 6,
        },
      },
    },
  },
});

export default function MuiProvider({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider theme={theme}>
      {children}
    </ThemeProvider>
  );
}
