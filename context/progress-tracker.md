# Progress Tracker

Update this file after every meaningful implementation
change.

## Current Phase

- Complete

## Current Goal

- Fixed node text rendering and improved selection/palette colors (2026-05-19).

## Completed

- Fixed node double-click to edit text on all shapes (2026-05-19):
  - Root cause: `onDoubleClick={startEditing}` was placed on the label `<span>`. When the label is
    empty the span has zero size and receives no pointer events, making editing unreachable.
  - Fix: moved `onDoubleClick` to the full-size container div for CSS shapes (`rectangle`, `pill`,
    `circle`) and to the `absolute inset-0 z-10` text overlay div for SVG shapes (`diamond`,
    `hexagon`, `cylinder`). Removed `onDoubleClick` from the `<span>` since it's now redundant.
  - Changed `startEditing` signature to `(e: React.MouseEvent)` and called `e.stopPropagation()`
    so React Flow does not also handle the double-click event.
  - Added `style={{ pointerEvents: "none" }}` to the SVG element on SVG shapes so pointer events
    fall through to the `z-10` text overlay div rather than being intercepted by the SVG.
  - Verification passed: `npm run build` (TypeScript clean, all routes present).

- Fixed node text rendering and improved selection/palette colors (`context/current-issues.md`) (2026-05-19):
  - `components/editor/canvas-node.tsx`: added `relative z-10` to the label `<span>` so it renders above
    NodeResizer's absolutely-positioned resize handles; added `z-20` to the editing overlay; added `z-10`
    to the SVG text overlay div to ensure it sits above the SVG element in the stacking context.
  - Changed label font from `text-xs` (12 px) to `text-sm` (14 px) + `leading-tight` for clearer, more
    readable text across all shape variants; matching change applied to the edit-mode textarea.
  - Changed selection border on CSS shapes (`rectangle`, `pill`, `circle`) from bright `border-primary`
    (cyan) to `border-white/50` — a neutral white ring that doesn't clash with any shape fill color.
  - Changed SVG stroke when selected from `var(--primary)` to `rgba(255,255,255,0.5)` for the same
    neutral white selection indicator on diamond / hexagon / cylinder.
  - Changed `resizerHandleStyle` to use white background + white border; removed cyan `border-primary`
    from handles so the NodeResizer handles are clean white squares on all fill colors.
  - `types/canvas.ts`: raised lightness of all five non-Default palette text colors from 0.68–0.74 to
    0.86–0.93, and slightly increased chroma (Purple hue shifted to 310, Red text hue to 350 for
    pink tones); results in clearly legible, vibrant text on every dark fill color.
  - Verification passed: `npm run build` (TypeScript clean, all routes present).

- Fixed missing node labels in canvas (2026-05-19):
  - Root cause: both `handleShapeSelect` and `handleDrop` in `canvas.tsx` created nodes with
    `data: { label: "", ... }` — empty string means nothing is ever rendered in the label span.
  - Fix: changed both creation paths to set `label` to the capitalized shape name
    (e.g. `"Rectangle"`, `"Diamond"`) so the shape's type appears as the default label.
    Users can still double-click to rename or clear it.
  - Verification passed: `npm run build` (TypeScript clean, all routes present).

- Fixed SSL mode warning in `lib/prisma.ts` (2026-05-19):
  - `DATABASE_URL` using `sslmode=require` (or `prefer`/`verify-ca`) triggered a deprecation
    warning from `pg-connection-string` about upcoming libpq-semantics breaking change.
  - Added a regex normalization in `createClient()` that rewrites `sslmode=prefer`,
    `sslmode=require`, and `sslmode=verify-ca` to `sslmode=verify-full` in the connection
    string before passing it to `PrismaPg`. This preserves current verify-full behavior
    and silences the warning without touching `.env.local`.
  - Verification passed: `npm run build` (TypeScript clean, all routes present).

