import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

import prisma from '@/lib/prisma'

type RouteContext = { params: Promise<{ projectId: string }> }

export async function PATCH(request: Request, { params }: RouteContext) {
  const { userId } = await auth()
  if (!userId) {
    return NextResponse.json(
      { error: { code: 'UNAUTHENTICATED', message: 'Authentication required.' } },
      { status: 401 },
    )
  }

  const { projectId } = await params

  const project = await prisma.project.findFirst({
    where: { id: projectId },
    select: { ownerId: true },
  })

  if (!project) {
    return NextResponse.json(
      { error: { code: 'NOT_FOUND', message: 'Project not found.' } },
      { status: 404 },
    )
  }

  if (project.ownerId !== userId) {
    return NextResponse.json(
      { error: { code: 'FORBIDDEN', message: 'Only the project owner can rename this project.' } },
      { status: 403 },
    )
  }

  let name: string
  try {
    const body: unknown = await request.json()
    if (
      !body ||
      typeof body !== 'object' ||
      !('name' in body) ||
      typeof (body as Record<string, unknown>).name !== 'string' ||
      !((body as Record<string, unknown>).name as string).trim()
    ) {
      return NextResponse.json(
        { error: { code: 'INVALID_INPUT', message: 'A non-empty name is required.' } },
        { status: 422 },
      )
    }
    name = ((body as Record<string, unknown>).name as string).trim()
  } catch {
    return NextResponse.json(
      { error: { code: 'INVALID_INPUT', message: 'Request body must be valid JSON.' } },
      { status: 422 },
    )
  }

  const updated = await prisma.project.update({
    where: { id: projectId },
    data: { name },
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

  return NextResponse.json({ data: updated })
}

export async function DELETE(_request: Request, { params }: RouteContext) {
  const { userId } = await auth()
  if (!userId) {
    return NextResponse.json(
      { error: { code: 'UNAUTHENTICATED', message: 'Authentication required.' } },
      { status: 401 },
    )
  }

  const { projectId } = await params

  const project = await prisma.project.findFirst({
    where: { id: projectId },
    select: { ownerId: true },
  })

  if (!project) {
    return NextResponse.json(
      { error: { code: 'NOT_FOUND', message: 'Project not found.' } },
      { status: 404 },
    )
  }

  if (project.ownerId !== userId) {
    return NextResponse.json(
      { error: { code: 'FORBIDDEN', message: 'Only the project owner can delete this project.' } },
      { status: 403 },
    )
  }

  await prisma.project.delete({ where: { id: projectId } })

  return new NextResponse(null, { status: 204 })
}
