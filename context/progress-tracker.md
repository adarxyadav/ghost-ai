# Progress Tracker

Update this file after every meaningful implementation
change.

## Current Phase

- Complete

## Current Goal

- Editor home screen and project dialogs from
  `context/feature-specs/04-project-dialogs.md` implemented
  and verified; sidebar project items with owned-only actions,
  mobile backdrop scrim, and Create/Rename/Delete dialogs wired.

## Completed

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

## Next Up

- Build the next feature unit from the feature specs.

## Open Questions

- None.

## Architecture Decisions

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
