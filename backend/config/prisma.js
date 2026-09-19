import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

// Sanitize DATABASE_URL if enclosed in quotes or contains whitespace
let dbUrl = process.env.DATABASE_URL ? process.env.DATABASE_URL.trim().replace(/^["']|["']$/g, '') : '';
if (dbUrl) {
  process.env.DATABASE_URL = dbUrl;
}

const globalForPrisma = global;

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    datasources: dbUrl ? { db: { url: dbUrl } } : undefined,
    log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error']
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma;

