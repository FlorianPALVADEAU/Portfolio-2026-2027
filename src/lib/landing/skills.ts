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
  { id: "infrastructure", items: ["AWS", "Kubernetes", "Docker", "Helm", "CI/CD"] },
  { id: "delivery", items: null },
  { id: "collaboration", items: null },
] as const;

/**
 * Only credentials confirmed by the owner. `score: null` when none is published; `credentialId` is
 * the public identifier a verifier asks for, and `verifyUrl` the page that checks it. Oldest first,
 * since the plates read as a timeline from left to right.
 */
export const certifications = [
  {
    id: "psm",
    name: "PSM I",
    issuer: "Scrum.org",
    year: 2025,
    score: null,
    logo: "/brand/certifications/psm1.svg",
    credentialId: null,
    verifyUrl: "https://www.scrum.org/user/1559892",
  },
  {
    id: "aws",
    name: "AWS Developer Associate",
    issuer: "AWS",
    year: 2025,
    score: null,
    logo: "/brand/certifications/aws-cda.svg",
    credentialId: "093b98680b094f94971f653d5a619197",
    verifyUrl: "https://aws.amazon.com/verification",
  },
  {
    id: "ckad",
    name: "CKAD",
    issuer: "CNCF",
    year: 2026,
    score: "92%",
    logo: "/brand/certifications/ckad.svg",
    credentialId: "LF-gm9o7dmr8j",
    verifyUrl: "https://training.linuxfoundation.org/certification/verify/",
  },
] as const;

/** Technologies in display order, derived so the marquee never drifts from the skills section. */
export const technologies = skillGroups.flatMap(({ items }) => items ?? []);
