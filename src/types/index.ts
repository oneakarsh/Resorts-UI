export interface User {
  id?: string;
  _id?: string;
  name: string;
  email: string;
  phone?: string;
  role: 'user' | 'property_owner' | 'manager' | 'admin' | 'superadmin';
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
  createdBy?: string;
  permissions?: string[];
}

export interface Resort {
  id?: string;
  _id?: string;
  name: string;
  description: string;
  location: string;
  latitude: number;
  longitude: number;
  pricePerNight: number;
  amenities: string[];
  maxGuests: number;
  rooms: number;
  rating?: number;
  image?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Booking {
  id?: string;
  _id?: string;
  userId: string;
  resortId: string;
  resort?: Resort;
  checkInDate: string;
  checkOutDate: string;
  numberOfGuests: number;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  specialRequests?: string;
  paymentMethod?: 'credit_card' | 'debit_card' | 'paypal';
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: User;
}
