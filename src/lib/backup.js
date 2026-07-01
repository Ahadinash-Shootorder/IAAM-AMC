import fs from 'fs/promises';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');

// Event type → directory name mapping
const EVENT_TYPE_DIR = {
  individual: 'individual-events',
  upcoming: 'upcoming-events',
  archive: 'congress-archive',
};

/**
 * Ensures a directory exists
 */
async function ensureDir(dirPath) {
  try {
    await fs.mkdir(dirPath, { recursive: true });
  } catch (error) {
    if (error.code !== 'EEXIST') throw error;
  }
}

/**
 * Backs up a specific page section.
 *
 * For event pages (pageId starts with "event-"):
 *   Updates data/pages/<eventType-dir>/events.json
 *   by writing only the changed section into that event's entry.
 *
 * For all other pages:
 *   Writes to data/pages/<pageId>/<sectionId>.json
 */
export async function backupPageSection(pageId, sectionId, data) {
  try {
    if (pageId.startsWith('event-')) {
      const { default: prisma } = await import('./prisma');
      const eventId = pageId.slice(6);
      const event = await prisma.event.findUnique({ where: { id: eventId } });
      if (!event) {
        console.warn(`[Backup] Event ${eventId} not found — skipping backup`);
        return;
      }

      const typeDirName = EVENT_TYPE_DIR[event.eventType];
      if (!typeDirName) {
        console.warn(`[Backup] Unknown eventType "${event.eventType}" for ${eventId}`);
        return;
      }

      const typeDir = path.join(DATA_DIR, 'pages', typeDirName);
      await ensureDir(typeDir);
      const eventsJsonPath = path.join(typeDir, 'events.json');

      // Read existing events.json or start fresh
      let allEvents = {};
      try {
        const raw = await fs.readFile(eventsJsonPath, 'utf-8');
        allEvents = JSON.parse(raw);
      } catch {
        // File doesn't exist yet
      }

      // Ensure entry exists for this event
      if (!allEvents[eventId]) {
        allEvents[eventId] = {
          meta: {
            title: event.title,
            slug: event.slug,
            date: event.date,
            location: event.location,
            order: event.order,
          },
          layout: { sections: [] },
          sections: {},
        };
      }

      // Update only the changed section
      if (!allEvents[eventId].sections) allEvents[eventId].sections = {};
      allEvents[eventId].sections[sectionId] = data;

      await fs.writeFile(eventsJsonPath, JSON.stringify(allEvents, null, 2));
      console.log(`[Backup] Saved ${typeDirName}/events.json → event: ${eventId}, section: ${sectionId}`);
    } else {
      // Non-event page: individual section file
      const pageDir = path.join(DATA_DIR, 'pages', pageId);
      await ensureDir(pageDir);
      const filePath = path.join(pageDir, `${sectionId}.json`);
      await fs.writeFile(filePath, JSON.stringify(data, null, 2));
      console.log(`[Backup] Saved ${pageId}/${sectionId}.json`);
    }
  } catch (error) {
    console.error(`[Backup Error] Failed to backup page section ${pageId}/${sectionId}:`, error);
  }
}

/**
 * Backs up a full collection array to data/[collectionName].json
 */
export async function backupCollection(collectionName, items) {
  if (!collectionName || !/^[a-zA-Z0-9_-]+$/.test(collectionName)) {
    throw new Error('Invalid collection name');
  }
  try {
    await ensureDir(DATA_DIR);
    const filePath = path.join(DATA_DIR, `${collectionName}.json`);
    await fs.writeFile(filePath, JSON.stringify(items, null, 2));
    console.log(`[Backup] Saved ${collectionName}.json`);
  } catch (error) {
    console.error(`[Backup Error] Failed to backup collection ${collectionName}:`, error);
  }
}

/**
 * Backs up page layout configuration (section visibility and order).
 *
 * For event pages: updates layout.sections inside the events.json entry.
 * For other pages: writes data/pages/<pageId>/layout.json
 */
export async function backupPageLayout(pageId, sections) {
  if (!pageId || !/^[a-zA-Z0-9_-]+$/.test(pageId)) {
    throw new Error('Invalid page ID');
  }
  try {
    if (pageId.startsWith('event-')) {
      const { default: prisma } = await import('./prisma');
      const eventId = pageId.slice(6);
      const event = await prisma.event.findUnique({ where: { id: eventId } });
      if (!event) return;

      const typeDirName = EVENT_TYPE_DIR[event.eventType];
      if (!typeDirName) return;

      const eventsJsonPath = path.join(DATA_DIR, 'pages', typeDirName, 'events.json');

      let allEvents = {};
      try {
        const raw = await fs.readFile(eventsJsonPath, 'utf-8');
        allEvents = JSON.parse(raw);
      } catch { /* file doesn't exist yet */ }

      if (!allEvents[eventId]) allEvents[eventId] = { meta: {}, layout: { sections: [] }, sections: {} };
      allEvents[eventId].layout = { sections };

      await fs.writeFile(eventsJsonPath, JSON.stringify(allEvents, null, 2));
      console.log(`[Backup] Saved layout for ${typeDirName}/events.json → event: ${eventId}`);
    } else {
      const pageDir = path.join(DATA_DIR, 'pages', pageId);
      await ensureDir(pageDir);
      const filePath = path.join(pageDir, 'layout.json');
      await fs.writeFile(filePath, JSON.stringify({ sections }, null, 2));
      console.log(`[Backup] Saved layout for page ${pageId}`);
    }
  } catch (error) {
    console.error(`[Backup Error] Failed to backup page layout ${pageId}:`, error);
  }
}
