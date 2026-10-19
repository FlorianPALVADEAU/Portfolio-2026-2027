import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { HeroSection } from ".";

const meta = {
  title: "Organisms/HeroSection",
  component: HeroSection,
  parameters: { layout: "fullscreen" },
  args: {
    locale: "en",
    messages: {
      badge: "Open to positions, Switzerland",
      role: "Full-stack software engineer",
      tagline:
        "I design, build and run web applications in TypeScript, from enterprise integrations to the ticketing platform of a race I founded.",
      cta: "Get in touch",
      scroll: "Scroll",
      portraitAlt: "Portrait of Florian Palvadeau",
    },
  },
} satisfies Meta<typeof HeroSection>;

export default meta;

export const Default: StoryObj<typeof meta> = {};
