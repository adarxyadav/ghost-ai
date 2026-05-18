"use client";

import { useCallback, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import type { ProjectRecord } from "@/types/project";

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

function randomSuffix(): string {
  return Math.random().toString(36).slice(2, 8);
}

export interface UseProjectActionsReturn {
  dialogType: DialogType;
  selectedProject: ProjectRecord | null;
  nameValue: string;
  roomIdPreview: string;
  isLoading: boolean;
  openCreate: () => void;
  openRename: (project: ProjectRecord) => void;
  openDelete: (project: ProjectRecord) => void;
  closeDialog: () => void;
  setNameValue: (value: string) => void;
  handleCreate: () => Promise<void>;
  handleRename: () => Promise<void>;
  handleDelete: () => Promise<void>;
}

export function useProjectActions(activeProjectId?: string): UseProjectActionsReturn {
  const router = useRouter();
  const [dialogType, setDialogType] = useState<DialogType>("none");
  const [selectedProject, setSelectedProject] = useState<ProjectRecord | null>(null);
  const [nameValue, setNameValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const suffixRef = useRef(randomSuffix());

  const openCreate = useCallback(() => {
    suffixRef.current = randomSuffix();
    setNameValue("");
    setDialogType("create");
  }, []);

  const openRename = useCallback((project: ProjectRecord) => {
    setSelectedProject(project);
    setNameValue(project.name);
    setDialogType("rename");
  }, []);

  const openDelete = useCallback((project: ProjectRecord) => {
    setSelectedProject(project);
    setDialogType("delete");
  }, []);

  const closeDialog = useCallback(() => {
    setDialogType("none");
    setSelectedProject(null);
  }, []);

  const handleCreate = useCallback(async () => {
    const name = nameValue.trim();
    const slug = toSlug(name);
    const roomId = slug ? `${slug}-${suffixRef.current}` : suffixRef.current;
    setIsLoading(true);
    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name || undefined, id: roomId }),
      });
      if (!res.ok) throw new Error("Failed to create project");
      const { data } = (await res.json()) as { data: { id: string } };
      closeDialog();
      router.push(`/editor/${data.id}`);
    } finally {
      setIsLoading(false);
    }
  }, [nameValue, closeDialog, router]);

  const handleRename = useCallback(async () => {
    if (!selectedProject) return;
    const name = nameValue.trim();
    if (!name) return;
    setIsLoading(true);
    try {
      const res = await fetch(`/api/projects/${selectedProject.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      if (!res.ok) throw new Error("Failed to rename project");
      closeDialog();
      router.refresh();
    } finally {
      setIsLoading(false);
    }
  }, [selectedProject, nameValue, closeDialog, router]);

  const handleDelete = useCallback(async () => {
    if (!selectedProject) return;
    setIsLoading(true);
    try {
      const res = await fetch(`/api/projects/${selectedProject.id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete project");
      closeDialog();
      if (selectedProject.id === activeProjectId) {
        router.push("/editor");
      } else {
        router.refresh();
      }
    } finally {
      setIsLoading(false);
    }
  }, [selectedProject, activeProjectId, closeDialog, router]);

  const slug = toSlug(nameValue);
  const roomIdPreview = slug
    ? `${slug}-${suffixRef.current}`
    : suffixRef.current;

  return {
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
  };
}
