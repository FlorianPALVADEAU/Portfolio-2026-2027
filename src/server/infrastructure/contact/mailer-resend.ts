import { Effect, Layer } from "effect";
import { DeliveryFailed } from "@/server/domain/contact";
import { Mailer } from "@/server/services/contact";

const ENDPOINT = "https://api.resend.com/emails";
const DEFAULT_SENDER = "Portfolio <onboarding@resend.dev>";

const fail = (reason: string) => new DeliveryFailed({ reason });
const oneLine = (value: string) => value.replace(/\s+/g, " ").trim();

export const MailerResend = Layer.succeed(Mailer, {
  send: ({ name, email, message }) =>
    Effect.gen(function* () {
      const key = process.env.RESEND_API_KEY;
      const to = process.env.CONTACT_EMAIL;
      if (!(key && to)) return yield* fail("RESEND_API_KEY or CONTACT_EMAIL is not set");

      yield* Effect.tryPromise({
        try: async () => {
          const reply = await fetch(ENDPOINT, {
            method: "POST",
            headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
            body: JSON.stringify({
              from: process.env.CONTACT_FROM ?? DEFAULT_SENDER,
              to: [to],
              reply_to: email,
              subject: `Portfolio: message from ${oneLine(name)}`,
              text: `${message}\n\n-- ${oneLine(name)} <${email}>`,
            }),
            signal: AbortSignal.timeout(10_000),
          });
          if (!reply.ok) {
            const detail = await reply.text().catch(() => "");
            throw new Error(`resend ${reply.status} ${detail.slice(0, 200)}`.trim());
          }
        },
        catch: (error) => fail(String(error)),
      });
    }),
});
