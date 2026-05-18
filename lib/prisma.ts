import { PrismaClient } from '../app/generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { withAccelerate } from '@prisma/extension-accelerate'

const createClient = () => {
  const url = process.env.DATABASE_URL ?? ''
  if (url.startsWith('prisma+postgres://')) {
    return new PrismaClient({ accelerateUrl: url }).$extends(withAccelerate())
  }
  const adapter = new PrismaPg({ connectionString: url })
  return new PrismaClient({ adapter })
}

type PrismaClientSingleton = ReturnType<typeof createClient>

const globalForPrisma = global as typeof globalThis & {
  prisma?: PrismaClientSingleton
}

export const prisma: PrismaClientSingleton =
  globalForPrisma.prisma ?? createClient()

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}

export default prisma
