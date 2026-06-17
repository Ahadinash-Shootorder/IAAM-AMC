import fs from 'fs/promises';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');

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
 * Backs up a specific page section to data/pages/[pageId]/[sectionId].json
 */
export async function backupPageSection(pageId, sectionId, data) {
  try {
    const pageDir = path.join(DATA_DIR, 'pages', pageId);
    await ensureDir(pageDir);
    const filePath = path.join(pageDir, `${sectionId}.json`);
    await fs.writeFile(filePath, JSON.stringify(data, null, 2));
    console.log(`[Backup] Saved ${pageId}/${sectionId}.json`);
  } catch (error) {
    console.error(`[Backup Error] Failed to backup page section ${pageId}/${sectionId}:`, error);
  }
}

/**
 * Backs up a full collection array to data/[collectionName].json
 */
export async function backupCollection(collectionName, items) {
  try {
    await ensureDir(DATA_DIR);
    const filePath = path.join(DATA_DIR, `${collectionName}.json`);
    await fs.writeFile(filePath, JSON.stringify(items, null, 2));
    console.log(`[Backup] Saved ${collectionName}.json`);
  } catch (error) {
    console.error(`[Backup Error] Failed to backup collection ${collectionName}:`, error);
  }
}
