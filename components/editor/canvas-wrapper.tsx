"use client";

import { LiveblocksProvider, RoomProvider, ClientSideSuspense } from "@liveblocks/react";
import { ErrorBoundary } from "react-error-boundary";

import { Canvas } from "@/components/editor/canvas";

type CanvasWrapperProps = {
  roomId: string;
};

export function CanvasWrapper({ roomId }: CanvasWrapperProps) {
  return (
    <LiveblocksProvider authEndpoint="/api/liveblocks-auth">
      <RoomProvider
        id={roomId}
        initialPresence={{ cursor: null, isThinking: false }}
      >
        <ErrorBoundary
          fallback={
            <div className="flex h-full w-full items-center justify-center text-sm text-muted-foreground">
              Connection error — could not reach the canvas.
            </div>
          }
        >
          <ClientSideSuspense
            fallback={
              <div className="flex h-full w-full items-center justify-center text-sm text-muted-foreground">
                Loading canvas…
              </div>
            }
          >
            <Canvas />
          </ClientSideSuspense>
        </ErrorBoundary>
      </RoomProvider>
    </LiveblocksProvider>
  );
}
