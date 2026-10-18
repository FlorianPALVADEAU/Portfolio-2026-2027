import { expect, test } from "@playwright/test";
import { expectNoA11yViolations } from "./support/axe";

test("root redirects to a locale and the page has no accessibility violations", async ({
  page,
}) => {
  await page.goto("/");

  await expect(page).toHaveURL(/\/en$/);
  await expect(page.getByRole("heading", { level: 1, name: "Florian Palvadeau" })).toBeVisible();
  await expectNoA11yViolations(page);
});

test("locale switcher navigates to the German page", async ({ page }) => {
  await page.goto("/en");
  await page.getByRole("link", { name: "DE, Deutsch" }).click();

  await expect(page).toHaveURL(/\/de$/);
  await expect(page.locator("html")).toHaveAttribute("lang", "de");
  await expect(page.getByText("Offen für Stellen, Schweiz")).toBeVisible();
});

test("unknown locale returns 404", async ({ page }) => {
  const response = await page.goto("/es");
  expect(response?.status()).toBe(404);
});
