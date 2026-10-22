"use server";

import { Effect, Layer } from "effect";
import { headers } from "next/headers";
import { type ContactState, invalidFields } from "@/lib/contact";
import { createRateLimiter } from "@/lib/rate-limit";
import { sendContact } from "@/server/services/contact";
import { HumanCheckTurnstile } from "./human-check-turnstile";
import { MailerResend } from "./mailer-resend";

// Per instance, so it only slows a single source down; Turnstile and Resend quotas stay the backstop.
const allowAttempt = createRateLimiter({ limit: 5, windowMs: 10 * 60 * 1000 });

const field = (data: FormData, name: string) => {
  const value = data.get(name);
  return typeof value === "string" ? value : "";
};

/** Server action behind the contact form. Never reveals why a delivery failed. */
export async function submitContact(
  _previous: ContactState,
  data: FormData,
): Promise<ContactState> {
  // Real visitors never see the honeypot; pretend success so a bot learns nothing.
  if (field(data, "website") !== "") return { status: "sent" };

  const ip = (await headers()).get("x-forwarded-for")?.split(",")[0]?.trim();
  if (!allowAttempt(ip ?? "unknown")) return { status: "error", reason: "limited" };
  const fields = {
    name: field(data, "name").trim(),
    email: field(data, "email").trim(),
    message: field(data, "message").trim(),
  };

  return Effect.runPromise(
    sendContact({ fields, token: field(data, "cf-turnstile-response"), ip }).pipe(
      Effect.provide(Layer.mergeAll(HumanCheckTurnstile, MailerResend)),
      // The visitor never sees the cause; the server log keeps it.
      Effect.tapError((error) =>
        Effect.logWarning(`contact ${error._tag}: ${"reason" in error ? error.reason : ""}`),
      ),
      Effect.match({
        onSuccess: (): ContactState => ({ status: "sent" }),
        onFailure: (error): ContactState => {
          if (error._tag === "InvalidContact") {
            return { status: "error", reason: "invalid", fields: invalidFields(fields) };
          }
          return {
            status: "error",
            reason: error._tag === "HumanCheckFailed" ? "human" : "unavailable",
          };
        },
      }),
    ),
  );
}
