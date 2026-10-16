# 0007. Token-driven themes

- Status: accepted
- Date: 2026-10-16

## Context

The site ships a dark, a light and a Swiss design theme. Components must not know which theme is active, and every theme must stay accessible.

## Decision

Components use semantic tokens only (`background`, `foreground`, `surface`, `muted`, `border`, `accent`, `ring`, radius, shadow). Each theme assigns values to those tokens under `[data-theme]` in `src/styles/themes.css`; Tailwind utilities map to the tokens in `src/styles/tokens.css`. Raw color values and per-theme conditionals do not appear in components. A Vitest suite computes WCAG contrast for every text and background pair in every theme, and Storybook has a theme switcher.

## Consequences

Adding or tuning a theme is a change to one file and cannot silently break contrast. The Swiss theme differs through tokens (sharp radius, black borders), so layout differences beyond tokens need an explicit decision.
