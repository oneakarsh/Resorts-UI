'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  Box,
} from '@mui/material';
import { signIn } from 'next-auth/react';

interface LoginDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  onSwitchToRegister: () => void;
}

export default function LoginDialog({
  open,
  onClose,
  onSuccess,
  onSwitchToRegister,
}: LoginDialogProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email || !password) return setError('Please enter email and password');

    try {
      setLoading(true);
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError('Invalid credentials');
      } else if (result?.ok) {
        onSuccess();
      }
    } catch {
      setError('Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          border: '1px solid #e5e5e5',
          boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
        },
      }}
    >
      <DialogTitle sx={{ fontWeight: 600, fontSize: '1.25rem', color: '#0a0a0a', pt: 3, pb: 0 }}>
        Log in
      </DialogTitle>
      <DialogContent sx={{ px: 3, pt: 2, pb: 1 }}>
        <Typography variant="body2" sx={{ color: '#737373', mb: 2 }}>
          Sign in to your Scaper account
        </Typography>
        {error && (
          <Alert severity="error" sx={{ mb: 2, borderRadius: 1.5 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}
        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            required
            size="small"
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 1.5,
                '& fieldset': { borderColor: '#e5e5e5' },
                '&.Mui-focused fieldset': { borderColor: '#0a0a0a' },
              },
            }}
          />
          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            required
            size="small"
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 1.5,
                '& fieldset': { borderColor: '#e5e5e5' },
                '&.Mui-focused fieldset': { borderColor: '#0a0a0a' },
              },
            }}
          />
        </Box>
      </DialogContent>
      <DialogActions sx={{ flexDirection: 'column', px: 3, pb: 3, pt: 0, gap: 2 }}>
        <Button
          type="submit"
          variant="contained"
          fullWidth
          size="medium"
          disabled={loading}
          onClick={handleSubmit}
          sx={{
            py: 1.25,
            borderRadius: 1.5,
            fontWeight: 500,
            bgcolor: '#0a0a0a',
            '&:hover': { bgcolor: '#262626' },
          }}
        >
          {loading ? <CircularProgress size={20} color="inherit" /> : 'Sign in'}
        </Button>
        <Typography variant="body2" sx={{ color: '#737373' }}>
          Don&apos;t have an account?{' '}
          <Button
            onClick={onSwitchToRegister}
            sx={{
              textTransform: 'none',
              p: 0,
              minWidth: 'auto',
              color: '#0a0a0a',
              fontWeight: 500,
              '&:hover': { bgcolor: 'transparent', textDecoration: 'underline' },
            }}
          >
            Sign up
          </Button>
        </Typography>
      </DialogActions>
    </Dialog>
  );
}
