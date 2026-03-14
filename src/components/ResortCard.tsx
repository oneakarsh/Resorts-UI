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
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { Resort } from '@/types';
import { useRouter } from 'next/navigation';

interface ResortCardProps {
  resort: Resort;
}

export default function ResortCard({ resort }: ResortCardProps) {
  const router = useRouter();
  const [wishlisted, setWishlisted] = useState(false);

  const handleBookNow = () => {
    const id = resort.id ?? resort._id;
    if (!id) return;
    router.push(`/resorts/${id}`);
  };

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 2,
        transition: 'all 0.2s ease',
        position: 'relative',
        boxShadow: 3,
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 6,
        },
      }}
    >
      {/* Wishlist */}
      <IconButton
        size="small"
        sx={{
          position: 'absolute',
          top: 8,
          right: 8,
          bgcolor: 'white',
          zIndex: 2,
        }}
        onClick={() => setWishlisted(!wishlisted)}
      >
        {wishlisted ? (
          <FavoriteIcon fontSize="small" color="error" />
        ) : (
          <FavoriteBorderIcon fontSize="small" />
        )}
      </IconButton>

      {/* Image */}
      <CardMedia
        sx={{
          height: 160,
        }}
        image={
          resort.images?.[0] ??
          `https://via.placeholder.com/400x300?text=${encodeURIComponent(
            resort.name
          )}`
        }
      />

      <CardContent sx={{ flexGrow: 1, p: 1.5 }}>
        <Stack spacing={0.75}>
          <Box display="flex" justifyContent="space-between" gap={1}>
            <Typography
              variant="subtitle1"
              fontWeight={600}
              noWrap
              sx={{ flexGrow: 1 }}
            >
              {resort.name}
            </Typography>

            <Typography
              variant="subtitle2"
              color="primary"
              fontWeight={600}
              whiteSpace="nowrap"
            >
              ${resort.pricePerNight}
              <Typography
                component="span"
                variant="caption"
                color="text.secondary"
              >
                {' '}
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
                sx={{ fontSize: '0.7rem', height: 22 }}
              />
            ))}
          </Box>

          <Typography variant="caption" color="text.secondary">
            📍 {resort.location}
          </Typography>

          <Typography variant="caption" color="text.secondary">
            👥 {resort.maxGuests} · 🛏️ {Array.isArray(resort.rooms) ? resort.rooms.length : (resort.rooms || 0)} rooms
          </Typography>
        </Stack>
      </CardContent>

      <CardActions sx={{ px: 1.5, pb: 1.5 }}>
        <Button
          fullWidth
          variant="contained"
          size="medium"
          onClick={handleBookNow}
          sx={{
            borderRadius: 2,
            textTransform: 'none',
            fontWeight: 600,
            fontSize: '0.9rem',
            py: 1,
          }}
        >
          View Resort
        </Button>
      </CardActions>
    </Card>
  );
}
