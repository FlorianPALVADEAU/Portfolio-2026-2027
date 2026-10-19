import { expect, test } from "@playwright/test";
import { expectNoA11yViolations } from "./support/axe";

test.describe("works reel", () => {
  test("keeps real titles readable while the reel animates them", async ({ page }) => {
    await page.goto("/en");

    const works = page.getByRole("region", { name: "Selected works" });
    await works.scrollIntoViewIfNeeded();

    await expect(works.getByRole("link", { name: "Overbound" })).toBeVisible();
    await expect(works.locator("[data-reel-title] .sr-only").first()).toHaveText("Overbound");
    await expect(works.locator("[data-reel-title] [aria-hidden='true']").first()).toBeAttached();
    await expectNoA11yViolations(page);
  });

  test("shears the covers while scrolling and straightens them at rest", async ({ page }) => {
    await page.goto("/en");
    const works = page.getByRole("region", { name: "Selected works" });
    await works.scrollIntoViewIfNeeded();
    const frame = works.locator("[data-reel-frame]").first();
    const transform = () => frame.evaluate((element) => getComputedStyle(element).transform);

    await expect(async () => {
      await page.mouse.wheel(0, 900);
      expect(await transform()).not.toBe("none");
    }).toPass({ timeout: 5000 });
    await expect.poll(transform, { timeout: 5000 }).toMatch(/^(none|matrix\(1, 0, 0, 1, 0, 0\))$/);
  });

  test("leaves titles untouched under reduced motion", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/en");

    await expect(page.locator("[data-reel-title] [aria-hidden='true']")).toHaveCount(0);
  });
});
