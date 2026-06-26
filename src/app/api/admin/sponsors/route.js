import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { backupCollection } from '@/lib/backup';

export async function GET() {
  try {
    const items = await prisma.sponsor.findMany({ orderBy: { order: 'asc' } });
    return NextResponse.json(items);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    let data;
    try {
      data = await req.json();
    } catch {
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
    }

    if (!data.name || typeof data.name !== 'string' || !data.name.trim()) {
      return NextResponse.json({ error: 'Sponsor name is required' }, { status: 400 });
    }

    const item = await prisma.sponsor.create({
      data: { name: data.name.trim(), logo: data.logo || null, websiteUrl: data.websiteUrl || null, tier: data.tier || 'standard', order: Math.max(0, parseInt(data.order) || 0) }
    });
    
    // Backup
    const allItems = await prisma.sponsor.findMany({ orderBy: { order: 'asc' } });
    backupCollection('sponsors', allItems).catch(console.error);

    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
