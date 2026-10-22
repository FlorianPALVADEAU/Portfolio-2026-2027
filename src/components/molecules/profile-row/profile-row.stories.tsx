import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ProfileRow } from "./profile-row";

const meta = {
  title: "Molecules/ProfileRow",
  component: ProfileRow,
  args: { order: 1, label: "GitHub", href: "https://github.com/octocat" },
  decorators: [
    (Story) => (
      <ul className="border-b border-border">
        <li>
          <Story />
        </li>
      </ul>
    ),
  ],
} satisfies Meta<typeof ProfileRow>;

export default meta;

export const External: StoryObj<typeof meta> = {
  args: { externalLabel: "opens in a new tab" },
};

export const Download: StoryObj<typeof meta> = {
  args: { order: 4, label: "CV", href: "/cv/en/cv.pdf", download: true },
};

export const Email: StoryObj<typeof meta> = {
  args: { order: 5, label: "Email", href: "mailto:name@example.com" },
};
