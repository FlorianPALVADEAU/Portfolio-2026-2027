---
name: add-note
description: Add a tech-watch note to the notes section as typed content. Use when writing a new note.
---

# Add a note

1. Create `content/notes/<slug>/note.ts` (slug, date, tags, reading time) and `content/notes/<slug>/i18n/{fr,en,de}.json`.
2. Compose the body from the shared block catalog (paragraph, heading, code, quote, link). No MDX.
3. Cite sources with links and dates.
4. Run the `i18n-review` skill on the three files.
5. Build to validate the schema, then check the rendered note on mobile.
