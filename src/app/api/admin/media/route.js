import prisma from '@/lib/prisma';
import { jwtVerify } from 'jose';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    const assets = await prisma.mediaAsset.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return Response.json({ assets });
  } catch (error) {
    console.error('Error fetching media:', error);
    return Response.json({ error: 'Failed to fetch media assets' }, { status: 500 });
  }
}
