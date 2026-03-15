'use client';

import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Chip,
  IconButton,
  Stack,
} from '@mui/material';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import StarIcon from '@mui/icons-material/Star';
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
  const [isHovered, setIsHovered] = useState(false);

  const handleNavigate = () => {
    const id = resort.id ?? resort._id;
    if (!id) return;
    router.push(`/resorts/${id}`);
  };

  const imageUrl = (((resort as any).images?.[0]) ?? resort.image) ?? 
    `https://images.unsplash.com/photo-1540553016722-983e48a2cd10?auto=format&fit=crop&w=800&q=80`;

  return (
    <Card
      elevation={0}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleNavigate}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 4,
        position: 'relative',
        cursor: 'pointer',
        bgcolor: 'transparent',
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': {
          transform: 'translateY(-4px)',
        },
      }}
    >
      <Box sx={{ position: 'relative', overflow: 'hidden', borderRadius: 4, height: 280 }}>
        {promoted && (
          <Box
            sx={{
              position: 'absolute',
              top: 16,
              left: 16,
              zIndex: 2,
              px: 1.5,
              py: 0.5,
              borderRadius: 2,
              bgcolor: 'rgba(10, 10, 10, 0.8)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            <Typography
              variant="caption"
              sx={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#fff' }}
            >
              Featured
            </Typography>
          </Box>
        )}
        
        <IconButton
          size="small"
          onClick={(e) => {
            e.stopPropagation();
            setWishlisted(!wishlisted);
          }}
          sx={{
            position: 'absolute',
            top: 16,
            right: 16,
            bgcolor: 'rgba(255, 255, 255, 0.9)',
            zIndex: 2,
            backdropFilter: 'blur(4px)',
            '&:hover': { bgcolor: '#fff', transform: 'scale(1.1)' },
            transition: 'all 0.2s',
          }}
        >
          {wishlisted ? (
            <FavoriteIcon fontSize="small" sx={{ color: '#ef4444' }} />
          ) : (
            <FavoriteBorderIcon fontSize="small" sx={{ color: '#0a0a0a' }} />
          )}
        </IconButton>

        <CardMedia
          component="img"
          sx={{ 
            height: '100%', 
            width: '100%',
            objectFit: 'cover',
            transition: 'transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
            transform: isHovered ? 'scale(1.1)' : 'scale(1)',
          }}
          image={imageUrl}
          alt={resort.name}
        />
        
        {/* Subtle overlay for better legibility when we add text over image */}
        <Box 
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '40%',
            background: 'linear-gradient(to top, rgba(0,0,0,0.4) 0%, transparent 100%)',
            pointerEvents: 'none',
          }}
        />
      </Box>

      <CardContent sx={{ px: 1, py: 2, flexGrow: 1 }}>
        <Stack spacing={1}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography
              variant="h6"
              sx={{ 
                fontWeight: 700, 
                fontSize: '1.125rem', 
                color: '#0a0a0a',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitLineClamp: 1,
                WebkitBoxOrient: 'vertical',
              }}
            >
              {resort.name}
            </Typography>
            <Box display="flex" alignItems="center" gap={0.5}>
              <StarIcon sx={{ fontSize: 16, color: '#f59e0b' }} />
              <Typography variant="body2" sx={{ fontWeight: 600, color: '#0a0a0a' }}>
                {resort.rating || '4.8'}
              </Typography>
            </Box>
          </Box>

          <Typography 
            variant="body2" 
            sx={{ 
              color: '#737373', 
              fontSize: '0.875rem',
              display: '-webkit-box',
              WebkitLineClamp: 1,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden'
            }}
          >
            {resort.location}
          </Typography>

          <Box display="flex" gap={1} pt={0.5}>
            <Typography variant="body1" sx={{ fontWeight: 700, color: '#0a0a0a', fontSize: '1rem' }}>
              {formatRupee(resort.pricePerNight)}
            </Typography>
            <Typography variant="body1" sx={{ color: '#737373', fontSize: '0.875rem', alignSelf: 'center' }}>
              per night
            </Typography>
          </Box>

          <Box display="flex" gap={0.5} pt={1} flexWrap="wrap">
            {resort.amenities?.slice(0, 3).map((amenity) => (
              <Chip
                key={amenity}
                label={amenity}
                size="small"
                sx={{
                  height: 24,
                  fontSize: '0.65rem',
                  fontWeight: 600,
                  bgcolor: '#f5f5f5',
                  color: '#404040',
                  border: 'none',
                  '& .MuiChip-label': { px: 1 }
                }}
              />
            ))}
            {resort.amenities && resort.amenities.length > 3 && (
              <Typography variant="caption" sx={{ color: '#a3a3a3', alignSelf: 'center', ml: 0.5 }}>
                +{resort.amenities.length - 3} more
              </Typography>
            )}
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}
