import { PrismaClient } from "@prisma/client";

const appendOnlyAuditLogError =
  "AuditLog is append-only. Update and delete operations are not permitted.";

function createPrismaClient() {
  return new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  }).$extends({
    query: {
      auditLog: {
        update() {
          throw new Error(appendOnlyAuditLogError);
        },
        updateMany() {
          throw new Error(appendOnlyAuditLogError);
        },
        upsert() {
          throw new Error(appendOnlyAuditLogError);
        },
        delete() {
          throw new Error(appendOnlyAuditLogError);
        },
        deleteMany() {
          throw new Error(appendOnlyAuditLogError);
        },
      },
    },
  });
}

type PrismaClientSingleton = ReturnType<typeof createPrismaClient>;

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClientSingleton | undefined;
};

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
