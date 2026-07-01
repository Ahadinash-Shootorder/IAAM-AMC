import fs from 'fs';
import path from 'path';
import { jwtVerify } from 'jose';
import prisma from '@/lib/prisma';
import { validateId } from '@/lib/data';
import { logActivity } from '@/lib/logger';

export const dynamic = 'force-dynamic';

const ALLOWED_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif', '.pdf']);
const ALLOWED_MIME_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'application/pdf',
]);
const MAX_SIZE = 10 * 1024 * 1024; // 10 MB

const UPLOADS_ROOT = path.join(process.cwd(), 'public', 'uploads');

function getJwtSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error(
      'JWT_SECRET environment variable is not set. This is required.'
    );
  }
  return new TextEncoder().encode(secret);
}

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');
    const pageId = formData.get('pageId') || 'home';
    const section = formData.get('section') || 'general';

    if (!file) {
      return Response.json({ error: 'No file uploaded' }, { status: 400 });
    }

    if (!validateId(pageId) || !validateId(section)) {
      return Response.json({ error: 'Invalid page or section ID' }, { status: 400 });
    }

    // Validate MIME type
    if (!ALLOWED_MIME_TYPES.has(file.type)) {
      return Response.json(
        { error: 'Only image files are allowed (jpg, png, webp, gif)' },
        { status: 400 }
      );
    }

    // Validate file extension — MIME type alone can be spoofed by renaming a file
    const ext = path.extname(file.name).toLowerCase();
    if (!ALLOWED_EXTENSIONS.has(ext)) {
      return Response.json(
        { error: 'Invalid file extension. Allowed: jpg, jpeg, png, webp, gif' },
        { status: 400 }
      );
    }

    // Validate file size
    if (file.size > MAX_SIZE) {
      return Response.json({ error: 'File size exceeds 5 MB limit' }, { status: 400 });
    }

    const uploadDir = path.join(UPLOADS_ROOT, pageId, section);

    // Verify upload directory resolves inside UPLOADS_ROOT (no path traversal)
    if (!uploadDir.startsWith(UPLOADS_ROOT + path.sep)) {
      return Response.json({ error: 'Invalid upload path' }, { status: 400 });
    }

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const timestamp = Date.now();
    const safeName = path.basename(file.name).replace(/[^a-zA-Z0-9._-]/g, '_');
    const filename = `${timestamp}-${safeName}`;
    const filePath = path.join(uploadDir, filename);

    const bytes = await file.arrayBuffer();
    fs.writeFileSync(filePath, Buffer.from(bytes));

    const publicPath = `/uploads/${pageId}/${section}/${filename}`;

    // Add to Media Library database. If this fails we surface the error to
    // the admin rather than silently leaving an orphaned file with no DB
    // row (the Media library would then list it but the DB wouldn't track it,
    // leading to phantom entries after cleanup).
    let asset;
    try {
      asset = await prisma.mediaAsset.create({
        data: {
          filename: file.name,
          url: publicPath,
          mimetype: file.type,
          size: file.size,
        },
      });
    } catch (dbErr) {
      console.error('Error saving to MediaAsset DB:', dbErr);
      // Remove the orphaned file so the disk and DB stay consistent.
      try {
        fs.unlinkSync(filePath);
      } catch (unlinkErr) {
        console.error('Failed to clean up orphaned upload:', unlinkErr);
      }
      return Response.json(
        { error: 'Failed to record upload in media library' },
        { status: 500 }
      );
    }

    // Log activity (best-effort; don't fail the upload on logging errors)
    try {
      const token = request.cookies.get('admin_token')?.value;
      if (token) {
        const { payload } = await jwtVerify(token, getJwtSecret());
        await logActivity(payload.email, 'UPLOAD_MEDIA', {
          filename: file.name,
          path: publicPath,
        });
      }
    } catch (e) {
      console.error('Failed to log upload activity:', e);
    }

    return Response.json({ success: true, path: publicPath, filename, asset });
  } catch (error) {
    console.error('Upload error:', error);
    return Response.json({ error: 'Failed to upload file' }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { filePath } = await request.json();

    if (!filePath || typeof filePath !== 'string') {
      return Response.json({ error: 'Invalid file path' }, { status: 400 });
    }

    // Resolve the full path and confirm it lives strictly inside UPLOADS_ROOT
    const fullPath = path.resolve(process.cwd(), 'public', filePath.replace(/^\//, ''));
    if (!fullPath.startsWith(UPLOADS_ROOT + path.sep)) {
      return Response.json({ error: 'Access denied' }, { status: 403 });
    }

    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
    }

    // Remove from Media Library database
    try {
      await prisma.mediaAsset.deleteMany({
        where: { url: filePath },
      });
    } catch (dbErr) {
      console.error('Error removing from MediaAsset DB:', dbErr);
    }

    // Log activity (best-effort)
    try {
      const token = request.cookies.get('admin_token')?.value;
      if (token) {
        const { payload } = await jwtVerify(token, getJwtSecret());
        await logActivity(payload.email, 'DELETE_MEDIA', { path: filePath });
      }
    } catch (e) {
      console.error('Failed to log delete activity:', e);
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error('Delete error:', error);
    return Response.json({ error: 'Failed to delete file' }, { status: 500 });
  }
}
