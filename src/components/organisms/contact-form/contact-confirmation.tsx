"use client";

import { CircleCheck } from "lucide-react";
import { useEffect, useRef } from "react";
import { Button } from "@/components/atoms/button";
import { Heading } from "@/components/atoms/heading";
import { Icon } from "@/components/atoms/icon";
import { Text } from "@/components/atoms/text";
import type { FormMessages } from "./form-messages";

export function ContactConfirmation({
  messages,
  onAgain,
}: {
  messages: FormMessages;
  onAgain: () => void;
}) {
  const card = useRef<HTMLDivElement>(null);
  useEffect(() => card.current?.focus(), []);

  return (
    <div>
      <div
        ref={card}
        role="status"
        tabIndex={-1}
        className="flex flex-col items-start gap-4 border-y border-foreground py-8 focus:outline-none"
      >
        <Icon icon={CircleCheck} size="lg" />
        <Heading level={4} size="lg">
          {messages.confirmation.title}
        </Heading>
        <Text>{messages.confirmation.text}</Text>
        <Button variant="outline" onClick={onAgain}>
          {messages.confirmation.again}
        </Button>
      </div>
    </div>
  );
}
