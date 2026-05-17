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

Do not modify generated ui `components/ui/*` files after installation.

Also install `lucide-react`.

create `lib/utils.ts` with a reusable `cn()` helper for merging tailwind classes.

Ensure all the components match the dark theme in `global.css`.

### Check when done

- All components import without errors.
- `cn()` works properly
- No default light styling appears
