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

<<<<<<< HEAD
- **Database**: User accounts, project metadata (name, owner, created/updated timestamps),
  project relationships (ownership, collaborators), access control lists, and all relational
  data requiring ACID guarantees. Access pattern: indexed lookups by user ID and project ID.
  Retention: soft-delete with 30-day retention before permanent removal. Authorization:
  enforced at query level—only owner and collaborators can read/write project records.
  Invariants: foreign keys enforced, no orphaned records, all writes in transactions.

- **Blob/File Storage**: Generated project artifacts (compiled outputs, exports, media files),
  user-uploaded assets, and any content exceeding 1MB. Access pattern: signed URLs with
  time-limited access. Retention: objects marked for deletion cascade when parent project
  is deleted. Authorization: pre-signed URLs scoped to authenticated user, validated against
  database ownership before generation. Invariants: every blob has a metadata record in the
  database with owner reference, ETag/CAS for conflict detection on updates, idempotent
  upload operations.

## Auth and Access Model

- **Authentication**: Every user signs in via the configured auth provider.
  Sessions are validated on every request. API routes reject unauthenticated
  requests with 401. Token types: session cookies (httpOnly, secure, sameSite).
  Scopes/roles: user (default), admin (platform operations).

- **Ownership**: Every project has exactly one owner (the creator). Ownership
  is immutable once created. The owner's user ID is stored in the project record
  and indexed for fast lookups.

- **Access Control**: Only the project owner or explicitly added collaborators
  can read or write project resources (database records, blob storage objects).
  Mutation operations (create, update, delete) require ownership or collaborator
  status verified before any state change. Public read access is opt-in per project
  and defaults to private.

## Invariants

1. **Request handlers do not run long-lived background work**: HTTP route handlers
   must respond within 10 seconds. Long-running tasks (exports, compilation) are
   delegated to background jobs with status polling endpoints.

2. **Referential integrity between database and blob storage**: Every blob object
   referenced in the database must exist in storage. Deletions are two-phase:
   mark blob metadata as deleted in DB transaction, then async cleanup in storage.
   No orphaned blobs without metadata records.

3. **All external input is validated at system boundaries**: API route handlers,
   form submissions, and file uploads must validate and parse input before any
   business logic runs. Use explicit schemas (Zod, TypeScript types) and reject
   invalid input with 400 status.

4. **Idempotent operations use client-provided idempotency keys**: Mutation endpoints
   that can be retried (create project, upload file) accept an optional idempotency
   key. Duplicate requests with the same key return the original result without
   side effects. Keys are stored with 24-hour TTL.

5. **Optimistic concurrency control for collaborative edits**: Updates to shared
   resources include ETag or version field. Concurrent updates without matching
   version are rejected with 409 conflict, requiring client to refetch and retry.
=======
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
>>>>>>> 8fa25cb (implement auth)
