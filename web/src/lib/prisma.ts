import type { PrismaClient as PrismaClientType } from "@prisma/client";
import prismaPkg from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const PrismaClient = (prismaPkg as unknown as {
  PrismaClient: new (...args: unknown[]) => PrismaClientType;
}).PrismaClient;

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClientType };
const globalForPgPool = globalThis as unknown as { pgPool?: Pool };

function getPgPool() {
  if (globalForPgPool.pgPool) return globalForPgPool.pgPool;
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });
  if (process.env.NODE_ENV !== "production") globalForPgPool.pgPool = pool;
  return pool;
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
    adapter: new PrismaPg(getPgPool()),
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
