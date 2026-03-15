import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = req.nextUrl;

  // DEBUG: log token and pathname for troubleshooting role-based redirects
  // Remove these logs after debugging
  // eslint-disable-next-line no-console
  console.log('[middleware] pathname=', pathname, ' token=', token);

  if (pathname.startsWith('/admin')) {
    if (!token || (token.role !== 'admin' && token.role !== 'superadmin' && token.role !== 'property_owner' && token.role !== 'manager')) {
      // Show 404 for unauthorized access instead of redirecting to login
      return NextResponse.rewrite(new URL('/404', req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
