import { Section } from "@/components/atoms/section";
import { SectionHeader } from "@/components/molecules/section-header";
import { FrameRail } from "@/features/frame-rail";
import type { Messages } from "@/lib/i18n";
import { skillGroups } from "@/lib/landing";
import { AiFrame } from "./ai-frame";
import { CertificationsFrame } from "./certifications-frame";
import { ClosingFrame } from "./closing-frame";
import { CollaborationFrame } from "./collaboration-frame";
import { DeliveryFrame } from "./delivery-frame";
import { EngineeringFrame } from "./engineering-frame";
import { InfrastructureFrame } from "./infrastructure-frame";

type SkillsSectionProps = {
  index: number;
  title: string;
  messages: Messages["home"]["skills"];
  photo: Messages["home"]["photos"]["closing"];
};

/**
 * Seven full-screen frames that slide sideways while the page scrolls, each laid out its own way:
 * the five skill groups, the certifications, then a photo that shrinks into the page.
 */
export function SkillsSection({ index, title, messages, photo }: SkillsSectionProps) {
  const frames = [
    ...skillGroups.map(({ id }) => ({ id, label: messages.groups[id].title })),
    { id: "certifications", label: messages.certifications },
    { id: "closing", label: photo.caption },
  ];
  const props = { total: frames.length, messages };

  return (
    <Section id="skills" aria-labelledby="skills-title" className="scroll-mt-4 py-0">
      <FrameRail frames={frames} navLabel={messages.navigation}>
        <EngineeringFrame order={1} {...props}>
          <SectionHeader index={index} title={title} titleId="skills-title" size="2xl" />
        </EngineeringFrame>
        <InfrastructureFrame order={2} {...props} />
        <AiFrame order={3} {...props} />
        <DeliveryFrame order={4} {...props} />
        <CollaborationFrame order={5} {...props} />
        <CertificationsFrame order={6} {...props} />
        <ClosingFrame messages={messages.closing} photo={photo} />
      </FrameRail>
    </Section>
  );
}
