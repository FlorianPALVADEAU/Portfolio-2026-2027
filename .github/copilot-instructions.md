# Copilot instructions

The full rules are in [AGENTS.md](../AGENTS.md). Key points:

- Never add `Co-Authored-By` trailers, "Generated with ..." lines or any AI attribution to commits, pull requests, issues, comments or files.
- Never commit to `main`: use an issue, a branch named `<type>/<issue#>-<slug>` and a pull request with `Closes #<issue>`.
- Use Conventional Commits.
- Atomic design: atoms, molecules, organisms, templates. Pages and layouts contain no raw HTML elements. Imports only go downward; features are imported through their `index.ts`.
- TypeScript strict: no `any`, no non-null assertions. Biome formats and lints.
- GSAP only for animation, honoring `prefers-reduced-motion`. Effect only in `src/server` and build-time code.
- All copy exists in French, English and German. Accessibility (WCAG AA, keyboard) is required.
- Run `npm run check`, `npm run typecheck`, `npm run lint:arch` and `npm run knip` before opening a pull request.
