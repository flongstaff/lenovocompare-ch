import { test, expect } from "@playwright/test";

test.describe("Pricing Flow", () => {
  test.beforeEach(async ({ page }) => {
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
    const modelSelect = page.locator('select[name*="model"], [class*="carbon-select"]').first();
    if (await modelSelect.isVisible()) {
      await modelSelect.selectOption({ index: 1 });
    }

    const priceInput = page.locator('input[type="number"], input[name*="price"], input[placeholder*="CHF"]').first();
    if (await priceInput.isVisible()) {
      await priceInput.fill("1299");
    }

    const submitBtn = page.locator('button[type="submit"], button:has-text("Add"), button:has-text("Save")').first();
    if (await submitBtn.isVisible()) {
      await submitBtn.click();
    }
  });

  test("price persists in localStorage after page reload", async ({ page }) => {
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

    await expect(page.getByText(/1.*299/)).toBeVisible({ timeout: 5_000 });
  });

  test("delete a price entry", async ({ page }) => {
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

    const deleteBtn = page
      .locator('button[aria-label*="delete" i], button[aria-label*="remove" i], button:has-text("Delete")')
      .first();
    if (await deleteBtn.isVisible()) {
      await deleteBtn.click();
    }

    const prices = await page.evaluate(() => JSON.parse(localStorage.getItem("lenovocompare-prices") || "[]"));
    expect(prices).toHaveLength(0);
  });
});
