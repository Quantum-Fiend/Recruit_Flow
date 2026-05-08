import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

const basePrisma = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
})

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = basePrisma

export { basePrisma }

export const prisma = basePrisma.$extends({
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
