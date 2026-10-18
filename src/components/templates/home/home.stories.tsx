import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Home } from "./home";

const meta = {
  title: "Templates/Home",
  component: Home,
  args: {
    locale: "en",
    messages: {
      badge: "Open to positions, Switzerland",
      role: "Full-stack software engineer",
      cta: "Get in touch",
    },
  },
} satisfies Meta<typeof Home>;

export default meta;

export const Default: StoryObj<typeof meta> = {};
