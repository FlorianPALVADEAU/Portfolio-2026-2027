import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { BlockList } from ".";

const meta = {
  title: "Organisms/BlockList",
  component: BlockList,
  args: {
    blocks: [
      {
        id: "overview",
        type: "text",
        title: "Overview",
        paragraphs: ["A short paragraph.", "Another one."],
      },
      { id: "stack", type: "stack", title: "Stack", items: ["TypeScript", "Next.js", "Effect"] },
      {
        id: "challenges",
        type: "challenges",
        title: "Challenges",
        items: [
          { title: "Typed content", body: "Validated at build time." },
          { title: "Three locales", body: "French, English and German." },
        ],
      },
      {
        id: "results",
        type: "results",
        title: "Results",
        items: [{ label: "Locales", value: "3" }],
      },
      {
        id: "links",
        type: "links",
        title: "Links",
        items: [{ id: "source", href: "https://github.com/FlorianPALVADEAU/Portfolio-2026-2027" }],
        labels: { source: "Source code" },
      },
    ],
  },
} satisfies Meta<typeof BlockList>;

export default meta;

export const Default: StoryObj<typeof meta> = {};
