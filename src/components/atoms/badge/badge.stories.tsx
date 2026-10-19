import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Badge } from "./badge";

const meta = {
  title: "Atoms/Badge",
  component: Badge,
  args: { children: "Open to positions, Switzerland" },
} satisfies Meta<typeof Badge>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Accent: Story = { args: { variant: "accent" } };
export const Outline: Story = { args: { variant: "outline" } };
