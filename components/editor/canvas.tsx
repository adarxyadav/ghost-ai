"use client";

import { useCallback } from "react";
import {
  ReactFlow,
  Background,
  BackgroundVariant,
  ConnectionMode,
  ReactFlowProvider,
  Panel,
  useReactFlow,
  MarkerType,
} from "@xyflow/react";
import type { NodeChange, EdgeChange, Connection } from "@xyflow/react";
import { useLiveblocksFlow, Cursors } from "@liveblocks/react-flow";
import { useHistory, useCanUndo, useCanRedo } from "@liveblocks/react";
import "@xyflow/react/dist/style.css";
import "@liveblocks/react-ui/styles.css";
import "@liveblocks/react-flow/styles.css";

import type { CanvasNode, CanvasEdge, DragPayload } from "@/types/canvas";
import { CanvasNodeComponent } from "@/components/editor/canvas-node";
import { CanvasEdgeComponent } from "@/components/editor/canvas-edge";
import { ShapePanel } from "@/components/editor/shape-panel";
import { CanvasControlBar } from "@/components/editor/canvas-control-bar";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";

const nodeTypes = { canvasNode: CanvasNodeComponent };
const edgeTypes = { canvasEdge: CanvasEdgeComponent };

const defaultEdgeOptions = {
  type: "canvasEdge",
  markerEnd: { type: MarkerType.ArrowClosed },
};

function makeNodeId(shape: string): string {
  return `${shape}-${crypto.randomUUID()}`;
}

type CanvasFlowProps = {
  nodes: CanvasNode[];
  edges: CanvasEdge[];
  onNodesChange: (changes: NodeChange<CanvasNode>[]) => void;
  onEdgesChange: (changes: EdgeChange<CanvasEdge>[]) => void;
  onDelete: (params: { nodes: CanvasNode[]; edges: CanvasEdge[] }) => void;
};

function CanvasFlow({
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  onDelete,
}: CanvasFlowProps) {
  const rf = useReactFlow<CanvasNode, CanvasEdge>();
  const { screenToFlowPosition } = rf;
  const { undo, redo } = useHistory();
  const canUndo = useCanUndo();
  const canRedo = useCanRedo();

  useKeyboardShortcuts({ instance: rf, onUndo: undo, onRedo: redo });

  const handleConnect = useCallback(
    (connection: Connection) => {
      const newEdge: CanvasEdge = {
        id: `e-${crypto.randomUUID()}`,
        type: "canvasEdge",
        source: connection.source,
        target: connection.target,
        sourceHandle: connection.sourceHandle ?? null,
        targetHandle: connection.targetHandle ?? null,
        data: {},
      };
      onEdgesChange([{ type: "add", item: newEdge }]);
    },
    [onEdgesChange],
  );

  const handleShapeSelect = useCallback(
    (payload: DragPayload) => {
      const position = screenToFlowPosition({
        x: window.innerWidth / 2,
        y: window.innerHeight / 2,
      });
      const id = makeNodeId(payload.shape);
      const newNode: CanvasNode = {
        id,
        type: "canvasNode",
        position,
        data: { label: payload.shape.charAt(0).toUpperCase() + payload.shape.slice(1), shape: payload.shape },
        style: { width: payload.width, height: payload.height },
      };
      onNodesChange([{ type: "add" as const, item: newNode }]);
    },
    [screenToFlowPosition, onNodesChange],
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const raw = e.dataTransfer.getData("application/ghost-shape");
      if (!raw) return;
      let payload: DragPayload;
      try {
        payload = JSON.parse(raw) as DragPayload;
      } catch {
        return;
      }
      const position = screenToFlowPosition({ x: e.clientX, y: e.clientY });
      const id = makeNodeId(payload.shape);
      const newNode: CanvasNode = {
        id,
        type: "canvasNode",
        position,
        data: { label: payload.shape.charAt(0).toUpperCase() + payload.shape.slice(1), shape: payload.shape },
        style: { width: payload.width, height: payload.height },
      };
      onNodesChange([{ type: "add" as const, item: newNode }]);
    },
    [screenToFlowPosition, onNodesChange],
  );

  return (
    <div className="h-full w-full" onDragOver={handleDragOver} onDrop={handleDrop}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={handleConnect}
        onDelete={onDelete}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        defaultEdgeOptions={defaultEdgeOptions}
        connectionMode={ConnectionMode.Loose}
        fitView
      >
        <Background variant={BackgroundVariant.Dots} />
        <Cursors />
        <Panel position="bottom-left" style={{ marginBottom: "1rem", marginLeft: "1rem" }}>
          <CanvasControlBar
            instance={rf}
            canUndo={canUndo}
            canRedo={canRedo}
            onUndo={undo}
            onRedo={redo}
          />
        </Panel>
        <Panel position="bottom-center" style={{ marginBottom: "0.75rem" }}>
          <ShapePanel onShapeSelect={handleShapeSelect} />
        </Panel>
      </ReactFlow>
    </div>
  );
}

export function Canvas() {
  const { nodes, edges, onNodesChange, onEdgesChange, onDelete } =
    useLiveblocksFlow<CanvasNode, CanvasEdge>({
      suspense: true,
      nodes: { initial: [] },
      edges: { initial: [] },
    });

  return (
    <ReactFlowProvider>
      <CanvasFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onDelete={onDelete}
      />
    </ReactFlowProvider>
  );
}
