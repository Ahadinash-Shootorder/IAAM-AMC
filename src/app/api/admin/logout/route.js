import { NextResponse } from 'next/server';
import { logActivity } from '@/lib/logger';
import { jwtVerify } from 'jose';
import { getJwtSecret } from '@/lib/auth';

export async function POST(request) {
  const token = request.cookies.get('admin_token')?.value;
  if (token) {
    try {
      const { payload } = await jwtVerify(token, getJwtSecret());
      await logActivity(payload.email, 'LOGOUT');
    } catch (e) {
      // ignore
    }
  }

  const response = NextResponse.json({ success: true, message: 'Logged out successfully' });
  
  response.cookies.set('admin_token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0, // Immediately expire the cookie
  });

  return response;
}
