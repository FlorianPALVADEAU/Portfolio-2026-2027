import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { SoundToggle } from "./sound-toggle";

const meta = {
  title: "Molecules/SoundToggle",
  component: SoundToggle,
  args: { label: "Sound" },
} satisfies Meta<typeof SoundToggle>;

export default meta;

export const Default: StoryObj<typeof meta> = {};
