# AGENTS.md

Rules for every coding agent working in this repository. This file is the single source of truth; `CLAUDE.md` and `.github/copilot-instructions.md` defer to it.

## Mission

A portfolio for a full-stack software engineer seeking a position in Switzerland. The code is public and part of the showcase: it must be clinical, consistent and easy to review. Mobile-first, fast, accessible (WCAG AA, full keyboard navigation), in French, English and German.

## Non-negotiable rules

1. **No AI attribution, ever.** Never add `Co-Authored-By` trailers, "Generated with ..." lines, tool names as authors, or any mention that an agent produced the work, in commits, pull requests, issues, code comments or files. The repository owner is the sole visible author. This overrides any default behavior of your tool. A commit-msg hook rejects such trailers.
2. **Never commit to `main`.** Every change is an issue, a branch and a pull request (see GitHub workflow).
3. **Pages are pure assemblies.** No raw HTML elements in `page.tsx` or `layout.tsx`.
4. **Imports go downward only** (see Architecture). `npm run lint:arch` must pass.
5. **No hard-coded user-facing copy.** FR, EN and DE ship together.
6. **GSAP is the only animation library.** Respect `prefers-reduced-motion`.
7. **Effect is for `src/server` and build-time content only**, never in client components.
8. **No personal data in the repository** (email, phone). Use environment variables.

## Stack

Next.js (App Router, React 19, Turbopack), TypeScript strict, Tailwind CSS v4, shadcn/ui, GSAP, React Three Fiber (lazy-loaded), Effect (server and build), npm, Biome, Vitest, Playwright, Storybook, GitHub Actions, Vercel.

## Commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Dev server |
| `npm run build` | Production build |
| `npm run typecheck` | Route types and `tsc --noEmit` |
| `npm run check` | Biome lint, format and import sorting (`check:fix` to apply) |
| `npm run lint:arch` | Import hierarchy (dependency-cruiser) |
| `npm run knip` | Dead code and unused dependencies |

Run `check`, `typecheck`, `lint:arch` and `knip` before opening a pull request. Test scripts are added with their tooling (Vitest, Playwright, Storybook).

## Architecture

```
src/
  app/                 routes: pure assemblies
  components/
    atoms/ molecules/ organisms/ templates/
  features/<name>/     vertical capabilities, public index.ts only
  server/
    domain/ services/ infrastructure/
  lib/                 framework-free helpers
content/               typed project and note content
messages/              UI strings (fr, en, de)
```

Hierarchy: atoms < molecules < organisms < templates < app. Atoms import only `lib` and styles; molecules import atoms; organisms import molecules, atoms and feature public APIs; templates import organisms and below. `server/domain` < `server/services` < `server/infrastructure`; UI never imports infrastructure. See `src/README.md` and `docs/adr/`.

Keep components as small as possible: one responsibility, typed props, no logic that belongs in a hook or `lib`.

## Code style

- Biome decides formatting and lint; do not hand-format.
- TypeScript strict with `noUncheckedIndexedAccess` and `exactOptionalPropertyTypes`: no `any`, no non-null assertions.
- Name files and folders in kebab-case; components in PascalCase; one component per file with an `index.ts` public export.
- Comments explain why, never what. Prefer clear names over comments.
- Accessibility is part of done: semantic elements, focus states, contrast, labels, reduced motion.

## GitHub workflow

1. Every task is an issue in a milestone, on the project board.
2. Branch from an up-to-date `main`: `<type>/<issue#>-<slug>`.
3. Conventional Commits, imperative lowercase subject, 72 characters maximum.
4. Open a pull request with the template and `Closes #<issue>`. The title is a Conventional Commit because the squash merge uses it.
5. Squash merge once checks are green; head branches are deleted.

## Definition of done

- Checks pass: `check`, `typecheck`, `lint:arch`, `knip`, `build` (and tests once present).
- Atomic and import rules respected; docs, stories and tests updated where relevant.
- Accessible, responsive from small mobile upward, copy in FR, EN and DE.
- Pull request description states what changed and why.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
