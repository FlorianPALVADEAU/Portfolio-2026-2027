import { describe, expect, it } from "vitest";
import { prepareTypewriter, splitIntoLetters } from "./reel-text";

function element(text: string): HTMLElement {
  const node = document.createElement("p");
  node.textContent = text;
  document.body.append(node);
  return node;
}

describe("splitIntoLetters", () => {
  it("keeps the real text for assistive tech and animates an aria-hidden copy", () => {
    const node = element("Atlas Dashboard");
    const { letters } = splitIntoLetters(node);

    expect(letters).toHaveLength("AtlasDashboard".length);
    expect(node.querySelector(".sr-only")?.textContent).toBe("Atlas Dashboard");
    expect(node.querySelector("[aria-hidden='true']")?.textContent).toBe("Atlas Dashboard");
  });

  it("restores the original content", () => {
    const node = element("Overbound");
    splitIntoLetters(node).restore();

    expect(node.children).toHaveLength(0);
    expect(node.textContent).toBe("Overbound");
  });
});

describe("prepareTypewriter", () => {
  it("types progressively and keeps the full text laid out", () => {
    const node = element("2026 • Next.js");
    const { type } = prepareTypewriter(node);
    const visible = node.querySelector("[aria-hidden='true']");

    type(0);
    expect(visible?.textContent).toBe("2026 • Next.js");
    expect(visible?.querySelector(".opacity-0")?.textContent).toBe("2026 • Next.js");

    type(0.5);
    expect(visible?.querySelector(".opacity-0")?.textContent).toBe("Next.js");
    expect(node.querySelector(".sr-only")?.textContent).toBe("2026 • Next.js");

    type(1);
    expect(visible?.querySelector(".opacity-0")?.textContent).toBe("");
  });
});
