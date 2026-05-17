# Ghost AI

## Overview

Ghost AI is a dark, editor-first workspace for builders who
need to organize AI-assisted projects, generated artifacts, and
collaborative project context in one focused application shell.
The initial product serves founders, developers, and creative
operators who want a fast protected project workspace before
heavier storage and collaboration systems are introduced.

## Goals

1. Provide a reusable editor chrome so every editor screen can
   share the same navbar, sidebar, layout, and dark theme.
2. Keep the first interactive route lightweight: the home route
   redirects by Clerk session state, and `/editor` renders the
   editor shell with no TypeScript or lint errors.
3. Establish source-of-truth context documents so future feature
   work can be scoped, implemented, and verified from written
   specs rather than ad hoc decisions.
4. Prepare project navigation patterns for future project lists:
   the sidebar must expose My project, Shared, and New Project
   entry points even before persistence is added.
5. Use Clerk for account access so the editor shell is protected
   while Clerk continues to own sign-in, sign-up, profile, and
   logout flows.

## Core User Flow

1. User opens the Ghost AI app and is redirected based on Clerk
   session state: authenticated users enter the editor workspace,
   while unauthenticated users go to sign in.
2. User uses the navbar sidebar toggle to open the floating
   project sidebar without shifting the editor canvas.
3. User reviews project navigation tabs: My project and Shared.
4. User closes the sidebar and returns to the centered editor
   canvas area.
5. In future persistence units, user creates a project from the
   New Project action and opens it in the same editor layout.

## Features

### Editor Chrome

- Fixed dark top navbar with left, center, and right regions.
- Floating project sidebar that slides over the canvas rather
  than resizing page content.
- Reusable editor layout pattern for pages that need the same
  chrome around different editor content.

### Design System Foundation

- Dark-only Tailwind CSS v4 theme using shadcn/ui tokens.
- Generated shadcn/ui primitives stored under `components/ui/`
  and customized by the app as needed.
- Shared `cn()` utility for class composition.

### Future Project Workspace

- Project list tabs for owned and shared projects.
- New Project entry point ready for a later dialog and storage
  implementation.

### Authentication

- Clerk root provider and protected route proxy.
- Minimal dark sign-in and sign-up routes using Clerk components.
- Clerk user menu in the editor navbar for profile settings and
  logout.

## Scope

### In Scope

- Next.js App Router pages and layouts for the editor workspace.
- Clerk authentication wiring, auth pages, protected route proxy,
  and built-in user menu.
- Dark theme tokens, shadcn/ui primitives, and Lucide icons.
- Reusable editor navbar, sidebar, dialog pattern, and layout.
- Context documentation that defines product, architecture,
  standards, workflow, and progress.

### Out of Scope

- Persistent database or blob storage implementations.
- Real project creation, project sharing, and collaboration.
- AI model calls, prompt execution, background jobs, and artifact
  generation.
- Public marketing pages.

## Success Criteria

1. `npm run lint` and `npm run build` pass on the current branch.
2. The home route redirects authenticated users to `/editor` and
   unauthenticated users to `/sign-in`.
3. Opening the sidebar does not change the editor canvas layout.
4. All visible UI uses theme tokens from `app/globals.css` and
   no light-mode fallback appears.
5. Context documents contain concrete guidance with no bracketed
   placeholder instructions before the next feature unit begins.
