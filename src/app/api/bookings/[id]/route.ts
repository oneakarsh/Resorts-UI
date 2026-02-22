import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { getSessionOrUnauthorized } from '@/lib/apiAuth';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export async function GET(req: NextRequest, context: any) {
  const { params } = context;
  const { authorized, session, response } = await getSessionOrUnauthorized();

  if (!authorized) {
    return response;
  }

  try {
    const res = await axios.get(`${API_BASE_URL}/bookings/${params.id}`, {
      headers: { Authorization: `Bearer ${(session as any).accessToken}` },
    });
    return NextResponse.json(res.data, { status: res.status });
  } catch (error: any) {
    console.error('Get booking error:', error?.response?.data || error.message || error);
    return NextResponse.json(
      { error: 'Failed to fetch booking', details: error?.response?.data?.message },
      { status: error?.response?.status || 500 }
    );
  }
}
