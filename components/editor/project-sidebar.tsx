"use client";

import Link from "next/link";
import { Pencil, Plus, Trash2, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { ProjectRecord } from "@/types/project";
import { cn } from "@/lib/utils";

type ProjectSidebarProps = {
  isOpen: boolean;
  onClose: () => void;
  ownedProjects: ProjectRecord[];
  sharedProjects: ProjectRecord[];
  activeProjectId?: string;
  onCreateProject: () => void;
  onRenameProject: (project: ProjectRecord) => void;
  onDeleteProject: (project: ProjectRecord) => void;
};

function EmptyProjectState() {
  return (
    <div className="flex min-h-40 items-center justify-center rounded-lg border border-dashed border-border bg-muted/20 px-6 text-center text-sm text-muted-foreground">
      No projects to show.
    </div>
  );
}

type ProjectItemProps = {
  project: ProjectRecord;
  isActive?: boolean;
  onRename?: () => void;
  onDelete?: () => void;
};

function ProjectItem({ project, isActive, onRename, onDelete }: ProjectItemProps) {
  return (
    <div
      className={cn(
        "group flex items-center justify-between gap-1 rounded-md px-2 py-1.5 text-sm hover:bg-muted/50",
        isActive && "border-l-2 border-primary bg-muted/70 pl-1.5 font-medium",
      )}
    >
      <Link
        href={`/editor/${project.id}`}
        className="min-w-0 flex-1 truncate"
      >
        {project.name}
      </Link>
      {onRename && onDelete && (
        <div className="flex shrink-0 items-center gap-0.5 opacity-0 transition-opacity group-hover:opacity-100">
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
  ownedProjects,
  sharedProjects,
  activeProjectId,
  onCreateProject,
  onRenameProject,
  onDeleteProject,
}: ProjectSidebarProps) {
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
          <h2 className="text-sm font-medium">Projects</h2>
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
            <TabsTrigger value="my-project">My Projects</TabsTrigger>
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
                    isActive={project.id === activeProjectId}
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
                    isActive={project.id === activeProjectId}
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