- Built canvas ergonomics (`context/feature-specs/17-canvas-ergonomics.md`) (2026-05-19):
  - Created `components/editor/canvas-control-bar.tsx`: pill-shaped floating bar with zoom
    (ZoomOut, Fit, ZoomIn) and history (Undo, Redo) button groups separated by a thin divider;
    disabled buttons dim to 30% opacity; zoom calls `instance.zoomIn/zoomOut({ duration: 200 })`
    and `fitView({ duration: 300 })`; undo/redo call Liveblocks `undo`/`redo` from `useHistory`.
  - Created `hooks/useKeyboardShortcuts.ts`: attaches a `keydown` listener on `window`; skips
    when `e.target` is an `input`, `textarea`, or `contentEditable` element; supports `+`/`=`
    (zoom in), `-` (zoom out), `Cmd/Ctrl+Z` (undo), `Cmd/Ctrl+Shift+Z` (redo), `Cmd/Ctrl+Y` (redo).
  - Updated `components/editor/canvas.tsx`: removed `MiniMap`; wired `useHistory`, `useCanUndo`,
    `useCanRedo` from `@liveblocks/react` inside `CanvasFlow`; added `CanvasControlBar` in a
    `Panel position="bottom-left"` panel; called `useKeyboardShortcuts` with the React Flow instance.
  - Both `CanvasControlBar` and `useKeyboardShortcuts` accept a minimal structural interface
    (`ZoomableInstance`) instead of the full generic `ReactFlowInstance<CanvasNode, CanvasEdge>` to
    avoid TypeScript assignability errors from the generic constraint mismatch.
  - Verification passed: `npm run build` (TypeScript clean, all routes present).

- Fixed sidebar-open hydration mismatch in `workspace-shell.tsx` (2026-05-19):
  - Replaced the `useState` lazy initializer (which read `sessionStorage` synchronously during
    hydration) with `useState(false)` + a single `useEffect` that reads `sessionStorage` after
    hydration and calls `setIsSidebarOpen(true)` only when the stored value is `"true"`.
  - Root cause: the lazy initializer ran on the client during React's hydration render and
    returned `true` (if sessionStorage had `"true"`), while the server always rendered with
    `false` (sessionStorage unavailable) — producing mismatched `aria-label`/`aria-pressed` on
    the toggle button and a mismatched DOM tree in `ProjectSidebar` (conditional scrim `<div>`
    vs `<aside>`).
  - Verification passed: `npm run build` (TypeScript clean, all routes present).

- Built custom edge behavior (`context/feature-specs/16-edge-behavior.md`) (2026-05-19):
  - Updated `CanvasEdge` in `types/canvas.ts` to use `CanvasEdgeData { label?: string }` so
    edge labels can be stored and synced via Liveblocks.
  - Added `NodeHandles` component in `canvas-node.tsx` rendering four `type="source"` handles
    (Top, Right, Bottom, Left) with `id` props. Handles styled as small white dots with dark
    border (`8×8 px, borderRadius 50%`). Visibility driven by `isHovered || !!selected` state
    with a 0.15s opacity transition; each shape branch's root element wires `onMouseEnter`/
    `onMouseLeave` to toggle `isHovered`.
  - Created `components/editor/canvas-edge.tsx`: custom edge renderer using `getSmoothStepPath`
    (borderRadius 8) for clean right-angle routing; renders a visible `<path>` with
    `opacity 0.85` active / `0.35` rest and a 20 px invisible hit path for hover detection
    without increasing visible line thickness. Passes `markerEnd` from React Flow edge props to
    the visible path for the arrowhead.
  - Inline edge label editing: double-click on the `EdgeLabelRenderer` div triggers edit mode;
    `<input>` grows with content via `width: length*8px`; saves on blur, Enter, or Escape via
    `updateEdgeData(id, { label })`; saved labels render as pill badges
    (`rounded-full border bg-popover`); active edge with no label shows a faint `label...` hint.
    `nodrag nopan` and `onMouseDown stopPropagation` on the label container prevent canvas pan
    and drag during label interaction.
  - Updated `canvas.tsx`: added `edgeTypes = { canvasEdge: CanvasEdgeComponent }` and
    `defaultEdgeOptions = { type: "canvasEdge", markerEnd: { type: MarkerType.ArrowClosed } }`;
    replaced `useLiveblocksFlow` `onConnect` with a `handleConnect` wrapper that creates fully
    typed `CanvasEdge` objects (including `type: "canvasEdge"` and `data: {}`) via
    `onEdgesChange([{ type: "add", item: newEdge }])` for proper Liveblocks sync.
  - `ConnectionMode.Loose` (already set) allows any source handle to connect to any other handle.
  - Verification passed: `npm run build` (TypeScript clean, all routes present).

