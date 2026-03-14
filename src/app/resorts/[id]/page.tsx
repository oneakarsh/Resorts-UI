'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import {
  Box,
  Container,
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
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import { Resort } from '@/types';
import { resortAPI, bookingAPI } from '@/lib/api';
import LoginDialog from '@/components/LoginDialog';
import RegisterDialog from '@/components/RegisterDialog';

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

  // Auth dialogs
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

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
    const amenityPrice = selectedAmenities.length * 50; // Assuming $50 per amenity
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
    
    // Check if authenticated before showing payment
    if (status !== 'authenticated') {
      setShowLogin(true);
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
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error && !resort) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  if (!resort) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="error">Resort not found</Alert>
      </Container>
    );
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ py: 4, px: 2 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Book {resort.name}
        </Typography>
        <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2 }}>
          ID: {resort.id ?? resort._id}
        </Typography>

        <Grid container spacing={4}>
          {/* Resort Details */}
          <Grid size={{ xs: 12, md: 8 }}>
            <Card>
              <CardMedia
                component="img"
                height="300"
                image={resort.images?.[0] || 'https://via.placeholder.com/400x300?text=No+Image'}
                alt={resort.name}
              />
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  {resort.name}
                </Typography>
                <Typography variant="body1" color="text.secondary" paragraph>
                  {resort.description}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  📍 {resort.location}
                </Typography>
                <Typography variant="h6" color="primary" sx={{ mt: 2 }}>
                  ${resort.pricePerNight} per night
                </Typography>

                <Box sx={{ mt: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Available Amenities
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {resort.amenities.map((amenity) => (
                      <Chip
                        key={amenity}
                        label={amenity}
                        variant={selectedAmenities.includes(amenity) ? 'filled' : 'outlined'}
                        onClick={() => handleAmenityToggle(amenity)}
                        sx={{ cursor: 'pointer' }}
                      />
                    ))}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Booking Form */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Booking Details
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
                    {calculateNights()} nights × ${resort.pricePerNight} = ${calculateNights() * resort.pricePerNight}
                  </Typography>
                  <Typography variant="body2">
                    Amenities: {selectedAmenities.length} × $50 = ${selectedAmenities.length * 50}
                  </Typography>
                  <Typography variant="h6" sx={{ mt: 1 }}>
                    Total: ${calculateTotalPrice()}
                  </Typography>
                </Box>

                {!showPayment ? (
                  <Button
                    variant="contained"
                    size="large"
                    onClick={handleProceedToPayment}
                    fullWidth
                  >
                    Proceed to Payment
                  </Button>
                ) : (
                  <>
                    <Divider sx={{ my: 2 }} />
                    <Typography variant="h6" gutterBottom>
                      Payment Details
                    </Typography>

                    <TextField
                      label="Card Number"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      fullWidth
                      placeholder="1234 5678 9012 3456"
                    />

                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <TextField
                        label="Expiry Date"
                        value={expiryDate}
                        onChange={(e) => setExpiryDate(e.target.value)}
                        placeholder="MM/YY"
                        sx={{ flex: 1 }}
                      />
                      <TextField
                        label="CVV"
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value)}
                        placeholder="123"
                        sx={{ flex: 1 }}
                      />
                    </Box>

                    <TextField
                      label="Cardholder Name"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      fullWidth
                    />

                    <Button
                      variant="contained"
                      size="large"
                      onClick={handleBookingSubmit}
                      disabled={bookingLoading}
                      fullWidth
                      sx={{ mt: 2 }}
                    >
                      {bookingLoading ? <CircularProgress size={20} /> : 'Complete Booking'}
                    </Button>
                  </>
                )}
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Box>

      {/* Auth Dialogs */}
      <LoginDialog 
        open={showLogin} 
        onClose={() => setShowLogin(false)} 
        onSuccess={() => {
          setShowLogin(false);
          setShowPayment(true);
        }}
        onSwitchToRegister={() => {
          setShowLogin(false);
          setShowRegister(true);
        }}
      />
      <RegisterDialog 
        open={showRegister} 
        onClose={() => setShowRegister(false)} 
        onSuccess={() => {
          setShowRegister(false);
          setShowLogin(true);
        }}
        onSwitchToLogin={() => {
          setShowRegister(false);
          setShowLogin(true);
        }}
      />
    </LocalizationProvider>
  );
}