import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

const basePrisma = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
})

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = basePrisma

export { basePrisma }

type PrismaExtensionQueryArgs = {
  model: string;
  args?: unknown;
  query: (args?: unknown) => Promise<unknown>;
};

export const prisma = basePrisma.$extends({
  query: {
    $allModels: {
      async findMany({ model, args, query }: PrismaExtensionQueryArgs) {
        const prismaArgs = (args ?? {}) as Record<string, unknown>;
        if (model === "Job" || model === "Application" || model === "User") {
          prismaArgs.where = {
            ...((prismaArgs as Record<string, unknown>).where ?? {}),
            deletedAt: null,
          };
        }
        return query(prismaArgs);
      },
      async findFirst({ model, args, query }: PrismaExtensionQueryArgs) {
        const prismaArgs = (args ?? {}) as Record<string, unknown>;
        if (model === "Job" || model === "Application" || model === "User") {
          prismaArgs.where = {
            ...((prismaArgs as Record<string, unknown>).where ?? {}),
            deletedAt: null,
          };
        }
        return query(prismaArgs);
      },
      async findUnique({ model, args, query }: PrismaExtensionQueryArgs) {
        const result = await query(args);
        if (
          result &&
          (model === "Job" || model === "Application" || model === "User")
        ) {
          if ((result as { deletedAt?: unknown }).deletedAt !== null)
            return null;
        }
        return result;
      },
      async findUniqueOrThrow({
        model,
        args,
        query,
      }: PrismaExtensionQueryArgs) {
        const result = await query(args);
        if (
          result &&
          (model === "Job" || model === "Application" || model === "User")
        ) {
          if ((result as { deletedAt?: unknown }).deletedAt !== null)
            throw new Error(`${model} not found`);
        }
        return result;
      },
      async count({ model, args, query }: PrismaExtensionQueryArgs) {
        const prismaArgs = (args ?? {}) as Record<string, unknown>;
        if (model === "Job" || model === "Application" || model === "User") {
          prismaArgs.where = {
            ...((prismaArgs as Record<string, unknown>).where ?? {}),
            deletedAt: null,
          };
        }
        return query(prismaArgs);
      },
    },
  },
});
