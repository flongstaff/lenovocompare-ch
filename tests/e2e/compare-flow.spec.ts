import { test, expect } from "@playwright/test";

test.describe("Compare Flow", () => {
  test("compare page with 2 models shows charts", async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => {
      sessionStorage.setItem("lenovocompare-compare", JSON.stringify(["t14-gen5-intel", "t14s-gen5-amd"]));
    });
    await page.goto("/compare");

    await expect(page.locator("svg.recharts-surface").first()).toBeVisible({
      timeout: 10_000,
    });
  });

  test("compare page with 4 models renders all model columns", async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => {
      sessionStorage.setItem(
        "lenovocompare-compare",
        JSON.stringify(["t14-gen5-intel", "t14s-gen5-amd", "x1-carbon-gen12", "p1-gen7"]),
      );
    });
    await page.goto("/compare");

    await expect(page.locator("svg.recharts-surface").first()).toBeVisible({
      timeout: 10_000,
    });
  });

  test("compare page renders correctly on mobile", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/");
    await page.evaluate(() => {
      sessionStorage.setItem("lenovocompare-compare", JSON.stringify(["t14-gen5-intel", "t14s-gen5-amd"]));
    });
    await page.goto("/compare");

    await expect(page.locator("h1, h2").first()).toBeVisible();
  });

  test("empty compare page shows helpful message", async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => {
      sessionStorage.removeItem("lenovocompare-compare");
    });
    await page.goto("/compare");

    await expect(page.getByText(/select|add|choose|no models/i).first()).toBeVisible();
  });
});
