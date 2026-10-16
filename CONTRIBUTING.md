# Contributing

This repository is a public portfolio. Its history is part of the showcase, so every change follows the same workflow.

## Workflow

1. Every task starts as an issue, assigned to a milestone and placed on the project board.
2. Create a branch from an up-to-date `main`, named `<type>/<issue#>-<slug>` (for example `feat/42-hero-section`).
3. Commit with [Conventional Commits](https://www.conventionalcommits.org/). Types: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`.
4. Open a pull request using the template, with `Closes #<issue>` in the description.
5. Wait for required checks and review, resolve all threads.
6. Squash merge. The pull request title becomes the commit message on `main`, so it must be a valid Conventional Commit.

Direct commits to `main` are blocked by a repository ruleset.

## Commit rules

- Imperative mood, lowercase subject, no trailing period, 72 characters maximum.
- Commits carry no `Co-Authored-By` trailer and no tool attribution. The author is the sole contributor.

## Local setup

Requires Node 24 (see `.nvmrc`) and npm.

```bash
npm install
npm run dev
```
