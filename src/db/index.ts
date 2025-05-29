// src/db/index.ts or wherever you define your Prisma client
import { PrismaClient } from '@/generated/prisma'


declare global {
  // Correctly extend the globalThis object
  var cachedPrisma: PrismaClient | undefined
}

const globalForPrisma = globalThis as typeof globalThis & {
  cachedPrisma?: PrismaClient
}

const prisma = globalForPrisma.cachedPrisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.cachedPrisma = prisma
}

export const db = prisma
