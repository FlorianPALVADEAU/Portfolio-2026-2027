import { Section } from "@/components/atoms/section";
import { CertificationList } from "@/components/molecules/certification-list";
import { SectionHeader } from "@/components/molecules/section-header";
import { FrameRail } from "@/features/frame-rail";
import type { Messages } from "@/lib/i18n";
import { certifications, skillGroups } from "@/lib/landing";
import { CollaborationFrame } from "./collaboration-frame";
import { DeliveryFrame } from "./delivery-frame";
import { EngineeringFrame } from "./engineering-frame";
import { InfrastructureFrame } from "./infrastructure-frame";

type SkillsSectionProps = {
  index: number;
  title: string;
  messages: Messages["home"]["skills"];
};

/**
 * Four full-screen frames that slide sideways while the page scrolls, each laid out its own way:
 * engineering, infrastructure, delivery and collaboration. Certifications follow, outside the rail.
 */
export function SkillsSection({ index, title, messages }: SkillsSectionProps) {
  const total = skillGroups.length;
  const frames = skillGroups.map(({ id }) => ({ id, label: messages.groups[id].title }));
  const props = { total, messages };

  return (
    <Section id="skills" aria-labelledby="skills-title" className="scroll-mt-4 py-0">
      <FrameRail
        frames={frames}
        header={<SectionHeader index={index} title={title} titleId="skills-title" size="2xl" />}
      >
        <EngineeringFrame order={1} {...props} />
        <InfrastructureFrame order={2} {...props} />
        <DeliveryFrame order={3} {...props} />
        <CollaborationFrame order={4} {...props} />
      </FrameRail>
      <div className="mx-auto max-w-xl px-(--gutter) py-(--section-space)">
        <CertificationList title={messages.certifications} items={certifications} />
      </div>
    </Section>
  );
}
