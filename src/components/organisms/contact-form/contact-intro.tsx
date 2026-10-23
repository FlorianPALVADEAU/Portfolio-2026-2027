import { Heading } from "@/components/atoms/heading";
import { Rise } from "@/components/atoms/rise";
import { RiseText } from "@/components/atoms/rise-text";
import { Text } from "@/components/atoms/text";
import type { FormMessages } from "./form-messages";

const INTRO = "flex flex-col gap-4 md:col-span-5";

export function ContactIntro({ messages }: { messages: FormMessages }) {
  return (
    <div className={INTRO}>
      <Heading level={3} size="3xl">
        <RiseText>{messages.title}</RiseText>
      </Heading>
      <Rise>
        <Text tone="muted" className="max-w-[40ch]">
          {messages.intro}
        </Text>
      </Rise>
    </div>
  );
}
