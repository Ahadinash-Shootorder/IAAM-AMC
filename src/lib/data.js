import prisma from './db';
import { backupPageSection, backupPageLayout, backupCollection } from './backup';
import fs from 'fs';
import path from 'path';

async function seedAssembliesOnTheFly() {
  try {
    await prisma.page.upsert({
      where: { id: 'assemblies' },
      update: { label: 'Assemblies Page', route: '/assemblies' },
      create: { id: 'assemblies', label: 'Assemblies Page', route: '/assemblies' }
    });

    const sectionsPath = path.join(process.cwd(), 'prisma', 'seed_data', 'sections.json');
    if (fs.existsSync(sectionsPath)) {
      const sections = JSON.parse(fs.readFileSync(sectionsPath, 'utf-8'));
      const assembliesSections = sections.filter(sec => sec.pageId === 'assemblies');
      for (const sec of assembliesSections) {
        await prisma.section.upsert({
          where: { pageId_id: { pageId: sec.pageId, id: sec.id } },
          update: {
            label: sec.label,
            visible: sec.visible,
            order: sec.order
          },
          create: {
            id: sec.id,
            pageId: sec.pageId,
            label: sec.label,
            visible: sec.visible,
            order: sec.order,
            content: sec.content,
            draftContent: sec.draftContent
          }
        });
      }
    }
  } catch (err) {
    console.error('Failed to auto-seed Assemblies:', err);
  }
}

async function seedAwardsOnTheFly() {
  try {
    await prisma.page.upsert({
      where: { id: 'fellow-awards' },
      update: { label: 'Fellow & Awards', route: '/fellow-&-awards' },
      create: { id: 'fellow-awards', label: 'Fellow & Awards', route: '/fellow-&-awards' }
    });

    const sectionsPath = path.join(process.cwd(), 'prisma', 'seed_data', 'sections.json');
    if (fs.existsSync(sectionsPath)) {
      const sections = JSON.parse(fs.readFileSync(sectionsPath, 'utf-8'));
      const awardsSections = sections.filter(sec => sec.pageId === 'fellow-awards');
      for (const sec of awardsSections) {
        await prisma.section.upsert({
          where: { pageId_id: { pageId: sec.pageId, id: sec.id } },
          update: {
            label: sec.label,
            visible: sec.visible,
            order: sec.order
          },
          create: {
            id: sec.id,
            pageId: sec.pageId,
            label: sec.label,
            visible: sec.visible,
            order: sec.order,
            content: sec.content,
            draftContent: sec.draftContent
          }
        });
      }
    }
  } catch (err) {
    console.error('Failed to auto-seed Fellow & Awards:', err);
  }
}

