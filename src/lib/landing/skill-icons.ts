import {
  siDjango,
  siGithubactions,
  siKubernetes,
  siNestjs,
  siNextdotjs,
  siPostgresql,
  siReact,
  siRedis,
  siSupabase,
  siTypescript,
  siVuedotjs,
} from "simple-icons";

export type SkillIcon = { title: string; path: string };

/** Simple Icons dropped the AWS logo, so AWS shows a plain cloud (Material Design Icons, Apache-2.0). */
const awsCloud: SkillIcon = {
  title: "AWS",
  path: "M19.35 10.04A7.49 7.49 0 0 0 12 4C9.11 4 6.6 5.64 5.35 8.04A5.994 5.994 0 0 0 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z",
};

/** Logos by skill label. Skills without one (BullMQ, CI/CD, practices) show their name alone. */
const icons: Record<string, SkillIcon> = {
  TypeScript: siTypescript,
  React: siReact,
  "Next.js": siNextdotjs,
  NestJS: siNestjs,
  "Vue.js": siVuedotjs,
  Django: siDjango,
  PostgreSQL: siPostgresql,
  Redis: siRedis,
  Supabase: siSupabase,
  AWS: awsCloud,
  Kubernetes: siKubernetes,
  "GitHub Actions": siGithubactions,
};

export function skillIcon(label: string): SkillIcon | null {
  return icons[label] ?? null;
}
