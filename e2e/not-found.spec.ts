import { expect, test } from "@playwright/test";
import { expectNoA11yViolations } from "./support/axe";

test.describe("unknown addresses", () => {
  for (const path of ["/en/nope", "/en/projects/unknown"]) {
    test(`${path} answers 404 with the page in the visitor's language`, async ({ page }) => {
      const response = await page.goto(path);
      expect(response?.status()).toBe(404);

      await expect(page.getByRole("heading", { level: 1 })).toContainText("wandered off");
      await expect(page.getByRole("link", { name: "Back to the home page" })).toHaveAttribute(
        "href",
        "/en",
      );
      await expectNoA11yViolations(page);
    });
  }

  test("a French address gets the French page", async ({ page }) => {
    const response = await page.goto("/fr/nope");
    expect(response?.status()).toBe(404);
    await expect(page.getByRole("heading", { level: 1 })).toContainText("s'est perdue");
  });
});
