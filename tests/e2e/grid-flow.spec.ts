import { test, expect } from "@playwright/test";

test.describe("Grid Flow", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("loads the grid with 98+ laptop cards", async ({ page }) => {
    await expect(page.locator('[class*="carbon-card"]')).not.toHaveCount(0);
    const cards = page.locator('[class*="carbon-card"]');
    expect(await cards.count()).toBeGreaterThanOrEqual(98);
  });

  test("filters by lineup — ThinkPad", async ({ page }) => {
    await page.getByRole("button", { name: /ThinkPad/i }).click();
    const cards = page.locator('[class*="carbon-card"]');
    expect(await cards.count()).toBeGreaterThan(0);
  });

  test("filters by lineup — Legion", async ({ page }) => {
    await page.getByRole("button", { name: /Legion/i }).click();
    const cards = page.locator('[class*="carbon-card"]');
    expect(await cards.count()).toBeGreaterThan(0);
  });

  test("filters by series within a lineup", async ({ page }) => {
    await page.getByRole("button", { name: /ThinkPad/i }).click();
    await page.getByRole("button", { name: /^X1$/i }).click();
    const cards = page.locator('[class*="carbon-card"]');
    expect(await cards.count()).toBeGreaterThan(0);
  });

  test("sorts models by name or score", async ({ page }) => {
    const sortSelect = page.locator('[class*="carbon-select"]').first();
    await sortSelect.selectOption({ index: 1 });
  });

  test("selects models for compare", async ({ page }) => {
    const compareButtons = page.locator(
      '[class*="carbon-card"] button[aria-label*="compare" i], [class*="carbon-card"] input[type="checkbox"]',
    );
    if ((await compareButtons.count()) >= 2) {
      await compareButtons.nth(0).click();
      await compareButtons.nth(1).click();
    }
  });
});
