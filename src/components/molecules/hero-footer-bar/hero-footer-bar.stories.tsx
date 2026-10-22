import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { HeroFooterBar } from "./hero-footer-bar";

const meta = {
  title: "Molecules/HeroFooterBar",
  component: HeroFooterBar,
  args: { badge: "Open to work, Switzerland", cv: "Download CV", cvHref: "/cv/en/cv.pdf" },
  decorators: [
    (Story) => (
      <div data-theme="dark" className="relative h-40 bg-black px-6">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof HeroFooterBar>;

export default meta;

export const Default: StoryObj<typeof meta> = {};

export const WithoutCv: StoryObj<typeof meta> = { args: { cvHref: null } };
