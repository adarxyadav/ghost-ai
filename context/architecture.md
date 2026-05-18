# Architecture Context

## Stack

| Layer     | Technology                  | Role   |
| --------- | --------------------------- | ------ |
| Framework | Next.js + TypeScript       | App framework and type system |
| UI        | Tailwind CSS v4 + shadcn/ui | Styling tokens and reusable UI primitives |
| Icons     | Lucide React                | Stroke icon library for controls |
| Auth      | Clerk                       | Session provider, auth UI, protected routes, and user menu |
| Database  | Prisma ORM v7 + PostgreSQL  | Schema, migrations, and typed client via Prisma |

## System Boundaries

- `app/` — Next.js app routes, root layout, and global styles.
- `components/ui/` — shadcn/ui primitives owned by the app and
  safe to customize. Re-running the shadcn CLI may overwrite
  local edits, so update through source-controlled changes.
- `components/auth/` — custom app shell around Clerk-hosted auth
  components.
- `components/editor/` — editor chrome, layout, sidebar, and
  editor-specific composition components.
- `lib/` — shared application utilities such as `cn()` and the `prisma` singleton.
- `prisma/` — Prisma schema files and migrations.
- `prisma/models/` — per-model schema files (multi-file schema).
- `app/generated/prisma/` — auto-generated Prisma client (do not edit).
- `context/` — product, architecture, UI, standards, workflow,
  progress, and feature specifications.

## Storage Model

- **Current state**: Prisma ORM v7 with PostgreSQL is implemented.
  `Project` and `ProjectCollaborator` models are live in the
  database. `lib/prisma.ts` exports a cached singleton that
  branches on `DATABASE_URL`: `prisma+postgres://` uses Accelerate
  (`@prisma/extension-accelerate`), all other URLs use
  `@prisma/adapter-pg` directly. The Prisma client is generated to
  `app/generated/prisma/` and must not be committed or edited by
  hand. Run `npx prisma generate` after schema changes.
- **Future database boundary**: Store only project metadata,
  ownership, collaborator relationships, audit metadata, and
  searchable indexes. Do not store large generated artifacts,
  binary media, or prompt outputs directly in relational rows.
  Access patterns must be owner/collaborator scoped, paginated,
  and validated at the route boundary. Backups and retention
  rules must be documented in the feature spec that introduces
  the database.
- **Future blob/file boundary**: Store generated artifacts,
  media, exports, and other large content. Blob keys must be
  referenced by database metadata, never trusted directly from
  client input. Use checksum or ETag validation for overwrite
  protection and define retention/cleanup behavior alongside the
  feature that creates blobs.

## Auth and Access Model

- **Current state**: Clerk is the authentication provider.
  `ClerkProvider` wraps the root layout, `proxy.ts` protects all
  routes by default. The public routes are the root redirector,
  sign-in, and sign-up paths. The home route redirects
  authenticated users to `/editor` and unauthenticated users to
  `/sign-in`.
- **Session model**: Clerk owns session creation, refresh, user
  profile, logout, and account settings flows. Server-side auth
  checks use Clerk's App Router helpers from
  `@clerk/nextjs/server`; client account controls use Clerk's
  built-in components such as `UserButton`. Sign-in and sign-up
  completion is forced to `/editor` by default so stale auth
  `redirect_url` values cannot strand users on the root
  redirector.
- **Future roles**: Minimum roles are owner, collaborator, and
  viewer. Owners can read/write project metadata and artifacts;
  collaborators can mutate only granted project resources;
  viewers can read only explicitly shared resources.
- **Authorization boundary**: Every future mutation must verify
  authenticated identity, project membership, role permission,
  and target resource ownership before touching database or blob
  state.

## Invariants

1. Routes remain focused: request handlers must validate input,
   authorize access, perform one responsibility, and return a
   predictable response shape.
2. Database rows and blob objects must stay referentially
   consistent. If a blob write succeeds but metadata write fails,
   the feature must clean up or mark the artifact for retry.
3. Future mutations that can be retried must be idempotent or use
   explicit compare-and-set semantics such as version columns,
   checksums, or ETags.
4. UI must not hardcode color values for app surfaces; use
   tokens from `app/globals.css` and the mappings in
   `context/ui-context.md`.
5. Generated shadcn/ui primitives are app-owned, but updates from
   the CLI must be reviewed because local customizations can be
   overwritten.
