# Components

Atomic design levels: `atoms`, `molecules`, `organisms`, `templates`. Rules in the root [AGENTS.md](../../AGENTS.md).

- One component per folder with an `index.ts` export; props typed; no business logic.
- An atom imports only `lib` and styles; a molecule only atoms; an organism molecules, atoms and feature public APIs; a template organisms and below.
- Never import `server/infrastructure`.
- Add a Storybook story, keyboard and focus states, and a reduced-motion path for every animation.
