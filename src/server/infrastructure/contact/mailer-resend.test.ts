import { Effect } from "effect";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { Mailer } from "@/server/services/contact";
import { MailerResend } from "./mailer-resend";

const message = {
  name: "Ada\nLovelace",
  email: "ada@example.com",
  message: "Hello there, friend.",
};

const send = () =>
  Effect.runPromiseExit(
    Effect.gen(function* () {
      yield* (yield* Mailer).send(message);
    }).pipe(Effect.provide(MailerResend)),
  );

describe("Resend mailer", () => {
  beforeEach(() => {
    vi.stubEnv("RESEND_API_KEY", "re_key");
    vi.stubEnv("CONTACT_EMAIL", "owner@example.test");
  });
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it("posts the message to the owner and lets them reply to the visitor", async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, status: 200 });
    vi.stubGlobal("fetch", fetchMock);

    expect((await send())._tag).toBe("Success");
    const [url, init] = fetchMock.mock.calls[0] ?? [];
    expect(url).toBe("https://api.resend.com/emails");
    expect(init.headers.Authorization).toBe("Bearer re_key");
    const payload = JSON.parse(init.body);
    expect(payload).toMatchObject({ to: ["owner@example.test"], reply_to: "ada@example.com" });
    expect(payload.subject).toBe("Portfolio: message from Ada Lovelace");
    expect(payload.from).toContain("onboarding@resend.dev");
  });

  it("fails without calling Resend when it is not configured", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    vi.stubEnv("CONTACT_EMAIL", "");

    expect((await send())._tag).toBe("Failure");
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("fails when Resend refuses the message", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false, status: 422 }));

    expect((await send())._tag).toBe("Failure");
  });
});
