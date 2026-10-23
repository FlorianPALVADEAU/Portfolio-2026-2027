import { render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const destroy = vi.fn();
const raf = vi.fn();
const lenisOptions = vi.fn();

vi.mock("lenis", () => ({
  default: class {
    constructor(options: unknown) {
      lenisOptions(options);
    }
    raf = raf;
    destroy = destroy;
  },
}));

const ticker = { add: vi.fn(), remove: vi.fn(), lagSmoothing: vi.fn() };
vi.mock("gsap", () => ({ gsap: { ticker, registerPlugin: vi.fn() } }));

const scrollTriggerConfig = vi.fn();
vi.mock("gsap/ScrollTrigger", () => ({ ScrollTrigger: { config: scrollTriggerConfig } }));

let reduced = false;
const listeners: Array<(event: { matches: boolean }) => void> = [];

beforeEach(() => {
  reduced = false;
  listeners.length = 0;
  vi.clearAllMocks();
  window.matchMedia = ((query: string) => ({
    media: query,
    get matches() {
      return reduced;
    },
    addEventListener: (_: string, fn: (event: { matches: boolean }) => void) => listeners.push(fn),
    removeEventListener: () => {},
  })) as unknown as typeof window.matchMedia;
});

afterEach(() => vi.resetModules());

async function mount() {
  const { SmoothScroll } = await import("./smooth-scroll");
  return render(<SmoothScroll />);
}

describe("SmoothScroll", () => {
  it("starts Lenis on the GSAP ticker by default", async () => {
    await mount();

    expect(lenisOptions).toHaveBeenCalledWith(expect.objectContaining({ autoRaf: false }));
    expect(ticker.add).toHaveBeenCalledTimes(1);
  });

  it("ignores mobile viewport resizes in ScrollTrigger", async () => {
    await mount();

    expect(scrollTriggerConfig).toHaveBeenCalledWith({ ignoreMobileResize: true });
  });

  it("does not start when reduced motion is preferred", async () => {
    reduced = true;
    await mount();

    expect(lenisOptions).not.toHaveBeenCalled();
    expect(ticker.add).not.toHaveBeenCalled();
  });

  it("stops when the preference turns on and cleans up on unmount", async () => {
    const { unmount } = await mount();

    for (const fn of listeners) fn({ matches: true });
    expect(destroy).toHaveBeenCalledTimes(1);

    unmount();
    expect(destroy).toHaveBeenCalledTimes(1);
  });
});
