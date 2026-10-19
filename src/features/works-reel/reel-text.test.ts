import { describe, expect, it } from "vitest";
import { prepareTypewriter, ROLLER_COPIES, splitIntoLetters } from "./reel-text";

function element(text: string): HTMLElement {
  const node = document.createElement("p");
  node.textContent = text;
  document.body.append(node);
  return node;
}

describe("splitIntoLetters", () => {
  it("keeps the real text for assistive tech and animates an aria-hidden copy", () => {
    const node = element("Atlas Dashboard");
    const { letters, strips } = splitIntoLetters(node);

    expect(letters).toHaveLength("AtlasDashboard".length);
    expect(strips[0]?.children).toHaveLength(ROLLER_COPIES);
    expect(node.querySelector(".sr-only")?.textContent).toBe("Atlas Dashboard");
    expect(
      node
        .querySelector("[aria-hidden='true']")
        ?.textContent?.startsWith("A".repeat(ROLLER_COPIES)),
    ).toBe(true);
  });

  it("restores the original content", () => {
    const node = element("Overbound");
    splitIntoLetters(node).restore();

    expect(node.children).toHaveLength(0);
    expect(node.textContent).toBe("Overbound");
  });
});

describe("prepareTypewriter", () => {
  it("resolves random symbols into the real text from left to right", () => {
    const node = element("2026 • Next.js");
    const { type } = prepareTypewriter(node);
    const visible = node.querySelector("[aria-hidden='true']");

    type(0);
    expect(visible?.textContent).toHaveLength(14);
    expect(visible?.textContent?.[4]).toBe(" ");

    type(0.5);
    expect(visible?.textContent).toHaveLength(14);
    expect(visible?.textContent?.startsWith("2026 • ")).toBe(true);
    expect(node.querySelector(".sr-only")?.textContent).toBe("2026 • Next.js");

    type(1);
    expect(visible?.textContent).toBe("2026 • Next.js");
  });

  it("restores the original nodes", () => {
    const node = element("2026 • Next.js");
    const { restore } = prepareTypewriter(node);
    restore();
    expect(node.textContent).toBe("2026 • Next.js");
    expect(node.querySelector("[aria-hidden='true']")).toBeNull();
  });
});
