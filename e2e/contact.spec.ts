import { expect, test } from "@playwright/test";
import { expectNoA11yViolations } from "./support/axe";

test.describe("contact form", () => {
  test("offers a labelled, accessible form without exposing an address", async ({ page }) => {
    await page.goto("/en#contact");

    const form = page.getByRole("region", { name: "Let's work together" }).locator("form");
    await form.scrollIntoViewIfNeeded();

    await expect(form.getByLabel("Name")).toBeVisible();
    await expect(form.getByLabel("Email")).toBeVisible();
    await expect(form.getByLabel("Message")).toBeVisible();
    await expect(form.getByRole("button", { name: "Send message" })).toBeEnabled();
    await expect(page.locator("a[href^='mailto:']")).toHaveCount(0);
    await expectNoA11yViolations(page);
  });

  test("keeps the honeypot out of the tab order", async ({ page }) => {
    await page.goto("/en#contact");

    await expect(page.locator("input[name='website']")).toHaveAttribute("tabindex", "-1");
  });

  test("is translated", async ({ page }) => {
    await page.goto("/de#contact");

    await expect(page.getByRole("button", { name: "Nachricht senden" })).toBeVisible();
  });
});
