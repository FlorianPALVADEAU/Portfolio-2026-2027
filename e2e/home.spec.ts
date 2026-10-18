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

test("chosen theme persists across reloads without a flash", async ({ page }) => {
  await page.goto("/en");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");

  await page.getByRole("radio", { name: "Swiss" }).check({ force: true });
  await expect(page.locator("html")).toHaveAttribute("data-theme", "swiss");

  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "swiss");
  await expect(page.getByRole("radio", { name: "Swiss" })).toBeChecked();
});

test("skip link is the first tab stop and moves focus to main", async ({ page }) => {
  await page.goto("/en");
  await page.keyboard.press("Tab");

  const skip = page.getByRole("link", { name: "Skip to content" });
  await expect(skip).toBeFocused();
  await expect(skip).toBeVisible();

  await page.keyboard.press("Enter");
  await expect(page.locator("main")).toBeFocused();
});

test("page exposes header, main and footer landmarks", async ({ page }) => {
  await page.goto("/en");

  await expect(page.getByRole("banner")).toBeVisible();
  await expect(page.getByRole("main")).toBeVisible();
  await expect(page.getByRole("contentinfo")).toBeVisible();
});
