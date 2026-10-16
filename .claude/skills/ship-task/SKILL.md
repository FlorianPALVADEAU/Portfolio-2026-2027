---
name: ship-task
description: Deliver a task through the full GitHub workflow (issue, branch, checks, pull request, squash merge). Use when starting or finishing any change in this repository.
---

# Ship a task

1. Find or create the issue (milestone, labels `type:`/`area:`/`priority:`/`size:`, project board). Never work without one.
2. `git switch main && git pull`, then `git switch -c <type>/<issue#>-<slug>`.
3. Implement the smallest change that satisfies the acceptance criteria.
4. Run `npm run check`, `npm run typecheck`, `npm run lint:arch`, `npm run knip`, `npm run build`, plus tests when they exist.
5. Commit as a Conventional Commit (imperative, lowercase, 72 characters max) with `Refs #<issue>` in the body.
6. Push and open the pull request from the template, with `Closes #<issue>`, the same milestone and labels. The title is a Conventional Commit.
7. Ask the `code-reviewer` subagent to review the diff and address its findings.
8. Squash merge once checks pass.

Never commit to `main`. Never add `Co-Authored-By` trailers, "Generated with ..." lines or any AI attribution to commits, pull requests or files.
