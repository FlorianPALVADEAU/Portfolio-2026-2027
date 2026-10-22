import { describe, expect, it } from "vitest";
import { invalidFields } from "./rules";

const valid = { name: "Ada", email: "ada@example.com", message: "Hello, I like your work." };

describe("invalidFields", () => {
  it("rejects addresses without a real domain", () => {
    for (const email of ["a@b.c", "a@b..com", "a@.com", "a@com", "a b@c.com"]) {
      expect(invalidFields({ ...valid, email }), email).toEqual(["email"]);
    }
  });

  it("accepts a valid message", () => {
    expect(invalidFields(valid)).toEqual([]);
  });

  it("names every field that breaks a rule, in form order", () => {
    expect(invalidFields({ name: "  ", email: "nope", message: "short" })).toEqual([
      "name",
      "email",
      "message",
    ]);
  });

  it("measures the trimmed value", () => {
    expect(invalidFields({ ...valid, message: `   ${"x".repeat(9)}   ` })).toEqual(["message"]);
  });

  it("rejects values over the limits", () => {
    expect(invalidFields({ ...valid, name: "x".repeat(101) })).toEqual(["name"]);
    expect(invalidFields({ ...valid, message: "x".repeat(4001) })).toEqual(["message"]);
  });
});
