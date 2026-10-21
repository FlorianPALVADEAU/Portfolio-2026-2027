import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { PointerTag } from "./pointer-tag";

const meta = {
  title: "Atoms/PointerTag",
  component: PointerTag,
  args: { icon: ArrowDown, anchor: "bottom", children: "Scroll", className: "visible" },
} satisfies Meta<typeof PointerTag>;

export default meta;

export const Scroll: StoryObj<typeof meta> = {};

export const View: StoryObj<typeof meta> = {
  args: { icon: ArrowUpRight, children: "View" },
};