- Built floating node color toolbar (`context/feature-specs/15-nodes-color-toolbar.md`) (2026-05-19):
  - Added `NodeColorPair` type and `NODE_COLOR_PALETTE` (6 pairs: Default, Cyan, Green, Amber, Purple, Red)
    to `types/canvas.ts`; bg colors use dark oklch values keyed to existing theme hues; text colors
    mirror the app's chart/accent tokens. Added `textColor?: string` to `CanvasNodeData`.
  - Added `NodeToolbar` (from `@xyflow/react`) inside `CanvasNodeComponent`; shows only when the node
    is `selected`; positioned `Position.Top` so it floats above the node without overlapping it.
  - Toolbar renders one circular swatch per palette entry; active swatch is ringed with its paired text
    color; hovered swatch shows a tight `box-shadow` glow in its text color plus a `scale(1.1)` lift.
  - `nodrag nopan` classes and `onMouseDown stopPropagation` on the toolbar container and each button
    prevent toolbar clicks from triggering node drag or canvas pan.
  - Swatch `onClick` calls `updateNodeData(id, { color: pair.bg, textColor: pair.text })`; this routes
    through React Flow's `triggerNodeChanges` → `onNodesChange` → `useLiveblocksFlow` so color changes
    sync to collaborative storage with no server calls.
  - Applied colors to all six shape variants: CSS shapes (`rectangle`, `pill`, `circle`) receive inline
    `backgroundColor`/`color` style; SVG shapes (`diamond`, `hexagon`, `cylinder`) use dynamic `fill`
    prop derived from `data.color`; label overlays on SVG shapes use inline `color` from `data.textColor`.
  - Verification passed: `npm run build` (TypeScript clean, all routes present).

- Built node resizing and inline label editing (`context/feature-specs/14-node-editing.md`) (2026-05-19):
  - Added `NodeResizer` from `@xyflow/react` to all six shape branches in
    `components/editor/canvas-node.tsx`; handles appear only when a node is selected
    (`isVisible={!!selected}`); minimum size enforced at 80×40 px; handle and line
    styles use `var(--card)` / `var(--primary)` CSS custom properties to match the
    dark canvas theme at low opacity.
  - Added inline label editing: double-clicking the label area of any node sets local
    `isEditing` state; a `<textarea>` overlay (`absolute inset-0`, `nodrag nopan`,
    `onMouseDown stopPropagation`) replaces the label span so text interactions do not
    trigger node drag or canvas pan; editing closes on blur or `Escape`; `commitEdit`
    calls `updateNodeData(id, { label })` from `useReactFlow()` which routes through
    React Flow's `triggerNodeChanges` → `onNodesChange` → `useLiveblocksFlow` so
    label changes are synced to collaborative storage automatically.
  - Verification passed: `npm run build` (TypeScript clean, all routes present).

- Applied code-quality and correctness fixes from `context/current-issues.md` (2026-05-19):
  - `create-custom-text-editor-toolbar.md`: replaced `Editor` from `@tiptap/react` with
    `LexicalEditor` from `lexical` — the file uses Lexical APIs, not Tiptap.
  - `create-rooms-manually.md`: added `async` keyword to `fetchRoom` (was missing, causing a
    syntax error); added `LiveblocksError` to the import from `@liveblocks/node` so the
    `instanceof` check resolves.
  - `handling-hook-and-component-errors.md`: wrapped all switch cases that declare `const`
    bindings in block braces `{}` to eliminate duplicate-declaration scope errors.
  - `multiple-text-editors.md`: added `import { nanoid } from "nanoid"` so the `nanoid()`
    call in the mutation example resolves.
  - `components/editor/canvas.tsx`: replaced `timestamp+counter` node ID scheme with
    `crypto.randomUUID()` — collision-resistant across concurrent clients; removed the
    `nodeCounter` module-level variable.
  - `components/editor/project-sidebar.tsx`: added `focus-within:opacity-100` and
    `focus-visible:opacity-100` to the action-button wrapper div so keyboard-focused
    children reveal the Rename/Delete controls.
  - `components/editor/shape-panel.tsx` + `canvas.tsx`: added `onShapeSelect` prop to
    `ShapePanel`; buttons now also handle `onClick` and `onKeyDown` (Enter/Space) in
    addition to drag-and-drop; `CanvasFlow` passes a `handleShapeSelect` callback that
    uses `screenToFlowPosition(window.innerWidth/2, window.innerHeight/2)` to place the
    node at the viewport center.
  - `components/editor/share-dialog.tsx`: `handleRemove` now awaits the `DELETE` fetch and
    only calls `setCollaborators` when `res.ok` is true — prevents client state from
    diverging on network or server errors.
  - `components/editor/workspace-shell.tsx`: replaced `useState(false)` + `useEffect`
    sidebar-restore pattern with a lazy `useState` initializer that reads `sessionStorage`
    synchronously on first render; removed the separate `useEffect` and the `useEffect`
    import.
  - Verification passed: `npm run build` (TypeScript clean, all routes present).

