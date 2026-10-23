import { expect, test } from "@playwright/test";

/** Resolves once `read` returns the same value twice in a row, i.e. the thing has stopped moving. */
async function settle(read: () => Promise<number>) {
  let last = Number.NaN;
  await expect
    .poll(async () => {
      const current = await read();
      const still = current === last;
      last = current;
      return still;
    })
    .toBe(true);
  return last;
}

test.describe("skills rail", () => {
  test("slides from frame to frame as the page scrolls", async ({ page, isMobile }) => {
    test.skip(isMobile, "A phone stacks the frames instead of sliding them");
    await page.goto("/en");
    const skills = page.getByRole("region", { name: "Skills" });
    await expect(skills.locator("[data-motion]")).toHaveAttribute("data-motion", "rail");
    // Start at the top of the rail, where nothing has slid yet; centring it would land mid-way.
    await skills.evaluate((section) => section.scrollIntoView());

    const infrastructure = skills.getByRole("heading", { name: "Infrastructure" });
    const position = async () => (await infrastructure.boundingBox())?.x ?? 0;
    // The rail follows the scroll with a short delay, so wait until it has stopped moving.
    const before = await settle(position);

    // On a small screen each push moves the page one stop, and the first only clears the pause, so
    // keep pushing until the rail has slid rather than count on a fixed number under load.
    await expect
      .poll(
        async () => {
          await page.mouse.wheel(0, 2400);
          return settle(position);
        },
        { intervals: [250], timeout: 15_000 },
      )
      .toBeLessThan(before - 200);
  });

  test("jumps to a frame from the progress bar", async ({ page, isMobile }) => {
    test.skip(isMobile, "A phone stacks the frames instead of sliding them");
    await page.goto("/en");
    const skills = page.getByRole("region", { name: "Skills" });
    await skills.evaluate((section) => section.scrollIntoView());
    // Let the smooth scroll settle, as it would before a person reaches for the bar.
    await settle(() => page.evaluate(() => window.scrollY));

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

  test("stacks the frames on a phone, with no sideways movement", async ({ page, isMobile }) => {
    test.skip(!isMobile, "Only a phone stacks the frames while motion is on");
    await page.goto("/en");
    const skills = page.getByRole("region", { name: "Skills" });

    // The closing photo keeps its effect, so the stage is in its own mode, never the sliding rail.
    await expect(skills.locator("[data-motion]")).toHaveAttribute("data-motion", "finale");
    await expect(skills.getByRole("heading", { name: "Infrastructure" })).toBeAttached();
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - window.innerWidth,
    );
    expect(overflow).toBeLessThanOrEqual(0);
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
      "Between Geneva and the canton of Vaud",
    ]) {
      await expect(skills.getByRole("heading", { name })).toBeVisible();
    }
  });
});
