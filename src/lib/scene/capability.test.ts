import { afterEach, describe, expect, it, vi } from "vitest";
import { canRenderScene } from "./capability";

function setup({ reduced = false, saveData = false, webgl = true, touch = false }) {
  window.matchMedia = vi.fn((query: string) => ({
    matches: query.includes("pointer: fine") ? !touch : reduced,
  })) as never;
  Object.defineProperty(navigator, "connection", { value: { saveData }, configurable: true });
  vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue((webgl ? {} : null) as never);
}

describe("canRenderScene", () => {
  afterEach(() => vi.restoreAllMocks());

  it("allows a capable device", () => {
    setup({});
    expect(canRenderScene()).toBe(true);
  });

  it.each([
    ["reduced motion", { reduced: true }],
    ["data saving", { saveData: true }],
    ["missing WebGL", { webgl: false }],
    ["a touch screen", { touch: true }],
  ])("refuses with %s", (_, options) => {
    setup(options);
    expect(canRenderScene()).toBe(false);
  });
});
