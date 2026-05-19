"use client";

import { Handle, Position } from "@xyflow/react";
import type { NodeProps } from "@xyflow/react";
import type { CanvasNode } from "@/types/canvas";

export function CanvasNodeComponent({ data }: NodeProps<CanvasNode>) {
  return (
    <div className="flex h-full w-full items-center justify-center rounded border border-border bg-card text-xs text-card-foreground">
      <Handle type="target" position={Position.Top} />
      <span className="select-none px-2 text-center">
        {data.label || data.shape || ""}
      </span>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}
