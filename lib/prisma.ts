import { PrismaClient } from '../app/generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { withAccelerate } from '@prisma/extension-accelerate'

const createClient = () => {
  const url = process.env.DATABASE_URL
  if (!url) throw new Error('Missing or empty DATABASE_URL')
  if (url.startsWith('prisma+postgres://')) {
    return new PrismaClient({ accelerateUrl: url }).$extends(withAccelerate())
  }
  // Normalize deprecated SSL modes to verify-full to silence the pg warning
  // about prefer/require/verify-ca becoming libpq-compatible in pg v9.
  const normalizedUrl = url.replace(
    /([?&])sslmode=(prefer|require|verify-ca)(&|$)/g,
    (_, sep, _mode, end) => `${sep}sslmode=verify-full${end}`,
  )
  const adapter = new PrismaPg({ connectionString: normalizedUrl })
  return new PrismaClient({ adapter })
}

// Cast to PrismaClient to resolve union overload incompatibility between the
// Accelerate-extended and adapter-based branches of createClient.
const globalForPrisma = global as typeof globalThis & {
  prisma?: PrismaClient
}

export const prisma: PrismaClient =
  (globalForPrisma.prisma ?? createClient()) as unknown as PrismaClient

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}

export default prisma
