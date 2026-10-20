import { expect, test } from "@playwright/test";

test.describe("skills rail", () => {
  test("slides sideways as the page scrolls", async ({ page }) => {
    await page.goto("/en");
    const skills = page.getByRole("region", { name: "Skills" });
    await expect(skills.locator("[data-motion]")).toHaveAttribute("data-motion", "rail");
    // Start at the top of the rail, where nothing has slid yet; centring it would land mid-way.
    await skills.evaluate((section) => section.scrollIntoView());

    const typescript = skills.getByRole("listitem").filter({ hasText: "TypeScript" });
    const position = async () => (await typescript.boundingBox())?.x ?? 0;
    // The rail follows the scroll with a short delay, so wait until it has stopped moving.
    let before = Number.NaN;
    await expect
      .poll(async () => {
        const current = await position();
        const still = current === before;
        before = current;
        return still;
      })
      .toBe(true);

    await page.mouse.wheel(0, 900);
    await expect.poll(position).toBeLessThan(before - 200);
  });

  test("falls back to a plain list under reduced motion", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/en");
    const skills = page.getByRole("region", { name: "Skills" });

    await expect(skills.locator("[data-motion]")).toHaveAttribute("data-motion", "static");
    await expect(skills.getByRole("listitem").filter({ hasText: "TypeScript" })).toBeVisible();
  });
});
