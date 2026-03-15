import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { getSessionOrUnauthorized } from '@/lib/apiAuth';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export async function GET(req: NextRequest) {
  const { authorized, session, response } = await getSessionOrUnauthorized();

  if (!authorized) {
    return response || NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const res = await axios.get(`${API_BASE_URL}/bookings`, {
      headers: { Authorization: `Bearer ${(session as any).accessToken}` },
    });
    return NextResponse.json(res.data, { status: res.status });
  } catch (error: any) {
    console.error('Get bookings error:', error?.response?.data || error.message || error);
    return NextResponse.json(
      { error: 'Failed to fetch bookings', details: error?.response?.data?.message },
      { status: error?.response?.status || 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const { authorized, session, response } = await getSessionOrUnauthorized();

  if (!authorized) {
    return response || NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();

  try {
    const res = await axios.post(`${API_BASE_URL}/bookings`, body, {
      headers: { Authorization: `Bearer ${(session as any).accessToken}` },
    });
    return NextResponse.json(res.data, { status: res.status });
  } catch (error: any) {
    console.error('Create booking error:', error?.response?.data || error.message || error);
    return NextResponse.json(
      { error: 'Failed to create booking', details: error?.response?.data?.message },
      { status: error?.response?.status || 500 }
    );
  }
}
