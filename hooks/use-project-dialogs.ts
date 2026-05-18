"use client";

import { useCallback, useState } from "react";

export type ProjectRole = "owner" | "collaborator";

export interface MockProject {
  id: string;
  name: string;
  slug: string;
  role: ProjectRole;
}

export const MOCK_PROJECTS: MockProject[] = [
  { id: "1", name: "Ghost AI Core", slug: "ghost-ai-core", role: "owner" },
  { id: "2", name: "Design System", slug: "design-system", role: "owner" },
  {
    id: "3",
    name: "Marketing Site",
    slug: "marketing-site",
    role: "collaborator",
  },
];

type DialogType = "none" | "create" | "rename" | "delete";

function toSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export interface UseProjectDialogsReturn {
  dialogType: DialogType;
  selectedProject: MockProject | null;
  nameValue: string;
  slugPreview: string;
  isLoading: boolean;
  openCreate: () => void;
  openRename: (project: MockProject) => void;
  openDelete: (project: MockProject) => void;
  closeDialog: () => void;
  setNameValue: (value: string) => void;
}

export function useProjectDialogs(): UseProjectDialogsReturn {
  const [dialogType, setDialogType] = useState<DialogType>("none");
  const [selectedProject, setSelectedProject] = useState<MockProject | null>(
    null,
  );
  const [nameValue, setNameValue] = useState("");
  const [isLoading] = useState(false);

  const openCreate = useCallback(() => {
    setNameValue("");
    setDialogType("create");
  }, []);

  const openRename = useCallback((project: MockProject) => {
    setSelectedProject(project);
    setNameValue(project.name);
    setDialogType("rename");
  }, []);

  const openDelete = useCallback((project: MockProject) => {
    setSelectedProject(project);
    setDialogType("delete");
  }, []);

  const closeDialog = useCallback(() => {
    setDialogType("none");
  }, []);

  return {
    dialogType,
    selectedProject,
    nameValue,
    slugPreview: toSlug(nameValue),
    isLoading,
    openCreate,
    openRename,
    openDelete,
    closeDialog,
    setNameValue,
  };
}
