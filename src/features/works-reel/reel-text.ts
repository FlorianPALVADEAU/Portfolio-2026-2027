const VISUALLY_HIDDEN = "sr-only";

/**
 * Swaps an element's text for a visible, aria-hidden copy plus a visually hidden original, so
 * assistive tech always reads the real words while the visible copy is animated.
 */
function replaceWithAccessibleCopy(element: HTMLElement, text: string): HTMLElement {
  const original = document.createElement("span");
  original.className = VISUALLY_HIDDEN;
  original.textContent = text;
  const visible = document.createElement("span");
  visible.setAttribute("aria-hidden", "true");
  element.replaceChildren(original, visible);
  return visible;
}

/** One inline-block span per letter, grouped by word so lines still wrap between words only. */
export function splitIntoLetters(element: HTMLElement): {
  letters: HTMLElement[];
  restore: () => void;
} {
  const text = element.textContent ?? "";
  const previous = Array.from(element.childNodes);
  const visible = replaceWithAccessibleCopy(element, text);
  const letters: HTMLElement[] = [];

  text.split(" ").forEach((word, index, words) => {
    const wordElement = document.createElement("span");
    wordElement.className = "inline-block whitespace-nowrap";
    for (const character of word) {
      const letter = document.createElement("span");
      letter.className = "inline-block";
      letter.textContent = character;
      wordElement.append(letter);
      letters.push(letter);
    }
    visible.append(wordElement);
    if (index < words.length - 1) visible.append(" ");
  });

  return { letters, restore: () => element.replaceChildren(...previous) };
}

/**
 * Prepares text to be typed. `type(progress)` shows the first part and keeps the rest invisible
 * but laid out, so the line never reflows while it is written.
 */
export function prepareTypewriter(element: HTMLElement): {
  type: (progress: number) => void;
  restore: () => void;
} {
  const text = element.textContent ?? "";
  const previous = Array.from(element.childNodes);
  const visible = replaceWithAccessibleCopy(element, text);
  const typed = document.createTextNode("");
  const pending = document.createElement("span");
  pending.className = "opacity-0";
  pending.textContent = text;
  visible.append(typed, pending);

  return {
    type: (progress) => {
      const count = Math.round(text.length * Math.min(Math.max(progress, 0), 1));
      typed.data = text.slice(0, count);
      pending.textContent = text.slice(count);
    },
    restore: () => element.replaceChildren(...previous),
  };
}
