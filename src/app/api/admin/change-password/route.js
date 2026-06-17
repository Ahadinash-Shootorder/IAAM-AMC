import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { jwtVerify } from 'jose';
import { logActivity } from '@/lib/logger';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'iaam_super_secret_key_2026');

export async function POST(request) {
  try {
    const token = request.cookies.get('admin_token')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    let payload;
    try {
      const verified = await jwtVerify(token, JWT_SECRET);
      payload = verified.payload;
    } catch (e) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { currentPassword, newPassword } = await request.json();

    if (!currentPassword || !newPassword || newPassword.length < 6) {
      return NextResponse.json({ error: 'Invalid input. New password must be at least 6 characters.' }, { status: 400 });
    }

    const admin = await prisma.adminUser.findUnique({
      where: { id: payload.id },
    });

    if (!admin) {
      return NextResponse.json({ error: 'Admin not found' }, { status: 404 });
    }

    const isValidPassword = await bcrypt.compare(currentPassword, admin.password);

    if (!isValidPassword) {
      return NextResponse.json({ error: 'Incorrect current password' }, { status: 400 });
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    await prisma.adminUser.update({
      where: { id: admin.id },
      data: { password: hashedNewPassword },
    });

    await logActivity(admin.email, 'CHANGE_PASSWORD');

    return NextResponse.json({ success: true, message: 'Password updated successfully' });
  } catch (error) {
    console.error('Password change error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
