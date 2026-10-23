import { expect, test } from "@playwright/test";
import { expectNoA11yViolations } from "./support/axe";

test.describe("unknown addresses", () => {
  for (const path of ["/en/nope", "/en/projects/unknown"]) {
    test(`${path} answers 404 with the page in the visitor's language`, async ({ page }) => {
      const response = await page.goto(path);
      expect(response?.status()).toBe(404);

      await expect(page.getByRole("heading", { level: 1 })).toContainText("wasn't found");
      await expect(page.getByRole("link", { name: "Back to the home page" })).toHaveAttribute(
        "href",
        "/en",
      );
      await expectNoA11yViolations(page);
    });
  }

  test("fits the screen: no footer and nothing to scroll", async ({ page }) => {
    await page.goto("/en/nope");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

    await expect(page.getByRole("contentinfo")).toHaveCount(0);
    const overflow = await page.evaluate(
      () => document.documentElement.scrollHeight - window.innerHeight,
    );
    expect(overflow).toBeLessThanOrEqual(0);
  });

  test("the way back plays the page transition and lands on the home page", async ({ page }) => {
    await page.goto("/en/nope");
    await page.getByRole("link", { name: "Back to the home page" }).click();

    await expect(page).toHaveURL(/\/en$/);
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
    await expect(page.getByRole("heading", { level: 1 }).first()).toBeVisible();
  });

  test("a French address gets the French page", async ({ page }) => {
    const response = await page.goto("/fr/nope");
    expect(response?.status()).toBe(404);
    await expect(page.getByRole("heading", { level: 1 })).toContainText("n'a pas été trouvée");
  });
});
