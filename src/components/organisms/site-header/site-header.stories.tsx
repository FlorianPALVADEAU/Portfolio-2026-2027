import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { SiteHeader } from "./site-header";

const meta = {
  title: "Organisms/SiteHeader",
  component: SiteHeader,
  args: {
    locale: "en",
    messages: {
      language: "Language",
      theme: { label: "Theme", names: { dark: "Dark", light: "Light", swiss: "Swiss" } },
    },
  },
  parameters: { layout: "fullscreen", nextjs: { navigation: { pathname: "/en" } } },
} satisfies Meta<typeof SiteHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
