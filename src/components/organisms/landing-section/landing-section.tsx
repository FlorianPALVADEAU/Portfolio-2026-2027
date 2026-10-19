import type { ReactNode } from "react";
import { Container } from "@/components/atoms/container";
import { Section } from "@/components/atoms/section";
import { SectionHeader } from "@/components/molecules/section-header";
import { cn } from "@/lib/utils";

type LandingSectionProps = {
  id: string;
  index: number;
  title: string;
  /** Decorative layer rendered behind the content. */
  backdrop?: ReactNode;
  children?: ReactNode;
};

export function LandingSection({ id, index, title, backdrop, children }: LandingSectionProps) {
  return (
    <Section
      id={id}
      aria-labelledby={`${id}-title`}
      className={cn("scroll-mt-4", backdrop && "relative overflow-hidden")}
    >
      {backdrop}
      <Container className="flex flex-col gap-10">
        <SectionHeader index={index} title={title} titleId={`${id}-title`} />
        {children}
      </Container>
    </Section>
  );
}
