import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

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

    const { title, slug } = data;
    let finalSlug = slug ? slug.trim() : '';
    if (!finalSlug) {
      const baseSlug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      finalSlug = baseSlug || 'proceeding';
    }

    // Ensure slug is unique
    let checkedSlug = finalSlug;
    let count = 1;
    while (true) {
      const existing = await prisma.proceeding.findFirst({ where: { slug: checkedSlug } });
      if (!existing) break;
      checkedSlug = `${finalSlug}-${count}`;
      count++;
    }

    const item = await prisma.proceeding.create({
      data: { 
        title: data.title.trim(), 
        slug: checkedSlug,
        category: data.category || null, 
        authors: data.authors || null, 
        pdfUrl: data.pdfUrl || null, 
        date: data.date || null, 
        coverImage: data.coverImage || null, 
        link: data.link || null, 
        featured: typeof data.featured === 'boolean' ? data.featured : data.featured === 'true',
        description: data.description || '<p>As the global demand for sustainable energy solutions accelerates, the focus of advanced materials research has pivoted towards optimizing the efficiency of photovoltaic systems. <strong>Graphene</strong>, with its exceptional carrier mobility and transparency, remains at the forefront of this revolution. In this report, we evaluate the recent breakthroughs in hybridized nanostructures presented at EAEMC 2026.</p><p>As the global demand for sustainable energy solutions accelerates, the focus of advanced materials research has pivoted towards optimizing the efficiency of photovoltaic systems. <strong>Graphene</strong>, with its exceptional carrier mobility and transparency, remains at the forefront of this revolution. In this report, we evaluate the recent breakthroughs in hybridized nanostructures presented at EAEMC 2026.</p><p>As the global demand for sustainable energy solutions accelerates, the focus of advanced materials research has pivoted towards optimizing the efficiency of photovoltaic systems. <strong>Graphene</strong>, with its exceptional carrier mobility and transparency, remains at the forefront of this revolution. In this report, we evaluate the recent breakthroughs in hybridized nanostructures presented at EAEMC 2026.</p>',
        order: Math.max(0, parseInt(data.order) || 0) 
      }
    });
    
    // Backup
    const allItems = await prisma.proceeding.findMany({ orderBy: { order: 'asc' } });
    const { backupCollection, syncProceedingToPageJson } = await import('@/lib/backup');
    backupCollection('proceedings', allItems).catch(console.error);
    syncProceedingToPageJson(item).catch(console.error);

    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
