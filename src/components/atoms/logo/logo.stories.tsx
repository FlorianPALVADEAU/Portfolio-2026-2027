import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Logo } from "./logo";

const meta = {
  title: "Atoms/Logo",
  component: Logo,
  args: { label: "FPL", className: "h-10" },
} satisfies Meta<typeof Logo>;

export default meta;

export const Default: StoryObj<typeof meta> = {};
