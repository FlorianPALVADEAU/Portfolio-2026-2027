import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Heading } from "./heading";

const meta = {
  title: "Atoms/Heading",
  component: Heading,
  args: { level: 2, size: "2xl", children: "Full-stack software engineer" },
} satisfies Meta<typeof Heading>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Display: Story = { args: { level: 1, size: "display" } };
