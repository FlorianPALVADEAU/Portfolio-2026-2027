import { Effect, Schema } from "effect";
import { ContactMessage, InvalidContact } from "@/server/domain/contact";
import { HumanCheck, Mailer } from "./ports";

type Submission = {
  /** Raw visitor input, not yet validated. */
  fields: unknown;
  token: string;
  ip: string | undefined;
};

/** Validates the input, checks the visitor is human, then delivers the message. */
export const sendContact = ({ fields, token, ip }: Submission) =>
  Effect.gen(function* () {
    const message = yield* Schema.decodeUnknownEffect(ContactMessage)(fields).pipe(
      Effect.mapError((error) => new InvalidContact({ reason: error.message })),
    );
    yield* (yield* HumanCheck).verify(token, ip);
    yield* (yield* Mailer).send(message);
  });
