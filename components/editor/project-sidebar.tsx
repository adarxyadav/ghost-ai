"use client";

import { Pencil, Plus, Trash2, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { MockProject } from "@/hooks/use-project-dialogs";
import { cn } from "@/lib/utils";

type ProjectSidebarProps = {
  isOpen: boolean;
  onClose: () => void;
  projects: MockProject[];
  onCreateProject: () => void;
  onRenameProject: (project: MockProject) => void;
  onDeleteProject: (project: MockProject) => void;
};

function EmptyProjectState() {
  return (
    <div className="flex min-h-40 items-center justify-center rounded-lg border border-dashed border-border bg-muted/20 px-6 text-center text-sm text-muted-foreground">
      No projects to show.
    </div>
  );
}

type ProjectItemProps = {
  project: MockProject;
  onRename: () => void;
  onDelete: () => void;
};

function ProjectItem({ project, onRename, onDelete }: ProjectItemProps) {
  const isOwner = project.role === "owner";
  return (
    <div className="flex items-center justify-between gap-1 rounded-md px-2 py-1.5 text-sm hover:bg-muted/50">
      <span className="flex-1 truncate">{project.name}</span>
      {isOwner && (
        <div className="flex shrink-0 items-center gap-0.5">
          <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            aria-label={`Rename ${project.name}`}
            onClick={(e) => {
              e.stopPropagation();
              onRename();
            }}
          >
            <Pencil className="size-3" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            aria-label={`Delete ${project.name}`}
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
          >
            <Trash2 className="size-3" />
          </Button>
        </div>
      )}
    </div>
  );
}

export function ProjectSidebar({
  isOpen,
  onClose,
  projects,
  onCreateProject,
  onRenameProject,
  onDeleteProject,
}: ProjectSidebarProps) {
  const ownedProjects = projects.filter((p) => p.role === "owner");
  const sharedProjects = projects.filter((p) => p.role === "collaborator");

  return (
    <>
      {/* Mobile backdrop scrim */}
      {isOpen && (
        <div
          aria-hidden="true"
          className="fixed inset-0 z-40 bg-black/50 sm:hidden"
          onClick={onClose}
        />
      )}

      <aside
        aria-hidden={!isOpen}
        inert={!isOpen}
        className={cn(
          "fixed left-3 top-17 z-50 flex h-[calc(100vh-5rem)] w-[min(calc(100vw-1.5rem),20rem)] flex-col rounded-lg border border-border bg-card text-card-foreground shadow-2xl shadow-black/30 transition-transform duration-200 ease-out",
          isOpen
            ? "translate-x-0"
            : "pointer-events-none -translate-x-[calc(100%+1rem)]",
        )}
      >
        <div className="flex h-12 shrink-0 items-center justify-between border-b border-border px-4">
          <h2 className="text-sm font-medium">Project</h2>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label="Close project sidebar"
            onClick={onClose}
          >
            <X className="size-4" />
          </Button>
        </div>

        <Tabs defaultValue="my-project" className="min-h-0 flex-1 gap-0 p-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="my-project">My project</TabsTrigger>
            <TabsTrigger value="shared">Shared</TabsTrigger>
          </TabsList>
          <TabsContent value="my-project" className="mt-4">
            {ownedProjects.length === 0 ? (
              <EmptyProjectState />
            ) : (
              <div className="flex flex-col gap-0.5">
                {ownedProjects.map((project) => (
                  <ProjectItem
                    key={project.id}
                    project={project}
                    onRename={() => onRenameProject(project)}
                    onDelete={() => onDeleteProject(project)}
                  />
                ))}
              </div>
            )}
          </TabsContent>
          <TabsContent value="shared" className="mt-4">
            {sharedProjects.length === 0 ? (
              <EmptyProjectState />
            ) : (
              <div className="flex flex-col gap-0.5">
                {sharedProjects.map((project) => (
                  <ProjectItem
                    key={project.id}
                    project={project}
                    onRename={() => onRenameProject(project)}
                    onDelete={() => onDeleteProject(project)}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        <div className="border-t border-border p-4">
          <Button type="button" className="w-full" onClick={onCreateProject}>
            <Plus className="size-4" />
            New Project
          </Button>
        </div>
      </aside>
    </>
  );
}
