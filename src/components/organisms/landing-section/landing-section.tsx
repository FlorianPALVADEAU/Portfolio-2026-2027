import type { ReactNode } from "react";
import { Container } from "@/components/atoms/container";
import { Section } from "@/components/atoms/section";
import { SectionHeader } from "@/components/molecules/section-header";

type LandingSectionProps = {
  id: string;
  index: number;
  title: string;
  children?: ReactNode;
};

export function LandingSection({ id, index, title, children }: LandingSectionProps) {
  return (
    <Section id={id} aria-labelledby={`${id}-title`} className="scroll-mt-4">
      <Container className="flex flex-col gap-10">
        <SectionHeader index={index} title={title} titleId={`${id}-title`} />
        {children}
      </Container>
    </Section>
  );
}
