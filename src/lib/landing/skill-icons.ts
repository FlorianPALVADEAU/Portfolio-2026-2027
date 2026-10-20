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

/** Logos by skill label. Skills without one (BullMQ, AWS, practices) fall back to generated art. */
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
  Kubernetes: siKubernetes,
  "GitHub Actions": siGithubactions,
};

export function skillIcon(label: string): SkillIcon | null {
  return icons[label] ?? null;
}
