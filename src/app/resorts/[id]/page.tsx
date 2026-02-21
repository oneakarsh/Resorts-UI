'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Chip,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
  Divider,
  Paper,
} from '@mui/material';
import { formatRupee } from '@/lib/formatRupee';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import { Resort } from '@/types';
import { resortAPI, bookingAPI } from '@/lib/api';

export default function BookingPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session, status } = useSession();
  const id = params.id as string;

  const [resort, setResort] = useState<Resort | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Booking form state
  const [checkInDate, setCheckInDate] = useState<Dayjs | null>(dayjs());
  const [checkOutDate, setCheckOutDate] = useState<Dayjs | null>(dayjs().add(1, 'day'));
  const [numberOfGuests, setNumberOfGuests] = useState(1);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [bookingLoading, setBookingLoading] = useState(false);

  // Payment state
  const [showPayment, setShowPayment] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardName, setCardName] = useState('');

  const AMENITY_ADDON_RUPEES = 4000;

  const getNearbyAttractions = (location: string) => {
    switch (location.toLowerCase()) {
      case 'maldives':
        return [
          { name: 'Coral Garden Reef', distance: '1.8 km', type: 'Snorkeling' },
          { name: 'Lagoon Sandbank', distance: '3.2 km', type: 'Beach' },
          { name: 'Sunset Pier', distance: '0.9 km', type: 'Viewpoint' },
        ];
      case 'hawaii':
        return [
          { name: 'Hidden Bay Lookout', distance: '2.4 km', type: 'Viewpoint' },
          { name: 'Tropical Falls Trail', distance: '4.1 km', type: 'Hiking' },
          { name: 'Local Farmers Market', distance: '1.2 km', type: 'Market' },
        ];
      case 'dubai':
        return [
          { name: 'Desert Dune Point', distance: '5.0 km', type: 'Desert tour' },
          { name: 'Old Souk District', distance: '7.3 km', type: 'Market' },
          { name: 'City Skyline Deck', distance: '3.6 km', type: 'Viewpoint' },
        ];
      default:
        return [
          { name: 'Old Town Square', distance: '1.4 km', type: 'Historic' },
          { name: 'Riverside Promenade', distance: '2.1 km', type: 'Walk' },
          { name: 'Local Art Museum', distance: '2.9 km', type: 'Culture' },
        ];
    }
  };

  useEffect(() => {
    const fetchResort = async () => {
      try {
        setLoading(true);
        const response = await resortAPI.getById(id);
        const resortData = response.data?.data || response.data;
        setResort(resortData);
      } catch (err) {
        console.error('Failed to fetch resort:', err);
        setError('Failed to load resort details');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchResort();
    }
  }, [id]);

  const calculateNights = () => {
    if (!checkInDate || !checkOutDate) return 0;
    return checkOutDate.diff(checkInDate, 'day');
  };

  const calculateTotalPrice = () => {
    if (!resort) return 0;
    const nights = calculateNights();
    const basePrice = nights * resort.pricePerNight;
    const amenityPrice = selectedAmenities.length * AMENITY_ADDON_RUPEES;
    return basePrice + amenityPrice;
  };

  const handleAmenityToggle = (amenity: string) => {
    setSelectedAmenities(prev =>
      prev.includes(amenity)
        ? prev.filter(a => a !== amenity)
        : [...prev, amenity]
    );
  };

  const handleProceedToPayment = () => {
    if (!checkInDate || !checkOutDate || numberOfGuests < 1) {
      setError('Please fill in all required fields');
      return;
    }
    setError(null);
    setShowPayment(true);
  };

  const handleBookingSubmit = async () => {
    if (!resort || !checkInDate || !checkOutDate) return;

    if (status !== 'authenticated' || !session) {
      router.push('/login');
      return;
    }

    try {
      setBookingLoading(true);
      const bookingData = {
        resortId: resort.id,
        checkInDate: checkInDate.format('YYYY-MM-DD'),
        checkOutDate: checkOutDate.format('YYYY-MM-DD'),
        numberOfGuests,
        selectedAmenities,
        totalPrice: calculateTotalPrice(),
      };

      // Pass the access token to the API call
      const response = await bookingAPI.create(bookingData, session.accessToken);
      const booking = response.data?.data || response.data;

      // Redirect to success page or bookings
      router.push('/bookings');
    } catch (err: unknown) {
      console.error('Booking failed:', err);
      setError((err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Booking failed');
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
        <CircularProgress sx={{ color: '#0a0a0a' }} />
      </Box>
    );
  }

  if (error && !resort) {
    return (
      <Box sx={{ maxWidth: 560, mx: 'auto', px: 2, py: 4 }}>
        <Alert severity="error" sx={{ borderRadius: 2 }}>{error}</Alert>
      </Box>
    );
  }

  if (!resort) {
    return (
      <Box sx={{ maxWidth: 560, mx: 'auto', px: 2, py: 4 }}>
        <Alert severity="error" sx={{ borderRadius: 2 }}>Resort not found</Alert>
      </Box>
    );
  }

  const attractions = getNearbyAttractions(resort.location);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ py: 4, px: 2, maxWidth: 1100, mx: 'auto' }}>
        <Typography variant="h5" component="h1" sx={{ fontWeight: 600, color: '#0a0a0a', mb: 0.5 }}>
          Book {resort.name}
        </Typography>
        <Typography variant="body2" sx={{ color: '#737373', mb: 2 }}>
          {resort.location}
        </Typography>

        <Grid container spacing={3}>
            {/* Resort Details */}
            <Grid size={{ xs: 12, md: 8 }}>
              <Card variant="outlined" sx={{ borderColor: '#e5e5e5', boxShadow: 'none', borderRadius: 2, overflow: 'hidden' }}>
                <CardMedia
                  component="img"
                  height="280"
                  image={resort.images?.[0] || 'https://via.placeholder.com/400x300?text=No+Image'}
                  alt={resort.name}
                />
                <CardContent sx={{ p: 2.5 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, color: '#0a0a0a', mb: 1 }}>
                    {resort.name}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#737373', mb: 1.5, lineHeight: 1.6 }}>
                    {resort.description}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#737373', mb: 1.5 }}>
                    {resort.location}
                  </Typography>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#0a0a0a', mb: 2 }}>
                    {formatRupee(resort.pricePerNight)} per night
                  </Typography>

                  <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#0a0a0a', mb: 1 }}>
                    Amenities
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75 }}>
                    {resort.amenities.map((amenity) => (
                      <Chip
                        key={amenity}
                        label={amenity}
                        size="small"
                        variant={selectedAmenities.includes(amenity) ? 'filled' : 'outlined'}
                        onClick={() => handleAmenityToggle(amenity)}
                        sx={{
                          cursor: 'pointer',
                          borderColor: '#e5e5e5',
                          bgcolor: selectedAmenities.includes(amenity) ? '#0a0a0a' : 'transparent',
                          color: selectedAmenities.includes(amenity) ? '#fff' : '#737373',
                          fontWeight: 500,
                          '&:hover': { borderColor: '#0a0a0a' },
                        }}
                      />
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </Grid>

          {/* Booking Form */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Paper variant="outlined" sx={{ p: 2.5, borderColor: '#e5e5e5', boxShadow: 'none', borderRadius: 2 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#0a0a0a', mb: 2 }}>
                Booking details
              </Typography>

              {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <DatePicker
                  label="Check-in Date"
                  value={checkInDate}
                  onChange={setCheckInDate}
                  minDate={dayjs()}
                  slotProps={{ textField: { fullWidth: true } }}
                />

                <DatePicker
                  label="Check-out Date"
                  value={checkOutDate}
                  onChange={setCheckOutDate}
                  minDate={checkInDate || dayjs()}
                  slotProps={{ textField: { fullWidth: true } }}
                />

                <TextField
                  label="Number of Guests"
                  type="number"
                  value={numberOfGuests}
                  onChange={(e) => setNumberOfGuests(parseInt(e.target.value) || 1)}
                  inputProps={{ min: 1, max: resort.maxGuests }}
                  fullWidth
                />

                <FormControl fullWidth>
                  <InputLabel>Selected Amenities</InputLabel>
                  <Select
                    multiple
                    value={selectedAmenities}
                    onChange={(e) => setSelectedAmenities(e.target.value as string[])}
                    renderValue={(selected) => selected.join(', ')}
                  >
                    {resort.amenities.map((amenity) => (
                      <MenuItem key={amenity} value={amenity}>
                        {amenity}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <Divider sx={{ my: 2 }} />

                <Box>
                  <Typography variant="body2">
                    {calculateNights()} nights × {formatRupee(resort.pricePerNight)} = {formatRupee(calculateNights() * resort.pricePerNight)}
                  </Typography>
                  <Typography variant="body2">
                    Amenities: {selectedAmenities.length} × {formatRupee(AMENITY_ADDON_RUPEES)} = {formatRupee(selectedAmenities.length * AMENITY_ADDON_RUPEES)}
                  </Typography>
                  <Typography variant="h6" sx={{ mt: 1 }}>
                    Total: {formatRupee(calculateTotalPrice())}
                  </Typography>
                </Box>

                {!showPayment ? (
                  <Button
                    variant="contained"
                    size="medium"
                    onClick={handleProceedToPayment}
                    fullWidth
                    sx={{
                      py: 1.25,
                      fontWeight: 500,
                      bgcolor: '#0a0a0a',
                      '&:hover': { bgcolor: '#262626' },
                    }}
                  >
                    Proceed to payment
                  </Button>
                ) : (
                  <>
                    <Divider sx={{ my: 2, borderColor: '#e5e5e5' }} />
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#0a0a0a', mb: 1.5 }}>
                      Payment
                    </Typography>

                    <TextField
                      label="Card number"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      fullWidth
                      size="small"
                      placeholder="1234 5678 9012 3456"
                      sx={{ mb: 1.5, '& .MuiOutlinedInput-root': { borderRadius: 1.5 }, '& .MuiOutlinedInput-root fieldset': { borderColor: '#e5e5e5' } }}
                    />

                    <Box sx={{ display: 'flex', gap: 1, mb: 1.5 }}>
                      <TextField
                        label="Expiry"
                        value={expiryDate}
                        onChange={(e) => setExpiryDate(e.target.value)}
                        placeholder="MM/YY"
                        size="small"
                        sx={{ flex: 1, '& .MuiOutlinedInput-root': { borderRadius: 1.5 }, '& .MuiOutlinedInput-root fieldset': { borderColor: '#e5e5e5' } }}
                      />
                      <TextField
                        label="CVV"
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value)}
                        placeholder="123"
                        size="small"
                        sx={{ flex: 1, '& .MuiOutlinedInput-root': { borderRadius: 1.5 }, '& .MuiOutlinedInput-root fieldset': { borderColor: '#e5e5e5' } }}
                      />
                    </Box>

                    <TextField
                      label="Name on card"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      fullWidth
                      size="small"
                      sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: 1.5 }, '& .MuiOutlinedInput-root fieldset': { borderColor: '#e5e5e5' } }}
                    />

                    <Button
                      variant="contained"
                      size="medium"
                      onClick={handleBookingSubmit}
                      disabled={bookingLoading}
                      fullWidth
                      sx={{
                        py: 1.25,
                        fontWeight: 500,
                        bgcolor: '#0a0a0a',
                        '&:hover': { bgcolor: '#262626' },
                      }}
                    >
                      {bookingLoading ? <CircularProgress size={20} color="inherit" /> : 'Complete booking'}
                    </Button>
                  </>
                )}
              </Box>
            </Paper>
          </Grid>
        </Grid>

        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, color: '#0a0a0a', mb: 1.5 }}>
            Nearby attractions
          </Typography>
          <Typography variant="body2" sx={{ color: '#737373', mb: 2, display: 'block' }}>
            Swipe or scroll to explore
          </Typography>
          <Box
            className="attractions-swipe"
            sx={{
              display: 'flex',
              gap: 2,
              overflowX: 'auto',
              pb: 2,
              scrollSnapType: 'x mandatory',
              WebkitOverflowScrolling: 'touch',
              '& > *': { scrollSnapAlign: 'start', flexShrink: 0 },
              scrollbarWidth: 'thin',
            }}
          >
            {attractions.map((attraction) => (
              <Card
                key={attraction.name}
                variant="outlined"
                sx={{
                  minWidth: 280,
                  maxWidth: 320,
                  borderRadius: 2,
                  borderColor: '#e5e5e5',
                  boxShadow: 'none',
                  transition: 'border-color 0.2s, box-shadow 0.2s',
                  '&:hover': { borderColor: '#d4d4d4', boxShadow: '0 4px 12px rgba(0,0,0,0.06)' },
                }}
              >
                <CardContent sx={{ p: 2.5 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#0a0a0a', mb: 0.5 }}>
                    {attraction.name}
                  </Typography>
                  <Chip
                    label={attraction.type}
                    size="small"
                    sx={{
                      fontSize: '0.75rem',
                      height: 22,
                      mb: 1,
                      bgcolor: 'rgba(0,0,0,0.06)',
                      color: '#0a0a0a',
                      border: 'none',
                    }}
                  />
                  <Typography variant="body2" sx={{ color: '#737373' }}>
                    {attraction.distance} away
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Box>
        </Box>
      </Box>
    </LocalizationProvider>
  );
}