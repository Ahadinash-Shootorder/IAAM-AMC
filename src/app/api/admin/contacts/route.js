import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { logActivity } from '@/lib/logger';
import { jwtVerify } from 'jose';
import { getJwtSecret } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    const url = new URL(request.url);
    const status = url.searchParams.get('status');

    const queries = await prisma.contactQuery.findMany({
      where: status ? { status } : undefined,
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ queries });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch contact queries' }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const { id, status } = await request.json();

    if (!id || !status) {
      return NextResponse.json({ error: 'ID and status are required' }, { status: 400 });
    }

    const updated = await prisma.contactQuery.update({
      where: { id },
      data: { status }
    });

    try {
      const token = request.cookies.get('admin_token')?.value;
      if (token) {
        const { payload } = await jwtVerify(token, getJwtSecret());
        await logActivity(payload.email, 'UPDATE_CONTACT_STATUS', { id, status });
      }
    } catch (e) {}

    return NextResponse.json({ success: true, query: updated });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update contact query' }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { id } = await request.json();

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    await prisma.contactQuery.delete({
      where: { id }
    });

    try {
      const token = request.cookies.get('admin_token')?.value;
      if (token) {
        const { payload } = await jwtVerify(token, getJwtSecret());
        await logActivity(payload.email, 'DELETE_CONTACT_QUERY', { id });
      }
    } catch (e) {}

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete contact query' }, { status: 500 });
  }
}
