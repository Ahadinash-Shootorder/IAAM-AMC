import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { backupCollection } from '@/lib/backup';

export async function PUT(req, { params }) {
  try {
    const { id } = await params;
    const data = await req.json();
    const item = await prisma.sponsor.update({
      where: { id },
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

export async function DELETE(req, { params }) {
  try {
    const { id } = await params;
    await prisma.sponsor.delete({ where: { id } });
    
    // Backup
    const allItems = await prisma.sponsor.findMany({ orderBy: { order: 'asc' } });
    backupCollection('sponsors', allItems).catch(console.error);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
