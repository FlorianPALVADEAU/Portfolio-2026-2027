import { act, render } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ScrollRestore } from "./scroll-restore";

let pathname = "/en";
vi.mock("next/navigation", () => ({ usePathname: () => pathname }));

function scrollTo(top: number) {
  Object.defineProperty(window, "scrollY", { value: top, configurable: true });
  window.dispatchEvent(new Event("scroll"));
}

describe("ScrollRestore", () => {
  beforeEach(() => {
    pathname = "/en";
    window.history.pushState({}, "", pathname);
    scrollTo(0);
    window.scrollTo = vi.fn() as unknown as typeof window.scrollTo;
    Object.defineProperty(document.documentElement, "scrollHeight", {
      value: 5000,
      configurable: true,
    });
    vi.stubGlobal("requestAnimationFrame", (callback: FrameRequestCallback) => {
      callback(0);
      return 0;
    });
  });

  function leaveAndReturn(action: () => void) {
    const { rerender } = render(<ScrollRestore />);
    scrollTo(1800);
    pathname = "/en/projects/atlas";
    window.history.pushState({}, "", pathname);
    rerender(<ScrollRestore />);
    scrollTo(0);
    action();
    pathname = "/en";
    window.history.pushState({}, "", pathname);
    rerender(<ScrollRestore />);
  }

  it("puts the visitor back after the back button", () => {
    leaveAndReturn(() => act(() => void window.dispatchEvent(new PopStateEvent("popstate"))));

    expect(window.scrollTo).toHaveBeenCalledWith({ top: 1800, behavior: "instant" });
  });

  it("puts the visitor back after a marked link", () => {
    const link = document.createElement("a");
    link.setAttribute("data-restore-scroll", "");
    document.body.append(link);

    leaveAndReturn(() => act(() => void link.click()));

    expect(window.scrollTo).toHaveBeenCalledWith({ top: 1800, behavior: "instant" });
    link.remove();
  });

  it("leaves any other navigation at the top", () => {
    leaveAndReturn(() => {});

    expect(window.scrollTo).not.toHaveBeenCalled();
  });
});
