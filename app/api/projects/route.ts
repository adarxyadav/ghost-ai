import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

import prisma from '@/lib/prisma'

export async function GET() {
  const { userId } = await auth()
  if (!userId) {
    return NextResponse.json(
      { error: { code: 'UNAUTHENTICATED', message: 'Authentication required.' } },
      { status: 401 },
    )
  }

  const projects = await prisma.project.findMany({
    where: { ownerId: userId },
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      name: true,
      description: true,
      status: true,
      canvasJsonPath: true,
      createdAt: true,
      updatedAt: true,
    },
  })

  return NextResponse.json({ data: projects })
}

export async function POST(request: Request) {
  const { userId } = await auth()
  if (!userId) {
    return NextResponse.json(
      { error: { code: 'UNAUTHENTICATED', message: 'Authentication required.' } },
      { status: 401 },
    )
  }

  let name: string | undefined
  let customId: string | undefined
  try {
    const body: unknown = await request.json()
    if (body && typeof body === 'object') {
      const b = body as Record<string, unknown>
      if ('name' in b && typeof b.name === 'string') {
        name = (b.name as string).trim() || undefined
      }
      if ('id' in b && typeof b.id === 'string') {
        const rawId = (b.id as string).trim()
        // accept only lowercase alphanumeric + hyphens, 3–100 chars
        if (/^[a-z0-9][a-z0-9-]{1,98}[a-z0-9]$/.test(rawId)) {
          customId = rawId
        }
      }
    }
  } catch {
    // body is optional; missing or non-JSON body uses default name
  }

  const project = await prisma.project.create({
    data: {
      ...(customId ? { id: customId } : {}),
      ownerId: userId,
      name: name ?? 'Untitled Project',
    },
    select: {
      id: true,
      name: true,
      description: true,
      status: true,
      canvasJsonPath: true,
      createdAt: true,
      updatedAt: true,
    },
  })

  return NextResponse.json({ data: project }, { status: 201 })
}
