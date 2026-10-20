import { expect, test } from "@playwright/test";

test.describe("skills rail", () => {
  test("slides from frame to frame as the page scrolls", async ({ page }) => {
    await page.goto("/en");
    const skills = page.getByRole("region", { name: "Skills" });
    await expect(skills.locator("[data-motion]")).toHaveAttribute("data-motion", "rail");
    // Start at the top of the rail, where nothing has slid yet; centring it would land mid-way.
    await skills.evaluate((section) => section.scrollIntoView());

    const infrastructure = skills.getByRole("heading", { name: "Infrastructure" });
    const position = async () => (await infrastructure.boundingBox())?.x ?? 0;
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

    // On a small screen each push moves the page one stop, and the first only clears the pause.
    for (let push = 0; push < 2; push += 1) {
      await page.mouse.wheel(0, 2400);
      await page.waitForTimeout(1200);
    }
    await expect.poll(position).toBeLessThan(before - 200);
  });

  test("jumps to a frame from the progress bar", async ({ page }) => {
    await page.goto("/en");
    const skills = page.getByRole("region", { name: "Skills" });
    await skills.evaluate((section) => section.scrollIntoView());
    // Let the smooth scroll settle, as it would before a person reaches for the bar.
    await page.waitForTimeout(1000);

    await skills
      .getByRole("navigation", { name: "Parts of the section" })
      .getByRole("button", { name: /Delivery/ })
      .dispatchEvent("click");

    // The frame is centred once its own heading is on screen and the previous one has left it.
    const heading = skills.getByRole("heading", { name: "Delivery" });
    const previous = skills.getByRole("heading", { name: "Infrastructure" });
    const width = page.viewportSize()?.width ?? 0;
    await expect
      .poll(async () => {
        const x = (await heading.boundingBox())?.x ?? -1;
        const left = (await previous.boundingBox())?.x ?? 0;
        return x >= 0 && x < width && left < 0;
      })
      .toBe(true);
  });

  test("shows every frame stacked under reduced motion", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/en");
    const skills = page.getByRole("region", { name: "Skills" });

    await expect(skills.locator("[data-motion]")).toHaveAttribute("data-motion", "static");
    for (const name of [
      "Engineering",
      "Infrastructure",
      "Delivery",
      "Collaboration",
      "Certifications",
      "Between Lavaux and Lake Geneva",
    ]) {
      await expect(skills.getByRole("heading", { name })).toBeVisible();
    }
  });
});
