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
    const data = await req.json();
    const item = await prisma.sponsor.create({
      data: { name: data.name, logo: data.logo, websiteUrl: data.websiteUrl, tier: data.tier, order: parseInt(data.order) || 0 }
    });
    
    // Backup
    const allItems = await prisma.sponsor.findMany({ orderBy: { order: 'asc' } });
    backupCollection('sponsors', allItems).catch(console.error);

    return NextResponse.json(item);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
