import { expect, test } from "@playwright/test";
import { expectNoA11yViolations } from "./support/axe";
import { waitForIntro } from "./support/intro";

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

  test("explains an invalid form in the page language and moves focus to the first problem", async ({
    page,
  }) => {
    await page.goto("/fr#contact");
    const form = page.getByRole("region", { name: "Travaillons ensemble" }).locator("form");
    await form.scrollIntoViewIfNeeded();

    await form.getByRole("button", { name: "Envoyer le message" }).click();

    await expect(form.getByLabel("Nom")).toBeFocused();
    await expect(form.getByLabel("Nom")).toHaveAttribute("aria-invalid", "true");
    await expect(form.getByText("Indiquez votre nom.")).toBeVisible();
    await expect(form.getByText("Écrivez au moins 10 caractères.")).toBeVisible();
    await expectNoA11yViolations(page);
  });

  test("loads nothing from Cloudflare until the visitor starts writing", async ({ page }) => {
    const hosts: string[] = [];
    page.on("request", (request) => hosts.push(new URL(request.url()).hostname));
    await page.goto("/en#contact");
    const form = page.locator("#contact form");
    await form.scrollIntoViewIfNeeded();
    await page.waitForLoadState("load");
    expect(hosts).not.toContain("challenges.cloudflare.com");

    // The page is inert while the intro covers it, and an inert field cannot take focus.
    await waitForIntro(page);
    // The form rises in as it enters the viewport, and a hidden field cannot take focus.
    await expect(form.getByLabel("Name")).toBeVisible();
    await form.getByLabel("Name").focus();

    await expect.poll(() => hosts).toContain("challenges.cloudflare.com");
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
