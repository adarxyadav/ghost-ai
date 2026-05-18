import { auth, currentUser } from "@clerk/nextjs/server";

import prisma from "@/lib/prisma";
import type { ProjectRecord } from "@/types/project";

export async function getProjectsForCurrentUser(): Promise<{
  owned: ProjectRecord[];
  shared: ProjectRecord[];
}> {
  const { userId } = await auth();
  if (!userId) return { owned: [], shared: [] };

  const user = await currentUser();
  const email = user?.emailAddresses?.[0]?.emailAddress ?? null;

  const [ownedRows, sharedRows] = await Promise.all([
    prisma.project.findMany({
      where: { ownerId: userId },
      orderBy: { createdAt: "desc" },
      select: { id: true, name: true },
    }),
    email
      ? prisma.projectCollaborator.findMany({
          where: { collaboratorEmail: email },
          orderBy: { createdAt: "desc" },
          select: { project: { select: { id: true, name: true } } },
        })
      : Promise.resolve([]),
  ]);

  return {
    owned: ownedRows.map((p) => ({ ...p, role: "owner" as const })),
    shared: sharedRows.map((c) => ({ ...c.project, role: "collaborator" as const })),
  };
}
