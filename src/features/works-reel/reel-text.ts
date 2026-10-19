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

/** Glyph copies stacked in each letter's strip: the strip scrolls past them before it settles. */
export const ROLLER_COPIES = 3;

/**
 * One masked slot per letter holding a vertical strip of identical glyphs, grouped by word so
 * lines still wrap between words only. Sliding a strip rolls the letter like a drum.
 */
export function splitIntoLetters(element: HTMLElement): {
  letters: HTMLElement[];
  strips: HTMLElement[];
  restore: () => void;
} {
  const text = element.textContent ?? "";
  const previous = Array.from(element.childNodes);
  const visible = replaceWithAccessibleCopy(element, text);
  const letters: HTMLElement[] = [];
  const strips: HTMLElement[] = [];

  text.split(" ").forEach((word, index, words) => {
    const wordElement = document.createElement("span");
    wordElement.className = "inline-block whitespace-nowrap";
    for (const character of word) {
      const letter = document.createElement("span");
      // Extra bottom room keeps descenders from being clipped by the mask.
      letter.className = "-mb-[0.15em] inline-block h-[calc(1lh+0.15em)] overflow-hidden align-top";
      const strip = document.createElement("span");
      strip.className = "block";
      for (let copy = 0; copy < ROLLER_COPIES; copy += 1) {
        const glyph = document.createElement("span");
        glyph.className = "block pb-[0.15em]";
        glyph.textContent = character;
        strip.append(glyph);
      }
      letter.append(strip);
      wordElement.append(letter);
      letters.push(letter);
      strips.push(strip);
    }
    visible.append(wordElement);
    if (index < words.length - 1) visible.append(" ");
  });

  return { letters, strips, restore: () => element.replaceChildren(...previous) };
}

const NOISE = "!#$%&*+-/<=>?@[]^_{|}~0123456789";

function noise(length: number): string {
  let result = "";
  for (let index = 0; index < length; index += 1)
    result += NOISE[Math.floor(Math.random() * NOISE.length)];
  return result;
}

/**
 * Prepares text to be decoded. `type(progress)` shows the first part as written and fills the
 * rest with random symbols of the same length, so the line never reflows while it resolves.
 */
export function prepareTypewriter(element: HTMLElement): {
  type: (progress: number) => void;
  restore: () => void;
} {
  const text = element.textContent ?? "";
  const previous = Array.from(element.childNodes);
  const visible = replaceWithAccessibleCopy(element, text);
  const typed = document.createTextNode("");
  const pending = document.createTextNode("");
  visible.append(typed, pending);

  return {
    type: (progress) => {
      const count = Math.round(text.length * Math.min(Math.max(progress, 0), 1));
      typed.textContent = text.slice(0, count);
      // Spaces stay spaces so the words keep their shape while the rest is still noise.
      pending.textContent = noise(text.length - count).replace(/./g, (symbol, index) =>
        text[count + index] === " " ? " " : symbol,
      );
    },
    restore: () => element.replaceChildren(...previous),
  };
}
