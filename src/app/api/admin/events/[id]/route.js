import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { backupCollection } from '@/lib/backup';

export async function GET(req, { params }) {
  try {
    const { id } = await params;
    const item = await prisma.event.findUnique({ where: { id } });
    if (!item) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }
    return NextResponse.json(item);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    const { id } = await params;
    const data = await req.json();
    const item = await prisma.event.update({
      where: { id },
      data: {
        title: data.title,
        slug: data.slug || null,
        date: data.date,
        location: data.location,
        image: data.image,
        link: data.link,
        description: data.description || null,
        eventType: data.eventType,
        order: parseInt(data.order) || 0
      }
    });
    
    // Backup
    const allItems = await prisma.event.findMany({ orderBy: { order: 'asc' } });
    backupCollection('events', allItems).catch(console.error);

    return NextResponse.json(item);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const { id } = await params;
    await prisma.event.delete({ where: { id } });
    
    // Backup
    const allItems = await prisma.event.findMany({ orderBy: { order: 'asc' } });
    backupCollection('events', allItems).catch(console.error);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
