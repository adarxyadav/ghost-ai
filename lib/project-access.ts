import { auth, currentUser } from "@clerk/nextjs/server";

import prisma from "@/lib/prisma";

export type ProjectIdentity = {
  userId: string;
  email: string | null;
};

export type ProjectAccess = {
  id: string;
  name: string;
  role: "owner" | "collaborator";
};

export async function getCurrentIdentity(): Promise<ProjectIdentity | null> {
  const { userId } = await auth();
  if (!userId) return null;
  const user = await currentUser();
  const email = user?.emailAddresses?.[0]?.emailAddress ?? null;
  return { userId, email };
}

export async function getProjectAccess(
  projectId: string,
  identity: ProjectIdentity,
): Promise<ProjectAccess | null> {
  const project = await prisma.project.findFirst({
    where: { id: projectId },
    select: { id: true, name: true, ownerId: true },
  });

  if (!project) return null;

  if (project.ownerId === identity.userId) {
    return { id: project.id, name: project.name, role: "owner" };
  }

  if (identity.email) {
    const collab = await prisma.projectCollaborator.findFirst({
      where: { projectId, collaboratorEmail: identity.email.toLowerCase() },
      select: { projectId: true },
    });
    if (collab) {
      return { id: project.id, name: project.name, role: "collaborator" };
    }
  }

  return null;
}