async function seedEventOnTheFly(pageId) {
  try {
    const eventId = pageId.slice(6);
    const event = await prisma.event.findUnique({ where: { id: eventId } });
    if (!event) return;

    let eventRoute = `/events/${event.slug || event.id}`;
    if (event.eventType === 'upcoming') {
      eventRoute = `/upcoming-events/${event.slug || event.id}`;
    } else if (event.eventType === 'individual') {
      eventRoute = `/individual-events/${event.slug || event.id}`;
    } else if (event.eventType === 'archive') {
      eventRoute = `/congress-archive/${event.slug || event.id}`;
    }

    await prisma.page.upsert({
      where: { id: pageId },
      update: { label: `Event: ${event.title}`, route: eventRoute },
      create: { id: pageId, label: `Event: ${event.title}`, route: eventRoute }
    });

    const defaultSections = [
      {
        id: 'eventHero',
        label: 'Event Hero Banner',
        order: 1,
        content: {
          edition: '8th',
          editionSuffix: ' Anniversary Edition',
          title: event.title,
          tagline: '"Next-Generation Energy Materials for a Sustainable Future" — Join the premier international forum bridging cutting-edge research with practical net-zero applications.',
          date: event.date || '01 – 03 June 2026',
          location: event.location || 'Stockholm, Sweden',
          registerText: 'Register Now',
          registerLink: '#',
          programText: 'View Program',
          programLink: '#',
          backgroundImage: event.image || 'https://placehold.co/1278x661'
        }
      },
      {
        id: 'eventIntro',
        label: 'Decade of Excellence',
        order: 2,
        content: {
          title: 'Decade of Excellence',
          paragraphs: [
            `Join us in celebrating the 8th Anniversary of the prestigious European Advanced Energy Materials Congress (EAEMC), organized by the International Association of Advanced Materials (IAAM).`,
            `EAEMC has consistently served as a leading international platform bringing together researchers, industry professionals, policymakers, and academics to discuss groundbreaking research and innovations in advanced energy materials.`
          ],
          stats: [
            { value: '60+', label: 'PAST ASSEMBLIES' },
            { value: '8th', label: 'YEARLY ANNIVERSARY' }
          ],
          image: 'https://placehold.co/544x400'
        }
      },
      {
        id: 'eventSymposia',
        label: 'Conference Symposia',
        order: 3,
        content: {
          title: 'Conference Symposia',
          description: 'Focused scientific tracks exploring the frontier of energy science and materials engineering.',
          symposia: [
            { title: 'Renewable Energy', description: 'Focusing on sustainable materials and system efficiency for a circular energy economy.' },
            { title: 'Energy Storage', description: 'Advanced batteries, supercapacitors, and next-gen lithium-ion technologies.' },
            { title: 'Photovoltaics', description: 'Solar cells, thin films, and light-harvesting semiconductor innovations.' },
            { title: 'Energy Harvesting', description: 'Thermoelectrics, piezoelectrics, and micro-power conversion systems.' },
            { title: 'Hydrogen Tech', description: 'Fuel cells, hydrogen production, storage, and transport infrastructure.' },
            { title: 'Smart Materials', description: 'Intelligent materials designed for building efficiency and responsive systems.' }
          ],
          flyerText: 'Download Symposia Flyer',
          flyerLink: '#'
        }
      },
      {
        id: 'eventDeadlines',
        label: 'Critical Deadlines',
        order: 4,
        content: {
          title: 'Critical Deadlines',
          description: 'Mark your calendars for key submission and registration dates.',
          deadlines: [
            { label: 'EARLY-BIRD', date: '12 Dec 2025', description: 'Save on registration fees with early-bird rates.' },
            { label: 'ABSTRACTS', date: '30 Apr 2026', description: 'Final deadline for technical abstract submissions.' },
            { label: 'REGISTRATION', date: '27 Apr 2026', description: 'Standard registration closes for delegates.' },
            { label: 'FULL PAPERS', date: '03 July 2026', description: 'Submission for Scopus indexed congress journals.' }
          ]
        }
      },
      {
        id: 'eventHighlights',
        label: 'Conference Highlights',
        order: 5,
        content: {
          title: 'Conference Highlights',
          description: 'Reliving a decade of scientific advancement.',
          highlights: [
            { yearRange: '2011 to 2015', title: 'Initial Assemblies', image: 'https://placehold.co/224x192' },
            { yearRange: '2016', title: 'Three Global Summits', image: 'https://placehold.co/224x192' },
            { yearRange: '2017', title: 'Interaction & Forum', image: 'https://placehold.co/224x192' },
            { yearRange: '2018', title: 'Expansion in Sweden', image: 'https://placehold.co/224x192' },
            { yearRange: '2019', title: 'Global Roadmaps', image: 'https://placehold.co/224x192' }
          ]
        }
      },
      {
        id: 'eventSDGs',
        label: 'UNSDGs Commitments',
        order: 6,
        content: {
          title: 'UNSDGs Commitments',
          description: 'EAEMC 2026 is strictly aligned with the United Nations Sustainable Development Goals, ensuring our research has direct global impact.',
          reportText: 'Read Full Impact Report',
          reportLink: '#',
          goals: [
            { number: 'Goal 7', title: 'Clean Energy', description: 'Promoting cutting-edge sustainable energy solutions and infrastructure.', bgColor: '#DBEAFE', iconColor: '#2563EB' },
            { number: 'Goal 13', title: 'Climate Action', description: 'Advancing materials technologies to actively combat global climate change.', bgColor: '#DCFCE7', iconColor: '#16A34A' },
            { number: 'Goal 9', title: 'Innovation', description: 'Encouraging innovation and sustainable industrial growth in energy materials.', bgColor: '#FFEDD5', iconColor: '#EA580C' },
            { number: 'Goal 17', title: 'Partnerships', description: 'Fostering global interdisciplinary collaboration and academic partnerships.', bgColor: '#F3E8FF', iconColor: '#9333EA' }
          ]
        }
      },
      {
        id: 'eventPublications',
        label: 'Indexed Publications',
        order: 7,
        content: {
          title: 'Indexed Publications',
          description: 'Disseminating groundbreaking research through globally recognized and indexed academic channels.',
          publications: [
            { title: 'Congress Proceedings', description: 'All accepted abstracts and papers are published with ISBN and DOI indexing, and submitted for Scopus evaluation.', linkText: 'View Guidelines', linkUrl: '/congress-proceedings' },
            { title: 'Advanced Materials Letters', description: 'The official open-access journal of IAAM, providing a high-impact platform with no subscription fees for researchers.', linkText: 'Learn More', linkUrl: '#' },
            { title: 'Video Proceedings', description: 'An innovative open-access video journal dedicated to documented lectures and visual scientific presentations.', linkText: 'Watch Now', linkUrl: '#' }
          ]
        }
      }
    ];

    for (const sec of defaultSections) {
      const existing = await prisma.section.findUnique({
        where: { pageId_id: { pageId, id: sec.id } }
      });
      if (!existing) {
        await prisma.section.create({
          data: {
            id: sec.id,
            pageId,
            label: sec.label,
            visible: true,
            order: sec.order,
            content: JSON.stringify(sec.content),
            draftContent: null
          }
        });
      }
    }
  } catch (err) {
    console.error('Failed to auto-seed event details:', err);
  }
}

