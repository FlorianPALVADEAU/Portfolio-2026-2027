---
name: add-project
description: Add a project case study as typed content in three locales. Use when creating or editing a project page.
---

# Add a project

1. Create `content/projects/<slug>/project.ts` (slug, year, role, stack, links, media, ordered blocks) and `content/projects/<slug>/i18n/{fr,en,de}.json`.
2. Blocks come from the shared block catalog and are validated by the Effect Schema at build. Do not invent ad hoc fields.
3. Put images and videos under the project's media folder with descriptive alt text in every locale.
4. Same facts in all locales; German is Swiss Standard German (no ß).
5. Run the `i18n-review` skill on the three files.
6. Build: a missing translation or media file must fail, so a green build proves completeness.
7. Check the page at mobile width and in the three themes.
