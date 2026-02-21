'use client';

import React, { useEffect, useState } from 'react';
import {
  Typography,
  Box,
  Avatar,
  List,
  ListItem,
  ListItemText,
  Divider,
  Paper,
  CircularProgress,
  Alert,
} from '@mui/material';
import { useSession } from 'next-auth/react';
import { authAPI } from '@/lib/api';
import type { User } from '@/types';

type Profile = User & {
  createdAt?: string;
  joinedAt?: string;
};

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'loading') return;
    if (status !== 'authenticated' || !session) {
      setLoading(false);
      return;
    }

    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await authAPI.profile((session as any).accessToken);
        const payload = (res.data as any)?.data ?? res.data;
        const user: Profile = (payload?.user as Profile) ?? (payload as Profile);
        setProfile(user);
      } catch (err: unknown) {
        const e = err as { response?: { data?: { message?: string } }; message?: string };
        setError(e.response?.data?.message || e.message || 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [session, status]);

  if (loading) {
    return (
      <Box sx={{ py: 4, px: 2, maxWidth: 560, mx: 'auto', display: 'flex', justifyContent: 'center' }}>
        <CircularProgress sx={{ color: '#0a0a0a' }} />
      </Box>
    );
  }

  if (status !== 'authenticated') {
    return (
      <Box sx={{ py: 4, px: 2, maxWidth: 560, mx: 'auto' }}>
        <Alert severity="info" sx={{ borderRadius: 2 }}>
          Please log in to view your profile.
        </Alert>
      </Box>
    );
  }

  const joined =
    (profile?.createdAt && new Date(profile.createdAt).toLocaleDateString()) ||
    (profile?.joinedAt && new Date(profile.joinedAt).toLocaleDateString()) ||
    '';

  const initials = (profile?.name || session?.user?.name || 'U')
    .split(' ')
    .map((part) => part.charAt(0).toUpperCase())
    .slice(0, 2)
    .join('');

  return (
    <Box sx={{ py: 4, px: 2, maxWidth: 720, mx: 'auto' }}>
      {error && (
        <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
          {error}
        </Alert>
      )}

      <Paper
        variant="outlined"
        sx={{
          borderRadius: 3,
          borderColor: '#e5e5e5',
          boxShadow: '0 12px 40px rgba(0,0,0,0.04)',
          p: { xs: 2.5, md: 3 },
        }}
      >
        <Typography
          variant="overline"
          sx={{ color: '#a3a3a3', letterSpacing: '0.16em', mb: 1, display: 'block' }}
        >
          Profile
        </Typography>

        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: { xs: 'flex-start', sm: 'center' },
            gap: 2.5,
            mb: 2.5,
          }}
        >
          <Avatar
            sx={{
              width: 64,
              height: 64,
              bgcolor: '#0a0a0a',
              fontWeight: 600,
              fontSize: '1.25rem',
            }}
          >
            {initials}
          </Avatar>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#0a0a0a', mb: 0.5 }}>
              {profile?.name || session?.user?.name || 'Your account'}
            </Typography>
            <Typography variant="body2" sx={{ color: '#737373', mb: 0.25 }}>
              {profile?.email || session?.user?.email}
            </Typography>
            {profile?.phone && (
              <Typography variant="body2" sx={{ color: '#737373', mb: 0.25 }}>
                {profile.phone}
              </Typography>
            )}
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 0.75 }}>
              {joined && (
                <Typography
                  variant="caption"
                  sx={{
                    px: 1,
                    py: 0.5,
                    borderRadius: 999,
                    bgcolor: '#f5f5f5',
                    color: '#737373',
                  }}
                >
                  Joined {joined}
                </Typography>
              )}
              {profile?.role && (
                <Typography
                  variant="caption"
                  sx={{
                    px: 1,
                    py: 0.5,
                    borderRadius: 999,
                    bgcolor: '#f5f5f5',
                    color: '#737373',
                    textTransform: 'capitalize',
                  }}
                >
                  {profile.role}
                </Typography>
              )}
            </Box>
          </Box>
        </Box>

        <Divider sx={{ borderColor: '#e5e5e5', mb: 2 }} />

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
          <Box>
            <Typography variant="caption" sx={{ color: '#a3a3a3', letterSpacing: '0.08em' }}>
              EMAIL
            </Typography>
            <Typography variant="body2" sx={{ color: '#0a0a0a' }}>
              {profile?.email || session?.user?.email}
            </Typography>
          </Box>
          <Box>
            <Typography variant="caption" sx={{ color: '#a3a3a3', letterSpacing: '0.08em' }}>
              PHONE
            </Typography>
            <Typography variant="body2" sx={{ color: profile?.phone ? '#0a0a0a' : '#a3a3a3' }}>
              {profile?.phone || 'Not added'}
            </Typography>
          </Box>
          <Box>
            <Typography variant="caption" sx={{ color: '#a3a3a3', letterSpacing: '0.08em' }}>
              ROLE
            </Typography>
            <Typography variant="body2" sx={{ color: '#0a0a0a', textTransform: 'capitalize' }}>
              {profile?.role || 'user'}
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}
