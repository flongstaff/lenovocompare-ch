import { chromium } from "playwright";
import * as fs from "fs";

async function debug() {
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({
    userAgent:
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  });
  const page = await ctx.newPage();

  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      console.log(`Attempt ${attempt}...`);
      await page.goto("https://psref.lenovo.com/Product/ThinkPad/ThinkPad_X1_Carbon_Gen_12?MT=21KC", {
        waitUntil: "domcontentloaded",
        timeout: 60000,
      });

      // Wait for any content to render
      await page.waitForTimeout(10000);

      let text = await page.evaluate(() => document.body?.innerText || "");
      console.log("Initial text length:", text.length);

      if (text.length < 100) {
        console.log("Page empty, retrying...");
        continue;
      }

      // Check if we already have specs (Models tab shows the spec table too)
      if (text.includes("Processor**") || text.includes("Core Ultra")) {
        console.log("Specs visible on initial load");
      } else if (text.includes("Specifications")) {
        // Click Specifications tab
        await page.click('span:has-text("Specifications")', { timeout: 5000 }).catch(() => {
          // Fallback: use evaluate
          return page.evaluate(() => {
            const spans = document.querySelectorAll("span");
            for (const span of spans) {
              if (span.textContent?.trim() === "Specifications") {
                (span as HTMLElement).click();
                return true;
              }
            }
            return false;
          });
        });
        console.log("Clicked Specifications");
        await page.waitForTimeout(8000);
        text = await page.evaluate(() => document.body?.innerText || "");
      }

      console.log("Final text length:", text.length);
      fs.writeFileSync("/tmp/psref-dump.txt", text);

      if (text.includes("Processor**")) {
        console.log("SUCCESS: Found spec content");

        // Extract section between markers
        const procStart = text.indexOf("Processor**");
        const graphicsStart = text.indexOf("Graphics\n", procStart);
        const memoryKeyword = text.indexOf("MEMORY\n");
        const storageKeyword = text.indexOf("STORAGE\n");
        // Processor section
        if (procStart >= 0) {
          const end = graphicsStart > procStart ? graphicsStart : procStart + 1500;
          console.log("\n=== PROCESSORS ===");
          console.log(text.substring(procStart, end));
        }

        // Memory section
        if (memoryKeyword >= 0) {
          const end = storageKeyword > memoryKeyword ? storageKeyword : memoryKeyword + 800;
          console.log("\n=== MEMORY ===");
          console.log(text.substring(memoryKeyword, end));
        }

        // Storage section
        if (storageKeyword >= 0) {
          const end = storageKeyword + 800;
          console.log("\n=== STORAGE ===");
          console.log(text.substring(storageKeyword, end));
        }

        // Display section - search for "Display**" or "Display Type"
        const displayStars = text.indexOf("Display**");
        const displayType = text.indexOf("Display Type");
        const displayStart = displayStars >= 0 ? displayStars : displayType;
        if (displayStart >= 0) {
          console.log("\n=== DISPLAY ===");
          console.log(text.substring(displayStart, displayStart + 800));
        }

        break;
      } else {
        console.log("No Processor** found.");
        console.log("Sample:", text.substring(0, 500));
      }
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      console.log("Attempt failed:", msg);
    }
  }

  await browser.close();
}
debug();
