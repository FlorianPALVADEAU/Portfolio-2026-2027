import { describe, expect, it } from "vitest";
import { locales } from "./config";
import { getMessages } from "./messages";

function keys(value: unknown, prefix = ""): string[] {
  if (typeof value !== "object" || value === null) return [prefix];
  return Object.entries(value).flatMap(([key, child]) =>
    keys(child, prefix ? `${prefix}.${key}` : key),
  );
}

describe("messages", () => {
  it("expose the same keys in every locale", async () => {
    const [reference, ...others] = await Promise.all(locales.map(getMessages));
    for (const other of others) {
      expect(keys(other).sort()).toEqual(keys(reference).sort());
    }
  });

  it("have no empty strings", async () => {
    for (const locale of locales) {
      const messages = await getMessages(locale);
      const values = keys(messages).map((path) =>
        path.split(".").reduce<unknown>((o, k) => (o as Record<string, unknown>)[k], messages),
      );
      expect(values.every((v) => typeof v === "string" && v.trim() !== "")).toBe(true);
    }
  });

  it("use Swiss spelling in German", async () => {
    expect(JSON.stringify(await getMessages("de"))).not.toContain("ß");
  });
});
