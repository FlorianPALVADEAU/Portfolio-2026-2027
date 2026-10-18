import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import en from "../../../../messages/en.json";
import { Home } from "./home";

const meta = {
  title: "Templates/Home",
  component: Home,
  parameters: { layout: "fullscreen" },
  args: { locale: "en", messages: en.home },
} satisfies Meta<typeof Home>;

export default meta;

export const Default: StoryObj<typeof meta> = {};
