import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { backupCollection } from '@/lib/backup';

export async function GET() {
  try {
    const items = await prisma.proceeding.findMany({ orderBy: { order: 'asc' } });
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

    if (!data.title || typeof data.title !== 'string' || !data.title.trim()) {
      return NextResponse.json({ error: 'Proceeding title is required' }, { status: 400 });
    }

    const item = await prisma.proceeding.create({
      data: { title: data.title.trim(), category: data.category || null, authors: data.authors || null, pdfUrl: data.pdfUrl || null, date: data.date || null, coverImage: data.coverImage || null, link: data.link || null, order: Math.max(0, parseInt(data.order) || 0) }
    });
    
    // Backup
    const allItems = await prisma.proceeding.findMany({ orderBy: { order: 'asc' } });
    backupCollection('proceedings', allItems).catch(console.error);

    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
