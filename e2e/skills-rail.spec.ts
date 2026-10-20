import { expect, test } from "@playwright/test";

test.describe("skills rail", () => {
  test("slides sideways as the page scrolls", async ({ page }) => {
    await page.goto("/en");
    const skills = page.getByRole("region", { name: "Skills" });
    await skills.scrollIntoViewIfNeeded();
    await expect(skills.locator("[data-motion]")).toHaveAttribute("data-motion", "rail");

    const typescript = skills.getByRole("listitem").filter({ hasText: "TypeScript" });
    const before = (await typescript.boundingBox())?.x ?? 0;

    await page.mouse.wheel(0, 900);
    await expect
      .poll(async () => (await typescript.boundingBox())?.x ?? before)
      .toBeLessThan(before - 200);
  });

  test("falls back to a plain list under reduced motion", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/en");
    const skills = page.getByRole("region", { name: "Skills" });

    await expect(skills.locator("[data-motion]")).toHaveAttribute("data-motion", "static");
    await expect(skills.getByRole("listitem").filter({ hasText: "TypeScript" })).toBeVisible();
  });
});
