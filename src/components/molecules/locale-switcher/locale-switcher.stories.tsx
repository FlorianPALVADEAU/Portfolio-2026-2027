import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { LocaleSwitcher } from "./locale-switcher";

const meta = {
  title: "Molecules/LocaleSwitcher",
  component: LocaleSwitcher,
  args: { current: "en", label: "Language" },
  parameters: { nextjs: { navigation: { pathname: "/en" } } },
} satisfies Meta<typeof LocaleSwitcher>;

export default meta;
type Story = StoryObj<typeof meta>;

export const English: Story = {};
export const German: Story = { args: { current: "de", label: "Sprache" } };
