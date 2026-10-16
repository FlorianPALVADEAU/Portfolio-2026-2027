# Content

Typed content for projects and notes. Rules in the root [AGENTS.md](../AGENTS.md).

- Per project: `<slug>/project.ts` (structure, stack, media) and `<slug>/i18n/{fr,en,de}.json` (text). No MDX.
- Blocks are validated with Effect Schema at build; a missing translation or media file fails the build.
- German is Swiss Standard German (no ß). Keep tone and facts identical across locales.
