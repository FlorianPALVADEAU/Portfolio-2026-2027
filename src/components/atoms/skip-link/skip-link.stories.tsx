import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { SkipLink } from "./skip-link";

const meta = {
  title: "Atoms/SkipLink",
  component: SkipLink,
  args: { href: "#main", children: "Skip to content", autoFocus: true },
} satisfies Meta<typeof SkipLink>;

export default meta;

export const Focused: StoryObj<typeof meta> = {};
