import { readPageSectionData, writePageSectionData, validateId } from '@/lib/data';
import { logActivity } from '@/lib/logger';
import { jwtVerify } from 'jose';

export const dynamic = 'force-dynamic';
const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'iaam_super_secret_key_2026');

export async function GET(request, { params }) {
  try {
    const { pageId, section } = await params;
    const url = new URL(request.url);
    const preview = url.searchParams.get('preview') === 'true';

    if (!validateId(pageId) || !validateId(section)) {
      return Response.json({ error: 'Invalid page or section ID' }, { status: 400 });
    }
    const data = await readPageSectionData(pageId, section, preview);
    return Response.json(data);
  } catch (error) {
    return Response.json({ error: 'Failed to read section content' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const { pageId, section } = await params;
    const url = new URL(request.url);
    const asDraft = url.searchParams.get('draft') === 'true';

    if (!validateId(pageId) || !validateId(section)) {
      return Response.json({ error: 'Invalid page or section ID' }, { status: 400 });
    }
    const body = await request.json();
    await writePageSectionData(pageId, section, body, asDraft);

    try {
      const token = request.cookies.get('admin_token')?.value;
      if (token) {
        const { payload } = await jwtVerify(token, JWT_SECRET);
        await logActivity(payload.email, asDraft ? 'SAVE_DRAFT' : 'PUBLISH_CONTENT', { pageId, section });
      }
    } catch (e) {}

    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ error: 'Failed to update section content' }, { status: 500 });
  }
}
