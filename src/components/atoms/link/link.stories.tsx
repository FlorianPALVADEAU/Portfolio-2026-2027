import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Link } from "./link";

const meta = {
  title: "Atoms/Link",
  component: Link,
  args: { href: "/projects", children: "See the projects" },
} satisfies Meta<typeof Link>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Internal: Story = {};
export const External: Story = {
  args: { href: "https://github.com", external: true, children: "GitHub" },
};
