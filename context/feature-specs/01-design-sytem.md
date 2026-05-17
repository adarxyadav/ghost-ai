Read `AGENTS.md` before starting.

We're adding the design system and UI primitive components

Install and configure `shadcn/ui`

Add this following shadcn components:

- Button
- Card
- Dialog
- Input
- Tabs
- Textarea
- ScrollArea

Generated shadcn/ui primitives in `components/ui/*` are app-owned and may be customized by the app when needed.

Also install `lucide-react`.

create `lib/utils.ts` with a reusable `cn()` helper for merging tailwind classes.

Ensure all the components match the dark theme in `global.css`.

### Check when done

- All components import without errors.
- `cn()` works properly
- No default light styling appears
