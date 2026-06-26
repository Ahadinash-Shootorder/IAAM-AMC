import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { backupCollection } from '@/lib/backup';
import { getPageLayout } from '@/lib/data';

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
    .replace(/\-\-+/g, '-')         // Replace multiple - with single -
    .replace(/^-+/, '')             // Trim - from start
    .replace(/-+$/, '');            // Trim - from end
}

async function generateUniqueSlug(title, customSlug = null, eventId = null) {
  const baseSlug = slugify(customSlug || title || 'event');
  let slug = baseSlug || 'event';
  let counter = 1;
  while (true) {
    const existing = await prisma.event.findFirst({
      where: {
        slug,
        ...(eventId ? { NOT: { id: eventId } } : {})
      }
    });
    if (!existing) {
      break;
    }
    slug = `${baseSlug}-${counter}`;
    counter++;
  }
  return slug;
}

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
    const slug = await generateUniqueSlug(data.title, data.slug);
    const item = await prisma.event.create({
      data: {
        title: data.title,
        slug: slug,
        date: data.date,
        location: data.location,
        image: data.image,
        link: data.link,
        description: data.description || null,
        eventType: data.eventType,
        order: parseInt(data.order) || 0
      }
    });

    // Seed sections immediately so layout manager is ready
    try {
      await getPageLayout(`event-${item.id}`);
    } catch (e) {
      console.error(`Failed to pre-seed sections for event-${item.id}:`, e);
    }
    
    // Backup
    const allItems = await prisma.event.findMany({ orderBy: { order: 'asc' } });
    backupCollection('events', allItems).catch(console.error);

    return NextResponse.json(item);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
