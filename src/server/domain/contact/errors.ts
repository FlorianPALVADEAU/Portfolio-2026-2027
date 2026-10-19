import { Data } from "effect";

/** The input does not satisfy the contact schema. */
export class InvalidContact extends Data.TaggedError("InvalidContact")<{ reason: string }> {}

/** The visitor could not be told apart from a bot. */
export class HumanCheckFailed extends Data.TaggedError("HumanCheckFailed")<{ reason: string }> {}

/** The mail could not be handed to the provider, or the server is not configured to send it. */
export class DeliveryFailed extends Data.TaggedError("DeliveryFailed")<{ reason: string }> {}
