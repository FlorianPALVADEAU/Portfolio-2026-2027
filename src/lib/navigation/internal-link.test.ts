import { describe, expect, it } from "vitest";
import { getInternalNavigation } from "./internal-link";

const current = { origin: "https://site.test", pathname: "/en", search: "" };
const click = {
  button: 0,
  metaKey: false,
  ctrlKey: false,
  shiftKey: false,
  altKey: false,
  defaultPrevented: false,
};

function anchor(href: string, attributes: { target?: string; download?: boolean } = {}) {
  return {
    href: new URL(href, current.origin).href,
    target: attributes.target ?? "",
    hasAttribute: (name: string) => name === "download" && Boolean(attributes.download),
  };
}

describe("getInternalNavigation", () => {
  it("returns the target of a same-origin page link", () => {
    expect(getInternalNavigation(click, anchor("/fr?x=1#top"), current)).toBe("/fr?x=1#top");
  });

  it("leaves hash jumps on the same page to the browser", () => {
    expect(getInternalNavigation(click, anchor("/en#contact"), current)).toBeNull();
  });

  it("ignores external origins", () => {
    expect(getInternalNavigation(click, anchor("https://other.test/fr"), current)).toBeNull();
  });

  it("ignores modified, non-primary and already handled clicks", () => {
    expect(getInternalNavigation({ ...click, ctrlKey: true }, anchor("/fr"), current)).toBeNull();
    expect(getInternalNavigation({ ...click, button: 1 }, anchor("/fr"), current)).toBeNull();
    expect(
      getInternalNavigation({ ...click, defaultPrevented: true }, anchor("/fr"), current),
    ).toBeNull();
  });

  it("ignores new-tab and download links", () => {
    expect(getInternalNavigation(click, anchor("/fr", { target: "_blank" }), current)).toBeNull();
    expect(getInternalNavigation(click, anchor("/cv.pdf", { download: true }), current)).toBeNull();
  });
});
