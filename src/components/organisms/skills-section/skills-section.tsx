import { CertificationList } from "@/components/molecules/certification-list";
import { SkillGroup } from "@/components/molecules/skill-group";
import { LandingSection } from "@/components/organisms/landing-section";
import type { Messages } from "@/lib/i18n";
import { certifications, skillGroups } from "@/lib/landing";

type SkillsSectionProps = {
  title: string;
  messages: Messages["home"]["skills"];
};

export function SkillsSection({ title, messages }: SkillsSectionProps) {
  return (
    <LandingSection id="skills" title={title} tone="muted">
      <div className="flex flex-col gap-8 text-[clamp(1.25rem,2.1vw,1.875rem)] leading-snug">
        {skillGroups.map(({ id, items }) => (
          <SkillGroup
            key={id}
            title={messages.groups[id].title}
            items={items ?? messages.groups[id].items}
          />
        ))}
        <CertificationList title={messages.certifications} items={certifications} />
      </div>
    </LandingSection>
  );
}
