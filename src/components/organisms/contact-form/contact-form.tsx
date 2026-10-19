"use client";

import { useActionState } from "react";
import { Button } from "@/components/atoms/button";
import { Heading } from "@/components/atoms/heading";
import { InputField, TextAreaField } from "@/components/molecules/form-field";
import { TurnstileField } from "@/components/molecules/turnstile-field";
import { type ContactState, initialContactState } from "@/lib/contact";
import type { Messages } from "@/lib/i18n";

type ContactFormProps = {
  messages: Messages["home"]["contact"]["form"];
  action: (previous: ContactState, data: FormData) => Promise<ContactState>;
  /** Public Turnstile site key; without it the form is not rendered. */
  siteKey: string | undefined;
  /** Must match the action the server expects. */
  challengeAction: string;
};

export function ContactForm({ messages, action, siteKey, challengeAction }: ContactFormProps) {
  const [state, submit, pending] = useActionState(action, initialContactState);
  if (!siteKey) return null;

  const failed = state.status === "error";
  const sent = state.status === "sent";

  return (
    <form action={submit} className="mt-24 flex max-w-2xl flex-col gap-6">
      <Heading level={3} size="xl">
        {messages.title}
      </Heading>
      <InputField label={messages.name} name="name" autoComplete="name" required maxLength={100} />
      <InputField
        label={messages.email}
        name="email"
        type="email"
        autoComplete="email"
        required
        maxLength={254}
      />
      <TextAreaField
        label={messages.message}
        name="message"
        required
        minLength={10}
        maxLength={4000}
      />
      {/* Honeypot: hidden from people and assistive tech, bots fill it. */}
      <div aria-hidden="true" className="absolute -left-[9999px]">
        <label>
          {messages.website}
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      <TurnstileField
        siteKey={siteKey}
        action={challengeAction}
        label={messages.challenge}
        resetKey={state}
      />
      <div>
        <Button type="submit" loading={pending}>
          {pending ? messages.sending : messages.submit}
        </Button>
      </div>
      <p role="status" className="min-h-6 text-sm font-medium">
        {sent && messages.sent}
        {failed && messages[state.reason]}
      </p>
    </form>
  );
}
