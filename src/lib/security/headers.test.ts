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

  it("keeps the directives that Turnstile and the 3D scene rely on", () => {
    const value = csp(false);
    expect(value).toContain(
      "frame-src https://challenges.cloudflare.com https://www.openstreetmap.org",
    );
    expect(value).toContain("worker-src 'self' blob:");
    expect(value).toContain("img-src 'self' data: blob:");
  });

  it("allows eval and websockets in development only", () => {
    expect(csp(true)).toContain("'unsafe-eval'");
    expect(csp(false)).not.toContain("'unsafe-eval'");
    expect(csp(false)).not.toContain("ws:");
  });

  it("ships the hardening headers", () => {
    const keys = securityHeaders(false).map((header) => header.key);
    expect(keys).toEqual(
      expect.arrayContaining([
        "X-Content-Type-Options",
        "Referrer-Policy",
        "Permissions-Policy",
        "Strict-Transport-Security",
        "Cross-Origin-Opener-Policy",
      ]),
    );
  });

  it("meets the HSTS preload list requirements", () => {
    const hsts = securityHeaders(false).find((h) => h.key === "Strict-Transport-Security")?.value;
    expect(hsts).toMatch(/max-age=(\d+)/);
    expect(Number(hsts?.match(/max-age=(\d+)/)?.[1])).toBeGreaterThanOrEqual(31536000);
    expect(hsts).toContain("includeSubDomains");
    expect(hsts).toContain("preload");
  });
});
