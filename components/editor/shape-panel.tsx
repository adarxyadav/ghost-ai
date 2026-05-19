"use client";

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

export function ShapePanel() {
  const handleDragStart = (e: React.DragEvent, entry: ShapeEntry) => {
    const payload: DragPayload = {
      shape: entry.shape,
      width: entry.width,
      height: entry.height,
    };
    e.dataTransfer.setData("application/ghost-shape", JSON.stringify(payload));
    e.dataTransfer.effectAllowed = "move";
  };

  return (
    <div className="flex items-center gap-1 rounded-full border border-border bg-card px-3 py-2 shadow-lg">
      {SHAPES.map((entry) => {
        const Icon = entry.icon;
        return (
          <button
            key={entry.shape}
            draggable
            onDragStart={(e) => handleDragStart(e, entry)}
            title={entry.label}
            aria-label={entry.label}
            className="flex size-8 cursor-grab items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground active:cursor-grabbing"
          >
            <Icon className="size-4" />
          </button>
        );
      })}
    </div>
  );
}
