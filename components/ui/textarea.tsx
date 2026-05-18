import * as React from "react"

import { cn } from "@/lib/utils"

function Textarea({ className, onChange, value, ...props }: React.ComponentProps<"textarea">) {
  const textareaRef = React.useRef<HTMLTextAreaElement>(null)

  const adjustHeight = React.useCallback(() => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = "auto"
    el.style.height = `${el.scrollHeight}px`
  }, [])

  React.useEffect(() => {
    adjustHeight()
  }, [adjustHeight, value])

  return (
    <textarea
      ref={textareaRef}
      value={value}
      data-slot="textarea"
      className={cn(
        "flex h-auto min-h-16 w-full overflow-hidden rounded-lg border border-input bg-transparent px-2.5 py-2 text-base transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm dark:bg-input/30 dark:disabled:bg-input/80 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40",
        className
      )}
      onChange={(e) => {
        adjustHeight()
        onChange?.(e)
      }}
      {...props}
    />
  )
}

export { Textarea }
