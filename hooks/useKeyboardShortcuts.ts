import { useEffect } from "react";

const ZOOM_DURATION = 200;

type ZoomableInstance = {
  zoomIn: (options?: { duration?: number }) => void;
  zoomOut: (options?: { duration?: number }) => void;
} | null;

function isEditableTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  const tag = target.tagName.toLowerCase();
  return tag === "input" || tag === "textarea" || target.isContentEditable;
}

export function useKeyboardShortcuts({
  instance,
  onUndo,
  onRedo,
}: {
  instance: ZoomableInstance;
  onUndo: () => void;
  onRedo: () => void;
}) {
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (isEditableTarget(e.target)) return;

      const meta = e.metaKey || e.ctrlKey;

      if (!meta) {
        if (e.key === "+" || e.key === "=") {
          instance?.zoomIn({ duration: ZOOM_DURATION });
          return;
        }
        if (e.key === "-") {
          instance?.zoomOut({ duration: ZOOM_DURATION });
          return;
        }
      }

      if (meta && e.shiftKey && (e.key === "z" || e.key === "Z")) {
        e.preventDefault();
        onRedo();
        return;
      }

      if (meta && (e.key === "y" || e.key === "Y")) {
        e.preventDefault();
        onRedo();
        return;
      }

      if (meta && (e.key === "z" || e.key === "Z")) {
        e.preventDefault();
        onUndo();
        return;
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [instance, onUndo, onRedo]);
}
