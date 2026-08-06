import { PrismaClient } from '@prisma/client';
import { env } from './env.js';

const globalForPrisma = /** @type {typeof globalThis & { prisma?: PrismaClient }} */ (globalThis);

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: env.nodeEnv === 'development' ? ['warn', 'error'] : ['error'],
});

if (env.nodeEnv !== 'production') {
  globalForPrisma.prisma = prisma;
}
