"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import {
  RectangleHorizontal,
  Diamond,
  Circle,
  Pill,
  Cylinder,
  Hexagon,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { CanvasShape, DragPayload } from "@/types/canvas";

type ShapePanelProps = {
  onShapeSelect?: (payload: DragPayload) => void;
};

type ShapeEntry = {
  shape: CanvasShape;
  icon: LucideIcon;
  label: string;
  width: number;
  height: number;
};

const SHAPES: ShapeEntry[] = [
  { shape: "rectangle", icon: RectangleHorizontal, label: "Rectangle", width: 160, height: 80 },
  { shape: "diamond",   icon: Diamond,             label: "Diamond",   width: 120, height: 120 },
  { shape: "circle",    icon: Circle,              label: "Circle",    width: 80,  height: 80 },
  { shape: "pill",      icon: Pill,                label: "Pill",      width: 160, height: 60 },
  { shape: "cylinder",  icon: Cylinder,            label: "Cylinder",  width: 100, height: 100 },
  { shape: "hexagon",   icon: Hexagon,             label: "Hexagon",   width: 120, height: 120 },
];

type PreviewState = {
  shape: CanvasShape;
  width: number;
  height: number;
  x: number;
  y: number;
};

function GhostShape({ shape, width, height }: Omit<PreviewState, "x" | "y">) {
  if (shape === "rectangle") {
    return (
      <div
        style={{ width, height }}
        className="rounded border-2 border-primary bg-card"
      />
    );
  }

  if (shape === "pill" || shape === "circle") {
    return (
      <div
        style={{ width, height }}
        className="rounded-full border-2 border-primary bg-card"
      />
    );
  }

  // SVG shapes
  return (
    <div style={{ width, height }}>
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="h-full w-full">
        {shape === "diamond" && (
          <polygon
            points="50,2 98,50 50,98 2,50"
            fill="var(--card)"
            stroke="var(--primary)"
            strokeWidth={2}
          />
        )}
        {shape === "hexagon" && (
          <polygon
            points="50,2 94,26 94,74 50,98 6,74 6,26"
            fill="var(--card)"
            stroke="var(--primary)"
            strokeWidth={2}
          />
        )}
        {shape === "cylinder" && (
          <>
            <rect x="5" y="15" width="90" height="73" fill="var(--card)" stroke="var(--primary)" strokeWidth={2} />
            <ellipse cx="50" cy="88" rx="45" ry="12" fill="var(--card)" stroke="var(--primary)" strokeWidth={2} />
            <ellipse cx="50" cy="15" rx="45" ry="12" fill="var(--card)" stroke="var(--primary)" strokeWidth={2} />
          </>
        )}
      </svg>
    </div>
  );
}

export function ShapePanel({ onShapeSelect }: ShapePanelProps = {}) {
  const [preview, setPreview] = useState<PreviewState | null>(null);

  const handleDragStart = (e: React.DragEvent, entry: ShapeEntry) => {
    const payload: DragPayload = {
      shape: entry.shape,
      width: entry.width,
      height: entry.height,
    };
    e.dataTransfer.setData("application/ghost-shape", JSON.stringify(payload));
    e.dataTransfer.effectAllowed = "move";

    // Suppress the browser default drag ghost; use our React preview instead
    const transparent = new Image();
    transparent.src =
      "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
    e.dataTransfer.setDragImage(transparent, 0, 0);

    setPreview({ shape: entry.shape, width: entry.width, height: entry.height, x: e.clientX, y: e.clientY });
  };

  const handleDrag = (e: React.DragEvent) => {
    // clientX/Y are (0,0) on the final drag event before dragend in some browsers
    if (e.clientX === 0 && e.clientY === 0) return;
    setPreview((prev) => (prev ? { ...prev, x: e.clientX, y: e.clientY } : null));
  };

  const handleDragEnd = () => setPreview(null);

  return (
    <>
      {preview &&
        createPortal(
          <div
            style={{
              position: "fixed",
              left: preview.x - preview.width / 2,
              top: preview.y - preview.height / 2,
              pointerEvents: "none",
              zIndex: 9999,
              opacity: 0.65,
            }}
          >
            <GhostShape shape={preview.shape} width={preview.width} height={preview.height} />
          </div>,
          document.body,
        )}
      <div className="flex items-center gap-1 rounded-full border border-border bg-card px-3 py-2 shadow-lg">
        {SHAPES.map((entry) => {
          const Icon = entry.icon;
          return (
            <button
              key={entry.shape}
              draggable
              onDragStart={(e) => handleDragStart(e, entry)}
              onDrag={handleDrag}
              onDragEnd={handleDragEnd}
              onClick={() => onShapeSelect?.({ shape: entry.shape, width: entry.width, height: entry.height })}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onShapeSelect?.({ shape: entry.shape, width: entry.width, height: entry.height });
                }
              }}
              title={entry.label}
              aria-label={entry.label}
              className="flex size-8 cursor-grab items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground active:cursor-grabbing"
            >
              <Icon className="size-4" />
            </button>
          );
        })}
      </div>
    </>
  );
}
