import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { AmbientVideo } from "./ambient-video";

const meta = {
  title: "Atoms/AmbientVideo",
  component: AmbientVideo,
  args: { src: "/gallery/mic.mp4", poster: "/gallery/mic-poster.webp" },
  decorators: [
    (Story) => (
      <div className="aspect-video w-full max-w-xl overflow-hidden rounded-xl">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof AmbientVideo>;

export default meta;

/** Plays while on screen; under reduced motion only the poster shows. */
export const Default: StoryObj<typeof meta> = {};
