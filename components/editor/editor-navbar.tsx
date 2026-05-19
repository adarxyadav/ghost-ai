"use client";

import { UserButton } from "@clerk/nextjs";
import { MessageSquare, PanelLeftClose, PanelLeftOpen, Share2 } from "lucide-react";

import { Button } from "@/components/ui/button";

type EditorNavbarProps = {
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
  projectName?: string;
  isAiSidebarOpen?: boolean;
  onToggleAiSidebar?: () => void;
  onShare?: () => void;
};

export function EditorNavbar({
  isSidebarOpen,
  onToggleSidebar,
  projectName,
  isAiSidebarOpen,
  onToggleAiSidebar,
  onShare,
}: EditorNavbarProps) {
  const SidebarIcon = isSidebarOpen ? PanelLeftClose : PanelLeftOpen;

  return (
    <header className="fixed inset-x-0 top-0 z-40 grid h-14 grid-cols-[1fr_auto_1fr] items-center border-b border-border bg-background/95 px-3 text-foreground backdrop-blur">
      <div className="flex min-w-0 items-center justify-start gap-1">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label={isSidebarOpen ? "Close project sidebar" : "Open project sidebar"}
          aria-pressed={isSidebarOpen}
          onClick={onToggleSidebar}
        >
          <SidebarIcon className="size-4" />
        </Button>
      </div>

      <div className="flex min-w-0 flex-col items-center justify-center">
        {projectName && (
          <>
            <span className="truncate text-sm font-medium leading-tight">{projectName}</span>
            <span className="text-xs leading-tight text-muted-foreground">Workspace</span>
          </>
        )}
      </div>

      <div className="flex min-w-0 items-center justify-end gap-1">
        {onShare && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onShare}
          >
            <Share2 className="size-4" />
            Share
          </Button>
        )}
        {onToggleAiSidebar && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label={isAiSidebarOpen ? "Close AI assistant" : "Open AI assistant"}
            aria-pressed={isAiSidebarOpen}
            onClick={onToggleAiSidebar}
          >
            <MessageSquare className="size-4" />
          </Button>
        )}
        <UserButton />
      </div>
    </header>
  );
}
