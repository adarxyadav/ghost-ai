import Link from "next/link";
import { Lock } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";

export function AccessDenied() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background text-foreground">
      <div className="flex flex-col items-center gap-4 text-center">
        <Lock className="size-10 text-muted-foreground" />
        <h1 className="text-xl font-semibold">Access Denied</h1>
        <p className="max-w-xs text-sm text-muted-foreground">
          This project does not exist or you do not have permission to access it.
        </p>
        <Link href="/editor" className={buttonVariants({ variant: "outline" })}>
          Back to editor
        </Link>
      </div>
    </main>
  );
}
