import type { ContactField } from "./rules";

export { type ContactField, emailPattern, invalidFields, limits } from "./rules";

/** Outcome of a contact submission, shared by the server action and the form. */
export type ContactState =
  | { status: "idle" }
  | { status: "sent" }
  | {
      status: "error";
      reason: "invalid" | "human" | "unavailable";
      /** Fields to highlight when the reason is `invalid`. */
      fields?: readonly ContactField[];
    };

export const initialContactState: ContactState = { status: "idle" };
