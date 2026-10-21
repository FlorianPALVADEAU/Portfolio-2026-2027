import { expect, type Page, test } from "@playwright/test";
import { expectNoA11yViolations } from "./support/axe";

async function openMenu(page: Page) {
  await page.getByRole("button", { name: "Menu" }).click();
}

// Below md the language flags live in the menu; from md up they sit behind a header dropdown.
async function openLanguage(page: Page) {
  const dropdown = page.getByRole("button", { name: /^Language:/ });
  if (await dropdown.isVisible()) await dropdown.click();
  else if (!(await page.getByRole("link", { name: "DE, Deutsch" }).isVisible())) {
    await openMenu(page);
  }
}

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
  await openLanguage(page);
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

  await openMenu(page);
  await page.getByRole("button", { name: "Theme: Dark" }).click();
  await page.getByRole("button", { name: "Swiss" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "swiss");

  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "swiss");
  await openMenu(page);
  await expect(page.getByRole("button", { name: "Theme: Swiss" })).toBeVisible();
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
    await openLanguage(page);
    await page.getByRole("link", { name: "FR, Français" }).click();

    await expect(page).toHaveURL(/\/fr$/);
    await expect(page.locator("html")).toHaveAttribute("lang", "fr");
    await expect(page.locator("next-route-announcer").getByRole("alert")).toHaveText(
      /Florian Palvadeau/,
    );
    await expect(page.getByRole("main")).toBeVisible();
  });

  test.describe("with reduced motion", () => {
    test.use({ reducedMotion: "reduce" });

    test("navigates directly", async ({ page }) => {
      await page.goto("/en");
      await openLanguage(page);
      await page.getByRole("link", { name: "DE, Deutsch" }).click();

      await expect(page).toHaveURL(/\/de$/);
    });
  });
});

test("sound is muted by default and the opt-in persists", async ({ page, isMobile }) => {
  test.skip(isMobile, "the sound toggle is desktop-only: touch screens have no hover");
  await page.goto("/en");
  await expect(page.getByRole("button", { name: "Sound: off" })).toBeVisible();

  await page.getByRole("button", { name: "Sound: off" }).click();
  await expect(page.getByRole("button", { name: "Sound: on" })).toBeVisible();

  await page.reload();
  await expect(page.getByRole("button", { name: "Sound: on" })).toBeVisible();
});

test("has no accessibility violations while the menu is open", async ({ page }) => {
  await page.goto("/en");
  await openMenu(page);
  await expectNoA11yViolations(page);
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
      await page.goto(`/${locale}/projects/overbound`);

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
    expect(sitemap).toContain("/en/projects/overbound</loc>");
  });
});

