import { Data } from "effect";

/** Raised when content is missing, malformed or references a file that does not exist. */
export class ContentError extends Data.TaggedError("ContentError")<{
  slug: string;
  locale?: string;
  reason: string;
}> {
  override get message() {
    const where = this.locale ? `${this.slug} (${this.locale})` : this.slug;
    return `Invalid content for ${where}: ${this.reason}`;
  }
}
