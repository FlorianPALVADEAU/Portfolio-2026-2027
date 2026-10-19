import { Context, type Effect } from "effect";
import type { ContactMessage, DeliveryFailed, HumanCheckFailed } from "@/server/domain/contact";

/** Proves a token came from a real browser challenge. Infrastructure provides the check. */
export class HumanCheck extends Context.Service<
  HumanCheck,
  {
    readonly verify: (
      token: string,
      ip: string | undefined,
    ) => Effect.Effect<void, HumanCheckFailed>;
  }
>()("HumanCheck") {}

/** Hands a message to the owner. Infrastructure provides the transport and the recipient. */
export class Mailer extends Context.Service<
  Mailer,
  { readonly send: (message: ContactMessage) => Effect.Effect<void, DeliveryFailed> }
>()("Mailer") {}
