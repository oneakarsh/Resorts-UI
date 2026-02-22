import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export async function GET(req: NextRequest, context: any) {
  const { params } = context;
  const session = (await getServerSession(authOptions as any)) as any;
  if (!session?.user?.role || session.user.role !== 'superadmin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  try {
    const res = await axios.get(`${API_BASE_URL}/users/${params.id}`, {
      headers: { Authorization: `Bearer ${session.accessToken}` },
    });
    return NextResponse.json(res.data, { status: res.status });
  } catch (error: any) {
    console.error('Get user error:', error?.response?.data || error.message || error);
    return NextResponse.json({ error: 'Failed to fetch user' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, context: any) {
  const { params } = context;
  const session = (await getServerSession(authOptions as any)) as any;
  if (!session?.user?.role || session.user.role !== 'superadmin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const body = await req.json();

  try {
    const res = await axios.put(`${API_BASE_URL}/users/${params.id}`, body, {
      headers: { Authorization: `Bearer ${session.accessToken}` },
    });
    return NextResponse.json(res.data, { status: res.status });
  } catch (error: any) {
    console.error('Update user error:', error?.response?.data || error.message || error);
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, context: any) {
  const { params } = context;
  const session = (await getServerSession(authOptions as any)) as any;
  if (!session?.user?.role || session.user.role !== 'superadmin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  try {
    const res = await axios.delete(`${API_BASE_URL}/users/${params.id}`, {
      headers: { Authorization: `Bearer ${session.accessToken}` },
    });
    return NextResponse.json(res.data, { status: res.status });
  } catch (error: any) {
    console.error('Delete user error:', error?.response?.data || error.message || error);
    return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 });
  }
}
