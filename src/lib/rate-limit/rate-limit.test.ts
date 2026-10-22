import { describe, expect, it } from "vitest";
import { createRateLimiter } from "./rate-limit";

describe("createRateLimiter", () => {
  it("allows the limit then refuses until the window slides", () => {
    let time = 0;
    const allow = createRateLimiter({ limit: 2, windowMs: 1000, now: () => time });
    expect(allow("a")).toBe(true);
    expect(allow("a")).toBe(true);
    expect(allow("a")).toBe(false);
    time = 1001;
    expect(allow("a")).toBe(true);
  });

  it("counts each key on its own", () => {
    const allow = createRateLimiter({ limit: 1, windowMs: 1000, now: () => 0 });
    expect(allow("a")).toBe(true);
    expect(allow("b")).toBe(true);
    expect(allow("a")).toBe(false);
  });

  it("keeps the table within its cap even when every key is live", () => {
    const allow = createRateLimiter({ limit: 1, windowMs: 1000, maxKeys: 2, now: () => 0 });
    allow("a");
    allow("b");
    allow("c");

    // `a`, the oldest, was dropped to make room, so it counts as new again.
    expect(allow("a")).toBe(true);
    expect(allow("c")).toBe(false);
  });
});
