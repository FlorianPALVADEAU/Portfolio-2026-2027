import AxeBuilder from "@axe-core/playwright";
import { expect, type Page } from "@playwright/test";

const WCAG_AA_TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"];

export async function expectNoA11yViolations(page: Page) {
  // Entrance animations blend colors mid-flight; audit once every entrance has settled.
  await page.waitForFunction(() =>
    [...document.querySelectorAll("[data-entrance-root]")].every(
      (element) => (element as HTMLElement).dataset.entranceState === "done",
    ),
  );
  // Reveal transitions blend colors too; looping animations never end, so only finite ones count.
  await page.waitForFunction(() =>
    document
      .getAnimations()
      .every(
        (animation) =>
          animation.playState !== "running" ||
          animation.effect?.getComputedTiming().iterations === Infinity,
      ),
  );
  // Scroll-scrubbed words (intro, gallery) are dimmed or blurred on purpose until reached; the full text stays in the DOM and readable.
  const { violations } = await new AxeBuilder({ page })
    .withTags(WCAG_AA_TAGS)
    .exclude("[data-lit-word]")
    .exclude("[data-zoom-word]")
    .analyze();
  expect(violations, JSON.stringify(violations, null, 2)).toEqual([]);
}
