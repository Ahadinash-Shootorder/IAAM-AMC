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
    const { default: prisma } = await import('./prisma');
    if (pageId.startsWith('event-')) {
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

      let allEvents = {};
      try {
        const raw = await fs.readFile(eventsJsonPath, 'utf-8');
        allEvents = JSON.parse(raw);
      } catch { }

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

      if (!allEvents[eventId].sections) allEvents[eventId].sections = {};
      allEvents[eventId].sections[sectionId] = data;

      await fs.writeFile(eventsJsonPath, JSON.stringify(allEvents, null, 2));
      console.log(`[Backup] Saved ${typeDirName}/events.json → event: ${eventId}, section: ${sectionId}`);

    } else if (pageId.startsWith('proceeding-')) {
      const proceedingId = pageId.slice(11);
      const proceeding = await prisma.proceeding.findUnique({ where: { id: proceedingId } });
      if (!proceeding) {
        console.warn(`[Backup] Proceeding ${proceedingId} not found — skipping backup`);
        return;
      }

      const typeDir = path.join(DATA_DIR, 'pages', 'congress-proceedings');
      await ensureDir(typeDir);
      const proceedingsJsonPath = path.join(typeDir, 'proceedings.json');

      let allProceedings = {};
      try {
        const raw = await fs.readFile(proceedingsJsonPath, 'utf-8');
        allProceedings = JSON.parse(raw);
      } catch { }

      if (!allProceedings[proceedingId]) {
        allProceedings[proceedingId] = {
          meta: {
            title: proceeding.title,
            category: proceeding.category,
            authors: proceeding.authors,
            pdfUrl: proceeding.pdfUrl,
            date: proceeding.date,
            coverImage: proceeding.coverImage,
            link: proceeding.link,
            order: proceeding.order,
            slug: proceeding.slug || proceeding.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          },
          layout: { sections: [] },
          sections: {},
        };
      }

      if (!allProceedings[proceedingId].sections) allProceedings[proceedingId].sections = {};
      allProceedings[proceedingId].sections[sectionId] = data;

      await fs.writeFile(proceedingsJsonPath, JSON.stringify(allProceedings, null, 2));
      console.log(`[Backup] Saved congress-proceedings/proceedings.json → proceeding: ${proceedingId}, section: ${sectionId}`);

    } else {
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
    } else if (pageId.startsWith('proceeding-')) {
        const { default: prisma } = await import('./prisma');
        const proceedingId = pageId.slice(11);
        const proceeding = await prisma.proceeding.findUnique({ where: { id: proceedingId } });
        if (!proceeding) return;

        const proceedingsJsonPath = path.join(DATA_DIR, 'pages', 'congress-proceedings', 'proceedings.json');

        let allProceedings = {};
        try {
          const raw = await fs.readFile(proceedingsJsonPath, 'utf-8');
          allProceedings = JSON.parse(raw);
        } catch { /* file doesn't exist yet */ }

        if (!allProceedings[proceedingId]) allProceedings[proceedingId] = { meta: {}, layout: { sections: [] }, sections: {} };
        allProceedings[proceedingId].layout = { sections };

        await ensureDir(path.join(DATA_DIR, 'pages', 'congress-proceedings'));
        await fs.writeFile(proceedingsJsonPath, JSON.stringify(allProceedings, null, 2));
        console.log(`[Backup] Saved layout for congress-proceedings/proceedings.json → proceeding: ${proceedingId}`);
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

/**
 * Syncs proceeding changes to pages/congress-proceedings/proceedings.json
 */
export async function syncProceedingToPageJson(proceeding) {
  const typeDir = path.join(DATA_DIR, 'pages', 'congress-proceedings');
  await ensureDir(typeDir);
  const proceedingsJsonPath = path.join(typeDir, 'proceedings.json');

  let allProceedings = {};
  try {
    const raw = await fs.readFile(proceedingsJsonPath, 'utf-8');
    allProceedings = JSON.parse(raw);
  } catch {}

  const procId = proceeding.id;
  const slug = proceeding.slug || proceeding.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');

  if (!allProceedings[procId]) {
    const defaultSections = [
      { id: 'proceedingHero', label: 'Hero Section', order: 1, visible: true },
      { id: 'proceedingDownload', label: 'Download Section', order: 2, visible: true },
      { id: 'proceedingContent', label: 'Main Content', order: 3, visible: true },
      { id: 'relatedProceedings', label: 'Related Proceedings', order: 4, visible: true }
    ];
    const sectionsData = {
      proceedingHero: {
        category: proceeding.category || 'FASHION DESIGN',
        title: proceeding.title,
        author: proceeding.authors || 'Jane Cooper',
        date: proceeding.date || 'November, 2026',
      },
      proceedingDownload: {
        buttonText: 'Download Full PDF',
        pdfUrl: proceeding.pdfUrl || '#'
      },
      proceedingContent: {
        htmlContent: proceeding.description || '<p>As the global demand for sustainable energy solutions accelerates, the focus of advanced materials research has pivoted towards optimizing the efficiency of photovoltaic systems. <strong>Graphene</strong>, with its exceptional carrier mobility and transparency, remains at the forefront of this revolution. In this report, we evaluate the recent breakthroughs in hybridized nanostructures presented at EAEMC 2026.</p><p>As the global demand for sustainable energy solutions accelerates, the focus of advanced materials research has pivoted towards optimizing the efficiency of photovoltaic systems. <strong>Graphene</strong>, with its exceptional carrier mobility and transparency, remains at the forefront of this revolution. In this report, we evaluate the recent breakthroughs in hybridized nanostructures presented at EAEMC 2026.</p><p>As the global demand for sustainable energy solutions accelerates, the focus of advanced materials research has pivoted towards optimizing the efficiency of photovoltaic systems. <strong>Graphene</strong>, with its exceptional carrier mobility and transparency, remains at the forefront of this revolution. In this report, we evaluate the recent breakthroughs in hybridized nanostructures presented at EAEMC 2026.</p>'
      },
      relatedProceedings: {
        title: 'RELATED PROCEEDINGS',
        exploreText: 'Explore All Reports',
        exploreLink: '/congress-proceedings',
        proceedings: []
      }
    };
    allProceedings[procId] = {
      meta: {},
      layout: { sections: defaultSections },
      sections: sectionsData
    };
  }

  allProceedings[procId].meta = {
    title: proceeding.title,
    category: proceeding.category,
    authors: proceeding.authors,
    pdfUrl: proceeding.pdfUrl,
    date: proceeding.date,
    coverImage: proceeding.coverImage,
    link: proceeding.link,
    featured: proceeding.featured,
    order: proceeding.order,
    slug: slug,
  };

  if (allProceedings[procId].sections?.proceedingHero) {
    allProceedings[procId].sections.proceedingHero.title = proceeding.title;
    allProceedings[procId].sections.proceedingHero.category = proceeding.category;
    allProceedings[procId].sections.proceedingHero.author = proceeding.authors;
    allProceedings[procId].sections.proceedingHero.date = proceeding.date;
  }

  if (allProceedings[procId].sections?.proceedingDownload) {
    allProceedings[procId].sections.proceedingDownload.pdfUrl = proceeding.pdfUrl;
  }

  if (allProceedings[procId].sections?.proceedingContent) {
    const defaultContent = '<p>As the global demand for sustainable energy solutions accelerates, the focus of advanced materials research has pivoted towards optimizing the efficiency of photovoltaic systems. <strong>Graphene</strong>, with its exceptional carrier mobility and transparency, remains at the forefront of this revolution. In this report, we evaluate the recent breakthroughs in hybridized nanostructures presented at EAEMC 2026.</p><p>As the global demand for sustainable energy solutions accelerates, the focus of advanced materials research has pivoted towards optimizing the efficiency of photovoltaic systems. <strong>Graphene</strong>, with its exceptional carrier mobility and transparency, remains at the forefront of this revolution. In this report, we evaluate the recent breakthroughs in hybridized nanostructures presented at EAEMC 2026.</p><p>As the global demand for sustainable energy solutions accelerates, the focus of advanced materials research has pivoted towards optimizing the efficiency of photovoltaic systems. <strong>Graphene</strong>, with its exceptional carrier mobility and transparency, remains at the forefront of this revolution. In this report, we evaluate the recent breakthroughs in hybridized nanostructures presented at EAEMC 2026.</p>';
    allProceedings[procId].sections.proceedingContent.htmlContent = proceeding.description || defaultContent;
  }

  await fs.writeFile(proceedingsJsonPath, JSON.stringify(allProceedings, null, 2));
  console.log(`[Backup] Synced proceeding ${procId} metadata to congress-proceedings/proceedings.json`);
}

/**
 * Removes proceeding entry from pages/congress-proceedings/proceedings.json
 */
export async function deleteProceedingFromPageJson(procId) {
  const typeDir = path.join(DATA_DIR, 'pages', 'congress-proceedings');
  const proceedingsJsonPath = path.join(typeDir, 'proceedings.json');

  try {
    const raw = await fs.readFile(proceedingsJsonPath, 'utf-8');
    const allProceedings = JSON.parse(raw);
    if (allProceedings[procId]) {
      delete allProceedings[procId];
      await fs.writeFile(proceedingsJsonPath, JSON.stringify(allProceedings, null, 2));
      console.log(`[Backup] Deleted proceeding ${procId} from congress-proceedings/proceedings.json`);
    }
  } catch (err) {
    console.error(`[Backup Error] Failed to delete proceeding ${procId} from page JSON:`, err);
  }
}
