import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Stack } from "./stack";

const meta = {
  title: "Atoms/Stack",
  component: Stack,
  args: {
    children: [<span key="a">One</span>, <span key="b">Two</span>, <span key="c">Three</span>],
  },
} satisfies Meta<typeof Stack>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Column: Story = {};
export const Row: Story = { args: { direction: "row", gap: "sm" } };