- Built node shape rendering and drag preview (`context/feature-specs/13-node-shape.md`):
  - Replaced placeholder node renderer in `components/editor/canvas-node.tsx`:
    `rectangle` uses `rounded border`; `pill` and `circle` use `rounded-full border`
    (all with `bg-card`, `border-border` at rest and `border-primary` when selected).
    `diamond` and `hexagon` render as SVG `<polygon>` elements; `cylinder` renders as a
    `<rect>` body with two `<ellipse>` caps (bottom drawn before top for correct z-order).
    SVG uses `viewBox="0 0 100 100" preserveAspectRatio="none"` so shapes scale with the node's
    React Flow dimensions. SVG `fill` and `stroke` use CSS custom properties (`var(--card)`,
    `var(--border)`, `var(--primary)`) so they follow the theme. Labels overlay SVG shapes via
    `position: absolute inset-0 flex items-center justify-center`.
  - Added shape drag preview to `components/editor/shape-panel.tsx`:
    `PreviewState` tracks shape type, default dimensions, and live cursor coordinates.
    `handleDragStart` suppresses the browser default drag ghost via `setDragImage` with a
    1×1 transparent GIF and sets preview state. `onDrag` updates cursor position (skips
    `(0,0)` events emitted by some browsers before `dragend`). `onDragEnd` clears state.
    `GhostShape` renders the correct shape (CSS div for rectangle/pill/circle; inline SVG for
    diamond/hexagon/cylinder) using `var(--primary)` stroke so it's visually distinct.
    Portal to `document.body` positions the ghost fixed at the cursor (centered), `opacity: 0.65`,
    `pointerEvents: none`, `zIndex: 9999`. No changes to drop or node-creation logic.
  - Verification passed: `npm run build` (TypeScript clean, all routes present).

- Built shape panel (`context/feature-specs/12-shape-panel.md`):
  - Expanded `types/canvas.ts` `CanvasShape` to all six shapes: `rectangle`, `diamond`,
    `circle`, `pill`, `cylinder`, `hexagon`; added `DragPayload` type `{ shape, width, height }`.
  - Added `components/editor/canvas-node.tsx`: `CanvasNodeComponent` renders every shape as a
    bordered rectangle (`bg-card`, `border-border`) with the label or shape name centered;
    includes `Handle` targets at top and bottom for connections.
  - Added `components/editor/shape-panel.tsx`: pill-shaped floating toolbar with one draggable
    icon button per shape (Lucide icons: `RectangleHorizontal`, `Diamond`, `Circle`, `Pill`,
    `Cylinder`, `Hexagon`); `onDragStart` encodes `DragPayload` as JSON under the
    `"application/ghost-shape"` transfer key; default sizes: rectangle 160×80, diamond 120×120,
    circle 80×80, pill 160×60, cylinder 100×100, hexagon 120×120.
  - Updated `components/editor/canvas.tsx`: split into `Canvas` (holds `useLiveblocksFlow` state
    and wraps with `ReactFlowProvider`) and inner `CanvasFlow` (uses `useReactFlow` for
    `screenToFlowPosition`); `handleDrop` reads the drag payload, converts screen→flow
    coordinates, and calls `onNodesChange([{ type: "add", item: newNode }])` to create the node
    with the dragged shape and default dimensions; `ShapePanel` rendered via React Flow
    `<Panel position="bottom-center">`; `nodeTypes` wires `"canvasNode"` to
    `CanvasNodeComponent`; node IDs use `${shape}-${Date.now()}-${counter}`.
  - Verification passed: `npm run build` (TypeScript clean, all routes present).

