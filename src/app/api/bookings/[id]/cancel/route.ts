import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { getSessionOrUnauthorized } from '@/lib/apiAuth';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export async function PATCH(req: NextRequest, context: any) {
  const { params } = context;
  const { authorized, session, response } = await getSessionOrUnauthorized();

  if (!authorized) {
    return response || NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const res = await axios.patch(`${API_BASE_URL}/bookings/${params.id}/cancel`, {}, {
      headers: { Authorization: `Bearer ${(session as any).accessToken}` },
    });
    return NextResponse.json(res.data, { status: res.status });
  } catch (error: any) {
    console.error('Cancel booking error:', error?.response?.data || error.message || error);
    return NextResponse.json(
      { error: 'Failed to cancel booking', details: error?.response?.data?.message },
      { status: error?.response?.status || 500 }
    );
  }
}
