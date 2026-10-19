import { Effect } from "effect";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { HumanCheck } from "@/server/services/contact";
import { allowedHostnames, HumanCheckTurnstile } from "./human-check-turnstile";

const verify = (token: string) =>
  Effect.runPromiseExit(
    Effect.gen(function* () {
      yield* (yield* HumanCheck).verify(token, "203.0.113.7");
    }).pipe(Effect.provide(HumanCheckTurnstile)),
  );

const answer = (body: unknown, ok = true) =>
  vi.fn().mockResolvedValue({ ok, status: ok ? 200 : 500, json: async () => body });

describe("Turnstile human check", () => {
  beforeEach(() => {
    vi.stubEnv("TURNSTILE_SECRET", "secret");
    vi.stubEnv("NODE_ENV", "production");
  });
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it("accepts a successful challenge for the expected action and host", async () => {
    const fetchMock = answer({ success: true, action: "contact", hostname: "palvadeau.ch" });
    vi.stubGlobal("fetch", fetchMock);

    expect((await verify("token"))._tag).toBe("Success");
    const body = fetchMock.mock.calls[0]?.[1]?.body as URLSearchParams;
    expect(body.get("secret")).toBe("secret");
    expect(body.get("response")).toBe("token");
    expect(body.get("remoteip")).toBe("203.0.113.7");
  });

  it.each([
    ["a failed challenge", { success: false }],
    ["another action", { success: true, action: "login", hostname: "palvadeau.ch" }],
    ["another host", { success: true, action: "contact", hostname: "evil.example" }],
    ["localhost in production", { success: true, action: "contact", hostname: "localhost" }],
    ["a malformed reply", { nope: 1 }],
  ])("rejects %s", async (_label, body) => {
    vi.stubGlobal("fetch", answer(body));

    expect((await verify("token"))._tag).toBe("Failure");
  });

  it("rejects when siteverify is down, the token is empty or the secret is missing", async () => {
    vi.stubGlobal("fetch", answer({}, false));
    expect((await verify("token"))._tag).toBe("Failure");

    const fetchMock = answer({ success: true, action: "contact", hostname: "palvadeau.ch" });
    vi.stubGlobal("fetch", fetchMock);
    expect((await verify(""))._tag).toBe("Failure");

    vi.stubEnv("TURNSTILE_SECRET", "");
    expect((await verify("token"))._tag).toBe("Failure");
    expect(fetchMock).not.toHaveBeenCalled();
  });
});

describe("allowedHostnames", () => {
  it("allows localhost only outside production", () => {
    expect(allowedHostnames({ NODE_ENV: "production" }).has("localhost")).toBe(false);
    expect(allowedHostnames({ NODE_ENV: "development" }).has("localhost")).toBe(true);
  });

  it("allows Vercel preview hosts", () => {
    const hosts = allowedHostnames({ NODE_ENV: "production", VERCEL_URL: "p-abc.vercel.app" });
    expect(hosts.has("p-abc.vercel.app")).toBe(true);
  });
});
