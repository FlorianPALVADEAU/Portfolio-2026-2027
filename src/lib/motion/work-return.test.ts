import { beforeEach, describe, expect, it } from "vitest";
import { armWorkReturn, rememberLeftWork, takeWorkReturn } from "./work-return";

beforeEach(() => sessionStorage.clear());

describe("work return", () => {
  it("gives back the project left once the return is armed", () => {
    rememberLeftWork("/en/projects/overbound");
    armWorkReturn();

    expect(takeWorkReturn()).toBe("/en/projects/overbound");
    expect(takeWorkReturn()).toBeNull();
  });

  it("ignores a visit that is not a return", () => {
    rememberLeftWork("/en/projects/overbound");

    expect(takeWorkReturn()).toBeNull();
  });

  it("forgets a project that was never left", () => {
    armWorkReturn();

    expect(takeWorkReturn()).toBeNull();
  });
});
