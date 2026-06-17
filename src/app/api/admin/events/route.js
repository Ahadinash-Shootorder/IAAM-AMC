import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { backupCollection } from '@/lib/backup';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const eventType = searchParams.get('eventType');
    const where = eventType ? { eventType } : {};
    const items = await prisma.event.findMany({ where, orderBy: { order: 'asc' } });
    return NextResponse.json(items);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const data = await req.json();
    const item = await prisma.event.create({
      data: { title: data.title, date: data.date, location: data.location, image: data.image, link: data.link, eventType: data.eventType, order: parseInt(data.order) || 0 }
    });
    
    // Backup
    const allItems = await prisma.event.findMany({ orderBy: { order: 'asc' } });
    backupCollection('events', allItems).catch(console.error);

    return NextResponse.json(item);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
