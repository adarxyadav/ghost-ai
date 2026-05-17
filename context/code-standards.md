# Code Standards

## General

<<<<<<< HEAD
- **Keep modules small and single-purpose**: Each file should have one clear responsibility.
  If a module exceeds 300 lines or handles multiple unrelated concerns, split it.

- **Fix root causes, do not layer workarounds**: When encountering a bug or limitation,
  address the underlying issue rather than adding conditional logic or patches around it.
  Document the root cause in commit messages.

- **Do not mix unrelated concerns in one component or route**: UI components should not
  contain business logic or data fetching. API routes should not handle multiple unrelated
  operations. Separate rendering, state management, and data access into distinct layers.

- **Prefer composition over configuration**: Build features by composing small, focused
  functions and components rather than large configurable abstractions with many options.

## TypeScript

- **Strict mode is required**: `tsconfig.json` must have `strict: true`. All type-checking
  flags (`strictNullChecks`, `noImplicitAny`, etc.) are enabled. Enforced by: `tsc --noEmit`
  in CI.

- **Ban `any` type**: Use explicit interfaces, type unions, or `unknown` for truly dynamic
  data. If `any` is unavoidable, document why with a comment and use the narrowest scope.
  Enforced by: ESLint rule `@typescript-eslint/no-explicit-any`.

- **Explicit return types on exported functions**: All exported functions and methods must
  declare return types. Internal/private functions may infer. Enforced by: ESLint rule
  `@typescript-eslint/explicit-module-boundary-types`.

- **Validate external input at system boundaries**: API route handlers, form submissions,
  webhooks, and file uploads must validate input using Zod schemas or similar before any
  logic runs. Parse once at the boundary, then pass typed data to internal functions.
  Example:
  ```typescript
  const inputSchema = z.object({ name: z.string(), age: z.number() });
  const parsed = inputSchema.parse(req.body); // throws if invalid
  ```

- **Prefer `unknown` over `any` for dynamic data**: When receiving data from external sources
  (API responses, user input), type it as `unknown` and narrow with type guards before use.

## Next.js

- **Default to Server Components**: All components in the `app/` directory are server
  components unless explicitly marked with `"use client"`. Server components reduce
  JavaScript bundle size and can fetch data directly.

- **Add `"use client"` only when browser interactivity requires it**: Use client components
  for state management (useState, useReducer), browser APIs (localStorage, window), event
  handlers, or third-party libraries that require client-side execution. Keep the client
  boundary as low in the tree as possible.

- **Keep route handlers focused on a single responsibility**: Each API route file should
  handle one resource or operation. Do not combine unrelated endpoints in the same file.
  Example: `/api/projects/route.ts` handles project listing and creation, not user auth.

- **Co-locate route handlers with their operations**: Place route logic in `app/api/*/route.ts`.
  Extract reusable business logic into `lib/` or domain-specific modules, not in route files.

## Styling

- **Use CSS custom property tokens — no hardcoded hex values**: All colors must reference
  CSS variables defined in `app/globals.css` (e.g., `bg-background`, `text-foreground`,
  `border-border`). Never use literal hex, rgb, or hsl values in component classes.
  Enforced by: code review.

- **Follow the border radius scale defined in ui-context.md**: Use Tailwind utilities
  `rounded-sm` (inline/small UI), `rounded-lg` (cards/panels), `rounded-xl` (modals/overlays).
  Do not use arbitrary values like `rounded-[12px]` unless specified in the design spec.

- **Tailwind utility classes only**: Do not write custom CSS modules or styled-components.
  Use Tailwind's utility-first approach. For complex repeated patterns, extract to a
  reusable component rather than creating a new CSS class.

## API Routes

- **Validate and parse request input before any logic runs**: Use Zod or similar schema
  validation at the top of route handlers. Return 400 with error details for invalid input.
  Example:
  ```typescript
  const body = await req.json();
  const parsed = createProjectSchema.safeParse(body);
  if (!parsed.success) return Response.json({ error: parsed.error }, { status: 400 });
  ```

- **Enforce auth and ownership before any mutation**: Check authentication and authorization
  before any database write or state change. Return 401 for unauthenticated requests, 403
  for unauthorized access. Verify ownership or collaborator status against the database.

- **Return consistent, predictable response shapes**: All API responses should follow a
  consistent structure: `{ data: T }` for success, `{ error: string | object }` for errors.
  Always set appropriate HTTP status codes (200, 201, 400, 401, 403, 404, 500).

- **Handle errors with proper status codes**: 400 (bad input), 401 (not authenticated),
  403 (authenticated but not authorized), 404 (resource not found), 409 (conflict),
  500 (server error). Log 500 errors with full context for debugging.

## Data and Storage

- **Metadata belongs in the database**: User accounts, project metadata (name, owner, timestamps),
  relationships, access control lists, and all relational data requiring ACID guarantees are
  stored in the database with proper indexes and foreign keys.

- **Large generated content belongs in file or blob storage**: Any content exceeding 1MB
  (generated files, exports, media, uploads) goes to blob/file storage. Store a reference
  (object key, URL) in the database along with size, content-type, and ownership metadata.

- **Do not store large content directly in the database**: Avoid storing base64-encoded images,
  large JSON blobs, or binary data in database columns. Use blob storage and reference by ID/key.

- **Use transactions for multi-step writes**: When creating or updating records that span
  multiple tables (e.g., project + initial metadata + access grants), wrap in a database
  transaction to ensure atomicity.

- **Soft-delete with retention policy**: Do not hard-delete user data immediately. Mark as
  deleted with a timestamp, retain for 30 days, then permanently remove with a background job.

## File Organization

- `app/` — Next.js app router: pages, layouts, API routes, and global styles. Follow Next.js
  conventions for routing and file naming.

- `components/ui/` — shadcn/ui generated primitives (Button, Dialog, Input, etc.). These are
  customizable but regenerating can overwrite changes—see `ui-context.md` for guidance.

- `components/editor/` — Editor-specific components (navbar, sidebar, canvas controls) that
  compose UI primitives into feature-level widgets.

- `lib/` — Shared application utilities, helpers, and cross-cutting concerns. Examples: `cn()`
  for class merging, API client wrappers, validation schemas, formatting functions.

- `context/` — Product specifications, architecture, UI standards, workflow rules, progress
  tracking, and feature specs. Update these files when implementation changes design decisions.
=======
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
>>>>>>> 8fa25cb (implement auth)
