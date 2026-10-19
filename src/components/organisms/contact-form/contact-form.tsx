"use client";

import { CircleAlert, CircleCheck } from "lucide-react";
import {
  type FormEvent,
  startTransition,
  useActionState,
  useEffect,
  useRef,
  useState,
} from "react";
import { Button } from "@/components/atoms/button";
import { Heading } from "@/components/atoms/heading";
import { Icon } from "@/components/atoms/icon";
import { Text } from "@/components/atoms/text";
import { InputField, TextAreaField } from "@/components/molecules/form-field";
import { TurnstileField } from "@/components/molecules/turnstile-field";
import {
  type ContactField,
  type ContactState,
  initialContactState,
  invalidFields,
  limits,
} from "@/lib/contact";
import type { Messages } from "@/lib/i18n";

type FormMessages = Messages["home"]["contact"]["form"];

type ContactFormProps = {
  messages: FormMessages;
  action: (previous: ContactState, data: FormData) => Promise<ContactState>;
  /** Public Turnstile site key; without it the form cannot run and says so. */
  siteKey: string | undefined;
  /** Must match the action the server expects. */
  challengeAction: string;
};

const GRID = "mt-24 grid gap-10 md:grid-cols-12";
const INTRO = "flex flex-col gap-4 md:col-span-5";
const BODY = "md:col-span-6 md:col-start-7";

function Intro({ messages }: { messages: FormMessages }) {
  return (
    <div className={INTRO}>
      <Heading level={3} size="xl">
        {messages.title}
      </Heading>
      <Text tone="muted" className="max-w-[40ch]">
        {messages.intro}
      </Text>
    </div>
  );
}

function Confirmation({ messages, onAgain }: { messages: FormMessages; onAgain: () => void }) {
  const card = useRef<HTMLDivElement>(null);
  useEffect(() => card.current?.focus(), []);

  return (
    <div className={BODY}>
      <div
        ref={card}
        role="status"
        tabIndex={-1}
        className="flex flex-col items-start gap-4 rounded-md border border-foreground p-6 focus:outline-none"
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

function focusField(form: HTMLFormElement | null, field: ContactField) {
  form?.querySelector<HTMLElement>(`[name="${field}"]`)?.focus();
}

const read = (data: FormData, name: string) => {
  const value = data.get(name);
  return typeof value === "string" ? value : "";
};

function Form({
  messages,
  action,
  siteKey,
  challengeAction,
  onSent,
}: ContactFormProps & { onSent: () => void }) {
  const [state, submit, pending] = useActionState(action, initialContactState);
  const [errors, setErrors] = useState<readonly ContactField[]>([]);
  const [length, setLength] = useState(0);
  const [engaged, setEngaged] = useState(false);
  const form = useRef<HTMLFormElement>(null);

  useEffect(() => {
    const element = form.current;
    const engage = () => setEngaged(true);
    element?.addEventListener("focusin", engage, { once: true });
    return () => element?.removeEventListener("focusin", engage);
  }, []);

  useEffect(() => {
    if (state.status === "sent") return onSent();
    if (state.status === "error" && state.reason === "invalid") {
      const fields = state.fields ?? [];
      setErrors(fields);
      const [first] = fields;
      if (first) focusField(form.current, first);
    }
  }, [state, onSent]);

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const invalid = invalidFields({
      name: read(data, "name"),
      email: read(data, "email"),
      message: read(data, "message"),
    });
    setErrors(invalid);
    const [first] = invalid;
    if (first) return focusField(form.current, first);
    // Not the form's `action` prop: React would empty the fields after every attempt.
    startTransition(() => submit(data));
  };
  const clear = (field: ContactField) => () =>
    setErrors((current) => current.filter((name) => name !== field));

  const failure = state.status === "error" ? messages[state.reason] : null;
  const message = (field: ContactField) =>
    errors.includes(field) ? messages.errors[field] : undefined;

  return (
    <form
      ref={form}
      onSubmit={onSubmit}
      noValidate
      aria-busy={pending}
      className={`${BODY} flex flex-col gap-6`}
    >
      <Text tone="muted" size="sm">
        {messages.required}
      </Text>
      <InputField
        label={messages.name}
        name="name"
        autoComplete="name"
        required
        maxLength={limits.nameMax}
        error={message("name")}
        onChange={clear("name")}
      />
      <InputField
        label={messages.email}
        name="email"
        type="email"
        autoComplete="email"
        required
        maxLength={limits.emailMax}
        error={message("email")}
        onChange={clear("email")}
      />
      <TextAreaField
        label={messages.message}
        name="message"
        required
        maxLength={limits.messageMax}
        error={message("message")}
        hint={`${length} / ${limits.messageMax}`}
        onChange={(event) => {
          setLength(event.currentTarget.value.length);
          clear("message")();
        }}
      />
      {/* Honeypot: invisible to people and assistive technology, bots fill it. */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute -left-[9999px]"
      />
      <TurnstileField
        siteKey={siteKey ?? ""}
        action={challengeAction}
        label={messages.challenge}
        load={engaged}
        resetKey={state}
      />
      <Button type="submit" loading={pending} className="w-full md:w-auto md:self-start">
        {pending ? messages.sending : messages.submit}
      </Button>
      {failure && (
        <p
          role="alert"
          className="flex items-start gap-2 rounded-md border border-foreground p-4 text-sm font-medium"
        >
          <Icon icon={CircleAlert} size="sm" className="mt-0.5" />
          {failure}
        </p>
      )}
    </form>
  );
}

export function ContactForm(props: ContactFormProps) {
  const { messages, siteKey } = props;
  const [sent, setSent] = useState(false);
  // A new key discards the action state, so "send another" starts from a clean form.
  const [attempt, setAttempt] = useState(0);

  if (!siteKey) {
    return (
      <div className={GRID}>
        <Intro messages={messages} />
        <Text tone="muted" className={BODY}>
          {messages.unconfigured}
        </Text>
      </div>
    );
  }

  return (
    <div className={GRID}>
      <Intro messages={messages} />
      {sent ? (
        <Confirmation
          messages={messages}
          onAgain={() => {
            setSent(false);
            setAttempt((count) => count + 1);
          }}
        />
      ) : (
        <Form key={attempt} {...props} onSent={() => setSent(true)} />
      )}
    </div>
  );
}
