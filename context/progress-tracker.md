# Progress Tracker

Update this file after every meaningful implementation
change.

## Current Phase

- Complete

## Current Goal

- Share dialog from `context/feature-specs/09-share-dialog.md` implemented and verified.

## Completed

- Built share dialog (`context/feature-specs/09-share-dialog.md`):
  - Added `app/api/projects/[projectId]/collaborators/route.ts` with `GET` (list
    collaborators, accessible to owner or any collaborator), `POST` (invite by email,
    owner-only, upsert-safe), and `DELETE` (remove by email in JSON body, owner-only);
    all three enforce `401`/`403` and validate input; returns `204` on delete.
  - Clerk enrichment is best-effort: calls `clerkClient().users.getUserList` with the
    collaborator email list; maps primary email → `{ name, avatarUrl }`; silently falls
    back to email-only if Clerk call fails.
  - Added `components/editor/share-dialog.tsx`: fetches collaborators when opened; owners
    see an invite-by-email input (Enter submits), collaborator list with remove buttons, and
    a "Copy link" button with temporary "Copied!" feedback; collaborators see the list
    read-only; avatars use Clerk image URL with `eslint-disable` on `<img>`; Clerk
    enrichment populates name and avatar when available.
  - Updated `lib/project-access.ts` `ProjectAccess` type to include `role:
    "owner" | "collaborator"` and updated `getProjectAccess` to return the role.
  - Updated `components/editor/workspace-shell.tsx` to accept `isOwner: boolean`,
    manage `isShareOpen` state, and render `ShareDialog`; `onShare` in `EditorNavbar`
    now opens the dialog.
  - Updated `app/editor/[roomId]/page.tsx` to pass `isOwner={project.role === "owner"}`.
  - Verification passed: `npm run build` (TypeScript clean, collaborators route listed).
- Built editor workspace shell (`context/feature-specs/08-editor-workspace-shell.md`):
  - Added `lib/project-access.ts` with `getCurrentIdentity()` (returns `userId` + primary
    email from Clerk) and `getProjectAccess(projectId, identity)` (checks owner match then
    collaborator match; returns `{ id, name }` or `null`).
  - Added `components/editor/access-denied.tsx`: centered layout, `Lock` icon, short message,
    and a styled `Link` back to `/editor`.
  - Updated `components/editor/editor-navbar.tsx` to accept optional `projectName` (renders
    in center column), `onShare`, `isAiSidebarOpen`, and `onToggleAiSidebar`; added Share2
    and MessageSquare buttons in the right section.
  - Updated `components/editor/project-sidebar.tsx` to accept optional `activeProjectId`;
    `ProjectItem` now takes `isActive` and applies `bg-muted/70 font-medium` when active.
  - Added `components/editor/workspace-shell.tsx`: client shell managing sidebar and AI
    sidebar open state; renders navbar with project name + share + AI toggle, canvas
    placeholder, collapsible AI sidebar panel, `ProjectSidebar` with active room highlighted,
    and all three project dialogs wired to `useProjectActions(project.id)`.
  - Added `app/editor/[roomId]/page.tsx`: async server component; unauthenticated users are
    redirected to `/sign-in`; missing or unauthorized projects render `AccessDenied`; fetches
    project access and sidebar project list in `Promise.all`; renders `WorkspaceShell`.
  - Verification passed: `npm run build` (TypeScript clean, `/editor/[roomId]` listed as a
    dynamic server-rendered route).
- Wired editor home to real project API (`context/feature-specs/07-wire-editor-home.md`):
  - Added `types/project.ts` with shared `ProjectRecord` interface (`id`, `name`, `role`).
  - Added `lib/projects.ts` server helper that fetches owned projects (`ownerId` match) and
    shared projects (`ProjectCollaborator.collaboratorEmail` match) in one `Promise.all`;
    returns both as `ProjectRecord[]` arrays with the correct `role`.
  - Added `hooks/use-project-actions.ts` managing dialog state (create/rename/delete) and
    real API mutations: POST creates with a client-generated `slug-suffix` room ID and
    navigates to `/editor/[id]`; PATCH renames and calls `router.refresh()`; DELETE
    redirects to `/editor` when deleting the active workspace, otherwise refreshes.
  - Updated `POST /api/projects` to accept an optional client-provided `id` (validated:
    lowercase alphanumeric + hyphens, 3–100 chars) so project ID and Liveblocks room ID
    stay aligned.
  - Updated `app/editor/page.tsx` to be an async server component that calls
    `getProjectsForCurrentUser()` and passes `ownedProjects`/`sharedProjects` to
    `EditorShell`.
  - Updated `EditorShell` to accept real project data props and use `useProjectActions`
    instead of the old mock-only hook.
  - Updated `ProjectSidebar` to accept separate `ownedProjects`/`sharedProjects` arrays
    of `ProjectRecord`; collaborator tab rows have no action buttons.
  - Updated `ProjectDialogs` to use `ProjectRecord`, rename `slugPreview` to
    `roomIdPreview`, and wire `onConfirm` handlers; Enter key in create/rename dialogs
    now submits instead of closing.