let _assembliesMigrated = false;

async function migrateAssembliesTabsOnce() {
  if (_assembliesMigrated) return false;
  try {
    const section = await prisma.section.findUnique({
      where: { pageId_id: { pageId: 'assemblies', id: 'assembliesTabs' } }
    });
    if (section && section.content) {
      const content = JSON.parse(section.content);
      let needsUpdate = false;
      const updatedTabs = (content.tabs || []).map(tab => {
        if (tab.label === 'Fellow Assemblies' && tab.link === '#') {
          tab.link = '/individual-events';
          needsUpdate = true;
        }
        if (tab.label === 'Advanced Materials Lecture Series' && tab.link === '#') {
          tab.link = '/congress-proceedings';
          needsUpdate = true;
        }
        if (tab.label === 'Contact Us' && tab.link === '/contacts') {
          tab.link = '/#contacts';
          needsUpdate = true;
        }
        return tab;
      });

      if (needsUpdate) {
        await prisma.section.update({
          where: { pageId_id: { pageId: 'assemblies', id: 'assembliesTabs' } },
          data: { content: JSON.stringify({ ...content, tabs: updatedTabs }) }
        });
        console.log('[Migration] Migrated assembliesTabs links successfully.');
      }
    }
    _assembliesMigrated = true;
    return true;
  } catch (err) {
    console.error('Failed to migrate assembliesTabs on the fly:', err);
    return false;
  }
}

export function validateId(id) {
  return typeof id === 'string' && /^[a-zA-Z0-9_-]+$/.test(id);
}

function safeParseJson(str) {
  if (!str) return {};
  try {
    return JSON.parse(str);
  } catch {
    return {};
  }
}

