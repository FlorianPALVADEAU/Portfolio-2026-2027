import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { WaveArt } from "./wave-art";

const meta = {
  title: "Atoms/WaveArt",
  component: WaveArt,
  args: { seed: 7, className: "h-96 w-72 text-muted-foreground" },
} satisfies Meta<typeof WaveArt>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const AnotherSeed: Story = { args: { seed: 42 } };
