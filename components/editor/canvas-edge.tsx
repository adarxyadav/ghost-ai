"use client";

import { useCallback, useState } from "react";
import { EdgeLabelRenderer, getSmoothStepPath, useReactFlow } from "@xyflow/react";
import type { EdgeProps } from "@xyflow/react";
import type { CanvasEdge } from "@/types/canvas";

export function CanvasEdgeComponent({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
  selected,
  markerEnd,
}: EdgeProps<CanvasEdge>) {
  const [isHovered, setIsHovered] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState("");
  const { updateEdgeData } = useReactFlow();

  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
    borderRadius: 8,
  });

  const label = data?.label ?? "";
  const isActive = isHovered || !!selected;

  const startEditing = useCallback(() => {
    setEditValue(label);
    setIsEditing(true);
  }, [label]);

  const commitEdit = useCallback(() => {
    updateEdgeData(id, { label: editValue });
    setIsEditing(false);
  }, [id, updateEdgeData, editValue]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter" || e.key === "Escape") {
        commitEdit();
      }
    },
    [commitEdit],
  );

  return (
    <>
      {/* visible edge */}
      <path
        className="react-flow__edge-path"
        d={edgePath}
        fill="none"
        strokeWidth={1.5}
        strokeLinecap="round"
        stroke="var(--foreground)"
        markerEnd={markerEnd}
        style={{
          opacity: isActive ? 0.85 : 0.35,
          transition: "opacity 0.15s",
        }}
      />
      {/* invisible wide hit area for hover detection and click-through to React Flow selection */}
      <path
        d={edgePath}
        fill="none"
        stroke="transparent"
        strokeWidth={20}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      />
      <EdgeLabelRenderer>
        <div
          style={{
            position: "absolute",
            transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
            pointerEvents: "all",
          }}
          className="nodrag nopan"
          onDoubleClick={(e) => {
            e.stopPropagation();
            startEditing();
          }}
          onMouseDown={(e) => e.stopPropagation()}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {isEditing ? (
            <input
              autoFocus
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onBlur={commitEdit}
              onKeyDown={handleKeyDown}
              onClick={(e) => e.stopPropagation()}
              onMouseDown={(e) => e.stopPropagation()}
              className="nodrag nopan rounded border border-border bg-popover px-2 py-0.5 text-center text-xs text-popover-foreground outline-none"
              style={{ width: `${Math.max(editValue.length * 8, 48)}px`, minWidth: "3rem" }}
            />
          ) : label ? (
            <span className="cursor-default select-none rounded-full border border-border bg-popover px-2 py-0.5 text-xs text-muted-foreground">
              {label}
            </span>
          ) : isActive ? (
            <span className="cursor-default select-none rounded-full border border-border/40 bg-popover/50 px-2 py-0.5 text-xs text-muted-foreground/30">
              label...
            </span>
          ) : null}
        </div>
      </EdgeLabelRenderer>
    </>
  );
}
