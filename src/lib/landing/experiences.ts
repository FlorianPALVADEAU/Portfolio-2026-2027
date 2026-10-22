/**
 * Where each technology of the engineering group was used, from the CV. `from` and `to` are
 * fractional years; `to: null` means the role is ongoing.
 */
export const experiences = [
  {
    id: "neurones",
    name: "Neurones IT",
    href: "https://www.neurones.net",
    from: 2022.35,
    to: 2023.65,
    stack: ["Django", "Vue.js", "Docker"],
  },
  {
    id: "jcdecaux",
    name: "JCDecaux",
    href: "https://www.jcdecaux.com",
    from: 2023.7,
    to: null,
    stack: ["TypeScript", "React", "NestJS", "PostgreSQL", "Redis", "AWS", "Kubernetes"],
  },
  {
    id: "overbound",
    name: "Overbound Race",
    href: "https://www.overbound-race.com",
    from: 2025.6,
    to: null,
    stack: ["Next.js", "Supabase", "Sanity", "Stripe", "Tailwind CSS"],
  },
] as const;

/** First and last year of the timeline axis. */
export const timelineYears = { start: 2022, end: 2027 } as const;

/** Figures from the CV; the labels live in the messages. */
export const skillStats = {
  features: 70,
  users: 1000,
  countries: 30,
  englishCountries: 13,
} as const;

/** Stages of the delivery pipeline and the tools that run them; the names live in the messages. */
export const pipelineStages = [
  { id: "push", tools: [] },
  { id: "test", tools: [] },
  { id: "build", tools: ["Docker"] },
  { id: "deploy", tools: ["Kubernetes", "Helm", "AWS"] },
] as const;
