import { describe, expect, it } from "vitest";
import { securityHeaders } from "./headers";

const csp = (development: boolean) =>
  securityHeaders(development).find((header) => header.key === "Content-Security-Policy")?.value ??
  "";

describe("securityHeaders", () => {
  it("forbids framing and plugins, and allows only the known third parties", () => {
    const value = csp(false);
    expect(value).toContain("frame-ancestors 'none'");
    expect(value).toContain("object-src 'none'");
    expect(value).toContain("https://challenges.cloudflare.com");
    expect(value).toContain("https://i.scdn.co");
  });

  it("allows eval and websockets in development only", () => {
    expect(csp(true)).toContain("'unsafe-eval'");
    expect(csp(false)).not.toContain("'unsafe-eval'");
    expect(csp(false)).not.toContain("ws:");
  });

  it("ships the hardening headers", () => {
    const keys = securityHeaders(false).map((header) => header.key);
    expect(keys).toEqual(
      expect.arrayContaining(["X-Content-Type-Options", "Referrer-Policy", "Permissions-Policy"]),
    );
  });
});
