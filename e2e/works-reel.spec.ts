import { expect, test } from "@playwright/test";
import { expectNoA11yViolations } from "./support/axe";

test.describe("works reel", () => {
  test("keeps real titles readable while the reel animates them", async ({ page }) => {
    await page.goto("/en");

    const works = page.getByRole("region", { name: "Selected works" });
    await works.scrollIntoViewIfNeeded();

    await expect(works.getByRole("link", { name: "Overbound" })).toBeVisible();
    await expect(works.locator("[data-reel-title] [aria-hidden='true']").first()).toHaveText(
      "Overbound",
    );
    await expectNoA11yViolations(page);
  });

  test("leaves titles untouched under reduced motion", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/en");

    await expect(page.locator("[data-reel-title] [aria-hidden='true']")).toHaveCount(0);
  });
});
