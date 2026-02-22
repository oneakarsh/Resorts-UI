import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { checkRole } from '@/lib/apiAuth';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export async function GET(req: NextRequest) {
  const { authorized, session, response } = await checkRole(['admin', 'superadmin']);

  if (!authorized) {
    return response;
  }

  try {
    const res = await axios.get(`${API_BASE_URL}/bookings/admin/all`, {
      headers: { Authorization: `Bearer ${(session as any).accessToken}` },
    });
    return NextResponse.json(res.data, { status: res.status });
  } catch (error: any) {
    console.error('Get admin bookings error:', error?.response?.data || error.message || error);
    return NextResponse.json(
      { error: 'Failed to fetch all bookings', details: error?.response?.data?.message },
      { status: error?.response?.status || 500 }
    );
  }
}
