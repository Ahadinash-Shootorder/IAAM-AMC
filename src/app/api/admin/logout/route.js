import { NextResponse } from 'next/server';
import { logActivity } from '@/lib/logger';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'iaam_super_secret_key_2026');

export async function POST(request) {
  const token = request.cookies.get('admin_token')?.value;
  if (token) {
    try {
      const { payload } = await jwtVerify(token, JWT_SECRET);
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
