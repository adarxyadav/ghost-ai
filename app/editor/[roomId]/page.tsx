import { redirect } from "next/navigation";

import { AccessDenied } from "@/components/editor/access-denied";
import { WorkspaceShell } from "@/components/editor/workspace-shell";
import { getCurrentIdentity, getProjectAccess } from "@/lib/project-access";
import { getProjectsForCurrentUser } from "@/lib/projects";

type Props = {
  params: Promise<{ roomId: string }>;
};

export default async function WorkspacePage({ params }: Props) {
  const { roomId } = await params;

  const identity = await getCurrentIdentity();
  if (!identity) {
    redirect("/sign-in");
  }

  const [project, { owned, shared }] = await Promise.all([
    getProjectAccess(roomId, identity),
    getProjectsForCurrentUser(),
  ]);

  if (!project) {
    return <AccessDenied />;
  }

  return (
    <WorkspaceShell
      project={project}
      ownedProjects={owned}
      sharedProjects={shared}
      isOwner={project.role === "owner"}
    />
  );
}
