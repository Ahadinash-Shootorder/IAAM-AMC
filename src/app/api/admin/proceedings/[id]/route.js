import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { backupCollection } from '@/lib/backup';

export async function PUT(req, { params }) {
  try {
    const { id } = await params;
    const data = await req.json();
    const item = await prisma.proceeding.update({
      where: { id },
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

export async function DELETE(req, { params }) {
  try {
    const { id } = await params;
    await prisma.proceeding.delete({ where: { id } });
    
    // Backup
    const allItems = await prisma.proceeding.findMany({ orderBy: { order: 'asc' } });
    backupCollection('proceedings', allItems).catch(console.error);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
