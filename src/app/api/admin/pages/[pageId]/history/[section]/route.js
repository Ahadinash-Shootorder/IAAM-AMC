import { validateId } from '@/lib/data';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request, { params }) {
  try {
    const { pageId, section } = await params;
    if (!validateId(pageId) || !validateId(section)) {
      return Response.json({ error: 'Invalid page or section ID' }, { status: 400 });
    }
    
    const history = await prisma.sectionHistory.findMany({
      where: { pageId, sectionId: section },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        createdAt: true,
        // We only send back basic info to list them, not full content unless requested
      }
    });
    
    return Response.json({ history });
  } catch (error) {
    return Response.json({ error: 'Failed to fetch history' }, { status: 500 });
  }
}

export async function POST(request, { params }) {
  // This will be used to RESTORE a history item to draftContent
  try {
    const { pageId, section } = await params;
    if (!validateId(pageId) || !validateId(section)) {
      return Response.json({ error: 'Invalid page or section ID' }, { status: 400 });
    }
    
    const { historyId } = await request.json();
    if (!historyId) {
      return Response.json({ error: 'History ID is required' }, { status: 400 });
    }

    const historyItem = await prisma.sectionHistory.findUnique({
      where: { id: historyId }
    });

    if (!historyItem || historyItem.pageId !== pageId || historyItem.sectionId !== section) {
      return Response.json({ error: 'History item not found' }, { status: 404 });
    }

    // Set the old content as the NEW draftContent
    await prisma.section.update({
      where: { pageId_id: { pageId, id: section } },
      data: { draftContent: historyItem.content }
    });

    return Response.json({ success: true, restoredContent: JSON.parse(historyItem.content) });
  } catch (error) {
    return Response.json({ error: 'Failed to restore history' }, { status: 500 });
  }
}
