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
}
