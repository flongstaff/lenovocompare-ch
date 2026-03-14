#!/usr/bin/env npx tsx
/**
 * Patches psrefUrl values in data/laptops.ts using discovered URLs from psref-data.json.
 *
 * After running scrape-psref.ts (which discovers correct URLs via search fallback),
 * this script reads the results and updates laptops.ts with the corrected URLs.
 *
 * Usage:
 *   npx tsx scripts/fix-psref-urls.ts            # Dry run (default)
 *   npx tsx scripts/fix-psref-urls.ts --apply     # Actually patch the file
 */
import * as fs from "fs";
import * as path from "path";

const SCRAPE_DATA_PATH = path.join(__dirname, "psref-data.json");
const LAPTOPS_PATH = path.join(__dirname, "..", "data", "laptops.ts");

const BOLD = "\x1b[1m";
const GREEN = "\x1b[32m";
const YELLOW = "\x1b[33m";
const CYAN = "\x1b[36m";
const DIM = "\x1b[2m";
const RESET = "\x1b[0m";

const apply = process.argv.includes("--apply");

interface ScrapedModel {
  id: string;
  name: string;
  psrefUrl: string;
  originalUrl?: string;
  error?: string;
  warnings: string[];
}

interface ScrapeResult {
  models: Record<string, ScrapedModel>;
}

const main = () => {
  console.log(`\n${BOLD}PSREF URL Fixer${RESET}\n`);

  if (!fs.existsSync(SCRAPE_DATA_PATH)) {
    console.error("No psref-data.json found. Run scrape-psref.ts first.");
    process.exit(1);
  }

  const data = JSON.parse(fs.readFileSync(SCRAPE_DATA_PATH, "utf-8")) as ScrapeResult;
  let laptopsSource = fs.readFileSync(LAPTOPS_PATH, "utf-8");

  // Find models where psrefUrl differs from originalUrl (URL was corrected during scrape)
  const patches: Array<{ id: string; name: string; oldUrl: string; newUrl: string }> = [];

  for (const model of Object.values(data.models)) {
    if (model.error) continue;
    if (!model.originalUrl || !model.psrefUrl) continue;
    if (model.psrefUrl === model.originalUrl) continue;

    // Verify the old URL exists in laptops.ts
    if (!laptopsSource.includes(model.originalUrl)) {
      console.log(`${YELLOW}⚠${RESET} ${model.id}: old URL not found in laptops.ts, skipping`);
      continue;
    }

    patches.push({
      id: model.id,
      name: model.name,
      oldUrl: model.originalUrl,
      newUrl: model.psrefUrl,
    });
  }

  // Also normalize any remaining Lenovo_ prefix URLs that weren't scraped
  const lenovoPrefixRegex =
    /psrefUrl:\s*"(https:\/\/psref\.lenovo\.com\/Product\/(ThinkPad|IdeaPad|Legion)\/Lenovo_(ThinkPad|IdeaPad|Legion)[^"]+)"/g;
  let match;
  while ((match = lenovoPrefixRegex.exec(laptopsSource)) !== null) {
    const oldUrl = match[1];
    const newUrl = oldUrl.replace(
      /\/Product\/(ThinkPad|IdeaPad|Legion)\/Lenovo_(ThinkPad|IdeaPad|Legion)/,
      "/Product/$1/$2",
    );

    // Skip if already in patches list
    if (patches.some((p) => p.oldUrl === oldUrl)) continue;

    patches.push({
      id: `(regex-normalized)`,
      name: oldUrl.split("/").pop() || "",
      oldUrl,
      newUrl,
    });
  }

  if (patches.length === 0) {
    console.log(`${GREEN}No URL patches needed.${RESET}`);
    return;
  }

  console.log(`${CYAN}Found ${patches.length} URL(s) to patch:${RESET}\n`);

  for (const patch of patches) {
    console.log(`  ${patch.id}`);
    console.log(`    ${DIM}old: ${patch.oldUrl}${RESET}`);
    console.log(`    ${GREEN}new: ${patch.newUrl}${RESET}`);
    console.log();
  }

  if (!apply) {
    console.log(`${YELLOW}Dry run — use --apply to patch laptops.ts${RESET}\n`);
    return;
  }

  // Apply patches
  let patchCount = 0;
  for (const patch of patches) {
    if (laptopsSource.includes(patch.oldUrl)) {
      laptopsSource = laptopsSource.replace(patch.oldUrl, patch.newUrl);
      patchCount++;
    }
  }

  fs.writeFileSync(LAPTOPS_PATH, laptopsSource);
  console.log(`${GREEN}Patched ${patchCount} URL(s) in data/laptops.ts${RESET}\n`);
};

main();