/**
 * Server-side HTML sanitizer for fields written via the rich-text editor.
 *
 * The admin rich-text editor emits arbitrary HTML. The public site currently
 * renders these fields as escaped text (no `dangerouslySetInnerHTML`), which
 * means stored XSS payloads are inert today — but they sit in the DB waiting
 * for the first person who flips the rendering to `innerHTML` to become a
 * working exploit. We sanitize on write so the invariant is safe by
 * construction, not by the mercy of every template.
 *
 * Approach: allowlist of safe formatting tags + attributes. No new runtime
 * dependencies (per project policy). Strip everything else. This is not a
 * replacement for DOMPurify for untrusted external HTML, but the only
 * authors are authenticated admins using a constrained editor.
 */
const ALLOWED_TAGS = new Set([
  'p', 'br', 'strong', 'b', 'em', 'i', 'u', 's', 'u',
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'ul', 'ol', 'li',
  'blockquote', 'a', 'span', 'div',
]);
const ALLOWED_ATTRS = {
  '*': new Set(['class']),
  a: new Set(['href', 'title', 'rel', 'target']),
};

function sanitizeHtml(input) {
  if (typeof input !== 'string' || input.length === 0) return input;
  // Reject any obvious script/style/iframe/embed/object payloads outright.
  if (/<(script|style|iframe|object|embed|link|meta|base)\b/i.test(input)) {
    // Strip them rather than reject the whole document so a stray whitespace
    // inside a tag doesn't break legitimate edits.
    input = input.replace(/<(script|style|iframe|object|embed|link|meta|base)\b[^>]*>[\s\S]*?<\/\1>/gi, '');
    input = input.replace(/<(script|style|iframe|object|embed|link|meta|base)\b[^>]*\/?>/gi, '');
  }
  // Strip event handlers (on*) and javascript: URLs.
  input = input.replace(/\s+on[a-z]+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, '');
  input = input.replace(/(href|src)\s*=\s*("javascript:[^"]*"|'javascript:[^']*'|javascript:[^\s>]+)/gi, '$1="#"');
  // Walk tags via a simple state machine; keep only allowlisted tags + attrs.
  return input.replace(/<\/?([a-zA-Z][a-zA-Z0-9]*)\b([^>]*)>/g, (match, rawTag, rawAttrs) => {
    const tag = rawTag.toLowerCase();
    if (!ALLOWED_TAGS.has(tag)) {
      // For tags we don't allow, drop the content too (safer than keeping text).
      return '';
    }
    const allowed = ALLOWED_ATTRS[tag] || ALLOWED_ATTRS['*'];
    const keptAttrs = [];
    rawAttrs.replace(/([a-zA-Z_:][-a-zA-Z0-9_:.]*)\s*=\s*("([^"]*)"|'([^']*)'|([^\s>]+))/g, (_m, name, _v, dq, sq, bare) => {
      const lname = name.toLowerCase();
      if (!allowed.has(lname)) return '';
      const value = dq ?? sq ?? bare ?? '';
      // Force external links to open safely.
      if (tag === 'a' && lname === 'href' && /^https?:\/\//i.test(value)) {
        keptAttrs.push('target="_blank"', 'rel="noopener noreferrer"');
        return '';
      }
      keptAttrs.push(`${name}="${value.replace(/"/g, '&quot;')}"`);
      return '';
    });
    const isClosing = match.startsWith('</');
    const attrStr = keptAttrs.length ? ' ' + keptAttrs.join(' ') : '';
    return isClosing ? `</${tag}>` : `<${tag}${attrStr}>`;
  });
}

/**
 * Recursively sanitize string values inside an object. Non-string values
 * (numbers, booleans, null, arrays of primitives) pass through unchanged.
 */
function sanitizeContent(value) {
  if (typeof value === 'string') return sanitizeHtml(value);
  if (Array.isArray(value)) return value.map(sanitizeContent);
  if (value && typeof value === 'object') {
    const out = {};
    for (const k of Object.keys(value)) out[k] = sanitizeContent(value[k]);
    return out;
  }
  return value;
}

export async function getPages() {
  const pages = await prisma.page.findMany({
    include: {
      sections: { orderBy: { order: 'asc' } },
    },
  });

  return {
    pages: pages.map((page) => ({
      ...page,
      sections: page.sections.map((sec) => ({
        ...sec,
        content: safeParseJson(sec.content),
      })),
    })),
  };
}

