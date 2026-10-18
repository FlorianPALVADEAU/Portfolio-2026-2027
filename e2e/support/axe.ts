import AxeBuilder from "@axe-core/playwright";
import { expect, type Page } from "@playwright/test";

const WCAG_AA_TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"];

export async function expectNoA11yViolations(page: Page) {
  // Entrance animations blend colors mid-flight; audit the settled page.
  await page.waitForFunction(() =>
    [...document.querySelectorAll("[data-entrance]")].every(
      (element) => getComputedStyle(element).opacity === "1",
    ),
  );
  const { violations } = await new AxeBuilder({ page }).withTags(WCAG_AA_TAGS).analyze();
  expect(violations, JSON.stringify(violations, null, 2)).toEqual([]);
}
