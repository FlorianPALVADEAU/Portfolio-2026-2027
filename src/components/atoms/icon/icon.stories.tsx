import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ArrowUpRight } from "lucide-react";
import { Icon } from "./icon";

const meta = {
  title: "Atoms/Icon",
  component: Icon,
  args: { icon: ArrowUpRight },
} satisfies Meta<typeof Icon>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Decorative: Story = {};
export const Labelled: Story = { args: { label: "Opens in a new tab", size: "lg" } };
