/** Skill groups in display order. `items: null` means the labels are prose and live in messages. */
export const skillGroups = [
  {
    id: "engineering",
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
  { id: "infrastructure", items: ["AWS", "Kubernetes", "GitHub Actions", "CI/CD"] },
  { id: "delivery", items: null },
  { id: "collaboration", items: null },
] as const;

/** Only credentials confirmed by the owner. `score: null` when none is published. */
export const certifications = [
  { id: "ckad", name: "CKAD", issuer: "CNCF", year: 2026, score: "92%" },
  { id: "psm", name: "PSM I", issuer: "Scrum.org", year: 2025, score: null },
  { id: "aws", name: "AWS Developer Associate", issuer: "AWS", year: 2025, score: null },
] as const;
