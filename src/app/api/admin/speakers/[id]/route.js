import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { backupCollection } from '@/lib/backup';

export async function PUT(req, { params }) {
  try {
    const { id } = await params;
    const data = await req.json();
    const item = await prisma.speaker.update({
      where: { id },
      data: { name: data.name, designation: data.designation, organization: data.organization, image: data.image, bannerImage: data.bannerImage, location: data.location, shortBio: data.shortBio, fullBio: data.fullBio, expertise: data.expertise, stats: data.stats, ctaText: data.ctaText, ctaLink: data.ctaLink, slug: data.slug, order: parseInt(data.order) || 0 }
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
