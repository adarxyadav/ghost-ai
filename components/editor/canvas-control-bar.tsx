"use client";

import { ZoomIn, ZoomOut, Maximize2, Undo2, Redo2 } from "lucide-react";

const ZOOM_DURATION = 200;
const FIT_DURATION = 300;

type ZoomableInstance = {
  zoomIn: (options?: { duration?: number }) => void;
  zoomOut: (options?: { duration?: number }) => void;
  fitView: (options?: { duration?: number }) => void;
} | null;

type CanvasControlBarProps = {
  instance: ZoomableInstance;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
};

export function CanvasControlBar({
  instance,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
}: CanvasControlBarProps) {
  return (
    <div className="flex items-center rounded-full border border-border bg-card px-1 py-1 shadow-md">
      <button
        onClick={() => instance?.zoomOut({ duration: ZOOM_DURATION })}
        className="flex h-7 w-7 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        aria-label="Zoom out"
      >
        <ZoomOut size={14} />
      </button>
      <button
        onClick={() => instance?.fitView({ duration: FIT_DURATION })}
        className="flex h-7 w-7 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        aria-label="Fit view"
      >
        <Maximize2 size={14} />
      </button>
      <button
        onClick={() => instance?.zoomIn({ duration: ZOOM_DURATION })}
        className="flex h-7 w-7 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        aria-label="Zoom in"
      >
        <ZoomIn size={14} />
      </button>

      <div className="mx-1 h-4 w-px bg-border" />

      <button
        onClick={onUndo}
        disabled={!canUndo}
        className="flex h-7 w-7 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:cursor-not-allowed disabled:opacity-30"
        aria-label="Undo"
      >
        <Undo2 size={14} />
      </button>
      <button
        onClick={onRedo}
        disabled={!canRedo}
        className="flex h-7 w-7 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:cursor-not-allowed disabled:opacity-30"
        aria-label="Redo"
      >
        <Redo2 size={14} />
      </button>
    </div>
  );
}
