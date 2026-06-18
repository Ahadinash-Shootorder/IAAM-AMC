import fs from 'fs';
import path from 'path';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

const UPLOADS_ROOT = path.join(process.cwd(), 'public', 'uploads');
const IMAGE_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg', '.ico']);

/**
 * Scan the uploads directory recursively and return all image files.
 * This ensures ALL images show up, not just those tracked in the DB.
 */
function scanUploadsDir(dir, basePath = '/uploads') {
  const results = [];
  
  if (!fs.existsSync(dir)) return results;

  const entries = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    const publicUrl = `${basePath}/${entry.name}`;
    
    if (entry.isDirectory()) {
      results.push(...scanUploadsDir(fullPath, publicUrl));
    } else if (entry.isFile()) {
      const ext = path.extname(entry.name).toLowerCase();
      if (IMAGE_EXTENSIONS.has(ext)) {
        const stats = fs.statSync(fullPath);
        results.push({
          id: publicUrl, // use URL as unique ID for file-system entries
          filename: entry.name,
          url: publicUrl,
          size: stats.size,
          createdAt: stats.birthtime || stats.mtime,
        });
      }
    }
  }

  return results;
}

export async function GET(request) {
  try {
    // Strategy: Scan the file system for ALL images under public/uploads/
    // This catches images uploaded before the MediaAsset DB tracking was added
    const fileSystemAssets = scanUploadsDir(UPLOADS_ROOT);

    // Also fetch DB assets to get any metadata (but file system is source of truth)
    let dbAssets = [];
    try {
      dbAssets = await prisma.mediaAsset.findMany({
        orderBy: { createdAt: 'desc' }
      });
    } catch (e) {
      // DB might not have the table yet, that's OK
    }

    // Merge: Use DB data when available (for richer metadata), file system otherwise
    const dbMap = new Map(dbAssets.map(a => [a.url, a]));
    
    const mergedAssets = fileSystemAssets.map(fsAsset => {
      const dbEntry = dbMap.get(fsAsset.url);
      if (dbEntry) {
        return {
          ...dbEntry,
          // Ensure URL matches file system
          url: fsAsset.url,
        };
      }
      return fsAsset;
    });

    // Sort by creation date, newest first
    mergedAssets.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return Response.json({ assets: mergedAssets });
  } catch (error) {
    console.error('Error fetching media:', error);
    return Response.json({ error: 'Failed to fetch media assets' }, { status: 500 });
  }
}
