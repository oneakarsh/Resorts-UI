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
  IconButton,
  InputAdornment,
  Box,
} from '@mui/material';
import { authAPI } from '@/lib/api';
import { Visibility, VisibilityOff } from '@mui/icons-material';

interface RegisterDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  onSwitchToLogin: () => void;
}

export default function RegisterDialog({
  open,
  onClose,
  onSuccess,
  onSwitchToLogin,
}: RegisterDialogProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!name || !email || !password) return setError('Please fill the required fields');
    if (password.length < 6) return setError('Password should be at least 6 characters');
    if (password !== confirmPassword) return setError('Passwords do not match');

    try {
      setLoading(true);
      const res = await authAPI.register({ name, email, password, confirmPassword, phone });
      const data = res.data;
      if (data) {
        onSuccess();
        onSwitchToLogin();
      } else {
        setError((data as { message?: string })?.message || 'Registration failed');
      }
    } catch (err: unknown) {
      const errObj = err as { response?: { data?: { message?: string } }; message?: string };
      setError(errObj?.response?.data?.message || errObj?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const inputSx = {
    '& .MuiOutlinedInput-root': {
      borderRadius: 1.5,
      '& fieldset': { borderColor: '#e5e5e5' },
      '&.Mui-focused fieldset': { borderColor: '#0a0a0a' },
    },
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
        Create account
      </DialogTitle>
      <DialogContent sx={{ px: 3, pt: 2, pb: 1 }}>
        <Typography variant="body2" sx={{ color: '#737373', mb: 2 }}>
          Join Scaper and start booking resorts
        </Typography>
        {error && (
          <Alert severity="error" sx={{ mb: 2, borderRadius: 1.5 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}
        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="Full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
            required
            size="small"
            sx={inputSx}
          />
          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            required
            size="small"
            sx={inputSx}
          />
          <TextField
            label="Phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            fullWidth
            size="small"
            sx={inputSx}
          />
          <TextField
            label="Password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            required
            size="small"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword((p) => !p)} edge="end" size="small">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={inputSx}
          />
          <TextField
            label="Confirm password"
            type={showConfirmPassword ? 'text' : 'password'}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            fullWidth
            required
            size="small"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowConfirmPassword((p) => !p)} edge="end" size="small">
                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={inputSx}
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
          {loading ? <CircularProgress size={20} color="inherit" /> : 'Create account'}
        </Button>
        <Typography variant="body2" sx={{ color: '#737373' }}>
          Already have an account?{' '}
          <Button
            onClick={onSwitchToLogin}
            sx={{
              textTransform: 'none',
              p: 0,
              minWidth: 'auto',
              color: '#0a0a0a',
              fontWeight: 500,
              '&:hover': { bgcolor: 'transparent', textDecoration: 'underline' },
            }}
          >
            Sign in
          </Button>
        </Typography>
      </DialogActions>
    </Dialog>
  );
}
