"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { MockProject } from "@/hooks/use-project-dialogs";

type BaseDialogProps = {
  open: boolean;
  onClose: () => void;
  isLoading: boolean;
};

type CreateProjectDialogProps = BaseDialogProps & {
  nameValue: string;
  onNameChange: (value: string) => void;
  slugPreview: string;
};

export function CreateProjectDialog({
  open,
  onClose,
  nameValue,
  onNameChange,
  slugPreview,
  isLoading,
}: CreateProjectDialogProps) {
  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) onClose(); }}>
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>New Project</DialogTitle>
        </DialogHeader>
        <div className="grid gap-2">
          <label
            htmlFor="create-project-name"
            className="text-sm font-medium"
          >
            Project Name
          </label>
          <Input
            id="create-project-name"
            placeholder="My Project"
            value={nameValue}
            onChange={(e) => onNameChange(e.target.value)}
          />
          <p className="min-h-4 text-xs text-muted-foreground">
            {slugPreview ? `/${slugPreview}` : ""}
          </p>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button disabled={!nameValue.trim() || isLoading}>
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

type RenameProjectDialogProps = BaseDialogProps & {
  project: MockProject | null;
  nameValue: string;
  onNameChange: (value: string) => void;
};

export function RenameProjectDialog({
  open,
  onClose,
  project,
  nameValue,
  onNameChange,
  isLoading,
}: RenameProjectDialogProps) {
  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) onClose(); }}>
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>Rename Project</DialogTitle>
          {project && (
            <DialogDescription>
              Rename &ldquo;{project.name}&rdquo;
            </DialogDescription>
          )}
        </DialogHeader>
        <div className="grid gap-2">
          <label
            htmlFor="rename-project-name"
            className="text-sm font-medium"
          >
            Project Name
          </label>
          <Input
            id="rename-project-name"
            value={nameValue}
            onChange={(e) => onNameChange(e.target.value)}
            autoFocus
            onKeyDown={(e) => {
              if (e.key === "Enter" && nameValue.trim()) onClose();
            }}
          />
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button disabled={!nameValue.trim() || isLoading}>
            Rename
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

type DeleteProjectDialogProps = BaseDialogProps & {
  project: MockProject | null;
};

export function DeleteProjectDialog({
  open,
  onClose,
  project,
  isLoading,
}: DeleteProjectDialogProps) {
  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) onClose(); }}>
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>Delete Project</DialogTitle>
          {project && (
            <DialogDescription>
              &ldquo;{project.name}&rdquo; will be permanently deleted. This
              action cannot be undone.
            </DialogDescription>
          )}
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={onClose}
            disabled={isLoading}
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
