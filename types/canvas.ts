import type { Node, Edge } from "@xyflow/react";

export type CanvasShape =
  | "rectangle"
  | "diamond"
  | "circle"
  | "pill"
  | "cylinder"
  | "hexagon";

export type NodeColorPair = {
  label: string;
  bg: string;
  text: string;
};

export const NODE_COLOR_PALETTE: NodeColorPair[] = [
  { label: "Default", bg: "var(--card)",          text: "var(--card-foreground)" },
  { label: "Cyan",    bg: "oklch(0.20 0.06 210)", text: "oklch(0.88 0.16 210)"  },
  { label: "Green",   bg: "oklch(0.19 0.07 145)", text: "oklch(0.86 0.18 145)"  },
  { label: "Amber",   bg: "oklch(0.20 0.07 60)",  text: "oklch(0.93 0.11 60)"   },
  { label: "Purple",  bg: "oklch(0.19 0.07 300)", text: "oklch(0.87 0.20 310)"  },
  { label: "Red",     bg: "oklch(0.19 0.08 24)",  text: "oklch(0.88 0.22 350)"  },
];

export type CanvasNodeData = {
  label: string;
  color?: string;
  textColor?: string;
  shape?: CanvasShape;
};

export type CanvasEdgeData = {
  label?: string;
};

export type CanvasNode = Node<CanvasNodeData, "canvasNode">;
export type CanvasEdge = Edge<CanvasEdgeData, "canvasEdge">;

export type DragPayload = {
  shape: CanvasShape;
  width: number;
  height: number;
};
