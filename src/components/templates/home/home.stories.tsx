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
      tagline: "I design, build and run web applications in TypeScript.",
      scroll: "Scroll",
      portraitAlt: "Portrait of Florian Palvadeau",
      sections: {
        intro: "Introduction",
        works: "Selected works",
        skills: "Skills",
        about: "About me (IRL)",
        gallery: "Gallery",
        contact: "Let's work together",
      },
    },
  },
} satisfies Meta<typeof Home>;

export default meta;

export const Default: StoryObj<typeof meta> = {};
