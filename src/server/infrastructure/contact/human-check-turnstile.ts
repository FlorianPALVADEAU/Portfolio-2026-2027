import { Effect, Layer, Schema } from "effect";
import { siteUrl } from "@/lib/site";
import { HumanCheckFailed } from "@/server/domain/contact";
import { HumanCheck } from "@/server/services/contact";

const SITEVERIFY = "https://challenges.cloudflare.com/turnstile/v0/siteverify";
export const CONTACT_ACTION = "contact";

const Verdict = Schema.Struct({
  success: Schema.Boolean,
  action: Schema.optional(Schema.String),
  hostname: Schema.optional(Schema.String),
});

/** Hosts the widget may run on: the site, Vercel previews, and localhost outside production. */
export function allowedHostnames(env: NodeJS.ProcessEnv = process.env): ReadonlySet<string> {
  const hosts = [new URL(siteUrl).hostname, env.VERCEL_URL, env.VERCEL_BRANCH_URL];
  if (env.NODE_ENV !== "production") hosts.push("localhost", "127.0.0.1");
  return new Set(hosts.filter((host): host is string => Boolean(host)));
}

const fail = (reason: string) => new HumanCheckFailed({ reason });

export const HumanCheckTurnstile = Layer.succeed(HumanCheck, {
  verify: (token, ip) =>
    Effect.gen(function* () {
      const secret = process.env.TURNSTILE_SECRET_KEY;
      if (!secret) return yield* fail("TURNSTILE_SECRET_KEY is not set");
      if (token.length === 0 || token.length > 2048) return yield* fail("missing token");

      const body = new URLSearchParams({ secret, response: token });
      if (ip) body.set("remoteip", ip);
      const response = yield* Effect.tryPromise({
        try: async () => {
          const reply = await fetch(SITEVERIFY, {
            method: "POST",
            body,
            signal: AbortSignal.timeout(10_000),
          });
          if (!reply.ok) throw new Error(`siteverify ${reply.status}`);
          return reply.json();
        },
        catch: (error) => fail(String(error)),
      });
      const verdict = yield* Schema.decodeUnknownEffect(Verdict)(response).pipe(
        Effect.mapError(() => fail("unexpected siteverify response")),
      );

      if (!verdict.success) return yield* fail("challenge not passed");
      if (verdict.action !== CONTACT_ACTION) return yield* fail("unexpected action");
      if (!(verdict.hostname && allowedHostnames().has(verdict.hostname))) {
        return yield* fail("unexpected hostname");
      }
    }),
});
