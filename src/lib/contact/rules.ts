export type ContactField = "name" | "email" | "message";

export const limits = {
  nameMax: 100,
  emailMax: 254,
  messageMin: 10,
  messageMax: 4000,
} as const;

/** A domain of dot-separated labels ending in an ASCII top-level domain of at least two letters. */
export const emailPattern = /^[^\s@]+@[^\s@.]+(\.[^\s@.]+)*\.[A-Za-z]{2,}$/;

/** Names of the fields that break the rules; the browser and the server share this verdict. */
export function invalidFields(values: Readonly<Record<ContactField, string>>): ContactField[] {
  const name = values.name.trim();
  const email = values.email.trim();
  const message = values.message.trim();
  const invalid: ContactField[] = [];
  if (name.length === 0 || name.length > limits.nameMax) invalid.push("name");
  if (email.length > limits.emailMax || !emailPattern.test(email)) invalid.push("email");
  if (message.length < limits.messageMin || message.length > limits.messageMax) {
    invalid.push("message");
  }
  return invalid;
}