- Added `app/api/projects/route.ts` with `GET` (list owner's projects ordered
  by `createdAt` desc) and `POST` (create project, defaulting missing/blank
  name to `"Untitled Project"`); both return `401` for unauthenticated
  requests.
- Added `app/api/projects/[projectId]/route.ts` with `PATCH` (rename) and
  `DELETE`; both enforce `401` for unauthenticated requests and `403` when the
  Clerk `userId` does not match `ownerId`; `PATCH` validates the request body
  and returns `422` for missing or blank name; `DELETE` responds `204 No
  Content` on success; both return `404` when the project is not found.
- Fixed `lib/prisma.ts` to annotate `prisma` as `PrismaClient` (cast via
  `unknown`) so the union of Accelerate-extended and adapter-based client types
  does not cause overload incompatibility errors in TypeScript type checking.
- Added `prisma/models/project.prisma` with `Project` (ownerId,
  name, optional description, `DRAFT`/`ARCHIVED` status enum,
  canvasJsonPath, timestamps, indexes on ownerId and createdAt)
  and `ProjectCollaborator` (project relation with cascade delete,
  collaboratorEmail, createdAt, unique constraint on
  projectId+email, indexes on email and projectId+createdAt).
- Created `lib/prisma.ts` as a cached `global` singleton;
  branches on `DATABASE_URL`: `prisma+postgres://` paths use
  `@prisma/extension-accelerate` with `accelerateUrl`, all other
  URLs use `@prisma/adapter-pg`.
- Ran migration `20260518101134_init_projects` and generated
  the Prisma client to `app/generated/prisma/`.
- Updated `prisma.config.ts` to also load `.env.local` via
  `dotenv.config({ path: ".env.local", override: false })` so the
  Prisma CLI can find `DATABASE_URL` during local development.
- Installed `@prisma/extension-accelerate` for Accelerate support.
- Updated `context/architecture.md` storage model to reflect the
  live database layer.
- Added `hooks/use-project-dialogs.ts` with a dedicated hook
  managing dialog type state, selected project, name form value,
  live slug preview, and loading state; exports `MOCK_PROJECTS`
  with two owned and one collaborator project.
- Added `components/editor/project-dialogs.tsx` with three
  controlled dialogs: `CreateProjectDialog` (name input + slug
  preview), `RenameProjectDialog` (prefilled input, auto-focus,
  Enter submits, current name in description), and
  `DeleteProjectDialog` (destructive confirmation, no input).
- Updated `components/editor/project-sidebar.tsx` to accept
  project list and dialog callbacks; renders project items with
  Pencil/Trash2 action buttons for owned projects only;
  collaborator projects show no actions; adds a mobile-only
  backdrop scrim that closes the sidebar on tap.
- Updated `components/editor/editor-shell.tsx` to render the
  editor home screen (heading, description, New Project button
  with Plus icon) and wire all four entry points (home button,
  sidebar create, sidebar rename, sidebar delete) to their
  respective dialogs via `useProjectDialogs`.
- Added `components/editor/editor-navbar.tsx` with fixed-height
  dark top chrome, left/center/right sections, and sidebar
  toggle icons that reflect open state.
- Added `components/editor/project-sidebar.tsx` as a floating
  off-canvas project sidebar with a Project header, close
  button, My project and Shared tabs, empty states, and a
  full-width New Project button.
- Added `components/editor/editor-dialog.tsx` as a reusable
  editor dialog content pattern supporting title, description,
  children, and footer action slots with existing dialog tokens.
- Added `components/editor/editor-shell.tsx` and wired
  `app/page.tsx` to render the editor chrome with sidebar state.
- Initialized shadcn/ui with Tailwind CSS v4 support.
- Added generated shadcn/ui primitives: Button, Card, Dialog,
  Input, Tabs, Textarea, and ScrollArea.
