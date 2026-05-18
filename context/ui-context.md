# UI Context

## Theme

Dark only. The design language is a dark technical
workspace with near-black backgrounds, layered surfaces,
cool cyan accents for primary actions, and restrained
state colors.

## Colors

[Define your color tokens as CSS custom properties.
All components must use these tokens — no hardcoded
hex values.]

| Role            | CSS Variable       | Value                     |
| --------------- | ------------------ | ------------------------- |
| Page background | `--bg-base`        | `var(--background)`       |
| Surface         | `--bg-surface`     | `var(--card)`             |
| Primary text    | `--text-primary`   | `var(--foreground)`       |
| Muted text      | `--text-muted`     | `var(--muted-foreground)` |
| Primary accent  | `--accent-primary` | `var(--primary)`          |
| Border          | `--border-default` | `var(--border)`           |
| Error           | `--state-error`    | `var(--destructive)`      |
| Success         | `--state-success`  | `var(--state-success)`    |

The shadcn/ui variables in `app/globals.css` are the source
of truth for component colors: `--background`, `--foreground`,
`--card`, `--popover`, `--primary`, `--secondary`, `--muted`,
`--accent`, `--destructive`, `--border`, `--input`, and `--ring`.
Do not introduce light-mode values.

## Typography

| Role      | Font       | Variable      |
| --------- | ---------- | ------------- |
| UI text   | Geist Sans | `--font-sans` |
| Code/mono | Geist Mono | `--font-mono` |

## Border Radius

| Context           | Class                             |
| ----------------- | --------------------------------- |
| Inline / small UI | `rounded-sm` / component defaults |
| Cards / panels    | `rounded-lg`                      |
| Modals / overlays | `rounded-xl`                      |

## Component Library

shadcn/ui on top of Tailwind CSS v4. Generated primitives
live in `components/ui/`. Add new primitives with the
shadcn CLI. These generated components are intended to be
customized by the application — edit them as needed to fit
project requirements. Warning: re-running the shadcn CLI
to update a component can overwrite local changes. Use
source control to track modifications and review the CLI's
migration guidance when updating existing components.

## Layout Patterns

- Pages use `bg-background` and `text-foreground` from the
  global theme.
- Panels and cards use shadcn surface tokens such as `bg-card`,
  `bg-popover`, `border-border`, and `text-card-foreground`.
- Modals use the generated Dialog primitive with dark backdrop
  and surface tokens.

## Icons

Lucide React. Stroke-based icons only. Sizes: `size-4`
for inline controls and generated button defaults unless a
component specifies a tighter icon size.
