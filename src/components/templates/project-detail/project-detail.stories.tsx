import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ProjectDetail } from ".";

const meta = {
  title: "Templates/ProjectDetail",
  component: ProjectDetail,
  parameters: { layout: "fullscreen" },
  args: {
    locale: "en",
    messages: { back: "Back to home", role: "Role", year: "Year" },
    project: {
      title: "Sample project",
      summary: "A placeholder that exercises every content block.",
      role: "Full-stack developer",
      year: 2026,
      cover: { src: "/projects/overbound/cover.webp", width: 1920, height: 1280, alt: "Cover" },
      blocks: [
        { id: "overview", type: "text", title: "Overview", paragraphs: ["A short paragraph."] },
        { id: "stack", type: "stack", title: "Stack", items: ["TypeScript", "Next.js"] },
      ],
    },
  },
} satisfies Meta<typeof ProjectDetail>;

export default meta;

export const Default: StoryObj<typeof meta> = {};
