"use client";

import { useState, useCallback } from "react";
import { Handle, Position, NodeResizer, NodeToolbar, useReactFlow } from "@xyflow/react";
import type { NodeProps } from "@xyflow/react";
import type { CanvasNode } from "@/types/canvas";
import { NODE_COLOR_PALETTE } from "@/types/canvas";

const MIN_WIDTH = 80;
const MIN_HEIGHT = 40;

const resizerHandleStyle: React.CSSProperties = {
  width: 8,
  height: 8,
  backgroundColor: "white",
  border: "1.5px solid rgba(255,255,255,0.7)",
  borderRadius: 2,
};

const resizerLineStyle: React.CSSProperties = {
  borderColor: "rgba(255,255,255,0.35)",
};

const handleBaseStyle: React.CSSProperties = {
  width: 8,
  height: 8,
  backgroundColor: "white",
  border: "1.5px solid rgba(0,0,0,0.7)",
  borderRadius: "50%",
  transition: "opacity 0.15s",
};

function NodeHandles({ visible }: { visible: boolean }) {
  const style: React.CSSProperties = { ...handleBaseStyle, opacity: visible ? 1 : 0 };
  return (
    <>
      <Handle id="top" type="source" position={Position.Top} style={style} />
      <Handle id="right" type="source" position={Position.Right} style={style} />
      <Handle id="bottom" type="source" position={Position.Bottom} style={style} />
      <Handle id="left" type="source" position={Position.Left} style={style} />
    </>
  );
}

