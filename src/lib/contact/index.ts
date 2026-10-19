/** Outcome of a contact submission, shared by the server action and the form. */
export type ContactState =
  | { status: "idle" }
  | { status: "sent" }
  | { status: "error"; reason: "invalid" | "human" | "unavailable" };

export const initialContactState: ContactState = { status: "idle" };
