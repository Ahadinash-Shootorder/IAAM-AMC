import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { backupCollection } from '@/lib/backup';

export async function GET() {
  try {
    const items = await prisma.speaker.findMany({ orderBy: { order: 'asc' } });
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
      return NextResponse.json({ error: 'Speaker name is required' }, { status: 400 });
    }

    const item = await prisma.speaker.create({
      data: { name: data.name.trim(), designation: data.designation || null, organization: data.organization || null, image: data.image || null, bannerImage: data.bannerImage || null, bannerImageMobile: data.bannerImageMobile || null, location: data.location || null, shortBio: data.shortBio || null, fullBio: data.fullBio || null, expertise: data.expertise || null, stats: data.stats || null, ctaText: data.ctaText || null, ctaLink: data.ctaLink || null, slug: data.slug || null, order: Math.max(0, parseInt(data.order) || 0) }
    });
    
    // Backup
    const allItems = await prisma.speaker.findMany({ orderBy: { order: 'asc' } });
    backupCollection('speakers', allItems).catch(console.error);

    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
