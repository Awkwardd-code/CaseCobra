// src/db/index.ts or wherever you define your Prisma client
import { PrismaClient } from '@prisma/client'


declare global {
  // Correctly extend the globalThis object
  let cachedPrisma: PrismaClient | undefined
}

const globalForPrisma = globalThis as typeof globalThis & {
  cachedPrisma?: PrismaClient
}

const prisma = globalForPrisma.cachedPrisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.cachedPrisma = prisma
}

export const db = prisma
