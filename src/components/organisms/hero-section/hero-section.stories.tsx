import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { HeroSection } from ".";

const meta = {
  title: "Organisms/HeroSection",
  component: HeroSection,
  parameters: { layout: "fullscreen" },
  args: {
    messages: {
      badge: "Open to positions, Switzerland",
      role: "Full-stack software engineer",
      headline: "From Geneva, I build software that holds.",
      cv: "Download CV (PDF)",
      opening: { base: "Code", phrases: ["that holds.", "built to last."] },
    },
  },
} satisfies Meta<typeof HeroSection>;

export default meta;

export const Default: StoryObj<typeof meta> = {};

export const WithCv: StoryObj<typeof meta> = { args: { cvHref: "/cv/cv-en.pdf" } };