test.describe("landing sections", () => {
  test("header navigation jumps to a section without a page transition", async ({ page }) => {
    await page.goto("/en");
    await openMenu(page);

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

test.describe("hero", () => {
  test("names the owner in the only h1 and shows the role and availability", async ({ page }) => {
    await page.goto("/en");

    await expect(
      page.getByRole("heading", { level: 1, name: /Florian Palvadeau.*From Geneva/ }),
    ).toBeVisible();
    await expect(page.getByText("Full-stack software engineer", { exact: true })).toBeVisible();
    await expect(page.getByText("Open to positions, Switzerland")).toBeVisible();
  });

  test.describe("with reduced motion", () => {
    test.use({ reducedMotion: "reduce" });

    test("content is visible immediately", async ({ page }) => {
      await page.goto("/en");
      const badge = page.getByText("Open to positions, Switzerland");

      await expect(badge).toHaveCSS("opacity", "1");
    });
  });
});

test.describe("intro and about", () => {
  for (const [locale, statement, hook] of [
    ["en", "I design, build and run web applications", "race organiser on the side"],
    ["fr", "Je conçois, développe et exploite", "organisateur de course à côté"],
    ["de", "Ich entwerfe, entwickle und betreibe", "nebenbei Rennveranstalter"],
  ] as const) {
    test(`renders the intro and the about hook in ${locale}`, async ({ page }) => {
      await page.goto(`/${locale}`);

      await expect(page.locator("#intro")).toContainText(statement);
      await expect(page.locator("#about")).toContainText(hook);
      await expectNoA11yViolations(page);
    });
  }
});

test.describe("selected works", () => {
  test("lists the case study and opens it from the card", async ({ page }) => {
    await page.goto("/en");

    const works = page.getByRole("region", { name: "Selected works" });
    const card = works.getByRole("link", { name: "Overbound" });
    // The reel swaps the title for animated letters once hydrated; a click that straddles the swap
    // is never fired, so wait for the real words to be tucked into their visually hidden copy.
    await expect(card.locator(".sr-only")).toHaveCount(1);
    await card.click();

    await expect(page).toHaveURL(/\/en\/projects\/overbound$/);
    await expect(page.getByRole("heading", { level: 1, name: "Overbound" })).toBeVisible();
  });

  test("cards are reachable and named in French", async ({ page }) => {
    await page.goto("/fr");
    await expect(
      page
        .getByRole("region", { name: "Projets sélectionnés" })
        .getByRole("link", { name: "Overbound" }),
    ).toBeVisible();
  });
});

test.describe("skills", () => {
  for (const [locale, group, certifications] of [
    ["en", "Collaboration", "Certifications"],
    ["fr", "Collaboration", "Certifications"],
    ["de", "Zusammenarbeit", "Zertifizierungen"],
  ] as const) {
    test(`lists groups and credentials in ${locale}`, async ({ page }) => {
      await page.goto(`/${locale}`);

      const skills = page.locator("#skills");
      await expect(skills.getByRole("heading", { name: group })).toBeVisible();
      await expect(skills.getByRole("heading", { name: certifications })).toBeVisible();
      await expect(skills.getByText(/92%/)).toBeVisible();
      await expectNoA11yViolations(page);
    });
  }
});

test.describe("technology band", () => {
  test("loops on its own, with no pause button", async ({ page }) => {
    await page.goto("/en");

    const band = page.getByRole("region", { name: "Technologies I work with" });
    await expect(band.getByRole("list")).toHaveCount(1);
    await expect(band.getByRole("button")).toHaveCount(0);
    // A band that is off screen is not driven, so bring it into view first.
    await band.scrollIntoViewIfNeeded();
    const track = band.locator("div.w-max");
    const offset = () => track.evaluate((node) => node.getBoundingClientRect().x);

    const before = await offset();
    await expect.poll(offset).not.toBe(before);
    await expectNoA11yViolations(page);
  });

  test.describe("with reduced motion", () => {
    test.use({ reducedMotion: "reduce" });

    test("is static and has no control", async ({ page }) => {
      await page.goto("/en");

      const band = page.getByRole("region", { name: "Technologies I work with" });
      await expect(band.getByRole("button")).toHaveCount(0);
      await expect(band.getByText("Kubernetes").first()).toBeVisible();
      await expect(band.getByText("Kubernetes").nth(1)).toBeHidden();
    });
  });
});

test.describe("contact", () => {
  test("links the approved profiles and publishes no direct contact details", async ({ page }) => {
    await page.goto("/en");

    const contact = page.locator("#contact");
    await expect(contact.getByRole("link", { name: /GitHub/ })).toHaveAttribute(
      "href",
      "https://github.com/FlorianPALVADEAU",
    );
    await expect(contact.getByRole("link", { name: /LinkedIn/ })).toBeVisible();
    await expect(page.locator('a[href^="mailto:"], a[href^="tel:"]')).toHaveCount(0);
    await expectNoA11yViolations(page);
  });
});

test.describe("3d budget", () => {
  const renderer = "WebGLRenderer";

  test("keeps three.js out of the scripts the document ships", async ({ page, request }) => {
    const html = await (await request.get("/en")).text();
    const sources = [...html.matchAll(/<script[^>]+src="([^"]+)"/g)].map((match) => match[1] ?? "");
    expect(sources.length).toBeGreaterThan(0);

    for (const source of sources) {
      const body = await (await request.get(source)).text();
      expect(body, source).not.toContain(renderer);
    }
    await page.goto("/en");
  });

  test.describe("with reduced motion", () => {
    test.use({ reducedMotion: "reduce" });

    test("never downloads three.js", async ({ page }) => {
      const chunks: string[] = [];
      page.on("response", async (response) => {
        if (!response.url().endsWith(".js")) return;
        if ((await response.text().catch(() => "")).includes(renderer)) chunks.push(response.url());
      });
      await page.goto("/en", { waitUntil: "networkidle" });

      expect(chunks).toEqual([]);
    });
  });
});

test("ignores keydown events without a key, as sent by browser autofill", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/en");

  await page.evaluate(() => document.dispatchEvent(new Event("keydown")));

  expect(errors).toEqual([]);
});

test("the now playing route answers with no content when Spotify is not configured", async ({
  request,
  page,
}) => {
  const reply = await request.get("/api/now-playing");
  expect(reply.status()).toBe(204);

  await page.goto("/en");
  await expect(page.getByRole("contentinfo").getByText(/Now playing|Last played/)).toHaveCount(0);
});

test("changing language keeps the theme and the scroll position", async ({ page }) => {
  await page.goto("/en");
  await openMenu(page);
  await page.getByRole("button", { name: "Theme: Dark" }).click();
  await page.getByRole("button", { name: "Light" }).click();
  await page.evaluate(() => window.scrollTo(0, 1200));
  const before = await page.evaluate(() => window.scrollY);

  await openLanguage(page);
  await page.getByRole("link", { name: "FR, Français" }).click();

  await expect(page).toHaveURL(/\/fr$/);
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  expect(await page.evaluate(() => window.scrollY)).toBeGreaterThan(before / 2);
});
