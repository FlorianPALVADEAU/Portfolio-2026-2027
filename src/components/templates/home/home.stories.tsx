import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import en from "../../../../messages/en.json";
import { Home } from "./home";

const meta = {
  title: "Templates/Home",
  component: Home,
  parameters: { layout: "fullscreen" },
  args: {
    locale: "en",
    messages: en.home,
    projects: [
      {
        slug: "overbound",
        title: "Overbound",
        summary: "An obstacle-course race I founded and organised.",
        year: 2026,
        stack: ["Next.js", "Supabase", "Stripe", "Sanity"],
        cover: { src: "/projects/overbound/cover.png", width: 1600, height: 900, alt: "Overbound" },
      },
    ],
  },
} satisfies Meta<typeof Home>;

export default meta;

export const Default: StoryObj<typeof meta> = {};
