# Content

Typed content for projects and notes. Rules in the root [AGENTS.md](../AGENTS.md).

- Per project: `<slug>/project.ts` (structure, stack, media) and `<slug>/i18n/{fr,en,de}.json` (text). No MDX.
- Blocks are validated with Effect Schema at build; a missing translation or media file fails the build.
- German is Swiss Standard German (no ß). Keep tone and facts identical across locales.
- A cover may carry `depth`, a grayscale depth map (white is near) that enables the hover parallax on pointer devices. Generate it offline with `scripts/generate-depth.mjs`; skip it for flat covers (slides, text), where depth means nothing.
