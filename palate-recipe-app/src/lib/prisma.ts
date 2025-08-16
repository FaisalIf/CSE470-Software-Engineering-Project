import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ["error"],
    datasources: {
      db: {
        // Ensure Prisma disables prepared statements under PgBouncer transaction pooling
        // See: https://www.prisma.io/docs/guides/performance-and-optimization/connection-management#pgbouncer
        url: process.env.DATABASE_URL
          ? `${process.env.DATABASE_URL}${
              process.env.DATABASE_URL.includes("?") ? "&" : "?"
            }pgbouncer=true&connection_limit=1&pool_timeout=0`
          : undefined,
      },
    },
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
