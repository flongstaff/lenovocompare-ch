---
name: e2e-scaffold
description: Generate Playwright E2E test stubs for key user flows (grid, model detail, compare, pricing)
---

# E2E Scaffold Skill

Generate Playwright E2E test stubs for key user flows in the LenovoCompare CH Next.js app running on `localhost:3000`.

## Setup

1. Create the test directory:

```bash
mkdir -p tests/e2e
```

2. Create `playwright.config.ts` in the project root if it does not already exist:

```ts
import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: "html",
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "mobile-chrome",
      use: { ...devices["Pixel 5"] },
    },
  ],
  webServer: {
    command: "npm run dev",
    url: "http://localhost:3000",
    reuseExistingServer: true,
    timeout: 30_000,
  },
});
```

## Test File Stubs

Generate the following four files in `tests/e2e/`.

### 1. `tests/e2e/grid-flow.spec.ts`

Covers the home page grid: loading, lineup filtering, series filtering, sorting, and selecting models for compare.

```ts
import { test, expect } from "@playwright/test";

test.describe("Grid Flow", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("loads the grid with 98+ laptop cards", async ({ page }) => {
    // Wait for skeleton loading to finish
    await expect(page.locator('[class*="carbon-card"]')).not.toHaveCount(0);
    const cards = page.locator('[class*="carbon-card"]');
    expect(await cards.count()).toBeGreaterThanOrEqual(98);
  });

  test("filters by lineup — ThinkPad", async ({ page }) => {
    // Click the ThinkPad lineup filter pill
    await page.getByRole("button", { name: /ThinkPad/i }).click();
    const cards = page.locator('[class*="carbon-card"]');
    expect(await cards.count()).toBeGreaterThan(0);
    // All visible cards should belong to ThinkPad lineup
    // (verify via card content or data attribute)
  });

  test("filters by lineup — Legion", async ({ page }) => {
    await page.getByRole("button", { name: /Legion/i }).click();
    const cards = page.locator('[class*="carbon-card"]');
    expect(await cards.count()).toBeGreaterThan(0);
  });

  test("filters by series within a lineup", async ({ page }) => {
    // Select ThinkPad lineup first, then X1 series
    await page.getByRole("button", { name: /ThinkPad/i }).click();
    await page.getByRole("button", { name: /^X1$/i }).click();
    const cards = page.locator('[class*="carbon-card"]');
    expect(await cards.count()).toBeGreaterThan(0);
  });

  test("sorts models by name or score", async ({ page }) => {
    // Open sort dropdown and select an option
    const sortSelect = page.locator('[class*="carbon-select"]').first();
    await sortSelect.selectOption({ index: 1 });
    // Verify cards are reordered (check first card changed)
  });

  test("selects models for compare", async ({ page }) => {
    // Click compare checkbox/button on first two cards
    const compareButtons = page.locator(
      '[class*="carbon-card"] button[aria-label*="compare" i], [class*="carbon-card"] input[type="checkbox"]',
    );
    if ((await compareButtons.count()) >= 2) {
      await compareButtons.nth(0).click();
      await compareButtons.nth(1).click();
    }
    // Verify compare bar or indicator appears
  });
});
```

### 2. `tests/e2e/model-detail.spec.ts`

Covers navigating to a model detail page and verifying all major sections render.

```ts
import { test, expect } from "@playwright/test";

// Use a known model ID that exists in the dataset
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
    // Performance radar chart or score cards
    await expect(page.getByText(/performance/i).first()).toBeVisible();
  });

  test("renders the benchmarks section", async ({ page }) => {
    await expect(page.getByText(/benchmark/i).first()).toBeVisible();
  });

  test("renders the gaming section if applicable", async ({ page }) => {
    // Gaming section may not appear on all models; check conditionally
    const gamingSection = page.getByText(/gaming/i).first();
    // Just verify the page loaded fully without errors
    await expect(page.locator("h1")).toBeVisible();
  });

  test("renders the linux compatibility section", async ({ page }) => {
    await expect(page.getByText(/linux/i).first()).toBeVisible();
  });

  test("renders the editorial section", async ({ page }) => {
    await expect(page.getByText(/editorial|verdict|summary/i).first()).toBeVisible();
  });

  test("navigating from grid to model detail works", async ({ page }) => {
    await page.goto("/");
    // Click the first card link/title
    const firstCard = page.locator('[class*="carbon-card"] a').first();
    await firstCard.click();
    await expect(page).toHaveURL(/\/model\/.+/);
    await expect(page.locator("h1")).toBeVisible();
  });
});
```

### 3. `tests/e2e/compare-flow.spec.ts`

Covers adding 2-4 models for comparison and verifying charts render on desktop and mobile.

