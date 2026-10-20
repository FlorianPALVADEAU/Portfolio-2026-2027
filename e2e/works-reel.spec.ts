import { expect, test } from "@playwright/test";
import { expectNoA11yViolations } from "./support/axe";

test.describe("works reel", () => {
  test("keeps real titles readable while the reel animates them", async ({ page }) => {
    await page.goto("/en");

    const works = page.getByRole("region", { name: "Selected works" });
    await works.scrollIntoViewIfNeeded();

    await expect(works.getByRole("link", { name: "Overbound" })).toBeVisible();
    // The reel scrolls with the page, so any title can lead; the real one must exist for every project.
    await expect(
      works.locator("[data-reel-title] .sr-only").filter({ hasText: "Overbound" }),
    ).toBeAttached();
    await expect(works.locator("[data-reel-title] [aria-hidden='true']").first()).toBeAttached();
    await expectNoA11yViolations(page);
  });

  test("draws the covers in a hidden canvas and keeps the DOM ones for assistive tech", async ({
    page,
  }) => {
    await page.goto("/en");
    const webgl = await page.evaluate(() =>
      Boolean(document.createElement("canvas").getContext("webgl2")),
    );
    test.skip(!webgl, "WebGL is not available in this browser");
    const works = page.getByRole("region", { name: "Selected works" });
    await works.scrollIntoViewIfNeeded();

    const canvas = page.locator("[data-reel-canvas]");
    await expect(canvas).toHaveAttribute("aria-hidden", "true");
    await expect(canvas.locator("canvas")).toBeAttached();
    await expect(works.locator("[data-reel-image]").first()).toHaveAttribute("alt", /.+/);
    await expectNoA11yViolations(page);
  });

  test("leaves titles untouched under reduced motion", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/en");

    await expect(page.locator("[data-reel-title] [aria-hidden='true']")).toHaveCount(0);
    await expect(page.locator("[data-reel-canvas]")).toHaveCount(0);
  });
});
