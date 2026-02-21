'use client';

import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Button,
  Typography,
  Box,
  Chip,
  IconButton,
  Stack,
} from '@mui/material';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { Resort } from '@/types';
import { useRouter } from 'next/navigation';
import { formatRupee } from '@/lib/formatRupee';

interface ResortCardProps {
  resort: Resort;
  promoted?: boolean;
}

export default function ResortCard({ resort, promoted }: ResortCardProps) {
  const router = useRouter();
  const [wishlisted, setWishlisted] = useState(false);

  const handleBookNow = () => {
    const id = resort.id ?? resort._id;
    if (!id) return;
    router.push(`/resorts/${id}`);
  };

  return (
    <Card
      elevation={0}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 2,
        border: '1px solid #e5e5e5',
        overflow: 'hidden',
        transition: 'border-color 0.2s, box-shadow 0.2s',
        '&:hover': {
          borderColor: '#d4d4d4',
          boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
        },
      }}
    >
      <Box sx={{ position: 'relative' }}>
        {promoted && (
          <Box
            sx={{
              position: 'absolute',
              top: 10,
              left: 10,
              zIndex: 1,
              px: 1,
              py: 0.25,
              borderRadius: 999,
              bgcolor: 'rgba(255,255,255,0.9)',
              border: '1px solid #e5e5e5',
            }}
          >
            <Typography
              variant="caption"
              sx={{ fontSize: '0.7rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#737373' }}
            >
              Promoted
            </Typography>
          </Box>
        )}
        <IconButton
          size="small"
          onClick={() => setWishlisted(!wishlisted)}
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            bgcolor: 'rgba(255,255,255,0.9)',
            zIndex: 1,
            '&:hover': { bgcolor: '#fff' },
          }}
        >
          {wishlisted ? (
            <FavoriteIcon fontSize="small" sx={{ color: '#dc2626' }} />
          ) : (
            <FavoriteBorderIcon fontSize="small" sx={{ color: '#737373' }} />
          )}
        </IconButton>

        <CardMedia
          sx={{ height: 180 }}
          image={
            resort.images?.[0] ??
            `https://via.placeholder.com/400x300?text=${encodeURIComponent(resort.name)}`
          }
        />
      </Box>

      <CardContent sx={{ flexGrow: 1, p: 2 }}>
        <Stack spacing={1}>
          <Box display="flex" justifyContent="space-between" alignItems="flex-start" gap={1}>
            <Typography
              variant="subtitle1"
              fontWeight={600}
              noWrap
              sx={{ flexGrow: 1, fontSize: '0.9375rem', letterSpacing: '-0.01em' }}
            >
              {resort.name}
            </Typography>
            <Typography variant="subtitle2" fontWeight={600} sx={{ color: '#0a0a0a', whiteSpace: 'nowrap' }}>
              {formatRupee(resort.pricePerNight)}
              <Typography component="span" variant="caption" sx={{ color: '#737373', fontWeight: 400 }}>
                /night
              </Typography>
            </Typography>
          </Box>

          <Box display="flex" gap={0.5} flexWrap="wrap">
            {resort.amenities?.slice(0, 3).map((amenity) => (
              <Chip
                key={amenity}
                label={amenity}
                size="small"
                variant="outlined"
                sx={{
                  fontSize: '0.6875rem',
                  height: 20,
                  borderColor: '#e5e5e5',
                  color: '#737373',
                }}
              />
            ))}
          </Box>

          <Typography variant="caption" sx={{ color: '#737373' }}>
            {resort.location}
          </Typography>
          <Typography variant="caption" sx={{ color: '#737373' }}>
            {resort.maxGuests} guests · {resort.rooms} rooms
          </Typography>
        </Stack>
      </CardContent>

      <CardActions sx={{ px: 2, pb: 2, pt: 0 }}>
        <Button
          fullWidth
          variant="outlined"
          size="medium"
          onClick={handleBookNow}
          sx={{
            borderRadius: 1.5,
            fontWeight: 500,
            fontSize: '0.875rem',
            py: 1,
            borderColor: '#0a0a0a',
            color: '#0a0a0a',
            '&:hover': {
              borderColor: '#0a0a0a',
              bgcolor: 'rgba(0,0,0,0.04)',
            },
          }}
        >
          View resort
        </Button>
      </CardActions>
    </Card>
  );
}
