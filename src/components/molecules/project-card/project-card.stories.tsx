import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ProjectCard } from ".";

const meta = {
  title: "Molecules/ProjectCard",
  component: ProjectCard,
  args: {
    href: "/en/projects/overbound",
    title: "Overbound",
    summary: "An obstacle-course race I founded and organised, with its own ticketing platform.",
    year: 2026,
    stack: ["Next.js", "Supabase", "Stripe", "Sanity"],
    cover: {
      src: "/projects/overbound/cover.png",
      width: 1600,
      height: 900,
      alt: "Overbound cover",
    },
  },
} satisfies Meta<typeof ProjectCard>;

export default meta;

export const Default: StoryObj<typeof meta> = {};
