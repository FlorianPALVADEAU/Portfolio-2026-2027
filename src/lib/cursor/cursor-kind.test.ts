import { afterEach, describe, expect, it } from "vitest";
import { resolveCursorTarget } from "./cursor-kind";

function mount(html: string, selector: string): Element {
  document.body.innerHTML = html;
  const element = document.querySelector(selector);
  if (!element) throw new Error(`missing ${selector}`);
  return element;
}

afterEach(() => {
  document.body.innerHTML = "";
});

describe("resolveCursorTarget", () => {
  it("is a dot over plain content and a scroll hint when one is active", () => {
    const target = mount("<p>hello</p>", "p");

    expect(resolveCursorTarget(target, false).kind).toBe("dot");
    expect(resolveCursorTarget(target, true).kind).toBe("scroll");
    expect(resolveCursorTarget(null, false).kind).toBe("dot");
  });

  it("grows over what can be clicked and names it as the anchor", () => {
    const target = mount("<a href='/x'><span>go</span></a>", "span");

    const { kind, anchor } = resolveCursorTarget(target, true);

    expect(kind).toBe("link");
    expect(anchor?.tagName).toBe("A");
  });

  it("lets a marked area win over the link that covers it", () => {
    const target = mount("<article data-cursor='view'><a href='/x'>card</a></article>", "a");

    expect(resolveCursorTarget(target, false).kind).toBe("view");
  });

  it.each([
    ["<textarea></textarea>", "textarea"],
    ["<input type='email'>", "input"],
    ["<input>", "input"],
    ["<select><option>a</option></select>", "select"],
    ["<iframe></iframe>", "iframe"],
    ["<dialog open><button>x</button></dialog>", "button"],
  ])("leaves the system pointer in %s", (html, selector) => {
    expect(resolveCursorTarget(mount(html, selector), true).kind).toBe("native");
  });

  it("keeps the custom cursor on checkboxes", () => {
    expect(resolveCursorTarget(mount("<input type='checkbox'>", "input"), false).kind).toBe("link");
  });
});
