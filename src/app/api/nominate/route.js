import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    const { nominator, nominee, category } = await request.json();

    if (!nominator || !nominee || !category) {
      return Response.json({ error: 'Nominator Name, Nominee Name, and Category are required.' }, { status: 400 });
    }

    const nominationRecord = {
      id: `nom-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      nominator,
      nominee,
      category,
      createdAt: new Date().toISOString()
    };

    const nominationsDir = path.join(process.cwd(), 'data');
    if (!fs.existsSync(nominationsDir)) {
      fs.mkdirSync(nominationsDir, { recursive: true });
    }

    const nominationsFilePath = path.join(nominationsDir, 'nominations.json');
    let nominations = [];

    if (fs.existsSync(nominationsFilePath)) {
      try {
        const fileContent = fs.readFileSync(nominationsFilePath, 'utf-8');
        nominations = JSON.parse(fileContent);
      } catch (err) {
        console.error('Failed to parse nominations.json, starting fresh:', err);
      }
    }

    nominations.push(nominationRecord);
    fs.writeFileSync(nominationsFilePath, JSON.stringify(nominations, null, 2), 'utf-8');

    console.log('[Nomination API] Saved nomination successfully:', nominationRecord);

    return Response.json({ success: true, nomination: nominationRecord });
  } catch (error) {
    console.error('[Nomination API] Error saving nomination:', error);
    return Response.json({ error: 'An error occurred while processing the nomination.' }, { status: 500 });
  }
}
