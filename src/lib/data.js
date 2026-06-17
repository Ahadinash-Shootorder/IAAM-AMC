import prisma from './db';
import { backupPageSection } from './backup';

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

  const sections = await prisma.section.findMany({
    where: { pageId },
    orderBy: { order: 'asc' },
  });

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
}

export async function readPageSectionData(pageId, sectionId, preview = false) {
  if (!validateId(pageId) || !validateId(sectionId)) {
    throw new Error('Invalid page or section ID');
  }

  const section = await prisma.section.findUnique({
    where: { pageId_id: { pageId, id: sectionId } },
  });

  return safeParseJson((preview && section?.draftContent) ? section.draftContent : section?.content);
}

export async function writePageSectionData(pageId, sectionId, data, asDraft = false) {
  if (!validateId(pageId) || !validateId(sectionId)) {
    throw new Error('Invalid page or section ID');
  }

  if (typeof data !== 'object' || data === null || Array.isArray(data)) {
    throw new Error('Content must be a plain object');
  }

  const strData = JSON.stringify(data);

  if (asDraft) {
    await prisma.section.update({
      where: { pageId_id: { pageId, id: sectionId } },
      data: { draftContent: strData },
    });
  } else {
    // If publishing, save current content to history first
    const current = await prisma.section.findUnique({
      where: { pageId_id: { pageId, id: sectionId } }
    });
    
    if (current && current.content) {
      await prisma.sectionHistory.create({
        data: {
          sectionId,
          pageId,
          content: current.content
        }
      });
    }

    await prisma.section.update({
      where: { pageId_id: { pageId, id: sectionId } },
      data: { content: strData, draftContent: null },
    });
  }

  // Backup to JSON in background
  backupPageSection(pageId, sectionId, data).catch(console.error);
}
