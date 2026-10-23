import { describe, expect, it } from "vitest";
import { isKnownPath } from "./routes";

const slugs = ["overbound"];

describe("isKnownPath", () => {
  it.each(["/fr", "/en", "/de", "/en/", "/en/projects/overbound", "/de/opengraph-image"])(
    "serves %s",
    (path) => expect(isKnownPath(path, slugs)).toBe(true),
  );

  it.each([
    "/",
    "/xx",
    "/en/nope",
    "/en/404",
    "/en/projects",
    "/en/projects/unknown",
    "/en/projects/overbound/extra",
    "/en/opengraph-image/extra",
  ])("answers %s with the 404 page", (path) => expect(isKnownPath(path, slugs)).toBe(false));
});
