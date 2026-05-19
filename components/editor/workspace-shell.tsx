"use client";

import { useEffect, useState } from "react";
import { MessageSquare, Sparkles } from "lucide-react";

import { EditorNavbar } from "@/components/editor/editor-navbar";
import { ProjectSidebar } from "@/components/editor/project-sidebar";
import { ShareDialog } from "@/components/editor/share-dialog";
import { CanvasWrapper } from "@/components/editor/canvas-wrapper";
import {
  CreateProjectDialog,
  DeleteProjectDialog,
  RenameProjectDialog,
} from "@/components/editor/project-dialogs";
import { useProjectActions } from "@/hooks/use-project-actions";
import { cn } from "@/lib/utils";
import type { ProjectRecord } from "@/types/project";

const SIDEBAR_KEY = "sidebar-open";

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

  useEffect(() => {
    try {
      if (sessionStorage.getItem(SIDEBAR_KEY) === "true") setIsSidebarOpen(true);
    } catch {}
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen((v) => {
      const next = !v;
      try { sessionStorage.setItem(SIDEBAR_KEY, String(next)); } catch {}
      return next;
    });
  };

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
    <div className="relative h-screen overflow-hidden bg-background text-foreground">
      <EditorNavbar
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={toggleSidebar}
        projectName={project.name}
        isAiSidebarOpen={isAiSidebarOpen}
        onToggleAiSidebar={() => setIsAiSidebarOpen((v) => !v)}
        onShare={() => setIsShareOpen(true)}
      />

      {/* Canvas fills the full area below the fixed navbar */}
      <div className="absolute inset-0 top-14">
        <CanvasWrapper roomId={project.id} />
      </div>

      {/* Floating project sidebar — fixed-positioned inside component */}
      <ProjectSidebar
        isOpen={isSidebarOpen}
        onClose={() => {
          setIsSidebarOpen(false);
          try { sessionStorage.setItem(SIDEBAR_KEY, "false"); } catch {}
        }}
        ownedProjects={ownedProjects}
        sharedProjects={sharedProjects}
        activeProjectId={project.id}
        onCreateProject={openCreate}
        onRenameProject={openRename}
        onDeleteProject={openDelete}
      />

      {/* Floating AI sidebar */}
      <aside
        aria-hidden={!isAiSidebarOpen}
        inert={!isAiSidebarOpen}
        className={cn(
          "fixed right-3 top-17 z-50 flex h-[calc(100vh-5rem)] w-72 flex-col rounded-lg border border-border bg-card text-card-foreground shadow-2xl shadow-black/30 transition-transform duration-200 ease-out",
          isAiSidebarOpen
            ? "translate-x-0"
            : "pointer-events-none translate-x-[calc(100%+1rem)]",
        )}
      >
        <div className="flex h-12 shrink-0 items-center justify-between border-b border-border px-4">
          <div>
            <p className="text-sm font-medium">AI Copilot</p>
            <p className="mt-0.5 text-xs leading-none text-muted-foreground">Placeholder panel</p>
          </div>
          <Sparkles className="size-4 text-muted-foreground" />
        </div>
        <div className="flex flex-1 flex-col gap-3 overflow-y-auto p-4">
          <div className="rounded-lg border border-border bg-muted/20 p-4">
            <div className="mb-2 flex items-center gap-2">
              <div className="flex size-8 items-center justify-center rounded-full bg-muted">
                <MessageSquare className="size-4 text-muted-foreground" />
              </div>
              <p className="text-sm font-medium">Chat surface pending</p>
            </div>
            <p className="text-xs text-muted-foreground">
              The toggle is wired. Messaging and generation are intentionally out of
              scope here.
            </p>
          </div>
          <div className="mt-auto rounded-lg border border-border bg-muted/20 p-4">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Future Hooks
            </p>
            <p className="text-xs text-muted-foreground">
              Prompt composer, run status, and architecture guidance will attach to
              this sidebar.
            </p>
          </div>
        </div>
      </aside>

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
