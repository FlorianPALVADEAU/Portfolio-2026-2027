---
name: create-component
description: Create a UI component at the right atomic level with props, story, tests and accessibility. Use for any new atom, molecule, organism or template.
---

# Create a component

1. Pick the level: atom (single element), molecule (atoms), organism (self-contained section), template (page layout). Reuse an existing component first.
2. Create `src/components/<level>/<name>/` with `<name>.tsx` and `index.ts`.
3. Type the props, forward `className`, expose no business logic. Use design tokens, never raw colors or magic numbers.
4. Respect the import hierarchy; run `npm run lint:arch`.
5. Handle states: hover, focus-visible, disabled, loading, and all three themes.
6. Make it accessible: semantic element, label, keyboard use, contrast, reduced motion.
7. Add a colocated Storybook story and a test for behavior.
8. Pages and layouts must only compose templates and organisms.
