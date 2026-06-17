import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

if (process.env.NODE_ENV === 'production' && !process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is not set. This is required in production.');
}

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'iaam_super_secret_key_2026');

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  // Only protect /admin routes
  if (pathname.startsWith('/admin')) {
    // Allow access to the login page without a token
    if (pathname === '/admin/login') {
      return NextResponse.next();
    }

    const token = request.cookies.get('admin_token')?.value;

    if (!token) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    try {
      await jwtVerify(token, JWT_SECRET);
      return NextResponse.next();
    } catch (error) {
      // Invalid or expired token
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }



  // Protect all other /api/admin routes except login and logout
  if (pathname.startsWith('/api/admin') && pathname !== '/api/admin/login' && pathname !== '/api/admin/logout') {
    const token = request.cookies.get('admin_token')?.value;
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
      await jwtVerify(token, JWT_SECRET);
      return NextResponse.next();
    } catch (error) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};
