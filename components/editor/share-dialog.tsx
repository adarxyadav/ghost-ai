"use client";

import { useCallback, useEffect, useState } from "react";
import { Check, Copy, Trash2, UserPlus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type Collaborator = {
  email: string;
  name: string | null;
  avatarUrl: string | null;
  addedAt: string;
};

type ApiResponse = {
  data: { role: "owner" | "collaborator"; collaborators: Collaborator[] };
};

type ShareDialogProps = {
  open: boolean;
  onClose: () => void;
  projectId: string;
  projectName: string;
  isOwner: boolean;
};

export function ShareDialog({
  open,
  onClose,
  projectId,
  projectName,
  isOwner,
}: ShareDialogProps) {
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [isFetching, setIsFetching] = useState(false);
  const [emailInput, setEmailInput] = useState("");
  const [isInviting, setIsInviting] = useState(false);
  const [inviteError, setInviteError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const fetchCollaborators = useCallback(async () => {
    setIsFetching(true);
    try {
      const res = await fetch(`/api/projects/${projectId}/collaborators`);
      if (res.ok) {
        const json = (await res.json()) as ApiResponse;
        setCollaborators(json.data.collaborators);
      }
    } finally {
      setIsFetching(false);
    }
  }, [projectId]);

  useEffect(() => {
    if (open) {
      setEmailInput("");
      setInviteError(null);
      void fetchCollaborators();
    }
  }, [open, fetchCollaborators]);

  const handleInvite = async () => {
    const email = emailInput.trim().toLowerCase();
    if (!email) return;
    setInviteError(null);
    setIsInviting(true);
    try {
      const res = await fetch(`/api/projects/${projectId}/collaborators`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) {
        const body = (await res.json()) as { error?: { message?: string } };
        setInviteError(body.error?.message ?? "Failed to invite collaborator.");
        return;
      }
      setEmailInput("");
      await fetchCollaborators();
    } finally {
      setIsInviting(false);
    }
  };

  const handleRemove = async (email: string) => {
    try {
      const res = await fetch(`/api/projects/${projectId}/collaborators`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        setCollaborators((prev) => prev.filter((c) => c.email !== email));
      }
    } catch {
      // best-effort
    }
  };

  const handleCopyLink = () => {
    void navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) onClose(); }}>
      <DialogContent className="sm:max-w-md" showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>Share &ldquo;{projectName}&rdquo;</DialogTitle>
        </DialogHeader>

        {isOwner && (
          <div className="grid gap-2">
            <label htmlFor="share-invite-email" className="text-sm font-medium">
              Invite by email
            </label>
            <div className="flex gap-2">
              <Input
                id="share-invite-email"
                type="email"
                placeholder="colleague@example.com"
                value={emailInput}
                onChange={(e) => {
                  setEmailInput(e.target.value);
                  setInviteError(null);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !isInviting) void handleInvite();
                }}
                disabled={isInviting}
              />
              <Button
                type="button"
                onClick={() => void handleInvite()}
                disabled={!emailInput.trim() || isInviting}
              >
                <UserPlus className="size-4" />
                Invite
              </Button>
            </div>
            {inviteError && (
              <p className="text-xs text-destructive">{inviteError}</p>
            )}
          </div>
        )}

        <div className="grid gap-2">
          {isFetching && collaborators.length === 0 ? (
            <p className="text-sm text-muted-foreground">Loading…</p>
          ) : collaborators.length === 0 ? (
            <p className="text-sm text-muted-foreground">No collaborators yet.</p>
          ) : (
            <>
              <p className="text-sm font-medium">Collaborators</p>
              <ScrollArea className="max-h-48">
                <ul className="flex flex-col gap-0.5">
                  {collaborators.map((c) => (
                    <li
                      key={c.email}
                      className="flex items-center gap-3 rounded-md px-2 py-1.5"
                    >
                      {c.avatarUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={c.avatarUrl}
                          alt={c.name ?? c.email}
                          className="size-7 shrink-0 rounded-full object-cover"
                        />
                      ) : (
                        <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-medium uppercase text-muted-foreground">
                          {(c.name ?? c.email)[0]}
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        {c.name && (
                          <p className="truncate text-sm font-medium">{c.name}</p>
                        )}
                        <p className="truncate text-xs text-muted-foreground">
                          {c.email}
                        </p>
                      </div>
                      {isOwner && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-sm"
                          aria-label={`Remove ${c.email}`}
                          onClick={() => void handleRemove(c.email)}
                        >
                          <Trash2 className="size-3.5" />
                        </Button>
                      )}
                    </li>
                  ))}
                </ul>
              </ScrollArea>
            </>
          )}
        </div>

        <div className="-mx-4 -mb-4 flex items-center justify-end gap-2 rounded-b-xl border-t bg-muted/50 px-4 py-3">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleCopyLink}
          >
            {copied ? (
              <>
                <Check className="size-3.5" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="size-3.5" />
                Copy link
              </>
            )}
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
