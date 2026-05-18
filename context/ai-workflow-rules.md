# AI Workflow Rules

## Approach

Build Ghost AI incrementally with a spec-driven workflow. Before
implementation, read the required context files, identify the
active feature spec, and confirm the work fits the current unit.
Example checklist: context read, feature scope identified,
affected files inspected, implementation plan kept small.

## Core Workflow Sections

1. **Orient**: Read project overview, architecture, UI context,
   code standards, workflow rules, progress tracker, and the
   active feature spec. Reviewer check: the implementation should
   reference the correct source-of-truth file.
2. **Scope**: Define the smallest change that satisfies the
   request. Example: update the editor layout without changing
   auth, storage, or unrelated UI primitives.
3. **Implement**: Prefer existing patterns and tokens. Keep
   changes local to the relevant route, component, or context
   file.
4. **Document**: Update `context/progress-tracker.md` after each
   meaningful implementation change. Update architecture, UI, or
   standards docs when their rules change.
5. **Verify**: Run `npm run lint` and `npm run build` before
   handoff. Add targeted checks when behavior changes.
6. **Deliver**: Summarize what changed, what was skipped, and
   which validation commands passed.

## Scoping Rules

- Work on one feature unit at a time. Example: editor chrome work
  may touch `components/editor/`, `app/page.tsx`, and related
  docs, but should not add persistence.
- Prefer small, verifiable increments over speculative changes.
  Reviewer checklist: the diff has a clear purpose, no unrelated
  refactors, and a direct validation path.
- Do not combine unrelated system boundaries in a single step.
  Example: do not mix UI layout changes with future auth token
  design unless the feature spec explicitly requires both.
- Treat generated shadcn/ui primitives as app-owned. Customize
  them when needed, but review diffs carefully because CLI
  updates can overwrite local changes.

## Acceptance And Verification

- The requested behavior works within the defined scope.
- No invariant in `context/architecture.md` is violated.
- UI changes use theme tokens from `app/globals.css` and follow
  `context/ui-context.md`.
- `context/progress-tracker.md` reflects the latest meaningful
  change.
- `npm run lint` and `npm run build` pass. If a command cannot be
  run, record the reason and residual risk in the handoff.

## Roles And Responsibilities

- Implementer: reads context, makes scoped changes, updates docs,
  and runs validation. Example checklist: no placeholder docs
  added, no generated file overwritten accidentally, no unrelated
  work reverted.
- Reviewer: verifies the change against the active spec,
  architecture invariants, UI tokens, and validation output.
- Product/context owner: resolves missing or ambiguous
  requirements by updating the relevant context file before code
  expands beyond the current spec.

## Delivery And Checkpoints

- Provide short progress updates while exploring or editing.
- Update the progress tracker once after a meaningful code or
  documentation change, and again when completion status changes.
- Before final delivery, check git diff, run validation, and
  report fixed findings and skipped findings with reasons.

## When to Split Work

Split an implementation step if it combines:

- UI changes and storage/auth/API changes.
- Multiple unrelated routes, dialogs, or feature specs.
- Behavior not clearly defined in the context files.
- A change that cannot be verified end to end with focused
  checks.

If a change cannot be verified end to end quickly, reduce the
scope or create a follow-up item in `progress-tracker.md`.

**Example:** If a feature requires a new API route, database table, and UI component,
split it into: (1) schema migration, (2) API route with tests, (3) UI integration.

## Handling Missing Requirements

- Do not invent product behavior not defined in the context
  files. Example: do not add real project persistence until a
  storage spec exists.
- If a requirement is ambiguous, resolve it in the relevant
  context file before implementing.
- If a requirement is missing but the current request can still
  proceed safely, add an open question in `progress-tracker.md`
  and keep the implementation limited to the defined behavior.

## Protected Files

Do not modify the following unless explicitly instructed:

- Third-party package internals (`node_modules`, vendor code).
- Generated build output such as `.next/`.
- Files explicitly marked as auto-generated with "DO NOT EDIT" headers.

Treat `components/ui/` as source code owned by the app. Customize
components when needed, but avoid broad rewrites and review CLI
diffs carefully because re-running the shadcn CLI can overwrite
local changes.

## Keeping Docs in Sync

Update the relevant context file whenever implementation changes:

- System architecture or boundaries.
- Storage model decisions.
- Code conventions or standards.
- Feature scope.
- UI theme tokens or component conventions.

Example reviewer checklist: the diff changes behavior, the
progress tracker mentions it, and any changed rule is reflected
in the matching context file.

## Before Moving to the Next Unit

1. The current unit works end to end within its defined scope.
2. No invariant defined in `architecture.md` was violated.
3. `progress-tracker.md` reflects the completed work.
4. `npm run lint` passes.
5. `npm run build` passes.
