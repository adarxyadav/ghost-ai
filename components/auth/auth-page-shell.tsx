import { Cpu, FileText, Share2 } from "lucide-react";
import type { ReactNode } from "react";

type AuthPageShellProps = {
  children: ReactNode;
};

const featureItems = [
  {
    icon: Cpu,
    title: "AI Architecture Generation",
    description:
      "Describe your system, AI maps it to nodes and edges on a live canvas.",
  },
  {
    icon: Share2,
    title: "Real-time Collaboration",
    description:
      "Live cursors, presence indicators, and shared node editing across your team.",
  },
  {
    icon: FileText,
    title: "Instant Spec Generation",
    description:
      "Export a complete Markdown technical spec directly from the canvas graph.",
  },
];

export function AuthPageShell({ children }: AuthPageShellProps) {
  return (
    <main className="grid min-h-screen bg-background text-foreground md:grid-cols-[minmax(0,0.9fr)_minmax(420px,1.1fr)]">
      <section className="hidden min-h-screen border-r border-border bg-card px-10 py-8 md:flex md:flex-col">
        <div className="flex items-center gap-3">
          <div className="grid size-8 place-items-center rounded-sm bg-primary text-sm font-semibold text-primary-foreground">
            G
          </div>
          <span className="text-sm font-medium">Ghost AI</span>
        </div>

        <div className="my-auto max-w-sm space-y-10">
          <div className="space-y-4">
            <h1 className="text-3xl font-bold leading-tight tracking-tight">
              Design systems at the speed of thought.
            </h1>
            <p className="text-sm leading-6 text-muted-foreground">
              Describe your architecture in plain English. Ghost AI maps it to a
              shared canvas your whole team can refine in real time.
            </p>
          </div>

          <ul className="space-y-6">
            {featureItems.map(({ icon: Icon, title, description }) => (
              <li key={title} className="flex items-start gap-4">
                <div className="grid size-9 shrink-0 place-items-center rounded-sm bg-muted">
                  <Icon className="size-4 text-primary" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">{title}</p>
                  <p className="text-xs leading-5 text-muted-foreground">
                    {description}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <p className="text-xs text-muted-foreground">
          © 2026 Ghost AI. All rights reserved.
        </p>
      </section>

      <section className="flex min-h-screen items-center justify-center px-4 py-8">
        {children}
      </section>
    </main>
  );
}
