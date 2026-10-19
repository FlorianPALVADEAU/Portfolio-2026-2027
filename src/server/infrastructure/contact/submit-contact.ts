"use server";

import { Effect, Layer } from "effect";
import { headers } from "next/headers";
import type { ContactState } from "@/lib/contact";
import { sendContact } from "@/server/services/contact";
import { HumanCheckTurnstile } from "./human-check-turnstile";
import { MailerResend } from "./mailer-resend";

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
  const fields = {
    name: field(data, "name").trim(),
    email: field(data, "email").trim(),
    message: field(data, "message").trim(),
  };

  return Effect.runPromise(
    sendContact({ fields, token: field(data, "cf-turnstile-response"), ip }).pipe(
      Effect.provide(Layer.mergeAll(HumanCheckTurnstile, MailerResend)),
      Effect.match({
        onSuccess: (): ContactState => ({ status: "sent" }),
        onFailure: (error): ContactState => ({
          status: "error",
          reason:
            error._tag === "InvalidContact"
              ? "invalid"
              : error._tag === "HumanCheckFailed"
                ? "human"
                : "unavailable",
        }),
      }),
      Effect.tap((state) =>
        state.status === "error" ? Effect.logWarning(`contact ${state.reason}`) : Effect.void,
      ),
    ),
  );
}
