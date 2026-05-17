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
