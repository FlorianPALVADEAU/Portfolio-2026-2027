/**
 * Skill groups in display order. `items: null` means the labels are prose and live in messages.
 * `hue` is the colour of the group in the pinned rail, in degrees of the OKLCH wheel.
 */
export const skillGroups = [
  {
    id: "engineering",
    hue: 255,
    items: [
      "TypeScript",
      "React",
      "Next.js",
      "NestJS",
      "Vue.js",
      "Django",
      "PostgreSQL",
      "Redis",
      "BullMQ",
      "Supabase",
    ],
  },
  { id: "infrastructure", hue: 175, items: ["AWS", "Kubernetes", "GitHub Actions", "CI/CD"] },
  { id: "delivery", hue: 55, items: null },
  { id: "collaboration", hue: 335, items: null },
] as const;

/** Only credentials confirmed by the owner. `score: null` when none is published. */
export const certifications = [
  { id: "ckad", name: "CKAD", issuer: "CNCF", year: 2026, score: "92%" },
  { id: "psm", name: "PSM I", issuer: "Scrum.org", year: 2025, score: null },
  { id: "aws", name: "AWS Developer Associate", issuer: "AWS", year: 2025, score: null },
] as const;

/** Technologies in display order, derived so the marquee never drifts from the skills section. */
export const technologies = skillGroups.flatMap(({ items }) => items ?? []);
