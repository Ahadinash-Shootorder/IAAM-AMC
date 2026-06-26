import { PrismaClient } from '@prisma/client';
import path from 'path';

// Force DATABASE_URL to use SQLite in production/runtime if it is missing or is set to a non-sqlite URL
if (!process.env.DATABASE_URL || !process.env.DATABASE_URL.startsWith('file:')) {
  const dbPath = path.join(process.cwd(), 'prisma', 'dev.db');
  process.env.DATABASE_URL = `file:${dbPath}`;
}

let prisma;

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient();
} else {
  if (!global.prisma_v2) {
    global.prisma_v2 = new PrismaClient();
  }
  prisma = global.prisma_v2;
}

export default prisma;
