import type { ReactNode } from "react";
import { Container } from "@/components/atoms/container";
import { Section } from "@/components/atoms/section";
import { SectionHeader } from "@/components/molecules/section-header";
import { Reveal } from "@/features/reveal";
import { cn } from "@/lib/utils";

/** `clear` lets the page-wide scene show through; the others are opaque panels that cover it. */
const tones = {
  clear: "",
  base: "bg-background",
  muted: "bg-muted",
  raised: "bg-surface",
} as const;

type LandingSectionProps = {
  id: string;
  title: string;
  tone?: keyof typeof tones;
  className?: string;
  children?: ReactNode;
};

export function LandingSection({
  id,
  title,
  tone = "base",
  className,
  children,
}: LandingSectionProps) {
  return (
    <Section
      id={id}
      aria-labelledby={`${id}-title`}
      className={cn("relative scroll-mt-4", tones[tone], className)}
    >
      <Container>
        <Reveal className="flex flex-col gap-12">
          <SectionHeader title={title} titleId={`${id}-title`} />
          {children}
        </Reveal>
      </Container>
    </Section>
  );
}
