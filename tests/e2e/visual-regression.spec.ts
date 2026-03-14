/**
 * Visual regression tests — screenshot baselines for key pages.
 *
 * Captures desktop (1280x720) and mobile (375x667) screenshots for each page
 * and compares against stored baselines using Playwright's toHaveScreenshot().
 *
 * First run creates baseline snapshots in tests/e2e/visual-regression.spec.ts-snapshots/.
 * Subsequent runs compare against baselines and fail on visual regressions.
 *
 * To update baselines after intentional UI changes:
 *   npx playwright test visual-regression --update-snapshots
 *
 * To run only visual regression tests:
 *   npx playwright test visual-regression
 */
import { test, expect, type Page } from "@playwright/test";

const SESSION_KEY = "lenovocompare-compare";
const MODEL_A = "t14-gen5-intel";
const MODEL_B = "t14s-gen5-amd";

const DESKTOP_VIEWPORT = { width: 1280, height: 720 };
const MOBILE_VIEWPORT = { width: 375, height: 667 };

/** Wait for page to be fully loaded and animations to settle. */
const waitForStable = async (page: Page, timeout = 15_000) => {
  // Wait for network idle and no pending animations
  await page.waitForLoadState("networkidle", { timeout });
  // Give CSS animations / framer-motion stagger time to complete
  await page.waitForTimeout(1000);
};

/** Wait for hydrated content (skeletons replaced with real cards). */
const waitForHydratedCards = async (page: Page) => {
  const cards = page.locator(".carbon-card:not(.animate-pulse)");
  await expect(cards.first()).toBeVisible({ timeout: 15_000 });
  await waitForStable(page);
};

// ── Desktop Screenshots ───────────────────────────────────────────────────────

test.describe("Visual regression — Desktop (1280x720)", () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize(DESKTOP_VIEWPORT);
  });

  test("home page grid", async ({ page }) => {
    await page.goto("/");
    await waitForHydratedCards(page);

    await expect(page).toHaveScreenshot("home-desktop.png", {
      maxDiffPixelRatio: 0.01,
      fullPage: false,
    });
  });

  test("model detail page", async ({ page }) => {
    await page.goto(`/model/${MODEL_A}`);
    await expect(page.locator("h1")).toBeVisible({ timeout: 15_000 });
    await waitForStable(page);

    await expect(page).toHaveScreenshot("model-detail-desktop.png", {
      maxDiffPixelRatio: 0.01,
      fullPage: false,
    });
  });

  test("compare page with 2 models", async ({ page }) => {
    await page.goto("/");
    await page.evaluate(([key, ids]) => sessionStorage.setItem(key, JSON.stringify(ids)), [
      SESSION_KEY,
      [MODEL_A, MODEL_B],
    ] as const);
    await page.goto("/compare");
    await expect(page.locator("svg").first()).toBeVisible({ timeout: 15_000 });
    await waitForStable(page);

    await expect(page).toHaveScreenshot("compare-desktop.png", {
      maxDiffPixelRatio: 0.01,
      fullPage: false,
    });
  });

  test("hardware page", async ({ page }) => {
    await page.goto("/hardware");
    await expect(page.locator("h1")).toBeVisible({ timeout: 15_000 });
    await waitForStable(page);

    await expect(page).toHaveScreenshot("hardware-desktop.png", {
      maxDiffPixelRatio: 0.01,
      fullPage: false,
    });
  });

  test("deals page", async ({ page }) => {
    await page.goto("/deals");
    await expect(page.locator("h1")).toBeVisible({ timeout: 15_000 });
    await waitForStable(page);

    await expect(page).toHaveScreenshot("deals-desktop.png", {
      maxDiffPixelRatio: 0.01,
      fullPage: false,
    });
  });
});

// ── Mobile Screenshots ────────────────────────────────────────────────────────

test.describe("Visual regression — Mobile (375x667)", () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize(MOBILE_VIEWPORT);
  });

  test("home page grid", async ({ page }) => {
    await page.goto("/");
    await waitForHydratedCards(page);

    await expect(page).toHaveScreenshot("home-mobile.png", {
      maxDiffPixelRatio: 0.01,
      fullPage: false,
    });
  });

  test("model detail page", async ({ page }) => {
    await page.goto(`/model/${MODEL_A}`);
    await expect(page.locator("h1")).toBeVisible({ timeout: 15_000 });
    await waitForStable(page);

    await expect(page).toHaveScreenshot("model-detail-mobile.png", {
      maxDiffPixelRatio: 0.01,
      fullPage: false,
    });
  });

  test("compare page with 2 models", async ({ page }) => {
    await page.goto("/");
    await page.evaluate(([key, ids]) => sessionStorage.setItem(key, JSON.stringify(ids)), [
      SESSION_KEY,
      [MODEL_A, MODEL_B],
    ] as const);
    await page.goto("/compare");
    await expect(page.locator("h1").filter({ hasText: /compare/i })).toBeVisible({ timeout: 15_000 });
    await waitForStable(page);

    await expect(page).toHaveScreenshot("compare-mobile.png", {
      maxDiffPixelRatio: 0.01,
      fullPage: false,
    });
  });

  test("hardware page", async ({ page }) => {
    await page.goto("/hardware");
    await expect(page.locator("h1")).toBeVisible({ timeout: 15_000 });
    await waitForStable(page);

    await expect(page).toHaveScreenshot("hardware-mobile.png", {
      maxDiffPixelRatio: 0.01,
      fullPage: false,
    });
  });

  test("deals page", async ({ page }) => {
    await page.goto("/deals");
    await expect(page.locator("h1")).toBeVisible({ timeout: 15_000 });
    await waitForStable(page);

    await expect(page).toHaveScreenshot("deals-mobile.png", {
      maxDiffPixelRatio: 0.01,
      fullPage: false,
    });
  });
});
