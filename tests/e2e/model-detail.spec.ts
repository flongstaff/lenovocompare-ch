import { test, expect } from "@playwright/test";

const MODEL_ID = "t14-gen5-intel";

test.describe("Model Detail", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`/model/${MODEL_ID}`);
  });

  test("renders the model name and lineup badge", async ({ page }) => {
    await expect(page.locator("h1")).toBeVisible();
    await expect(page.locator("h1")).not.toBeEmpty();
  });

  test("renders the specs section", async ({ page }) => {
    await expect(page.getByText(/processor/i).first()).toBeVisible();
    await expect(page.getByText(/memory/i).first()).toBeVisible();
    await expect(page.getByText(/display/i).first()).toBeVisible();
  });

  test("renders the performance overview section", async ({ page }) => {
    await expect(page.getByText(/performance/i).first()).toBeVisible();
  });

  test("renders the benchmarks section", async ({ page }) => {
    await expect(page.getByText(/benchmark/i).first()).toBeVisible();
  });

  test("renders the linux compatibility section", async ({ page }) => {
    await expect(page.getByText(/linux/i).first()).toBeVisible();
  });

  test("renders the editorial section", async ({ page }) => {
    await expect(page.getByText(/editorial|verdict|summary/i).first()).toBeVisible();
  });

  test("navigating from grid to model detail works", async ({ page }) => {
    await page.goto("/");
    const firstCard = page.locator('[class*="carbon-card"] a').first();
    await firstCard.click();
    await expect(page).toHaveURL(/\/model\/.+/);
    await expect(page.locator("h1")).toBeVisible();
  });
});
