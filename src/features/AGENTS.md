# Features

A feature is a vertical capability (theme, sound, i18n, transitions). Rules in the root [AGENTS.md](../../AGENTS.md).

- Expose a single public `index.ts`; nothing outside the feature imports its internals.
- A feature may use components and `lib`; it must not import `server/infrastructure`.
- Keep client state minimal and respect `prefers-reduced-motion` and user preferences (muted sound by default).
