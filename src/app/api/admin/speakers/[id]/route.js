import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { backupCollection } from '@/lib/backup';

export async function PUT(req, { params }) {
  try {
    const { id } = await params;
    let data;
    try {
      data = await req.json();
    } catch {
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
    }

    if (data.name !== undefined && (!data.name || typeof data.name !== 'string' || !data.name.trim())) {
      return NextResponse.json({ error: 'Speaker name cannot be empty' }, { status: 400 });
    }

    const item = await prisma.speaker.update({
      where: { id },
      data: { name: data.name?.trim(), designation: data.designation ?? undefined, organization: data.organization ?? undefined, image: data.image ?? undefined, bannerImage: data.bannerImage ?? undefined, bannerImageMobile: data.bannerImageMobile ?? undefined, location: data.location ?? undefined, shortBio: data.shortBio ?? undefined, fullBio: data.fullBio ?? undefined, expertise: data.expertise ?? undefined, stats: data.stats ?? undefined, ctaText: data.ctaText ?? undefined, ctaLink: data.ctaLink ?? undefined, slug: data.slug ?? undefined, order: data.order !== undefined ? Math.max(0, parseInt(data.order) || 0) : undefined }
    });
    
    // Backup
    const allItems = await prisma.speaker.findMany({ orderBy: { order: 'asc' } });
    backupCollection('speakers', allItems).catch(console.error);

    return NextResponse.json(item);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const { id } = await params;
    await prisma.speaker.delete({ where: { id } });
    
    // Backup
    const allItems = await prisma.speaker.findMany({ orderBy: { order: 'asc' } });
    backupCollection('speakers', allItems).catch(console.error);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
