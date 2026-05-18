"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { EditorNavbar } from "@/components/editor/editor-navbar";
import { ProjectSidebar } from "@/components/editor/project-sidebar";
import {
  CreateProjectDialog,
  DeleteProjectDialog,
  RenameProjectDialog,
} from "@/components/editor/project-dialogs";
import {
  MOCK_PROJECTS,
  useProjectDialogs,
} from "@/hooks/use-project-dialogs";

export function EditorShell() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const {
    dialogType,
    selectedProject,
    nameValue,
    slugPreview,
    isLoading,
    openCreate,
    openRename,
    openDelete,
    closeDialog,
    setNameValue,
  } = useProjectDialogs();

  return (
    <main className="min-h-screen bg-background text-foreground">
      <EditorNavbar
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={() => setIsSidebarOpen((current) => !current)}
      />
      <ProjectSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        projects={MOCK_PROJECTS}
        onCreateProject={openCreate}
        onRenameProject={openRename}
        onDeleteProject={openDelete}
      />

      <section className="flex min-h-screen items-center justify-center pt-14">
        <div className="flex flex-col items-center gap-4 text-center">
          <h1 className="text-2xl font-semibold">
            Create a project or open an existing one
          </h1>
          <p className="max-w-xs text-sm text-muted-foreground">
            Start a new architecture workspace, or choose a project from the
            sidebar.
          </p>
          <Button type="button" onClick={openCreate}>
            <Plus className="size-4" />
            New Project
          </Button>
        </div>
      </section>

      <CreateProjectDialog
        open={dialogType === "create"}
        onClose={closeDialog}
        nameValue={nameValue}
        onNameChange={setNameValue}
        slugPreview={slugPreview}
        isLoading={isLoading}
      />
      <RenameProjectDialog
        open={dialogType === "rename"}
        onClose={closeDialog}
        project={selectedProject}
        nameValue={nameValue}
        onNameChange={setNameValue}
        isLoading={isLoading}
      />
      <DeleteProjectDialog
        open={dialogType === "delete"}
        onClose={closeDialog}
        project={selectedProject}
        isLoading={isLoading}
      />
    </main>
  );
}
