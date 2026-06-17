import { PrismaClient } from '@prisma/client';

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
