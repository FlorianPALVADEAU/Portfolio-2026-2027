import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { FlipText } from "./flip-text";

const meta = {
  title: "Atoms/FlipText",
  component: FlipText,
  args: { children: "Let's talk" },
  decorators: [
    (Story) => (
      <a href="#flip" className="flip-host inline-block p-8 text-3xl no-underline">
        <Story />
      </a>
    ),
  ],
} satisfies Meta<typeof FlipText>;

export default meta;

type Story = StoryObj<typeof meta>;

/** Hover the label: the letters roll once, left to right. */
export const Default: Story = {};
