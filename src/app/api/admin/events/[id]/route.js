import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { backupCollection } from '@/lib/backup';

const VALID_EVENT_TYPES = new Set(['upcoming', 'individual', 'archive']);

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
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
    let data;
    try {
      data = await req.json();
    } catch {
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
    }

    if (!data.title || typeof data.title !== 'string' || !data.title.trim()) {
      return NextResponse.json({ error: 'Event title is required' }, { status: 400 });
    }
    if (data.eventType && !VALID_EVENT_TYPES.has(data.eventType)) {
      return NextResponse.json({ error: 'Invalid eventType' }, { status: 400 });
    }

    const slug = await generateUniqueSlug(data.title, data.slug, id);

    const item = await prisma.event.update({
      where: { id },
      data: {
        title: data.title.trim(),
        slug,
        date: data.date || null,
        location: data.location || null,
        image: data.image || null,
        link: data.link || null,
        description: data.description || null,
        eventType: data.eventType,
        order: Math.max(0, parseInt(data.order) || 0)
      }
    });

    // Sync Event page sections (eventHero and eventIntro) if they exist
    const pageId = `event-${id}`;
    
    const eventHeroSec = await prisma.section.findUnique({
      where: { pageId_id: { pageId, id: 'eventHero' } }
    });
    if (eventHeroSec) {
      const content = JSON.parse(eventHeroSec.content || '{}');
      content.title = data.title;
      content.date = data.date;
      content.location = data.location;
      content.backgroundImage = data.image;
      await prisma.section.update({
        where: { pageId_id: { pageId, id: 'eventHero' } },
        data: { content: JSON.stringify(content) }
      });
    }

    const eventIntroSec = await prisma.section.findUnique({
      where: { pageId_id: { pageId, id: 'eventIntro' } }
    });
    if (eventIntroSec) {
      const content = JSON.parse(eventIntroSec.content || '{}');
      if (content.paragraphs && Array.isArray(content.paragraphs)) {
        content.paragraphs[0] = data.description || '';
      } else {
        content.paragraphs = [data.description || ''];
      }
      await prisma.section.update({
        where: { pageId_id: { pageId, id: 'eventIntro' } },
        data: { content: JSON.stringify(content) }
      });
    }
    
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

    // Cascade delete layout pages and sections
    const pageId = `event-${id}`;
    await prisma.section.deleteMany({ where: { pageId } });
    await prisma.page.deleteMany({ where: { id: pageId } });
    
    // Backup
    const allItems = await prisma.event.findMany({ orderBy: { order: 'asc' } });
    backupCollection('events', allItems).catch(console.error);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
