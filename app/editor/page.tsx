import { getProjectsForCurrentUser } from "@/lib/projects";
import { EditorShell } from "@/components/editor/editor-shell";

export default async function EditorPage() {
  const { owned, shared } = await getProjectsForCurrentUser();
  return <EditorShell ownedProjects={owned} sharedProjects={shared} />;
}
