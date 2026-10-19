import { Schema } from "effect";
import { emailPattern, limits } from "@/lib/contact";

/** What a visitor may send. Limits keep the mail small and the form honest. */
export const ContactMessage = Schema.Struct({
  name: Schema.String.check(
    Schema.isTrimmed(),
    Schema.isMinLength(1),
    Schema.isMaxLength(limits.nameMax),
  ),
  email: Schema.String.check(
    Schema.isTrimmed(),
    Schema.isMaxLength(limits.emailMax),
    Schema.isPattern(emailPattern),
  ),
  message: Schema.String.check(
    Schema.isTrimmed(),
    Schema.isMinLength(limits.messageMin),
    Schema.isMaxLength(limits.messageMax),
  ),
});
export type ContactMessage = typeof ContactMessage.Type;
