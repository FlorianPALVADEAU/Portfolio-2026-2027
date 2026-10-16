import { expect, test } from "@playwright/test";
import { expectNoA11yViolations } from "./support/axe";

test("home page renders its heading and has no accessibility violations", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { level: 1, name: "Florian Palvadeau" })).toBeVisible();
  await expectNoA11yViolations(page);
});
