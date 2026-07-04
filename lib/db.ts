import path from "node:path";
import { PrismaClient } from "./generated/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

function resolveDatabaseUrl() {
  const envUrl = process.env.DATABASE_URL;
  if (!envUrl) {
    return "file:" + process.cwd().replace(/\\/g, "/") + "/dev.db";
  }
  // For non-sqlite URLs (e.g. Postgres in production) use as-is.
  if (!envUrl.startsWith("file:")) return envUrl;
  // Resolve relative sqlite paths against cwd so the app always opens the same
  // file regardless of the directory the process is launched from.
  const filePart = envUrl.slice("file:".length);
  const abs = path.isAbsolute(filePart)
    ? filePart
    : path.resolve(process.cwd(), filePart);
  return "file:" + abs.replace(/\\/g, "/");
}

function createPrismaClient() {
  const adapter = new PrismaBetterSqlite3({ url: resolveDatabaseUrl() });
  return new PrismaClient({ adapter });
}

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
