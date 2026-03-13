import { test, expect } from "@playwright/test";

test.describe("Static export smoke tests", () => {
  test("home page loads with model cards", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("h1")).toBeVisible();
    // Wait for hydrated cards (skeletons have animate-pulse, real cards don't)
    const cards = page.locator(".carbon-card:not(.animate-pulse)");
    await expect(cards.first()).toBeVisible({ timeout: 15000 });
  });

  test("compare page renders without errors", async ({ page }) => {
    await page.goto("/compare");
    await expect(page.locator("h1")).toContainText(/Compare/i);
  });

  test("model detail page renders", async ({ page }) => {
    await page.goto("/model/x1-carbon-gen12");
    await expect(page.locator("h1")).toBeVisible();
  });

  test("pricing page renders", async ({ page }) => {
    await page.goto("/pricing");
    await expect(page.locator("h1")).toBeVisible();
  });

  test("deals page renders", async ({ page }) => {
    await page.goto("/deals");
    await expect(page.locator("h1")).toBeVisible();
  });
});