```ts
import { test, expect } from "@playwright/test";

test.describe("Compare Flow", () => {
  test("compare page with 2 models shows charts", async ({ page }) => {
    // Seed compare state via localStorage before navigating
    await page.goto("/");
    await page.evaluate(() => {
      localStorage.setItem("lenovocompare-compare", JSON.stringify(["t14-gen5-intel", "t14s-gen5-amd"]));
    });
    await page.goto("/compare");

    // Verify at least one chart renders (SVG from recharts)
    await expect(page.locator("svg.recharts-surface").first()).toBeVisible({
      timeout: 10_000,
    });
  });

  test("compare page with 4 models renders all model columns", async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => {
      localStorage.setItem(
        "lenovocompare-compare",
        JSON.stringify(["t14-gen5-intel", "t14s-gen5-amd", "x1-carbon-gen12", "p1-gen7"]),
      );
    });
    await page.goto("/compare");

    // Verify all 4 model names appear
    await expect(page.locator("svg.recharts-surface").first()).toBeVisible({
      timeout: 10_000,
    });
  });

  test("compare page renders correctly on mobile", async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/");
    await page.evaluate(() => {
      localStorage.setItem("lenovocompare-compare", JSON.stringify(["t14-gen5-intel", "t14s-gen5-amd"]));
    });
    await page.goto("/compare");

    // Mobile uses swipeable card view (MobileCompareCards)
    await expect(page.locator("h1, h2").first()).toBeVisible();
  });

  test("empty compare page shows helpful message", async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => {
      localStorage.removeItem("lenovocompare-compare");
    });
    await page.goto("/compare");

    // Should show a prompt to select models
    await expect(page.getByText(/select|add|choose|no models/i).first()).toBeVisible();
  });
});
```

### 4. `tests/e2e/pricing-flow.spec.ts`

Covers adding a price, verifying localStorage persistence, and deleting a price.

```ts
import { test, expect } from "@playwright/test";

test.describe("Pricing Flow", () => {
  test.beforeEach(async ({ page }) => {
    // Clear pricing localStorage before each test
    await page.goto("/");
    await page.evaluate(() => {
      localStorage.removeItem("lenovocompare-prices");
    });
    await page.goto("/pricing");
  });

  test("pricing page loads", async ({ page }) => {
    await expect(page.locator("h1, h2").first()).toBeVisible();
  });

  test("add a new price entry", async ({ page }) => {
    // Fill in model selector, price, and retailer
    // (Adjust selectors based on actual form structure)
    const modelSelect = page.locator('select[name*="model"], [class*="carbon-select"]').first();
    if (await modelSelect.isVisible()) {
      await modelSelect.selectOption({ index: 1 });
    }

    const priceInput = page.locator('input[type="number"], input[name*="price"], input[placeholder*="CHF"]').first();
    if (await priceInput.isVisible()) {
      await priceInput.fill("1299");
    }

    // Submit the form
    const submitBtn = page.locator('button[type="submit"], button:has-text("Add"), button:has-text("Save")').first();
    if (await submitBtn.isVisible()) {
      await submitBtn.click();
    }

    // Verify the price appears in the list
  });

  test("price persists in localStorage after page reload", async ({ page }) => {
    // Seed a price directly
    await page.evaluate(() => {
      localStorage.setItem(
        "lenovocompare-prices",
        JSON.stringify([
          {
            id: "test-1",
            laptopId: "t14-gen5-intel",
            price: 1299,
            currency: "CHF",
            retailer: "digitec.ch",
            date: new Date().toISOString(),
          },
        ]),
      );
    });
    await page.reload();

    // Verify the price is still displayed
    await expect(page.getByText(/1.*299/)).toBeVisible({ timeout: 5_000 });
  });

  test("delete a price entry", async ({ page }) => {
    // Seed a price
    await page.evaluate(() => {
      localStorage.setItem(
        "lenovocompare-prices",
        JSON.stringify([
          {
            id: "test-del",
            laptopId: "t14-gen5-intel",
            price: 999,
            currency: "CHF",
            retailer: "brack.ch",
            date: new Date().toISOString(),
          },
        ]),
      );
    });
    await page.reload();

    // Find and click delete button
    const deleteBtn = page
      .locator('button[aria-label*="delete" i], button[aria-label*="remove" i], button:has-text("Delete")')
      .first();
    if (await deleteBtn.isVisible()) {
      await deleteBtn.click();
    }

    // Verify localStorage is cleared
    const prices = await page.evaluate(() => JSON.parse(localStorage.getItem("lenovocompare-prices") || "[]"));
    expect(prices).toHaveLength(0);
  });
});
```

## Notes

- **Playwright MCP** is available via Docker for visual testing and screenshot comparisons. Use the `mcr.microsoft.com/playwright/mcp` image configured in `.mcp.json`.
- **Model IDs** used in tests should reference real entries from `data/laptops.ts` (e.g., `t14-gen5-intel`, `t14s-gen5-amd`, `x1-carbon-gen12`, `p1-gen7`). Verify IDs exist before running tests.
- **localStorage keys** follow the `lenovocompare-*` convention (migrated from `thinkcompare-*`).
- **recharts SVGs** use class `recharts-surface` — use this to verify charts rendered.
- **Mobile viewport**: 375x812 triggers the mobile compare view (`MobileCompareCards`).
- **MAX_COMPARE = 4** — do not exceed 4 models in compare tests.
- Selectors may need adjustment as the UI evolves. Prefer `aria-label`, `role`, and text-based selectors over fragile CSS class selectors.
- Run E2E tests with `npx playwright test` after the dev server is running (the config starts it automatically via `webServer`).
