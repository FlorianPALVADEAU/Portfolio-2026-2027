import { CertificationList } from "@/components/molecules/certification-list";
import { SkillGroup } from "@/components/molecules/skill-group";
import { LandingSection } from "@/components/organisms/landing-section";
import type { Messages } from "@/lib/i18n";
import { certifications, skillGroups } from "@/lib/landing";

type SkillsSectionProps = {
  index: number;
  title: string;
  messages: Messages["home"]["skills"];
};

export function SkillsSection({ index, title, messages }: SkillsSectionProps) {
  return (
    <LandingSection id="skills" index={index} title={title}>
      <div className="grid gap-12 md:grid-cols-2">
        {skillGroups.map(({ id, items }) => (
          <SkillGroup
            key={id}
            title={messages.groups[id].title}
            items={items ?? messages.groups[id].items}
          />
        ))}
      </div>
      <div className="mt-12 max-w-2xl">
        <CertificationList title={messages.certifications} items={certifications} />
      </div>
    </LandingSection>
  );
}
