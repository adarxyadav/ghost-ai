# Code Standards

## General

- Keep modules focused and small. Aim for components and helpers
  under 200 lines; split earlier when a file mixes layout, state,
  data access, and formatting. Example checklist: a component
  should have one primary UI responsibility and export only the
  public API needed by callers.
- Fix root causes instead of adding compatibility patches. If a
  workaround is unavoidable, document the reason, scope it to the
  smallest component, and add a tracker note for removal. Example:
  suppress hydration only on the mismatching element, not the
  entire document body.
- Separate concerns. UI components render and handle interaction;
  domain helpers calculate behavior; persistence and API work
  belong at route or service boundaries. Reviewers should reject
  changes that mix database access into presentational components.

## TypeScript

- Strict TypeScript is required. `tsconfig.json` must keep
  `"strict": true`, and `npm run build` is the CI gate for type
  checking.
- Avoid `any`. Use explicit interfaces, discriminated unions, or
  `unknown` plus validation. If `any` is the only practical escape
  hatch, isolate it in one line with a comment explaining the
  upstream type gap.
- Exported functions and public component props need explicit
  types. Example checklist: exported helper return type, component
  prop type, and route response shape are all visible without
  opening the implementation.
- Validate external input at system boundaries before trusting it.
  Future API routes must parse request bodies, query parameters,
  path params, and storage metadata with a schema or narrow
  validator before use.
- Prefer discriminated unions for variants and state machines.
  Example: use `{ status: "idle" | "loading" | "error" }` shapes
  instead of several loosely related booleans.
- Use interfaces or named `Record` types for public DTOs. Inline
  object types are acceptable for private local values only.

## Next.js

- Default to server components for routes and static composition.
  Add `"use client"` only when browser state, event handlers, or
  effects are required.
- Keep client components at the smallest useful boundary. Example:
  sidebar open/close state belongs in an editor layout wrapper,
  while page content can remain server-rendered.
- Route handlers must perform one responsibility: validate,
  authorize, execute, and return. Long-running AI jobs or artifact
  generation must move to a background system when introduced.

## Styling

- Use CSS custom property tokens and Tailwind token classes. Do
  not hardcode app surface colors in components when a token such
  as `bg-background`, `bg-card`, `text-foreground`, or
  `border-border` exists.
- Follow the radius scale from `context/ui-context.md`: small
  controls use `rounded-sm` or primitive defaults, panels use
  `rounded-lg`, and overlays use `rounded-xl`.
- Use Lucide React icons for controls when an icon exists. Icon
  buttons need accessible labels and should use the generated
  button icon sizes.

## API Routes

- Validate and parse request input before any logic runs. Example
  checklist: method, params, body, and content type are checked
  before mutation.
- Enforce Clerk auth and ownership before future mutations. Do
  not add routes that read or write private user data without an
  explicit authorization check.
- Return consistent response shapes. Success responses should
  include typed data; errors should include a stable error code
  and safe message.
- Mutations that may be retried must be idempotent or protected
  by version, checksum, or ETag checks.

## Data and Storage

- Metadata belongs in the future database: project titles,
  ownership, collaborator relationships, artifact references, and
  audit timestamps.
- Large generated content belongs in future blob/file storage:
  generated artifacts, media, exports, and other large payloads.
- Do not store large generated content directly in database rows.
  Store a blob key, checksum, size, content type, and ownership
  metadata instead.
- Keep database and blob references consistent. A feature that
  creates or deletes blobs must define cleanup behavior for
  partial failures.

## File Organization

- `app/` — Next.js routes, layouts, metadata, and route handlers.
- `components/auth/` — auth-page presentation wrappers around
  Clerk components; do not rebuild Clerk internals here.
- `components/ui/` — app-owned shadcn/ui primitives.
- `components/editor/` — editor chrome, layout, sidebar, and
  editor-specific composition.
- `lib/` — shared utilities that are not tied to a single route.
- `context/` — source-of-truth product, architecture, standards,
  workflow, progress, and feature specifications.

## Enforcement

- Run `npm run lint` before handoff to catch ESLint and Next.js
  rules.
- Run `npm run build` before handoff to catch TypeScript,
  bundling, and route compilation errors.
- Reviewers should check this file, `context/architecture.md`,
  and the active feature spec before approving implementation
  changes.
