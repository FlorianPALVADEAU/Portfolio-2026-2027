import { Effect, Exit, Layer } from "effect";
import { describe, expect, it } from "vitest";
import { DeliveryFailed, HumanCheckFailed } from "@/server/domain/contact";
import { HumanCheck, Mailer } from "./ports";
import { sendContact } from "./send-contact";

const valid = { name: "Ada", email: "ada@example.com", message: "Hello, I like your work." };

function run(fields: unknown, options: { human?: boolean; deliver?: boolean } = {}) {
  const { human = true, deliver = true } = options;
  const sent: unknown[] = [];
  const layer = Layer.mergeAll(
    Layer.succeed(HumanCheck, {
      verify: () => (human ? Effect.void : Effect.fail(new HumanCheckFailed({ reason: "no" }))),
    }),
    Layer.succeed(Mailer, {
      send: (message) =>
        deliver
          ? Effect.sync(() => {
              sent.push(message);
            })
          : Effect.fail(new DeliveryFailed({ reason: "down" })),
    }),
  );
  return Effect.runPromiseExit(
    sendContact({ fields, token: "token", ip: undefined }).pipe(Effect.provide(layer)),
  ).then((exit) => ({ exit, sent }));
}

const tagOf = (exit: Exit.Exit<unknown, { _tag: string }>) =>
  Exit.isFailure(exit) ? Exit.findErrorOption(exit) : undefined;

describe("sendContact", () => {
  it("delivers a valid message", async () => {
    const { exit, sent } = await run(valid);

    expect(Exit.isSuccess(exit)).toBe(true);
    expect(sent).toEqual([valid]);
  });

  it.each([
    ["an empty name", { ...valid, name: "" }],
    ["a malformed email", { ...valid, email: "not-an-email" }],
    ["a message that is too short", { ...valid, message: "Hi" }],
    ["a message that is too long", { ...valid, message: "x".repeat(4001) }],
    ["a missing field", { name: "Ada" }],
  ])("rejects %s before any other work", async (_label, fields) => {
    const { exit, sent } = await run(fields);

    expect(tagOf(exit)?.toString()).toContain("InvalidContact");
    expect(sent).toHaveLength(0);
  });

  it("does not deliver when the human check fails", async () => {
    const { exit, sent } = await run(valid, { human: false });

    expect(tagOf(exit)?.toString()).toContain("HumanCheckFailed");
    expect(sent).toHaveLength(0);
  });

  it("reports a delivery failure", async () => {
    const { exit } = await run(valid, { deliver: false });

    expect(tagOf(exit)?.toString()).toContain("DeliveryFailed");
  });
});
