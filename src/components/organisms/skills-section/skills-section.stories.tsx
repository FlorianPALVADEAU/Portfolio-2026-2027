import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import en from "../../../../messages/en.json";
import { SkillsSection } from ".";

const meta = {
  title: "Organisms/SkillsSection",
  component: SkillsSection,
  parameters: { layout: "fullscreen" },
  args: {
    index: 4,
    title: en.home.sections.skills,
    messages: en.home.skills,
    photo: en.home.photos.closing,
  },
} satisfies Meta<typeof SkillsSection>;

export default meta;

/** Scroll the canvas: the section pins and slides from frame to frame, each revealing its content. */
export const Default: StoryObj<typeof meta> = {};
