"use client";

import { useState } from "react";

import { EditorNavbar } from "@/components/editor/editor-navbar";
import { ProjectSidebar } from "@/components/editor/project-sidebar";
import { ShareDialog } from "@/components/editor/share-dialog";
import {
  CreateProjectDialog,
  DeleteProjectDialog,
  RenameProjectDialog,
} from "@/components/editor/project-dialogs";
import { useProjectActions } from "@/hooks/use-project-actions";
import type { ProjectRecord } from "@/types/project";

type WorkspaceShellProps = {
  project: { id: string; name: string };
  ownedProjects: ProjectRecord[];
  sharedProjects: ProjectRecord[];
  isOwner: boolean;
};

export function WorkspaceShell({
  project,
  ownedProjects,
  sharedProjects,
  isOwner,
}: WorkspaceShellProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAiSidebarOpen, setIsAiSidebarOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);

  const {
    dialogType,
    selectedProject,
    nameValue,
    roomIdPreview,
    isLoading,
    openCreate,
    openRename,
    openDelete,
    closeDialog,
    setNameValue,
    handleCreate,
    handleRename,
    handleDelete,
  } = useProjectActions(project.id);

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-background text-foreground">
      <EditorNavbar
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={() => setIsSidebarOpen((v) => !v)}
        projectName={project.name}
        isAiSidebarOpen={isAiSidebarOpen}
        onToggleAiSidebar={() => setIsAiSidebarOpen((v) => !v)}
        onShare={() => setIsShareOpen(true)}
      />

      <div className="flex flex-1 overflow-hidden pt-14">
        <main className="relative flex flex-1 items-center justify-center bg-background">
          <p className="text-sm text-muted-foreground">Canvas coming soon</p>
        </main>

        {isAiSidebarOpen && (
          <aside className="flex w-72 shrink-0 flex-col border-l border-border bg-card">
            <div className="flex h-12 shrink-0 items-center border-b border-border px-4">
              <span className="text-sm font-medium">AI Assistant</span>
            </div>
            <div className="flex flex-1 items-center justify-center p-4 text-sm text-muted-foreground">
              AI chat coming soon
            </div>
          </aside>
        )}
      </div>

      <ProjectSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        ownedProjects={ownedProjects}
        sharedProjects={sharedProjects}
        activeProjectId={project.id}
        onCreateProject={openCreate}
        onRenameProject={openRename}
        onDeleteProject={openDelete}
      />

      <ShareDialog
        open={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        projectId={project.id}
        projectName={project.name}
        isOwner={isOwner}
      />

      <CreateProjectDialog
        open={dialogType === "create"}
        onClose={closeDialog}
        nameValue={nameValue}
        onNameChange={setNameValue}
        roomIdPreview={roomIdPreview}
        isLoading={isLoading}
        onConfirm={handleCreate}
      />
      <RenameProjectDialog
        open={dialogType === "rename"}
        onClose={closeDialog}
        project={selectedProject}
        nameValue={nameValue}
        onNameChange={setNameValue}
        isLoading={isLoading}
        onConfirm={handleRename}
      />
      <DeleteProjectDialog
        open={dialogType === "delete"}
        onClose={closeDialog}
        project={selectedProject}
        isLoading={isLoading}
        onConfirm={handleDelete}
      />
    </div>
  );
}
