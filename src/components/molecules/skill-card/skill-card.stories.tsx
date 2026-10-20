import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { skillIcon } from "@/lib/landing";
import { SkillCard } from "./skill-card";

const meta = {
  title: "Molecules/SkillCard",
  component: SkillCard,
  decorators: [
    (Story) => (
      <div data-theme="dark" className="w-72 bg-background p-8 text-foreground">
        <Story />
      </div>
    ),
  ],
  args: { index: 1, name: "TypeScript", category: "Engineering", icon: skillIcon("TypeScript") },
} satisfies Meta<typeof SkillCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const WithLogo: Story = {};
export const Practice: Story = {
  args: { index: 16, name: "Hexagonal architecture", category: "Delivery", icon: null },
};
