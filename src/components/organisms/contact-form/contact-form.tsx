"use client";

import { useState } from "react";
import { Rise } from "@/components/atoms/rise";
import { Text } from "@/components/atoms/text";
import { ContactConfirmation } from "./contact-confirmation";
import { type ContactFormProps, Form } from "./contact-fields";
import { ContactIntro } from "./contact-intro";

const GRID = "grid gap-10 md:grid-cols-12";
const BODY = "md:col-span-6 md:col-start-7";

export function ContactForm(props: ContactFormProps) {
  const { messages, siteKey } = props;
  const [sent, setSent] = useState(false);
  // A new key discards the action state, so "send another" starts from a clean form.
  const [attempt, setAttempt] = useState(0);

  if (!siteKey) {
    return (
      <div className={GRID}>
        <ContactIntro messages={messages} />
        <Rise className={BODY}>
          <Text tone="muted">{messages.unconfigured}</Text>
        </Rise>
      </div>
    );
  }

  return (
    <div className={GRID}>
      <ContactIntro messages={messages} />
      <Rise className={BODY}>
        {sent ? (
          <ContactConfirmation
            messages={messages}
            onAgain={() => {
              setSent(false);
              setAttempt((count) => count + 1);
            }}
          />
        ) : (
          <Form key={attempt} {...props} onSent={() => setSent(true)} />
        )}
      </Rise>
    </div>
  );
}
