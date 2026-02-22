import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { checkRole } from '@/lib/apiAuth';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export async function GET(req: NextRequest) {
  const { authorized, session, response } = await checkRole('superadmin');

  if (!authorized) {
    return response;
  }

  try {
    const res = await axios.get(`${API_BASE_URL}/users`, {
      headers: { Authorization: `Bearer ${(session as any).accessToken}` },
    });
    return NextResponse.json(res.data, { status: res.status });
  } catch (error: any) {
    console.error('Get users error:', error?.response?.data || error.message || error);
    return NextResponse.json(
      { error: 'Failed to fetch users', details: error?.response?.data?.message },
      { status: error?.response?.status || 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const { authorized, session, response } = await checkRole('superadmin');

  if (!authorized) {
    return response;
  }

  const body = await req.json();

  try {
    const res = await axios.post(`${API_BASE_URL}/users`, body, {
      headers: { Authorization: `Bearer ${(session as any).accessToken}` },
    });
    return NextResponse.json(res.data, { status: res.status });
  } catch (error: any) {
    console.error('Create user error:', error?.response?.data || error.message || error);
    return NextResponse.json(
      { error: 'Failed to create user', details: error?.response?.data?.message },
      { status: error?.response?.status || 500 }
    );
  }
}
