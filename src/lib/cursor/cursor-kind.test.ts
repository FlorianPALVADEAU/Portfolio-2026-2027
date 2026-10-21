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
  it("is an arrow over plain content, tagged with the scroll hint when one is active", () => {
    const target = mount("<p>hello</p>", "p");

    expect(resolveCursorTarget(target, false)).toEqual({ shape: "arrow", label: null });
    expect(resolveCursorTarget(target, true)).toEqual({ shape: "arrow", label: "scroll" });
    expect(resolveCursorTarget(null, false)).toEqual({ shape: "arrow", label: null });
  });

  it("becomes the hand over what can be clicked, and drops the scroll hint", () => {
    const target = mount("<a href='/x'><span>go</span></a>", "span");

    expect(resolveCursorTarget(target, true)).toEqual({ shape: "hand", label: null });
  });

  it("keeps the view tag on a marked area even though a link covers it", () => {
    const target = mount("<article data-cursor='view'><a href='/x'>card</a></article>", "a");

    expect(resolveCursorTarget(target, false)).toEqual({ shape: "hand", label: "view" });
  });

  it.each([
    ["<textarea></textarea>", "textarea"],
    ["<input type='email'>", "input"],
    ["<input>", "input"],
    ["<select><option>a</option></select>", "select"],
    ["<iframe></iframe>", "iframe"],
    ["<dialog open><button>x</button></dialog>", "button"],
  ])("leaves the system pointer in %s", (html, selector) => {
    expect(resolveCursorTarget(mount(html, selector), true).shape).toBe("native");
  });

  it("keeps the hand on checkboxes", () => {
    expect(resolveCursorTarget(mount("<input type='checkbox'>", "input"), false).shape).toBe(
      "hand",
    );
  });
});
