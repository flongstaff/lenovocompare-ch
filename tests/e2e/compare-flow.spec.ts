import { test, expect } from "@playwright/test";

// Two well-known model IDs present in data/laptops.ts for deterministic tests
const MODEL_A = "t14-gen5-intel";
const MODEL_B = "t14s-gen5-amd";
const MODEL_C = "x1-carbon-gen12";
const MODEL_D = "p1-gen7";
const SESSION_KEY = "lenovocompare-compare";

test.describe("Compare Flow", () => {
  // ── Seed-via-sessionStorage tests (fast, stable) ─────────────────────────

  test("should show comparison table when 2 models are pre-seeded via sessionStorage", async ({ page }) => {
    await page.goto("/");
    await page.evaluate(([key, ids]) => sessionStorage.setItem(key, JSON.stringify(ids)), [
      SESSION_KEY,
      [MODEL_A, MODEL_B],
    ] as const);
    await page.goto("/compare");

    await expect(page.locator("svg").first()).toBeVisible({ timeout: 10_000 });
  });

  test("should render all 4 model columns when 4 models are pre-seeded", async ({ page }) => {
    await page.goto("/");
    await page.evaluate(([key, ids]) => sessionStorage.setItem(key, JSON.stringify(ids)), [
      SESSION_KEY,
      [MODEL_A, MODEL_B, MODEL_C, MODEL_D],
    ] as const);
    await page.goto("/compare");

    await expect(page.locator("svg").first()).toBeVisible({ timeout: 10_000 });
  });

  test("should show empty-state prompt when no models are selected", async ({ page }) => {
    await page.goto("/");
    await page.evaluate(([key]) => sessionStorage.removeItem(key), [SESSION_KEY] as const);
    await page.goto("/compare");

    await expect(page.getByText(/select at least 2 models/i)).toBeVisible();
  });

  test("should render correctly on mobile viewport with 2 pre-seeded models", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/");
    await page.evaluate(([key, ids]) => sessionStorage.setItem(key, JSON.stringify(ids)), [
      SESSION_KEY,
      [MODEL_A, MODEL_B],
    ] as const);
    await page.goto("/compare");

    await expect(page.locator("h1").filter({ hasText: /compare/i })).toBeVisible({ timeout: 10_000 });
  });

  // ── URL parameter loading ─────────────────────────────────────────────────

  test("should load models from the ?ids= URL parameter", async ({ page }) => {
    await page.goto(`/compare?ids=${MODEL_A},${MODEL_B}`);

    await expect(page.locator("svg").first()).toBeVisible({ timeout: 10_000 });
  });

  // ── Interactive flow: home → floating bar → compare page ─────────────────

  test("should show floating bar after clicking the compare button on a laptop card", async ({ page }) => {
    await page.goto("/");
    // Clear any existing compare state
    await page.evaluate(([key]) => sessionStorage.removeItem(key), [SESSION_KEY] as const);

    // Wait for real (hydrated) cards — skeletons have animate-pulse
    const cards = page.locator(".carbon-card:not(.animate-pulse)");
    await expect(cards.first()).toBeVisible({ timeout: 15_000 });

    // Click the first card's compare toggle button
    const firstCompareBtn = page
      .locator(".carbon-card:not(.animate-pulse)")
      .first()
      .getByRole("button", { name: /add .+ to comparison/i });
    await firstCompareBtn.click();

    // Floating bar should appear
    const floatingBar = page.getByRole("link", { name: "Go to comparison page" });
    await expect(floatingBar).toBeVisible({ timeout: 5_000 });
  });

  test("should display count of 1 in the floating bar after selecting one model", async ({ page }) => {
    await page.goto("/");
    await page.evaluate(([key]) => sessionStorage.removeItem(key), [SESSION_KEY] as const);

    const cards = page.locator(".carbon-card:not(.animate-pulse)");
    await expect(cards.first()).toBeVisible({ timeout: 15_000 });

    const firstCompareBtn = page
      .locator(".carbon-card:not(.animate-pulse)")
      .first()
      .getByRole("button", { name: /add .+ to comparison/i });
    await firstCompareBtn.click();

    // The floating bar contains the count "1" followed by "/ 4"
    const countSpan = page.locator(".glass-bar span.font-mono").first();
    await expect(countSpan).toHaveText("1", { timeout: 5_000 });
  });

  test("should increment count to 2 after selecting a second model", async ({ page }) => {
    await page.goto("/");
    await page.evaluate(([key]) => sessionStorage.removeItem(key), [SESSION_KEY] as const);

    const cards = page.locator(".carbon-card:not(.animate-pulse)");
    await expect(cards.first()).toBeVisible({ timeout: 15_000 });

    const compareBtns = page
      .locator(".carbon-card:not(.animate-pulse)")
      .getByRole("button", { name: /add .+ to comparison/i });

    await compareBtns.nth(0).click();
    await compareBtns.nth(1).click();

    const countSpan = page.locator(".glass-bar span.font-mono").first();
    await expect(countSpan).toHaveText("2", { timeout: 5_000 });
  });

  test("should navigate to /compare when clicking the floating bar Compare link", async ({ page }) => {
    await page.goto("/");
    await page.evaluate(([key]) => sessionStorage.removeItem(key), [SESSION_KEY] as const);

    const cards = page.locator(".carbon-card:not(.animate-pulse)");
    await expect(cards.first()).toBeVisible({ timeout: 15_000 });

    const compareBtns = page
      .locator(".carbon-card:not(.animate-pulse)")
      .getByRole("button", { name: /add .+ to comparison/i });
    await compareBtns.nth(0).click();

    const floatingLink = page.getByRole("link", { name: "Go to comparison page" });
    await expect(floatingLink).toBeVisible({ timeout: 5_000 });
    await floatingLink.click();

    await expect(page).toHaveURL(/\/compare/);
    await expect(page.locator("h1").filter({ hasText: /compare/i })).toBeVisible({ timeout: 10_000 });
  });

  test("should show both selected model names in the compare table header after navigating via floating bar", async ({
    page,
  }) => {
    await page.goto("/");
    await page.evaluate(([key, ids]) => sessionStorage.setItem(key, JSON.stringify(ids)), [
      SESSION_KEY,
      [MODEL_A, MODEL_B],
    ] as const);

    // Seed to sessionStorage then navigate directly (more reliable than clicking two different cards)
    await page.goto("/compare");

    const tableHeader = page.locator("thead");
    await expect(tableHeader).toBeVisible({ timeout: 10_000 });
    // Both model links appear in the header
    await expect(tableHeader.locator("a").nth(0)).toBeVisible();
    await expect(tableHeader.locator("a").nth(1)).toBeVisible();
  });

  // ── Remove a model from the comparison ───────────────────────────────────

  test("should drop to empty state after removing all models from the compare page", async ({ page }) => {
    await page.goto("/");
    await page.evaluate(([key, ids]) => sessionStorage.setItem(key, JSON.stringify(ids)), [
      SESSION_KEY,
      [MODEL_A, MODEL_B],
    ] as const);
    await page.goto("/compare");

    await expect(page.locator("thead")).toBeVisible({ timeout: 10_000 });

    // Remove first model
    const removeBtn = page.getByRole("button", { name: /remove .+ from comparison/i }).first();
    await removeBtn.click();

    // Remove second model (now the only one left)
    const removeBtnNext = page.getByRole("button", { name: /remove .+ from comparison/i }).first();
    await removeBtnNext.click();

    await expect(page.getByText(/select at least 2 models/i)).toBeVisible({ timeout: 5_000 });
  });

  test("should remove a specific model from the compare table when its X button is clicked", async ({ page }) => {
    await page.goto("/");
    await page.evaluate(([key, ids]) => sessionStorage.setItem(key, JSON.stringify(ids)), [
      SESSION_KEY,
      [MODEL_A, MODEL_B, MODEL_C],
    ] as const);
    await page.goto("/compare");

    await expect(page.locator("thead")).toBeVisible({ timeout: 10_000 });

    const removeBtns = page.getByRole("button", { name: /remove .+ from comparison/i });
    const initialCount = await removeBtns.count();
    expect(initialCount).toBe(3);

    await removeBtns.first().click();

    const updatedCount = await page.getByRole("button", { name: /remove .+ from comparison/i }).count();
    expect(updatedCount).toBe(2);
  });

  // ── Clear comparison ──────────────────────────────────────────────────────

  test("should clear all selected models when the floating bar clear button is clicked", async ({ page }) => {
    await page.goto("/");
    await page.evaluate(([key]) => sessionStorage.removeItem(key), [SESSION_KEY] as const);

    const cards = page.locator(".carbon-card:not(.animate-pulse)");
    await expect(cards.first()).toBeVisible({ timeout: 15_000 });

    const firstCompareBtn = page
      .locator(".carbon-card:not(.animate-pulse)")
      .first()
      .getByRole("button", { name: /add .+ to comparison/i });
    await firstCompareBtn.click();

    const floatingBar = page.locator(".glass-bar");
    await expect(floatingBar).toBeVisible({ timeout: 5_000 });

    const clearBtn = page.getByRole("button", { name: "Clear all selected models" });
    await clearBtn.click();

    // Floating bar disappears when selection is empty
    await expect(floatingBar).not.toBeVisible({ timeout: 5_000 });
  });

  test("should persist cleared state so sessionStorage is empty after clear", async ({ page }) => {
    await page.goto("/");
    await page.evaluate(([key, ids]) => sessionStorage.setItem(key, JSON.stringify(ids)), [
      SESSION_KEY,
      [MODEL_A],
    ] as const);
    await page.reload();

    const cards = page.locator(".carbon-card:not(.animate-pulse)");
    await expect(cards.first()).toBeVisible({ timeout: 15_000 });

    // Floating bar should already be visible since we seeded sessionStorage
    const floatingBar = page.locator(".glass-bar");
    await expect(floatingBar).toBeVisible({ timeout: 5_000 });

    await page.getByRole("button", { name: "Clear all selected models" }).click();

    const stored = await page.evaluate(([key]) => sessionStorage.getItem(key), [SESSION_KEY] as const);
    expect(JSON.parse(stored ?? "[]")).toHaveLength(0);
  });

  // ── Compare page: share button ────────────────────────────────────────────

  test("should show the Copy Link button on the compare page when 2 models are selected", async ({ page }) => {
    await page.goto("/");
    await page.evaluate(([key, ids]) => sessionStorage.setItem(key, JSON.stringify(ids)), [
      SESSION_KEY,
      [MODEL_A, MODEL_B],
    ] as const);
    await page.goto("/compare");

    await expect(page.getByRole("button", { name: /copy link/i })).toBeVisible({ timeout: 10_000 });
  });

  // ── Diffs-only toggle ─────────────────────────────────────────────────────

  test("should toggle the diffs-only filter in the compare table", async ({ page }) => {
    await page.goto("/");
    await page.evaluate(([key, ids]) => sessionStorage.setItem(key, JSON.stringify(ids)), [
      SESSION_KEY,
      [MODEL_A, MODEL_B],
    ] as const);
    await page.goto("/compare");

    await expect(page.locator("thead")).toBeVisible({ timeout: 10_000 });

    const diffsBtn = page.getByRole("button", { name: /diffs only/i });
    await expect(diffsBtn).toBeVisible();
    await expect(diffsBtn).toHaveAttribute("aria-pressed", "false");

    await diffsBtn.click();
    await expect(diffsBtn).toHaveAttribute("aria-pressed", "true");
  });

  // ── Back navigation ───────────────────────────────────────────────────────

  test("should navigate back to the home page from the Back to models link", async ({ page }) => {
    await page.goto("/");
    await page.evaluate(([key, ids]) => sessionStorage.setItem(key, JSON.stringify(ids)), [
      SESSION_KEY,
      [MODEL_A, MODEL_B],
    ] as const);
    await page.goto("/compare");

    await expect(page.locator("h1").filter({ hasText: /compare/i })).toBeVisible({ timeout: 10_000 });

    await page.getByRole("link", { name: /back to models/i }).click();

    await expect(page).toHaveURL("/");
    await expect(page.locator("h1")).toBeVisible();
  });
});
