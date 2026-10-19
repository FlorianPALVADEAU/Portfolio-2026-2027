import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Heading } from "@/components/atoms/heading";
import { Text } from "@/components/atoms/text";

const colors = [
  ["background", "bg-background"],
  ["foreground", "bg-foreground"],
  ["surface", "bg-surface"],
  ["muted", "bg-muted"],
  ["muted-foreground", "bg-muted-foreground"],
  ["border", "bg-border"],
  ["accent", "bg-accent"],
  ["accent-foreground", "bg-accent-foreground"],
] as const;

// Class names are spelled out so Tailwind can detect them at build time.
const sizes = {
  xs: "text-xs",
  sm: "text-sm",
  base: "text-base",
  lg: "text-lg",
  xl: "text-xl",
  "2xl": "text-2xl",
  "3xl": "text-3xl",
  display: "text-display",
} as const;
const radii = { sm: "rounded-sm", md: "rounded-md", lg: "rounded-lg", xl: "rounded-xl" } as const;
const shadows = { sm: "shadow-sm", md: "shadow-md", lg: "shadow-lg" } as const; // taste-skill-ignore: documents the tokens

function Colors() {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      {colors.map(([name, swatch]) => (
        <div key={name} className="flex flex-col gap-2">
          <div className={`h-16 rounded-md border border-border ${swatch}`} />
          <Text size="sm">{name}</Text>
        </div>
      ))}
    </div>
  );
}

function Typography() {
  return (
    <div className="flex flex-col gap-4">
      {Object.entries(sizes).map(([size, utility]) => (
        <p key={size} className={utility}>
          <span className="text-muted-foreground">{size}</span> Full-stack software engineer
        </p>
      ))}
      <Heading level={2} size="2xl">
        Headings keep their level and change size independently
      </Heading>
    </div>
  );
}

function Surfaces() {
  return (
    <div className="flex flex-wrap gap-6">
      {Object.entries(radii).map(([name, utility]) => (
        <div
          key={name}
          className={`flex size-24 items-center justify-center border border-border bg-muted text-sm ${utility}`}
        >
          {name}
        </div>
      ))}
      {Object.entries(shadows).map(([name, utility]) => (
        <div
          key={name}
          className={`flex size-24 items-center justify-center rounded-md bg-surface text-sm ${utility}`}
        >
          {name}
        </div>
      ))}
    </div>
  );
}

const meta = {
  title: "Foundations/Tokens",
  parameters: { layout: "padded" },
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const ColorTokens: Story = { render: () => <Colors /> };
export const TypeScale: Story = { render: () => <Typography /> };
export const RadiusAndShadow: Story = { render: () => <Surfaces /> };