- Fixed canvas editor UI issues (`context/current-issues.md` 2026-05-19):
  - AI sidebar converted from flex-row panel (pushed canvas) to `fixed` overlay matching
    `ProjectSidebar` approach; canvas now always fills full width below the navbar.
  - Project items in `ProjectSidebar` now wrap in `<Link href="/editor/[id]">` so clicking a
    project navigates to it.
  - Sidebar open state persisted in `sessionStorage` (key `sidebar-open`) so it survives
    `router.push` navigation; restored via `useEffect` on mount to avoid SSR hydration mismatch.
  - Rename dialog now shows the project's current Room ID (unchanged by rename) below the input.
  - Visual improvements: sidebar title "Projects", tab "My Projects", action buttons reveal on
    hover only (`opacity-0 group-hover:opacity-100`), active item gets a left accent border,
    AI sidebar redesigned as "AI Copilot" with placeholder cards matching desired state,
    navbar center shows project name + "Workspace" subtitle on two lines.
  - Verification passed: `npm run build` (TypeScript clean, all routes present).

- Built base canvas (`context/feature-specs/11-base-canvas.md`):
  - Installed `@xyflow/react` and `react-error-boundary`.
  - Added `types/canvas.ts` with `CanvasNodeData` (label, color, shape), `CanvasNode`
    (`Node<CanvasNodeData, "canvasNode">`), and `CanvasEdge`
    (`Edge<Record<string, never>, "canvasEdge">`).
  - Added `components/editor/canvas.tsx`: calls `useLiveblocksFlow<CanvasNode, CanvasEdge>`
    with `suspense: true` and empty initial nodes/edges; renders `ReactFlow` with
    `ConnectionMode.Loose`, `fitView`, dot-pattern `Background`, `MiniMap`, and `Cursors`.
  - Added `components/editor/canvas-wrapper.tsx`: wraps the canvas in `LiveblocksProvider`
    (authEndpoint `/api/liveblocks-auth`), `RoomProvider` (room ID from props, initial presence
    `cursor: null, isThinking: false`), an `ErrorBoundary` with a styled fallback, and a
    `ClientSideSuspense` loading state.
  - Updated `components/editor/workspace-shell.tsx` to replace the canvas placeholder with
    `<CanvasWrapper roomId={project.id} />`.
  - `Storage` was kept as `{}` in `liveblocks.config.ts` — `useLiveblocksFlow` manages the
    `"flow"` storage key internally; declaring it in the global type forces `initialStorage`
    on `RoomProvider` which conflicts with the library's own initialization.
  - Verification passed: `npm run build` (TypeScript clean, all routes listed).
- Built Liveblocks setup (`context/feature-specs/10-liveblocks-setup.md`):
  - Updated `liveblocks.config.ts` to define `Presence` (`cursor: { x: number; y: number } | null`,
    `isThinking: boolean`) and `UserMeta` (`id`, `name`, `avatar`, `cursorColor`).
  - Added `lib/liveblocks.ts`: exports `getLiveblocks()` (lazy singleton — defers
    `new Liveblocks()` construction until first call so the secret-key validation does not fire
    during Next.js static page collection at build time) and `getUserCursorColor(userId)` (maps a
    user ID to a consistent color from a 10-color palette via a simple hash).
  - Installed `@liveblocks/node` (was not yet present in `node_modules`).
  - Added `app/api/liveblocks-auth/route.ts` (`POST /api/liveblocks-auth`): requires Clerk
    authentication (`getCurrentIdentity()`); verifies project access with `getProjectAccess()`
    and returns `403` for unauthorized; calls `liveblocks.getOrCreateRoom(room, { defaultAccesses:
    ["room:write"] })` to ensure the room exists; attaches user name, avatar, and deterministic
    cursor color to `identifyUser()`; returns the Liveblocks session token.
  - Verification passed: `npm run build` (TypeScript clean, `/api/liveblocks-auth` listed as a
    dynamic route).
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

- Started node color toolbar from `context/feature-specs/15-nodes-color-toolbar.md` on 2026-05-19.
- `NodeToolbar` from `@xyflow/react` renders via a portal outside the node's DOM but is positioned
  relative to it via React Flow context — it reads the current node ID from context, so no `nodeId`
  prop is required when rendered inside the node component.
- `box-shadow` in inline styles accepts CSS custom properties (`var(--token)`) and oklch color values;
  both resolve correctly in modern browsers, so the glow effect works with the palette's string colors.
