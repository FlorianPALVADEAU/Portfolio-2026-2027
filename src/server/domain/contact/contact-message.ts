import { Schema } from "effect";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** What a visitor may send. Limits keep the mail small and the form honest. */
export const ContactMessage = Schema.Struct({
  name: Schema.String.check(Schema.isTrimmed(), Schema.isMinLength(1), Schema.isMaxLength(100)),
  email: Schema.String.check(Schema.isTrimmed(), Schema.isMaxLength(254), Schema.isPattern(EMAIL)),
  message: Schema.String.check(
    Schema.isTrimmed(),
    Schema.isMinLength(10),
    Schema.isMaxLength(4000),
  ),
});
export type ContactMessage = typeof ContactMessage.Type;
