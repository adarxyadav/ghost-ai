# Architecture Context

## Stack

| Layer     | Technology                  | Role   |
| --------- | --------------------------- | ------ |
| Framework | Next.js + TypeScript       | App framework and type system |
| UI        | Tailwind CSS v4 + shadcn/ui | Styling tokens and reusable UI primitives |
| Icons     | Lucide React                | Stroke icon library for controls |
| Auth      | Not selected                | Out of scope for the current design-system unit |
| Database  | Not selected                | Out of scope for the current design-system unit |

## System Boundaries

- `app/` — Next.js app routes, root layout, and global styles.
- `components/ui/` — generated shadcn/ui primitives. Do not
  hand-edit these files after generation.
- `lib/` — shared application utilities such as `cn()`.
- `context/` — product, architecture, UI, standards, workflow,
  progress, and feature specifications.

## Storage Model

- **[Storage type e.g. Database]**: [What lives here —
  e.g. metadata, ownership, relationships]
- **[Storage type e.g. Blob/File Storage]**: [What lives
  here — e.g. generated files, media, large artifacts]

## Auth and Access Model

- [How authentication works — e.g. Every user signs in
  via Clerk]
- [How ownership works — e.g. Every project has a single
  owner]
- [How access control works — e.g. Only the owner or a
  collaborator can mutate project resources]

## Invariants

1. [Rule the codebase must never violate — e.g. Request
   handlers do not run long-lived background work]
2. [Invariant two]
3. [Invariant three]
4. [Invariant four]
