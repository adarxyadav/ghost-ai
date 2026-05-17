import { Plus, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

type ProjectSidebarProps = {
  isOpen: boolean;
  onClose: () => void;
};

function EmptyProjectState() {
  return (
    <div className="flex min-h-40 items-center justify-center rounded-lg border border-dashed border-border bg-muted/20 px-6 text-center text-sm text-muted-foreground">
      No projects to show.
    </div>
  );
}

export function ProjectSidebar({ isOpen, onClose }: ProjectSidebarProps) {
  return (
    <aside
      aria-hidden={!isOpen}
      inert={!isOpen}
      className={cn(
        "fixed left-3 top-17 z-50 flex h-[calc(100vh-5rem)] w-[min(calc(100vw-1.5rem),20rem)] flex-col rounded-lg border border-border bg-card text-card-foreground shadow-2xl shadow-black/30 transition-transform duration-200 ease-out",
        isOpen
          ? "translate-x-0"
          : "pointer-events-none -translate-x-[calc(100%+1rem)]",
      )}
    >
      <div className="flex h-12 shrink-0 items-center justify-between border-b border-border px-4">
        <h2 className="text-sm font-medium">Project</h2>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          aria-label="Close project sidebar"
          onClick={onClose}
        >
          <X className="size-4" />
        </Button>
      </div>

      <Tabs defaultValue="my-project" className="min-h-0 flex-1 gap-0 p-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="my-project">My project</TabsTrigger>
          <TabsTrigger value="shared">Shared</TabsTrigger>
        </TabsList>
        <TabsContent value="my-project" className="mt-4">
          <EmptyProjectState />
        </TabsContent>
        <TabsContent value="shared" className="mt-4">
          <EmptyProjectState />
        </TabsContent>
      </Tabs>

      <div className="border-t border-border p-4">
        <Button type="button" className="w-full">
          <Plus className="size-4" />
          New Project
        </Button>
      </div>
    </aside>
  );
}
