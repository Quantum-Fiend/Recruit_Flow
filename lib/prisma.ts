import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = (globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
})).$extends({
  query: {
    $allModels: {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      async findMany({ model, args, query }: any) {
        const prismaArgs = args || {}
        if (model === 'Job' || model === 'Application' || model === 'User') {
          prismaArgs.where = { ...prismaArgs.where, deletedAt: null }
        }
        return query(prismaArgs)
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      async findFirst({ model, args, query }: any) {
        const prismaArgs = args || {}
        if (model === 'Job' || model === 'Application' || model === 'User') {
          prismaArgs.where = { ...prismaArgs.where, deletedAt: null }
        }
        return query(prismaArgs)
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      async findUnique({ model, args, query }: any) {
        const prismaArgs = args || {}
        if (model === 'Job' || model === 'Application' || model === 'User') {
          prismaArgs.where = { ...prismaArgs.where, deletedAt: null }
        }
        return query(prismaArgs)
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      async findUniqueOrThrow({ model, args, query }: any) {
        const prismaArgs = args || {}
        if (model === 'Job' || model === 'Application' || model === 'User') {
          prismaArgs.where = { ...prismaArgs.where, deletedAt: null }
        }
        return query(prismaArgs)
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      async count({ model, args, query }: any) {
        const prismaArgs = args || {}
        if (model === 'Job' || model === 'Application' || model === 'User') {
          prismaArgs.where = { ...prismaArgs.where, deletedAt: null }
        }
        return query(prismaArgs)
      },
    }
  }
})

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma as unknown as PrismaClient
