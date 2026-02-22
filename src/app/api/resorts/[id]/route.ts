import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { checkRole } from '@/lib/apiAuth';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export async function GET(req: NextRequest, context: any) {
  const { params } = context;
  try {
    const res = await axios.get(`${API_BASE_URL}/resorts/${params.id}`);
    return NextResponse.json(res.data, { status: res.status });
  } catch (error: any) {
    console.error('Get resort error:', error?.response?.data || error.message || error);
    return NextResponse.json(
      { error: 'Failed to fetch resort', details: error?.response?.data?.message },
      { status: error?.response?.status || 500 }
    );
  }
}

export async function PUT(req: NextRequest, context: any) {
  const { params } = context;
  const { authorized, session, response } = await checkRole(['admin', 'superadmin']);

  if (!authorized) {
    return response;
  }

  const body = await req.json();

  try {
    const res = await axios.put(`${API_BASE_URL}/resorts/${params.id}`, body, {
      headers: { Authorization: `Bearer ${(session as any).accessToken}` },
    });
    return NextResponse.json(res.data, { status: res.status });
  } catch (error: any) {
    console.error('Update resort error:', error?.response?.data || error.message || error);
    return NextResponse.json(
      { error: 'Failed to update resort', details: error?.response?.data?.message },
      { status: error?.response?.status || 500 }
    );
  }
}

export async function DELETE(req: NextRequest, context: any) {
  const { params } = context;
  const { authorized, session, response } = await checkRole(['admin', 'superadmin']);

  if (!authorized) {
    return response;
  }

  try {
    const res = await axios.delete(`${API_BASE_URL}/resorts/${params.id}`, {
      headers: { Authorization: `Bearer ${(session as any).accessToken}` },
    });
    return NextResponse.json(res.data, { status: res.status });
  } catch (error: any) {
    console.error('Delete resort error:', error?.response?.data || error.message || error);
    return NextResponse.json(
      { error: 'Failed to delete resort', details: error?.response?.data?.message },
      { status: error?.response?.status || 500 }
    );
  }
}
