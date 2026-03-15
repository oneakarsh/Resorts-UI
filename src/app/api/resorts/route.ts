import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { checkRole, getSessionOrUnauthorized } from '@/lib/apiAuth';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const params = new URLSearchParams();

    // Pass through filter parameters
    if (searchParams.get('amenities')) {
      params.append('amenities', searchParams.get('amenities') || '');
    }
    if (searchParams.get('minRate')) {
      params.append('minRate', searchParams.get('minRate') || '');
    }
    if (searchParams.get('maxRate')) {
      params.append('maxRate', searchParams.get('maxRate') || '');
    }
    if (searchParams.get('location')) {
      params.append('location', searchParams.get('location') || '');
    }

    const queryString = params.toString();
    const url = queryString ? `${API_BASE_URL}/resorts?${queryString}` : `${API_BASE_URL}/resorts`;

    const res = await axios.get(url);
    return NextResponse.json(res.data, { status: res.status });
  } catch (error: any) {
    console.error('Get resorts error:', error?.response?.data || error.message || error);
    return NextResponse.json(
      { error: 'Failed to fetch resorts', details: error?.response?.data?.message },
      { status: error?.response?.status || 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const { authorized, session, response } = await checkRole(['admin', 'superadmin']);

  if (!authorized) {
    return response || NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();

  try {
    const res = await axios.post(`${API_BASE_URL}/resorts`, body, {
      headers: { Authorization: `Bearer ${(session as any).accessToken}` },
    });
    return NextResponse.json(res.data, { status: res.status });
  } catch (error: any) {
    console.error('Create resort error:', error?.response?.data || error.message || error);
    return NextResponse.json(
      { error: 'Failed to create resort', details: error?.response?.data?.message },
      { status: error?.response?.status || 500 }
    );
  }
}