export function CanvasNodeComponent({ id, data, selected }: NodeProps<CanvasNode>) {
  const shape = data.shape ?? "rectangle";
  const label = data.label ?? "";
  const { updateNodeData } = useReactFlow<CanvasNode>();

  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState("");
  const [hoveredSwatch, setHoveredSwatch] = useState<number | null>(null);
  const [isHovered, setIsHovered] = useState(false);

  const handlesVisible = isHovered || !!selected;

  const startEditing = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setEditValue(label);
    setIsEditing(true);
  }, [label]);

  const commitEdit = useCallback(() => {
    updateNodeData(id, { label: editValue });
    setIsEditing(false);
  }, [id, updateNodeData, editValue]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Escape") {
        setIsEditing(false);
      }
    },
    [],
  );

  const colorToolbar = (
    <NodeToolbar position={Position.Top} isVisible={!!selected}>
      <div
        className="nodrag nopan flex gap-1 rounded-lg border border-border bg-popover px-2 py-1.5 shadow-lg"
        onMouseDown={(e) => e.stopPropagation()}
      >
        {NODE_COLOR_PALETTE.map((pair, i) => {
          const isActive =
            i === 0 ? !data.color || data.color === pair.bg : data.color === pair.bg;
          return (
            <button
              key={i}
              className="nodrag nopan h-5 w-5 cursor-pointer rounded-full border-2 transition-transform"
              style={{
                backgroundColor: pair.bg,
                borderColor: isActive ? pair.text : "transparent",
                boxShadow:
                  hoveredSwatch === i ? `0 0 5px 2px ${pair.text}` : undefined,
                transform: hoveredSwatch === i ? "scale(1.1)" : undefined,
              }}
              onMouseDown={(e) => e.stopPropagation()}
              onMouseEnter={() => setHoveredSwatch(i)}
              onMouseLeave={() => setHoveredSwatch(null)}
              onClick={() => updateNodeData(id, { color: pair.bg, textColor: pair.text })}
              title={pair.label}
            />
          );
        })}
      </div>
    </NodeToolbar>
  );

  const editingOverlay = isEditing ? (
    <div
      className="nodrag nopan absolute inset-0 z-20 flex items-center justify-center"
      onMouseDown={(e) => e.stopPropagation()}
    >
      <textarea
        autoFocus
        value={editValue}
        onChange={(e) => setEditValue(e.target.value)}
        onBlur={commitEdit}
        onKeyDown={handleKeyDown}
        rows={1}
        className="nodrag nopan w-full resize-none bg-transparent px-2 text-center text-sm leading-tight outline-none placeholder:text-muted-foreground/60"
        style={{ color: "inherit" }}
        placeholder="Label..."
      />
    </div>
  ) : null;

  const labelSpan = (
    <span className="relative z-10 select-none px-2 text-center text-sm leading-tight">
      {label}
    </span>
  );

  const nodeBgStyle: React.CSSProperties = {
    backgroundColor: data.color ?? undefined,
    color: data.textColor ?? undefined,
  };

  if (shape === "rectangle") {
    return (
      <div
        className={`relative flex h-full w-full items-center justify-center rounded border bg-card text-card-foreground ${
          selected ? "border-white/50" : "border-border"
        }`}
        style={nodeBgStyle}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onDoubleClick={startEditing}
      >
        {colorToolbar}
        <NodeResizer
          minWidth={MIN_WIDTH}
          minHeight={MIN_HEIGHT}
          isVisible={!!selected}
          handleStyle={resizerHandleStyle}
          lineStyle={resizerLineStyle}
        />
        <NodeHandles visible={handlesVisible} />
        {editingOverlay ?? labelSpan}
      </div>
    );
  }

  if (shape === "pill" || shape === "circle") {
    return (
      <div
        className={`relative flex h-full w-full items-center justify-center rounded-full border bg-card text-card-foreground ${
          selected ? "border-white/50" : "border-border"
        }`}
        style={nodeBgStyle}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onDoubleClick={startEditing}
      >
        {colorToolbar}
        <NodeResizer
          minWidth={MIN_WIDTH}
          minHeight={MIN_HEIGHT}
          isVisible={!!selected}
          handleStyle={resizerHandleStyle}
          lineStyle={resizerLineStyle}
        />
        <NodeHandles visible={handlesVisible} />
        {editingOverlay ?? labelSpan}
      </div>
    );
  }

  // SVG shapes: diamond, hexagon, cylinder
  const stroke = selected ? "rgba(255,255,255,0.5)" : "var(--border)";
  const svgFill = data.color ?? "var(--card)";

  let svgContent: React.ReactNode;
  if (shape === "diamond") {
    svgContent = (
      <polygon
        points="50,2 98,50 50,98 2,50"
        fill={svgFill}
        stroke={stroke}
        strokeWidth={2}
      />
    );
  } else if (shape === "hexagon") {
    svgContent = (
      <polygon
        points="50,2 94,26 94,74 50,98 6,74 6,26"
        fill={svgFill}
        stroke={stroke}
        strokeWidth={2}
      />
    );
  } else {
    // cylinder: body rect, then bottom cap, then top cap on top
    svgContent = (
      <>
        <rect x="5" y="15" width="90" height="73" fill={svgFill} stroke={stroke} strokeWidth={2} />
        <ellipse cx="50" cy="88" rx="45" ry="12" fill={svgFill} stroke={stroke} strokeWidth={2} />
        <ellipse cx="50" cy="15" rx="45" ry="12" fill={svgFill} stroke={stroke} strokeWidth={2} />
      </>
    );
  }

  return (
    <div
      className="relative h-full w-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {colorToolbar}
      <NodeResizer
        minWidth={MIN_WIDTH}
        minHeight={MIN_HEIGHT}
        isVisible={!!selected}
        handleStyle={resizerHandleStyle}
        lineStyle={resizerLineStyle}
      />
      <NodeHandles visible={handlesVisible} />
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full"
        style={{ pointerEvents: "none" }}
      >
        {svgContent}
      </svg>
      <div
        className="absolute inset-0 z-10 flex items-center justify-center"
        style={{ color: data.textColor ?? "var(--card-foreground)" }}
        onDoubleClick={startEditing}
      >
        {editingOverlay ?? (
          <span className="relative z-10 select-none px-2 text-center text-sm leading-tight">
            {label}
          </span>
        )}
      </div>
    </div>
  );
}
