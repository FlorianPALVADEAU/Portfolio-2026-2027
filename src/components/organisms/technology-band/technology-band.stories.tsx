import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { TechnologyBand } from ".";

const meta = {
  title: "Organisms/TechnologyBand",
  component: TechnologyBand,
  parameters: { layout: "fullscreen" },
  args: { messages: { label: "Technologies I work with", pause: "Pause", play: "Play" } },
} satisfies Meta<typeof TechnologyBand>;

export default meta;

export const Default: StoryObj<typeof meta> = {};
