import { auth, clerkClient, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import prisma from "@/lib/prisma";

type RouteContext = { params: Promise<{ projectId: string }> };

type CollaboratorRow = { collaboratorEmail: string; createdAt: Date };

async function enrichWithClerk(
  rows: CollaboratorRow[],
): Promise<
  { email: string; addedAt: string; name: string | null; avatarUrl: string | null }[]
> {
  const emails = rows.map((r) => r.collaboratorEmail);

  const enrichMap = new Map<
    string,
    { name: string | null; avatarUrl: string | null }
  >();

  if (emails.length > 0) {
    try {
      const client = await clerkClient();
      const { data: users } = await client.users.getUserList({
        emailAddress: emails,
        limit: 100,
      });
      for (const u of users) {
        const primary = u.emailAddresses.find(
          (e) => e.id === u.primaryEmailAddressId,
        )?.emailAddress;
        if (primary) {
          const name =
            [u.firstName, u.lastName].filter(Boolean).join(" ") ||
            u.username ||
            null;
          enrichMap.set(primary, {
            name,
            avatarUrl: u.imageUrl || null,
          });
        }
      }
    } catch {
      // Clerk enrichment is best-effort; fall back to email-only
    }
  }

  return rows.map((r) => ({
    email: r.collaboratorEmail,
    addedAt: r.createdAt.toISOString(),
    ...(enrichMap.get(r.collaboratorEmail) ?? { name: null, avatarUrl: null }),
  }));
}

function parseEmailBody(
  body: unknown,
): { email: string } | { error: string } {
  if (
    !body ||
    typeof body !== "object" ||
    !("email" in body) ||
    typeof (body as Record<string, unknown>).email !== "string" ||
    !((body as Record<string, unknown>).email as string).trim()
  ) {
    return { error: "A valid email is required." };
  }
  return {
    email: ((body as Record<string, unknown>).email as string)
      .trim()
      .toLowerCase(),
  };
}

export async function GET(_request: Request, { params }: RouteContext) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json(
      { error: { code: "UNAUTHENTICATED", message: "Authentication required." } },
      { status: 401 },
    );
  }

  const { projectId } = await params;

  const project = await prisma.project.findFirst({
    where: { id: projectId },
    select: { ownerId: true },
  });

  if (!project) {
    return NextResponse.json(
      { error: { code: "NOT_FOUND", message: "Project not found." } },
      { status: 404 },
    );
  }

  const isOwner = project.ownerId === userId;

  if (!isOwner) {
    const user = await currentUser();
    const email = user?.emailAddresses?.[0]?.emailAddress ?? null;
    if (!email) {
      return NextResponse.json(
        { error: { code: "FORBIDDEN", message: "Access denied." } },
        { status: 403 },
      );
    }
    const collab = await prisma.projectCollaborator.findFirst({
      where: { projectId, collaboratorEmail: email },
      select: { projectId: true },
    });
    if (!collab) {
      return NextResponse.json(
        { error: { code: "FORBIDDEN", message: "Access denied." } },
        { status: 403 },
      );
    }
  }

  const rows = await prisma.projectCollaborator.findMany({
    where: { projectId },
    orderBy: { createdAt: "asc" },
    select: { collaboratorEmail: true, createdAt: true },
  });

  const collaborators = await enrichWithClerk(rows);

  return NextResponse.json({
    data: {
      role: isOwner ? "owner" : "collaborator",
      collaborators,
    },
  });
}

export async function POST(request: Request, { params }: RouteContext) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json(
      { error: { code: "UNAUTHENTICATED", message: "Authentication required." } },
      { status: 401 },
    );
  }

  const { projectId } = await params;

  const project = await prisma.project.findFirst({
    where: { id: projectId },
    select: { ownerId: true },
  });

  if (!project) {
    return NextResponse.json(
      { error: { code: "NOT_FOUND", message: "Project not found." } },
      { status: 404 },
    );
  }

  if (project.ownerId !== userId) {
    return NextResponse.json(
      {
        error: {
          code: "FORBIDDEN",
          message: "Only the project owner can invite collaborators.",
        },
      },
      { status: 403 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      {
        error: {
          code: "INVALID_INPUT",
          message: "Request body must be valid JSON.",
        },
      },
      { status: 422 },
    );
  }

  const parsed = parseEmailBody(body);
  if ("error" in parsed) {
    return NextResponse.json(
      { error: { code: "INVALID_INPUT", message: parsed.error } },
      { status: 422 },
    );
  }

  const { email } = parsed;

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json(
      { error: { code: "INVALID_INPUT", message: "Invalid email address." } },
      { status: 422 },
    );
  }

  const record = await prisma.projectCollaborator.upsert({
    where: {
      projectId_collaboratorEmail: { projectId, collaboratorEmail: email },
    },
    create: { projectId, collaboratorEmail: email },
    update: {},
    select: { collaboratorEmail: true, createdAt: true },
  });

  return NextResponse.json(
    {
      data: {
        email: record.collaboratorEmail,
        addedAt: record.createdAt.toISOString(),
      },
    },
    { status: 201 },
  );
}

export async function DELETE(request: Request, { params }: RouteContext) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json(
      { error: { code: "UNAUTHENTICATED", message: "Authentication required." } },
      { status: 401 },
    );
  }

  const { projectId } = await params;

  const project = await prisma.project.findFirst({
    where: { id: projectId },
    select: { ownerId: true },
  });

  if (!project) {
    return NextResponse.json(
      { error: { code: "NOT_FOUND", message: "Project not found." } },
      { status: 404 },
    );
  }

  if (project.ownerId !== userId) {
    return NextResponse.json(
      {
        error: {
          code: "FORBIDDEN",
          message: "Only the project owner can remove collaborators.",
        },
      },
      { status: 403 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      {
        error: {
          code: "INVALID_INPUT",
          message: "Request body must be valid JSON.",
        },
      },
      { status: 422 },
    );
  }

  const parsed = parseEmailBody(body);
  if ("error" in parsed) {
    return NextResponse.json(
      { error: { code: "INVALID_INPUT", message: parsed.error } },
      { status: 422 },
    );
  }

  await prisma.projectCollaborator.deleteMany({
    where: { projectId, collaboratorEmail: parsed.email },
  });

  return new NextResponse(null, { status: 204 });
}
