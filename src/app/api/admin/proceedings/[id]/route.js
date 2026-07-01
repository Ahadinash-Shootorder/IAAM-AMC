import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req, { params }) {
  try {
    const { id } = await params;
    const item = await prisma.proceeding.findUnique({ where: { id } });
    if (!item) {
      return NextResponse.json({ error: 'Proceeding not found' }, { status: 404 });
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

    if (data.title !== undefined && (!data.title || typeof data.title !== 'string' || !data.title.trim())) {
      return NextResponse.json({ error: 'Proceeding title cannot be empty' }, { status: 400 });
    }

    let checkedSlug = undefined;
    if (data.slug !== undefined || data.title !== undefined) {
      let finalSlug = data.slug ? data.slug.trim() : '';
      if (!finalSlug && data.title) {
        const baseSlug = data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        finalSlug = baseSlug || 'proceeding';
      }
      
      if (finalSlug) {
        checkedSlug = finalSlug;
        let count = 1;
        while (true) {
          const existing = await prisma.proceeding.findFirst({
            where: {
              slug: checkedSlug,
              NOT: { id }
            }
          });
          if (!existing) break;
          checkedSlug = `${finalSlug}-${count}`;
          count++;
        }
      }
    }

    const item = await prisma.proceeding.update({
      where: { id },
      data: { 
        title: data.title?.trim(), 
        slug: checkedSlug,
        category: data.category ?? undefined, 
        authors: data.authors ?? undefined, 
        pdfUrl: data.pdfUrl ?? undefined, 
        date: data.date ?? undefined, 
        coverImage: data.coverImage ?? undefined, 
        link: data.link ?? undefined, 
        featured: data.featured !== undefined ? (typeof data.featured === 'boolean' ? data.featured : data.featured === 'true') : undefined,
        description: data.description !== undefined ? data.description : undefined,
        order: data.order !== undefined ? Math.max(0, parseInt(data.order) || 0) : undefined 
      }
    });
    
    // Backup
    const allItems = await prisma.proceeding.findMany({ orderBy: { order: 'asc' } });
    const { backupCollection, syncProceedingToPageJson } = await import('@/lib/backup');
    backupCollection('proceedings', allItems).catch(console.error);
    syncProceedingToPageJson(item).catch(console.error);

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
    const { backupCollection, deleteProceedingFromPageJson } = await import('@/lib/backup');
    backupCollection('proceedings', allItems).catch(console.error);
    deleteProceedingFromPageJson(id).catch(console.error);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