export async function getPageLayout(pageId, preview = false) {
  if (!validateId(pageId)) throw new Error('Invalid page ID');

  let sections = await prisma.section.findMany({
    where: { pageId },
    orderBy: { order: 'asc' },
  });

  if (pageId === 'assemblies') {
    if (sections.length === 0) {
      await seedAssembliesOnTheFly();
      sections = await prisma.section.findMany({
        where: { pageId },
        orderBy: { order: 'asc' },
      });
    }
    // Perform one-time migration for tabs links; skip extra fetch if no change
    const didRun = await migrateAssembliesTabsOnce();
    if (didRun) {
      sections = await prisma.section.findMany({
        where: { pageId },
        orderBy: { order: 'asc' },
      });
    }
  }

  if (pageId === 'fellow-awards') {
    if (sections.length === 0) {
      await seedAwardsOnTheFly();
      sections = await prisma.section.findMany({
        where: { pageId },
        orderBy: { order: 'asc' },
      });
    }
  }

  if (pageId.startsWith('event-')) {
    if (sections.length < 7) {
      await seedEventOnTheFly(pageId);
      sections = await prisma.section.findMany({
        where: { pageId },
        orderBy: { order: 'asc' },
      });
    }
  }


  return {
    sections: sections.map((sec) => ({
      ...sec,
      content: safeParseJson((preview && sec.draftContent) ? sec.draftContent : sec.content),
    })),
  };
}

export async function updatePageLayout(pageId, layout) {
  if (!validateId(pageId)) throw new Error('Invalid page ID');
  if (!Array.isArray(layout.sections)) throw new Error('Invalid layout');

  const updates = layout.sections
    .filter((sec) => validateId(sec.id))
    .map((sec) =>
      prisma.section.update({
        where: { pageId_id: { pageId, id: sec.id } },
        data: {
          order: typeof sec.order === 'number' ? sec.order : 0,
          visible: Boolean(sec.visible),
        },
      })
    );

  await prisma.$transaction(updates);

  // Backup layout configuration
  const cleanSections = layout.sections
    .filter((sec) => validateId(sec.id))
    .map((s) => ({
      id: s.id,
      order: typeof s.order === 'number' ? s.order : 0,
      visible: Boolean(s.visible),
    }));
  backupPageLayout(pageId, cleanSections).catch((err) =>
    console.error(`[Backup] Page layout for ${pageId} failed:`, err)
  );
}

export async function readPageSectionData(pageId, sectionId, preview = false) {
  if (!validateId(pageId) || !validateId(sectionId)) {
    throw new Error('Invalid page or section ID');
  }

  let section = await prisma.section.findUnique({
    where: { pageId_id: { pageId, id: sectionId } },
  });

  if (pageId === 'assemblies' && !section) {
    await seedAssembliesOnTheFly();
    section = await prisma.section.findUnique({
      where: { pageId_id: { pageId, id: sectionId } },
    });
  }

  if (pageId === 'fellow-awards' && !section) {
    await seedAwardsOnTheFly();
    section = await prisma.section.findUnique({
      where: { pageId_id: { pageId, id: sectionId } },
    });
  }

  if (pageId.startsWith('event-') && !section) {
    await seedEventOnTheFly(pageId);
    section = await prisma.section.findUnique({
      where: { pageId_id: { pageId, id: sectionId } },
    });
  }

  return safeParseJson((preview && section?.draftContent) ? section.draftContent : section?.content);
}

