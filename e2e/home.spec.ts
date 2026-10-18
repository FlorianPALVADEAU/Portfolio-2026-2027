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

test.describe("smooth scroll", () => {
  test("is active by default", async ({ page }) => {
    await page.goto("/en");
    await expect(page.locator("html")).toHaveClass(/lenis/);
  });

  test.describe("with reduced motion", () => {
    test.use({ reducedMotion: "reduce" });

    test("is off", async ({ page }) => {
      await page.goto("/en");
      await expect(page.getByRole("main")).toBeVisible();
      await expect(page.locator("html")).not.toHaveClass(/lenis/);
    });
  });
});

test.describe("page transition", () => {
  test("navigates through the overlay and the route is announced", async ({ page }) => {
    await page.goto("/en");
    await page.getByRole("link", { name: "FR, Français" }).click();

    await expect(page).toHaveURL(/\/fr$/);
    await expect(page.locator("html")).toHaveAttribute("lang", "fr");
    await expect(page.locator("next-route-announcer").getByRole("alert")).toHaveText(
      /Florian Palvadeau/,
    );
    await expect(page.getByRole("main")).toBeVisible();
    await expect(page.getByRole("link", { name: "EN, English" })).toBeVisible();
  });

  test.describe("with reduced motion", () => {
    test.use({ reducedMotion: "reduce" });

    test("navigates directly", async ({ page }) => {
      await page.goto("/en");
      await page.getByRole("link", { name: "DE, Deutsch" }).click();

      await expect(page).toHaveURL(/\/de$/);
    });
  });
});

test("sound is muted by default and the opt-in persists", async ({ page }) => {
  await page.goto("/en");
  await expect(page.getByRole("button", { name: "Sound: off" })).toBeVisible();

  await page.getByRole("button", { name: "Sound: off" }).click();
  await expect(page.getByRole("button", { name: "Sound: on" })).toBeVisible();

  await page.reload();
  await expect(page.getByRole("button", { name: "Sound: on" })).toBeVisible();
});

test.describe("command palette", () => {
  test("opens with the keyboard, runs a command and restores focus on Escape", async ({ page }) => {
    await page.goto("/en");
    const trigger = page.getByRole("button", { name: "Commands" });
    await trigger.focus();

    await page.keyboard.press("Control+k");
    const combobox = page.getByRole("combobox", { name: "Type a command" });
    await expect(combobox).toBeFocused();

    await page.keyboard.press("Escape");
    await expect(combobox).toBeHidden();
    await expect(trigger).toBeFocused();

    await trigger.click();
    await combobox.fill("swiss");
    await page.keyboard.press("Enter");
    await expect(page.locator("html")).toHaveAttribute("data-theme", "swiss");
  });

  test("switches locale and filters out non-matching commands", async ({ page }) => {
    await page.goto("/en");
    await page.getByRole("button", { name: "Commands" }).click();
    const combobox = page.getByRole("combobox", { name: "Type a command" });

    await combobox.fill("zzz");
    await expect(page.getByText("No matching command")).toBeVisible();

    await combobox.fill("deutsch");
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/\/de$/);
  });

  test("has no accessibility violations while open", async ({ page }) => {
    await page.goto("/en");
    await page.getByRole("button", { name: "Commands" }).click();
    await expectNoA11yViolations(page);
  });
});

test.describe("seo", () => {
  test("exposes canonical, alternates, open graph and a Person without contact data", async ({
    page,
  }) => {
    await page.goto("/de");

    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", /\/de$/);
    await expect(page.locator('link[rel="alternate"][hreflang="fr"]')).toHaveCount(1);
    await expect(page.locator('link[rel="alternate"][hreflang="x-default"]')).toHaveCount(1);
    await expect(page.locator('meta[property="og:locale"]')).toHaveAttribute("content", "de_CH");
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
      "content",
      /opengraph-image/,
    );

    const raw = await page.locator('script[type="application/ld+json"]').textContent();
    const person = JSON.parse(raw ?? "{}");
    expect(person["@type"]).toBe("Person");
    expect(Object.keys(person)).not.toEqual(
      expect.arrayContaining(["email", "telephone", "address"]),
    );
  });

  test("serves sitemap, robots and a PNG open graph image per locale", async ({ request }) => {
    const sitemap = await (await request.get("/sitemap.xml")).text();
    for (const locale of ["fr", "en", "de"]) expect(sitemap).toContain(`/${locale}</loc>`);

    const robots = await (await request.get("/robots.txt")).text();
    expect(robots).toContain("Sitemap:");

    for (const locale of ["fr", "en", "de"]) {
      const image = await request.get(`/${locale}/opengraph-image`);
      expect(image.status()).toBe(200);
      expect(image.headers()["content-type"]).toContain("image/png");
    }
  });
});

test("the page sets no cookies, so no consent banner is needed", async ({ page, context }) => {
  await page.goto("/en");
  await page.waitForLoadState("networkidle");

  expect(await context.cookies()).toEqual([]);
});

test.describe("project page", () => {
  for (const [locale, back] of [
    ["en", "Back to home"],
    ["fr", "Retour à l'accueil"],
    ["de", "Zurück zur Startseite"],
  ] as const) {
    test(`renders without accessibility violations in ${locale}`, async ({ page }) => {
      await page.goto(`/${locale}/projects/sample-project`);

      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
      await expect(page.getByRole("link", { name: back })).toBeVisible();
      await expectNoA11yViolations(page);
    });
  }

  test("unknown project shows the not-found page and the sitemap lists real ones", async ({
    page,
    request,
  }) => {
    await page.goto("/en/projects/nope");
    // Cache Components streams the shell first, so the status can already be 200;
    // the not-found page still carries a noindex robots tag.
    await expect(page.getByText("This page could not be found")).toBeVisible();
    await expect(page.locator('meta[name="robots"]').first()).toHaveAttribute("content", /noindex/);

    const sitemap = await (await request.get("/sitemap.xml")).text();
    expect(sitemap).toContain("/en/projects/sample-project</loc>");
  });
});

test.describe("landing sections", () => {
  test("header navigation jumps to a section without a page transition", async ({ page }) => {
    await page.goto("/en");

    await page
      .getByRole("navigation", { name: "Sections" })
      .getByRole("link", { name: "Skills" })
      .click();

    await expect(page).toHaveURL(/#skills$/);
    await expect(page.getByRole("region", { name: "Skills" })).toBeInViewport();
  });

  for (const [locale, heading] of [
    ["fr", "Projets sélectionnés"],
    ["de", "Ausgewählte Projekte"],
  ] as const) {
    test(`shows translated section headings in ${locale}`, async ({ page }) => {
      await page.goto(`/${locale}`);
      await expect(page.getByRole("heading", { level: 2, name: heading })).toBeVisible();
    });
  }
});
