import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Flag } from "./flag";

const meta = {
  title: "Atoms/Flag",
  component: Flag,
  args: { locale: "fr" },
  argTypes: { locale: { control: "select", options: ["fr", "en", "de"] } },
} satisfies Meta<typeof Flag>;

export default meta;
type Story = StoryObj<typeof meta>;

export const French: Story = {};
export const English: Story = { args: { locale: "en" } };
export const German: Story = { args: { locale: "de" } };
