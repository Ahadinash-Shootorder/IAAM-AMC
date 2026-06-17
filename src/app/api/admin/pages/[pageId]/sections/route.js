import { getPageLayout, updatePageLayout, validateId } from '@/lib/data';

export const dynamic = 'force-dynamic';

export async function GET(request, { params }) {
  try {
    const { pageId } = await params;
    if (!validateId(pageId)) {
      return Response.json({ error: 'Invalid page ID' }, { status: 400 });
    }
    const layout = await getPageLayout(pageId);
    return Response.json(layout);
  } catch (error) {
    return Response.json({ error: 'Failed to read page layout' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const { pageId } = await params;
    if (!validateId(pageId)) {
      return Response.json({ error: 'Invalid page ID' }, { status: 400 });
    }
    const body = await request.json();
    await updatePageLayout(pageId, body);
    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ error: 'Failed to update page layout' }, { status: 500 });
  }
}
