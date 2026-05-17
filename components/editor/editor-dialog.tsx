import type { ReactNode } from "react";

import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

type EditorDialogProps = {
  title: ReactNode;
  description?: ReactNode;
  footerAction?: ReactNode;
  children?: ReactNode;
  className?: string;
};

export function EditorDialog({
  title,
  description,
  footerAction,
  children,
  className,
}: EditorDialogProps) {
  return (
    <DialogContent
      className={cn(
        "border border-border bg-popover text-popover-foreground",
        className
      )}
    >
      <DialogHeader>
        <DialogTitle>{title}</DialogTitle>
        {description ? (
          <DialogDescription>{description}</DialogDescription>
        ) : null}
      </DialogHeader>

      {children ? <div>{children}</div> : null}

      {footerAction ? <DialogFooter>{footerAction}</DialogFooter> : null}
    </DialogContent>
  );
}
