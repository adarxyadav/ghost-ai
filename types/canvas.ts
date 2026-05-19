import type { Node, Edge } from "@xyflow/react";

export type CanvasShape =
  | "rectangle"
  | "diamond"
  | "circle"
  | "pill"
  | "cylinder"
  | "hexagon";

export type CanvasNodeData = {
  label: string;
  color?: string;
  shape?: CanvasShape;
};

export type CanvasNode = Node<CanvasNodeData, "canvasNode">;
export type CanvasEdge = Edge<Record<string, never>, "canvasEdge">;

export type DragPayload = {
  shape: CanvasShape;
  width: number;
  height: number;
};
