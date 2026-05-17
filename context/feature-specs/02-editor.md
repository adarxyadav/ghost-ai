We need the base chrome components that frame every editor screen - the top navbar and the left sidebar shell. These will be reused and extended in every chapter that follows.

### Editor Navbar

Create `components/editor/editor-navbar.tsx`.

Requirements:

- fixed height top navbar
- left, center and right sections
- left section contains sidebar toggle buttons
- use `PanelLeftOpen` and `PanelLeftClose` icon based on sidebar state
- right sections stays empty for now.
- dark background with subtle bottom border.

### Project Sidebar

Create `components/editor/project-sidebar.tsx`

Requirements:

- sidebar should float above editor canvas.
- opening it shouldn't push page content.
- slide in from the left.
- accepts `isOpen` prop
- headers with `Project` title + close button.
- shadcn `Tabs`:
  - My project
  - Shared
- both tabs show empty palceholder state.
- full-width `New Project`button at the bottom with `Plus` icon

### Dialog pattern

Use existing color token from `globals.css` for dialog styling.

support:

- title
- description
- footer action

Do not build actual diologs yet.

### Check when done

- new components compile without Typescript errors
- no lint errors
- dialog pattern is ready to use for future use.