- SVG `fill` accepts a string prop; using `data.color ?? "var(--card)"` lets the palette drive SVG
  shape fill without touching the stroke logic.
- `nodrag nopan` CSS classes on the toolbar wrapper and buttons prevent React Flow from treating
  pointer events inside `NodeToolbar` as drag or pan gestures; `onMouseDown stopPropagation` is a
  belt-and-suspenders guard for the same.
- Started node editing from `context/feature-specs/14-node-editing.md` on 2026-05-19.
- `updateNodeData` from `useReactFlow()` dispatches a `NodeDataChange` through
  `triggerNodeChanges`, which calls the `onNodesChange` prop — `useLiveblocksFlow`
  wraps this callback so data updates sync to Liveblocks Storage automatically without
  needing to pass `onNodesChange` into the node component.
- `nodrag` and `nopan` CSS classes (React Flow v12 conventions) on the textarea wrapper
  and the textarea itself prevent node drag and canvas pan while the user types.
- `onMouseDown stopPropagation` on the editing overlay is a belt-and-suspenders guard
  for browsers that fire pointer events before React Flow checks its drag classes.
- Started node shape rendering from `context/feature-specs/13-node-shape.md` on 2026-05-19.
- SVG `fill` and `stroke` accept `var(--token)` in inline props (React passes them through as
  SVG presentation attributes); CSS custom properties defined on `:root` are resolved at paint time.
- `preserveAspectRatio="none"` on the SVG makes shapes fill the React Flow node bounding box
  regardless of aspect ratio — acceptable since default node sizes for SVG shapes are square.
- Browser drag ghost suppressed via `e.dataTransfer.setDragImage(new Image(), 0, 0)` with a
  1×1 transparent GIF; a React-managed fixed portal replaces it for the ghost preview.
- `drag` event (fires on the drag source) reliably carries `clientX/Y` during the drag but emits
  `(0,0)` on the final tick before `dragend` in some browsers — filtered with a guard.
- `createPortal` with `document.body` is safe inside `"use client"` components when the portal
  is only rendered after user interaction (state starts null, never reached during SSR).
- Started shape panel from `context/feature-specs/12-shape-panel.md` on 2026-05-19.
- `useReactFlow` must be called inside a `ReactFlowProvider` context, not in the same component
  that renders `<ReactFlow>` (which only provides context to its children, not its parent).
  Solved by splitting `Canvas` into an outer component (holds `useLiveblocksFlow` + wraps in
  `ReactFlowProvider`) and an inner `CanvasFlow` component that calls `useReactFlow`.
- `onNodesChange([{ type: "add" as const, item: newNode }])` is the standard React Flow
  `NodeAddChange` API; `useLiveblocksFlow` wraps `onNodesChange` so this syncs to liveblocks
  storage automatically.
- Started base canvas from `context/feature-specs/11-base-canvas.md` on 2026-05-19.
- Declaring `flow: LiveblocksFlow<CanvasNode, CanvasEdge>` in the global `Storage` type makes
  `RoomProvider` require `initialStorage`, which conflicts with `useLiveblocksFlow`'s own
  internal storage init. Kept `Storage: {}` and relied on `useLiveblocksFlow<CanvasNode, CanvasEdge>`
  generics for type safety instead.
- Verification passed: `npm run build` (TypeScript clean, `/editor/[roomId]` listed as dynamic).
- Started Liveblocks setup from `context/feature-specs/10-liveblocks-setup.md` on 2026-05-19.
- `@liveblocks/node` was not in `package.json`; installed as a runtime dependency.
- `new Liveblocks({ secret })` validates the secret format immediately and throws during Next.js
  static page collection at build time when `LIVEBLOCKS_SECRET_KEY` is not set. Solved with a
  lazy singleton getter `getLiveblocks()` in `lib/liveblocks.ts` instead of a module-level
  constant (same pattern as `lib/prisma.ts` global caching but deferred).
- `identifyUser` first arg must be a plain `string` userId (not `{ userId }`) unless you also
  want to pass `groupIds`; object form requires `groupIds: string[]` in the `Identity` type.
- `defaultAccesses: ["room:write"]` on `getOrCreateRoom` lets any identified user join; access
  is gated by our own `getProjectAccess` check before the token is issued.
- Verification passed: `npm run build` (TypeScript clean, `/api/liveblocks-auth` listed).
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