export async function writePageSectionData(pageId, sectionId, data, asDraft = false) {
  if (!validateId(pageId) || !validateId(sectionId)) {
    throw new Error('Invalid page or section ID');
  }

  if (typeof data !== 'object' || data === null || Array.isArray(data)) {
    throw new Error('Content must be a plain object');
  }

  // Sanitize HTML strings on write (defense against stored XSS).
  const sanitized = sanitizeContent(data);
  const strData = JSON.stringify(sanitized);

  if (asDraft) {
    // Drafts: only update draftContent. Do NOT touch history. Do NOT write
    // a JSON backup — drafts may be partial/abandoned, and overwriting the
    // canonical backup with draft content breaks the file-system fallback.
    await prisma.section.update({
      where: { pageId_id: { pageId, id: sectionId } },
      data: { draftContent: strData },
    });
    return;
  }

  // Publish path: snapshot the previous content into history AND replace the
  // live content atomically. If the new content equals the old content, skip
  // the history write so we don't bloat SectionHistory with no-op rows.
  // Both writes share a single Prisma transaction.
  const current = await prisma.section.findUnique({
    where: { pageId_id: { pageId, id: sectionId } },
  });

  if (!current) {
    throw new Error('Section not found');
  }

  if (current.content !== strData) {
    await prisma.$transaction(async (tx) => {
      if (current.content) {
        await tx.sectionHistory.create({
          data: {
            sectionId,
            pageId,
            content: current.content,
          },
        });
      }
      await tx.section.update({
        where: { pageId_id: { pageId, id: sectionId } },
        data: { content: strData, draftContent: null },
      });
    });
  } else {
    // No-op publish: still clear any stale draft.
    if (current.draftContent !== null) {
      await prisma.section.update({
        where: { pageId_id: { pageId, id: sectionId } },
        data: { draftContent: null },
      });
    }
  }

  // Backup the published content to JSON in the background. Failures here
  // are logged but do not fail the publish (DB is source of truth).
  backupPageSection(pageId, sectionId, sanitized).catch((err) =>
    console.error(`[Backup] ${pageId}/${sectionId} failed:`, err)
  );

  // Sync Event page sections content with main Event model on publish path
  if (!asDraft && pageId.startsWith('event-')) {
    const eventId = pageId.slice(6);
    let eventUpdated = false;
    
    if (sectionId === 'eventHero') {
      await prisma.event.update({
        where: { id: eventId },
        data: {
          title: sanitized.title,
          date: sanitized.date,
          location: sanitized.location,
          image: sanitized.backgroundImage
        }
      });
      eventUpdated = true;
    } else if (sectionId === 'eventIntro') {
      await prisma.event.update({
        where: { id: eventId },
        data: {
          description: sanitized.paragraphs?.[0] || ''
        }
      });
      eventUpdated = true;
    }

    if (eventUpdated) {
      const allItems = await prisma.event.findMany({ orderBy: { order: 'asc' } });
      backupCollection('events', allItems).catch(console.error);
    }
  }
}

export async function getEventsWithDetails(eventType) {
  const dbEvents = await prisma.event.findMany({
    where: { eventType },
    orderBy: { order: 'asc' }
  });

  if (dbEvents.length === 0) return [];

  // Batch-fetch all sections for all events in a single query (N+1 fix)
  const pageIds = dbEvents.map((e) => `event-${e.id}`);
  const allSections = await prisma.section.findMany({
    where: { pageId: { in: pageIds } }
  });

  const sectionsByPage = new Map();
  for (const sec of allSections) {
    if (!sectionsByPage.has(sec.pageId)) {
      sectionsByPage.set(sec.pageId, []);
    }
    sectionsByPage.get(sec.pageId).push(sec);
  }

  return dbEvents.map((event) => {
    const pageId = `event-${event.id}`;
    const sections = sectionsByPage.get(pageId) || [];
    const heroSec = sections.find((s) => s.id === 'eventHero');
    const introSec = sections.find((s) => s.id === 'eventIntro');
    const heroContent = heroSec ? safeParseJson(heroSec.content) : {};
    const introContent = introSec ? safeParseJson(introSec.content) : {};

    return {
      ...event,
      title: heroContent.title || event.title,
      date: heroContent.date || event.date || '',
      location: heroContent.location || event.location || '',
      image: event.image || heroContent.backgroundImage || '',
      description: event.description || (introContent.paragraphs && introContent.paragraphs[0]) || ''
    };
  });
}
