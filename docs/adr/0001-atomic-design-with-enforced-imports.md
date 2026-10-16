# 0001. Atomic design with enforced imports

- Status: accepted
- Date: 2026-10-16

## Context

The site is a design-system-driven portfolio. Large components and logic in route files make reuse, review and visual consistency hard, and conventions that are only written down drift.

## Decision

Components are split into atoms, molecules, organisms and templates. Pages and layouts only assemble templates and organisms. Imports only point downward and features are consumed through a public `index.ts`. dependency-cruiser enforces the hierarchy and a Biome GritQL plugin forbids raw HTML elements in `page.tsx` and `layout.tsx`.

## Consequences

Components stay small and testable, and violations fail the build instead of surviving review. The cost is more files and an upfront decision about where each piece belongs; a few shells such as `<html>` live in templates rather than in the layout.
