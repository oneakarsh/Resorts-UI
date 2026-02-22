import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { checkRole } from '@/lib/apiAuth';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export async function PATCH(req: NextRequest, context: any) {
  const { params } = context;
  const { authorized, session, response } = await checkRole(['admin', 'superadmin']);

  if (!authorized) {
    return response;
  }

  const body = await req.json();

  try {
    const res = await axios.patch(`${API_BASE_URL}/bookings/${params.id}/status`, body, {
      headers: { Authorization: `Bearer ${(session as any).accessToken}` },
    });
    return NextResponse.json(res.data, { status: res.status });
  } catch (error: any) {
    console.error('Update booking status error:', error?.response?.data || error.message || error);
    return NextResponse.json(
      { error: 'Failed to update booking status', details: error?.response?.data?.message },
      { status: error?.response?.status || 500 }
    );
  }
}