- Added `lib/utils.ts` with the reusable `cn()` helper.
- Installed shadcn support dependencies, including
  `lucide-react`, `class-variance-authority`, `clsx`,
  `tailwind-merge`, `tw-animate-css`, and `@base-ui/react`.
- Applied a dark-only global theme in `app/globals.css` and
  enabled the `dark` class at the root layout.
- Updated `context/ui-context.md` and `context/architecture.md`
  to reflect the implemented design-system foundation.
- Forwarded `orientation` through the Tabs primitive root for
  correct ARIA and keyboard behavior.
- Removed global body-level hydration suppression from
  `app/layout.tsx`.
- Replaced placeholder project, architecture, code standards,
  and AI workflow content with concrete project rules.
- Fixed feature spec typos and package naming references.
- Moved `shadcn` from runtime dependencies to dev dependencies
  and refreshed `package-lock.json`.
- Installed `@clerk/ui` for Clerk's dark appearance theme.
- Added shared auth route constants and Clerk appearance mapping
  in `lib/auth-routes.ts` and `lib/clerk-appearance.ts`.
- Wrapped the root layout in `ClerkProvider` with Clerk dark
  theme overrides that use app CSS variables.
- Added `proxy.ts` at the project root to keep sign-in and
  sign-up public while protecting all other matched routes.
- Added minimal two-panel Clerk sign-in and sign-up pages with a
  small-screen form-only layout.
- Moved the editor shell to `/editor` and updated `/` to redirect
  by Clerk session state.
- Added Clerk's built-in `UserButton` to the editor navbar.
- Updated architecture, project overview, and code standards docs
  to reflect the implemented Clerk auth boundary.
- Made `/` an explicit public redirect route so Clerk does not
  attach a root `redirect_url` before the app sends users to
  `/editor` or `/sign-in`.
- Added targeted body-level hydration suppression for known
  browser-extension-injected body attributes such as
  `cz-shortcut-listen`.
- Added Clerk sign-in and sign-up force redirects using the
  standard Clerk env vars with `/editor` fallbacks, so stale
  `redirect_url` values cannot leave post-auth navigation stuck
  on the root redirector.

## In Progress

- None.

## Session Notes (continued)

- Started share dialog from `context/feature-specs/09-share-dialog.md` on 2026-05-18.
- Clerk `getUserList` accepts `emailAddress: string[]` as a filter; result is
  `{ data: User[] }`. Enrichment is wrapped in try/catch so a Clerk API failure does
  not break the list endpoint.
- `DELETE /api/projects/[projectId]/collaborators` takes `{ email }` in the JSON body
  rather than a path segment to avoid URL-encoding issues with `@` characters.
- Avatar `<img>` elements use `// eslint-disable-next-line @next/next/no-img-element`
  because Clerk avatar URLs can originate from arbitrary OAuth CDNs (Google, GitHub, etc.)
  making a static remote-pattern list impractical.
- Started workspace shell from `context/feature-specs/08-editor-workspace-shell.md`
  on 2026-05-18.
- Button primitive (`@base-ui/react/button`) does not support `asChild`; used
  `buttonVariants` from `components/ui/button.tsx` directly on a `Link` element instead.
- Started editor home wiring from `context/feature-specs/07-wire-editor-home.md`
  on 2026-05-18.
- `lib/projects.ts` uses `currentUser()` from `@clerk/nextjs/server` to get the
  user's primary email for the collaborator query; owned projects use `auth()` userId
  directly.
- Room ID = `${toSlug(name)}-${6-char random suffix}` generated client-side in
  `useProjectActions`; passed to POST as `id`; validated server-side with regex.
- Verification passed: `npm run build` (TypeScript clean, all routes present).
- Started project API routes implementation from
  `context/feature-specs/06-project-apis.md` on 2026-05-18.
- `prisma` singleton in `lib/prisma.ts` was typed as the union of the
  Accelerate-extended and adapter-based clients; TypeScript could not resolve
  `findFirst`/`findUnique` overloads across the union members. Fixed by casting
  to `PrismaClient` via `unknown` with a comment. Runtime behavior is
  unchanged.
- Verification passed: `npm run build` (TypeScript clean, all four routes
  appear in route output).

## Next Up

- Build the next feature unit from the feature specs.

## Open Questions

- None.

## Architecture Decisions

- `lib/prisma.ts` exports a single Prisma client cached on
  `global` in development (hot-reload safe). It branches on
  `DATABASE_URL` prefix: `prisma+postgres://` uses Accelerate;
  all other URLs use `@prisma/adapter-pg`. Import it as
  `import prisma from '@/lib/prisma'` in server components and
  route handlers.
