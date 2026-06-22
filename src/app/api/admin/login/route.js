import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { SignJWT } from 'jose';
import { logActivity } from '@/lib/logger';

if (process.env.NODE_ENV === 'production' && !process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is not set. This is required in production.');
}

function getJwtSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET environment variable is not set. This is required.');
  }
  return new TextEncoder().encode(secret);
}

// Simple in-memory rate limiter (Warning: won't persist across serverless instances, but provides basic protection)
const rateLimitMap = new Map();
const MAX_ATTEMPTS = 5;
const LOCKOUT_TIME = 15 * 60 * 1000; // 15 minutes
export async function POST(request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    // Drop request.ip (removed in Next.js 16). Parse x-forwarded-for: first hop
    // is the real client when the request has been forwarded by a trusted proxy.
    const xff = request.headers.get('x-forwarded-for');
    const ip = (xff ? xff.split(',')[0].trim() : null)
      || request.headers.get('x-real-ip')
      || 'unknown';
    const currentTime = Date.now();
    const rateLimitData = rateLimitMap.get(ip) || { attempts: 0, lockoutUntil: 0 };

    if (currentTime < rateLimitData.lockoutUntil) {
      const remainingTime = Math.ceil((rateLimitData.lockoutUntil - currentTime) / 60000);
      return NextResponse.json({ error: `Too many login attempts. Please try again in ${remainingTime} minutes.` }, { status: 429 });
    }

    const admin = await prisma.adminUser.findUnique({
      where: { email },
    });

    if (!admin) {
      // Register failed attempt
      rateLimitData.attempts += 1;
      if (rateLimitData.attempts >= MAX_ATTEMPTS) rateLimitData.lockoutUntil = currentTime + LOCKOUT_TIME;
      rateLimitMap.set(ip, rateLimitData);
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const isValidPassword = await bcrypt.compare(password, admin.password);

    if (!isValidPassword) {
      // Register failed attempt
      rateLimitData.attempts += 1;
      if (rateLimitData.attempts >= MAX_ATTEMPTS) rateLimitData.lockoutUntil = currentTime + LOCKOUT_TIME;
      rateLimitMap.set(ip, rateLimitData);
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // Reset attempts on successful login
    rateLimitMap.delete(ip);

    const token = await new SignJWT({ id: admin.id, email: admin.email })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('24h')
      .sign(getJwtSecret());
      
    await logActivity(admin.email, 'LOGIN', { ip });

    const response = NextResponse.json({ success: true, message: 'Logged in successfully' });
    
    response.cookies.set('admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24, // 24 hours
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
