import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import en from "../../../../messages/en.json";
import { SkillsSection } from ".";

const meta = {
  title: "Organisms/SkillsSection",
  component: SkillsSection,
  parameters: { layout: "fullscreen" },
  args: { index: 4, title: en.home.sections.skills, messages: en.home.skills },
} satisfies Meta<typeof SkillsSection>;

export default meta;

/** Scroll the canvas: the section pins and slides sideways while a wave is drawn through the skills. */
export const Default: StoryObj<typeof meta> = {};
