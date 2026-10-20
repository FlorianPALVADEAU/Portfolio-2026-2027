import { Heading } from "@/components/atoms/heading";
import { Section } from "@/components/atoms/section";
import { Text } from "@/components/atoms/text";
import { CertificationList } from "@/components/molecules/certification-list";
import { SectionHeader } from "@/components/molecules/section-header";
import { SkillCard } from "@/components/molecules/skill-card";
import { CardRail, RailCard, RailCards, RailChapter, RailPanel } from "@/features/card-rail";
import type { Messages } from "@/lib/i18n";
import { certifications, skillGroups, skillIcon } from "@/lib/landing";

type SkillsSectionProps = {
  index: number;
  title: string;
  messages: Messages["home"]["skills"];
};

const pad = (value: number) => String(value).padStart(2, "0");

/** Always on the dark palette, whatever the theme, so the section reads as a stage of its own. */
export function SkillsSection({ index, title, messages }: SkillsSectionProps) {
  const groups = skillGroups.map(({ id, items }) => ({
    id,
    title: messages.groups[id].title,
    items: items ?? messages.groups[id].items,
  }));
  let position = 0;

  return (
    <Section
      id="skills"
      aria-labelledby="skills-title"
      data-theme="dark"
      className="relative scroll-mt-4 bg-background py-0 text-foreground"
    >
      <CardRail chapters={groups.map(({ id, title: label }) => ({ id, label }))}>
        <RailPanel className="px-(--gutter) in-data-[motion=rail]:w-[min(62vw,48rem)]">
          <SectionHeader index={index} title={title} titleId="skills-title" size="display" />
          <Text
            as="span"
            size="sm"
            tone="muted"
            data-rail-hint
            className="font-mono in-data-[motion=rail]:absolute in-data-[motion=rail]:bottom-20"
          >
            {`${messages.hint} →`}
          </Text>
        </RailPanel>
        {groups.map((group, order) => (
          <RailChapter
            key={group.id}
            numeral={pad(order + 1)}
            heading={
              <>
                <Text as="span" size="sm" tone="muted" className="font-mono" aria-hidden="true">
                  {`${pad(order + 1)} / ${pad(groups.length)}`}
                </Text>
                <Heading level={3} size="3xl">
                  {group.title}
                </Heading>
              </>
            }
          >
            <RailCards>
              {group.items.map((item) => {
                position += 1;
                return (
                  <RailCard key={item}>
                    <SkillCard
                      index={position}
                      name={item}
                      category={group.title}
                      icon={skillIcon(item)}
                    />
                  </RailCard>
                );
              })}
            </RailCards>
          </RailChapter>
        ))}
        <RailPanel className="px-(--gutter) in-data-[motion=rail]:w-screen">
          <div className="w-full max-w-xl in-data-[motion=rail]:mx-auto">
            <CertificationList title={messages.certifications} items={certifications} />
          </div>
        </RailPanel>
      </CardRail>
    </Section>
  );
}
