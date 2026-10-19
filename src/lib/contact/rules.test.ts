import { describe, expect, it } from "vitest";
import { invalidFields } from "./rules";

const valid = { name: "Ada", email: "ada@example.com", message: "Hello, I like your work." };

describe("invalidFields", () => {
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
