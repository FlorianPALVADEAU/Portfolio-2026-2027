import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ThemeSwitcher } from "./theme-switcher";

const meta = {
  title: "Molecules/ThemeSwitcher",
  component: ThemeSwitcher,
  args: { label: "Theme", names: { dark: "Dark", light: "Light", swiss: "Swiss" } },
} satisfies Meta<typeof ThemeSwitcher>;

export default meta;

export const Default: StoryObj<typeof meta> = {};