- The generated Prisma client lives in `app/generated/prisma/`;
  it is gitignored and must be regenerated after schema changes
  with `npx prisma generate`.
- `prisma/models/` holds per-domain model files; `schema.prisma`
  holds only the generator and datasource blocks. Prisma v7
  directory schema mode (`schema: "prisma/"`) recurses into
  subdirectories to pick up model files.
- Clerk owns sign-in, sign-up, profile settings, logout, and
  session lifecycle. The app wraps Clerk UI with a minimal auth
  page shell and app token variables without rebuilding Clerk
  internals.
- `proxy.ts` protects all matched routes by default and derives
  public paths from the root redirector and Clerk's standard
  sign-in and sign-up env vars, with `/sign-in` and `/sign-up`
  fallbacks.
- Editor chrome state lives in a small client shell while the
  route remains a simple server entry point.
- The project sidebar is positioned fixed over the editor canvas
  so opening it does not affect page layout.
- shadcn/ui primitives in `components/ui/` are app-owned and may
  be customized, but CLI updates must be reviewed because they
  can overwrite local edits.
- The application is dark-only at `:root` and the root layout
  includes the `dark` class to prevent default light styling from
  appearing.

## Session Notes

- Started Prisma implementation from
  `context/feature-specs/05-prisma.md` on 2026-05-18.
- Prisma v7 multi-file schema with `schema: "prisma/"` in
  `prisma.config.ts` recursively picks up `prisma/models/*.prisma`
  files — confirmed by `prisma validate`.
- `DATABASE_URL` lives in `.env.local` (not `.env`); updated
  `prisma.config.ts` to call `dotenv.config({ path: ".env.local",
  override: false })` so the Prisma CLI resolves it.
- Accelerate path requires `new PrismaClient({ accelerateUrl: url
  }).$extends(withAccelerate())`; empty constructor is rejected by
  Prisma v7 type system.
- Verification passed: `npx prisma validate`, migration applied,
  `npx prisma generate`, `npm run build` (TypeScript clean).
- Started project dialogs implementation from
  `context/feature-specs/04-project-dialogs.md` on 2026-05-18.
- Verification passed: `npm run lint` (zero errors, one pre-existing
  warning in skills template only) and `npm run build` (TypeScript
  and compilation clean).
- In-app browser automation unavailable; visual verification limited
  to compile/build checks.
- Started auth implementation from
  `context/feature-specs/03-auth.md` on 2026-05-18.
- Initial `npm install @clerk/ui` failed inside the sandbox due
  to registry DNS resolution; reran with approved network access
  and installed successfully.
- Verification passed for auth implementation: `npm run lint`,
  `npm run build`, and local HTTP smoke checks against the dev
  server at `http://localhost:3000`.
- Fixed the current auth issues from
  `context/current-issues.md`: removed the post-auth root
  redirect loop risk and suppressed the known body attribute
  hydration warning source.
- Verification passed after current issue fixes: `npm run lint`,
  `npm run build`, and local HTTP smoke checks for `/`,
  `/editor`, `/sign-in`, and `/sign-up`.
- Hardened the auth callback flow by forcing Clerk sign-in and
  sign-up completion to `/editor`, even if an older tab or auth
  attempt carries a stale root `redirect_url`.
- Verification passed after force redirect hardening:
  `npm run lint`, `npm run build`, clean dev server restart, and
  local HTTP smoke checks for root, editor, auth pages, and Clerk
  callback routes.
- Verified and addressed review findings for docs, specs, tabs,
  hydration suppression, success tokens, and dependency
  classification.
- Verification passed after review fixes: `npm install`,
  `npm run lint`, and `npm run build`.
- Started editor chrome implementation from
  `context/feature-specs/02-editor.md`.
- Verification passed: `npm run lint`, `npm run build`, and a
  local HTTP smoke check against the existing dev server at
  `http://localhost:3000`.
- In-app browser automation was unavailable in this session, so
  visual verification was limited to compile/build and local HTTP
  checks.
- Started design system implementation from
  `context/feature-specs/01-design-sytem.md`.
- `components.json` uses shadcn `base-nova`, Tailwind CSS v4,
  CSS variables, and `@/*` aliases.
- Verification passed: `npm run lint`, `npm run build`,
  direct `cn()` merge check, and local HTTP smoke check against
  the existing dev server at `http://localhost:3000`.
