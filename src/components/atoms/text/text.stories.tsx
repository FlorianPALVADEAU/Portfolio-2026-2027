import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Text } from "./text";

const meta = {
  title: "Atoms/Text",
  component: Text,
  args: { children: "Building fast, accessible products from end to end." },
} satisfies Meta<typeof Text>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Muted: Story = { args: { tone: "muted", size: "sm" } };
