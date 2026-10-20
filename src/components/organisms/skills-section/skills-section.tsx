import { Heading } from "@/components/atoms/heading";
import { Section } from "@/components/atoms/section";
import { Text } from "@/components/atoms/text";
import { CertificationList } from "@/components/molecules/certification-list";
import { SectionHeader } from "@/components/molecules/section-header";
import { RailNode, RailNodes, RailSlide, WaveRail } from "@/features/wave-rail";
import type { Messages } from "@/lib/i18n";
import { certifications, skillGroups } from "@/lib/landing";

type SkillsSectionProps = {
  index: number;
  title: string;
  messages: Messages["home"]["skills"];
};

export function SkillsSection({ index, title, messages }: SkillsSectionProps) {
  const groups = skillGroups.map(({ id, hue, items }) => ({
    id,
    tone: `oklch(0.68 0.16 ${hue})`,
    title: messages.groups[id].title,
    items: items ?? messages.groups[id].items,
  }));
  let position = 0;

  return (
    <Section
      id="skills"
      aria-labelledby="skills-title"
      className="relative scroll-mt-4 bg-muted py-0"
    >
      <WaveRail chapters={groups.map(({ id, title }) => ({ id, label: title }))}>
        <RailSlide className="in-data-[motion=rail]:w-screen in-data-[motion=rail]:items-end in-data-[motion=rail]:px-(--gutter) in-data-[motion=rail]:pb-[calc(50svh+1.5rem)]">
          <SectionHeader index={index} title={title} titleId="skills-title" />
          <Text
            as="span"
            size="sm"
            tone="muted"
            data-rail-hint
            className="hidden font-mono in-data-[motion=rail]:absolute in-data-[motion=rail]:bottom-20 in-data-[motion=rail]:left-(--gutter) in-data-[motion=rail]:block"
          >
            {`${messages.hint} →`}
          </Text>
        </RailSlide>
        {groups.map((group, order) => (
          <RailSlide
            key={group.id}
            ghost={group.title}
            tone={group.tone}
            heading={
              <>
                <Text as="span" size="sm" tone="muted" className="font-mono" aria-hidden="true">
                  {`${String(order + 1).padStart(2, "0")} / ${String(groups.length).padStart(2, "0")}`}
                </Text>
                <Heading level={3} size="2xl">
                  {group.title}
                </Heading>
              </>
            }
          >
            <RailNodes>
              {group.items.map((item) => {
                position += 1;
                return <RailNode key={item} index={position} label={item} />;
              })}
            </RailNodes>
          </RailSlide>
        ))}
        <RailSlide className="in-data-[motion=rail]:w-screen in-data-[motion=rail]:justify-center in-data-[motion=rail]:px-(--gutter)">
          <div className="w-full max-w-xl">
            <CertificationList title={messages.certifications} items={certifications} />
          </div>
        </RailSlide>
      </WaveRail>
    </Section>
  );
}
