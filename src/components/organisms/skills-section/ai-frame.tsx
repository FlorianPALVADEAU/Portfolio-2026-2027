import { FlipText } from "@/components/atoms/flip-text";
import { Pop } from "@/components/atoms/pop";
import { Text } from "@/components/atoms/text";
import { AgentFlow } from "@/components/molecules/agent-flow";
import { Frame } from "@/features/frame-rail";
import { FrameIntro } from "./frame-intro";
import type { GroupFrameProps } from "./frame-props";

/** Frame 3: how the work is done. The practices as a list on the left, the agents at work on the right. */
export function AiFrame({ order, total, messages }: GroupFrameProps) {
  const { items, notes, flow } = messages.groups.ai;

  return (
    <Frame
      numeral="03"
      aria-labelledby="skills-ai"
      className="gap-5 md:grid md:grid-cols-12 md:items-center md:gap-14"
    >
      <FrameIntro
        order={order}
        total={total}
        titleId="skills-ai"
        title={messages.groups.ai.title}
        lead={messages.groups.ai.lead}
        className="md:col-span-5"
      />
      <div className="flex flex-col gap-5 md:col-span-7 md:gap-6">
        <ol className="flex flex-col">
          {items.map((item, index) => (
            <li
              key={item}
              className="flip-host relative grid gap-x-6 py-1.5 md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] md:items-baseline"
            >
              <Pop
                from="grow"
                delay={0.3 + index * 0.15}
                className="absolute inset-x-0 top-0 h-px bg-foreground/25"
              />
              <Pop from="wipe" delay={0.4 + index * 0.15} className="contents">
                <Text className="text-lg font-medium text-pretty md:text-xl">
                  <FlipText>{item}</FlipText>
                </Text>
                <Text size="sm" tone="muted" className="text-pretty">
                  {notes[index] ?? ""}
                </Text>
              </Pop>
            </li>
          ))}
        </ol>
        <AgentFlow labels={flow} />
      </div>
    </Frame>
  );
}
