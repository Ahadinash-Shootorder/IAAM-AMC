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

    if (data.title !== undefined && (!data.title || typeof data.title !== 'string' || !data.title.trim())) {
      return NextResponse.json({ error: 'Proceeding title cannot be empty' }, { status: 400 });
    }

    const item = await prisma.proceeding.update({
      where: { id },
      data: { title: data.title?.trim(), category: data.category ?? undefined, authors: data.authors ?? undefined, pdfUrl: data.pdfUrl ?? undefined, date: data.date ?? undefined, coverImage: data.coverImage ?? undefined, link: data.link ?? undefined, order: data.order !== undefined ? Math.max(0, parseInt(data.order) || 0) : undefined }
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
