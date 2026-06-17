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
    const data = await req.json();
    const item = await prisma.proceeding.create({
      data: { title: data.title, category: data.category, authors: data.authors, pdfUrl: data.pdfUrl, date: data.date, coverImage: data.coverImage, link: data.link, order: parseInt(data.order) || 0 }
    });
    
    // Backup
    const allItems = await prisma.proceeding.findMany({ orderBy: { order: 'asc' } });
    backupCollection('proceedings', allItems).catch(console.error);

    return NextResponse.json(item);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
