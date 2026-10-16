---
name: a11y-audit
description: Audit a page or component for WCAG AA accessibility, keyboard use and reduced motion. Use before merging UI changes.
---

# Accessibility audit

1. Run the axe Playwright checks on the affected pages in every theme.
2. Keyboard: tab through every interactive element; focus is visible, order is logical, no traps, skip link works, `Escape` closes overlays.
3. Semantics: one `h1`, ordered headings, landmarks, buttons versus links, labels on inputs, alt text.
4. Contrast: text 4.5:1, large text and UI 3:1, in dark, light and Swiss themes.
5. Motion and sound: `prefers-reduced-motion` honored; sound muted by default with a visible toggle; no flashing content.
6. Zoom to 200% and test at 320px width without horizontal scroll.
7. Report findings with element, criterion and fix.
