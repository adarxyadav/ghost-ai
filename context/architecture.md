# Architecture Context

## Stack

| Layer     | Technology                  | Role   |
| --------- | --------------------------- | ------ |
| Framework | Next.js + TypeScript       | App framework and type system |
| UI        | Tailwind CSS v4 + shadcn/ui | Styling tokens and reusable UI primitives |
| Icons     | Lucide React                | Stroke icon library for controls |
| Auth      | Clerk                       | Session provider, auth UI, protected routes, and user menu |
| Database  | Not implemented             | Explicitly out of scope until a persistence feature spec exists |

## System Boundaries

- `app/` — Next.js app routes, root layout, and global styles.
- `components/ui/` — shadcn/ui primitives owned by the app and
  safe to customize. Re-running the shadcn CLI may overwrite
  local edits, so update through source-controlled changes.
- `components/auth/` — custom app shell around Clerk-hosted auth
  components.
- `components/editor/` — editor chrome, layout, sidebar, and
  editor-specific composition components.
- `lib/` — shared application utilities such as `cn()`.
- `context/` — product, architecture, UI, standards, workflow,
  progress, and feature specifications.

## Storage Model

- **Current state**: No database, blob store, or persistent
  server-side storage is implemented. UI components must not
  imply saved data unless a feature spec adds persistence.
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
