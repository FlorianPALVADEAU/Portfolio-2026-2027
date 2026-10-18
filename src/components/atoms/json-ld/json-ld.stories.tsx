import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { JsonLd } from "./json-ld";

const meta = {
  title: "Atoms/JsonLd",
  component: JsonLd,
  args: {
    data: { "@context": "https://schema.org", "@type": "Person", name: "Florian Palvadeau" },
  },
} satisfies Meta<typeof JsonLd>;

export default meta;

export const Default: StoryObj<typeof meta> = {};
