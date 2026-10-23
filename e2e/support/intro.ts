import { expect, type Page } from "@playwright/test";

/**
 * Waits until the first-visit loader has parted and removed itself. The loader is in the server
 * HTML and the page is inert behind it, so a test that clicks or tabs before this point is typing
 * into an inert page, and an attribute check made before hydration passes for the wrong reason.
 */
export async function waitForIntro(page: Page) {
  await expect(page.locator("[data-intro-loader]")).toHaveCount(0, { timeout: 20_000 });
}
