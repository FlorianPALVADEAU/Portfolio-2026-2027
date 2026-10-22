import AxeBuilder from "@axe-core/playwright";
import { expect, type Page } from "@playwright/test";

const WCAG_AA_TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"];

type Options = {
  /** Audit the scroll-scrubbed words too; only meaningful where they sit at rest, as under reduced motion. */
  scrubbedWords?: boolean;
};

export async function expectNoA11yViolations(page: Page, { scrubbedWords = false }: Options = {}) {
  // Entrance animations blend colors mid-flight; audit once every entrance has settled.
  await page.waitForFunction(() =>
    [...document.querySelectorAll("[data-entrance-root]")].every(
      (element) => (element as HTMLElement).dataset.entranceState === "done",
    ),
  );
  // Reveal transitions blend colors and may start after the page settled; cut them to their end state.
  await page.addStyleTag({ content: "*, *::before, *::after { transition: none !important; }" });
  await page.evaluate(
    () =>
      new Promise<void>((resolve) =>
        requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
      ),
  );
  // Scroll-scrubbed words (intro, gallery) are dimmed or blurred on purpose until reached; the full text stays in the DOM and readable.
  // The sound hint and the pointer tags are decorative bubbles that fade in and out, so they are never at rest.
  const audit = new AxeBuilder({ page })
    .withTags(WCAG_AA_TAGS)
    .exclude("[data-sound-hint]")
    .exclude("[data-pointer-tag]");
  if (!scrubbedWords) audit.exclude("[data-lit-word]").exclude("[data-zoom-word]");
  const { violations } = await audit.analyze();
  expect(violations, JSON.stringify(violations, null, 2)).toEqual([]);
}
