import { vi } from "vitest";

/**
 * Replaces `window.matchMedia` with a stub whose queries all answer the same way. Pass a function
 * when the answer changes during a test. Returns the spy so a test can check the query asked.
 */
export function mockMatchMedia(matches: boolean | (() => boolean)) {
  const read = typeof matches === "function" ? matches : () => matches;
  const spy = vi.fn((query: string) => ({
    media: query,
    get matches() {
      return read();
    },
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  }));
  window.matchMedia = spy as unknown as typeof window.matchMedia;
  return spy;
}
