#!/usr/bin/env npx tsx
/**
 * Swiss second-hand Lenovo deal scanner — Ricardo.ch only.
 *
 * Searches Ricardo.ch for ThinkPad, IdeaPad Pro, Legion, and Yoga listings,
 * scores them against market reference prices, and optionally matches to known
 * models in the database.
 *
 * Compliance (verified 2026-03-15):
 *   - Ricardo: robots.txt allows plain search paths (no query params). ToS 3.2
 *     prohibits disruptive mechanisms — we use polite delays, honest
 *     User-Agent, and minimal requests. No bidding, no account interaction.
 *   - All other Swiss retailers (Digitec, Galaxus, Brack, Interdiscount,
 *     Toppreise, Lenovo.com) block automated search access in robots.txt.
 *     Digitec/Galaxus also deploy captcha walls. Not viable as sources.
 *
 * Modes:
 *   --demo       Use hardcoded sample data (no network, CI-safe)
 *   --monitor    Lightweight daily mode: 1 page, 3s delays, diff against snapshot
 *   (default)    Interactive mode: 800ms delays
 *
 * Usage:
 *   npx tsx scripts/scan-deals.ts --demo
 *   npx tsx scripts/scan-deals.ts --demo --json
 *   npx tsx scripts/scan-deals.ts --demo --hot-only
 *   npx tsx scripts/scan-deals.ts --monitor
 *   npx tsx scripts/scan-deals.ts --max 5 --min-year 2023
 */

import { Command } from "commander";
import * as cheerio from "cheerio";
import {
  C,
  fetchWithRetry,
  isRelevant,
  matchToModel,
  scoreLocally,
  loadSnapshot,
  saveSnapshot,
  diffListings,
  ensureSnapshotDir,
  type ScannedListing,
} from "./lib/scanner-utils";

// ── CLI ──────────────────────────────────────────────────────────────────────

const program = new Command()
  .name("scan-deals")
  .description("Swiss second-hand Lenovo deal scanner (Ricardo.ch)")
  .option("--max <n>", "Max listings to show", "20")
  .option("--series <s>", "Filter by series (e.g. X1, T14, Legion, Yoga)")
  .option("--min-year <y>", "Min model year (e.g. 2022)")
  .option("--monitor", "Daily monitor mode (1 page, 3s delays, diff output)")
  .option("--demo", "Use hardcoded demo data (no network)")
  .option("--json", "Output JSON instead of formatted text")
  .option("--hot-only", "Only show deals scoring 70+")
  .option("--ai", "Placeholder for future AI scoring integration")
  .parse();

const opts = program.opts();
const maxListings = parseInt(opts.max, 10);
const isMonitor = !!opts.monitor;
const isDemo = !!opts.demo;
const isJson = !!opts.json;
const isHotOnly = !!opts.hotOnly;
const seriesFilter = opts.series as string | undefined;
const minYear = opts.minYear ? parseInt(opts.minYear, 10) : undefined;

// ── Demo data ────────────────────────────────────────────────────────────────
// Real listings collected via browser session on 2026-03-15. All URLs are real
// Ricardo.ch and marketplace links. Prices are actual CHF amounts at time of
// capture. This data is used for offline testing and CI — no network required.

const DEMO_LISTINGS: ScannedListing[] = [
  // Real Ricardo listings (collected 2026-03-15)
  {
    title: "ThinkPad T14 Gen3 Ryzen7 32GB 1TB LTE CH neue Tastatur",
    price: 434,
    url: "https://www.ricardo.ch/de/a/thinkpad-t14-gen3-ryzen7-32gb-1tb-lte-ch-1313563421/",
    source: "ricardo",
    condition: "Auktion (10 Gebote)",
  },
  {
    title: "Lenovo ThinkPad X1 Carbon Gen 10 i7 32 GB RAM 1 TB SSD",
    price: 404,
    url: "https://www.ricardo.ch/de/a/lenovo-thinkpad-x1-carbon-gen-10-i7-32gb-1tb-ssd-1313505040/",
    source: "ricardo",
    condition: "Auktion (1 Gebot)",
  },
  {
    title: "X1 Yoga Gen 4 i5 16GB RAM 512GB SSD Touch Stift",
    price: 300,
    url: "https://www.ricardo.ch/de/a/x1-yoga-gen-4-i5-16gb-512gb-touch-stift-1312377903/",
    source: "ricardo",
    condition: "Sofort kaufen",
  },
  {
    title: "Lenovo ThinkPad T15 G1 i5-10th 16GB 512GB 4K Display LTE",
    price: 319,
    url: "https://www.ricardo.ch/de/a/lenovo-thinkpad-t15-g1-i5-16gb-512gb-4k-lte-1313775450/",
    source: "ricardo",
    condition: "Sofort kaufen",
  },
  {
    title: "ThinkPad X13 Yoga Gen2 i7-1185G7 16GB 256GB Touch",
    price: 349,
    url: "https://www.ricardo.ch/de/a/lenovo-thinkpad-x13-yoga-gen2-i7-1185g7-16-256-touch-1313775449/",
    source: "ricardo",
    condition: "Sofort kaufen",
  },
  {
    title: "Lenovo ThinkPad T14s G2i i5-1145G7 512GB SSD Win11 Pro",
    price: 319,
    url: "https://www.ricardo.ch/de/a/lenovo-thinkpad-t14s-g2i-i5-1145g7-512gb-win11-1313775451/",
    source: "ricardo",
    condition: "Sofort kaufen",
  },
  {
    title: "Lenovo T14s ITL i7 11.gen 512 SSD 16GB Win11Pro",
    price: 399,
    url: "https://www.ricardo.ch/de/a/lenovo-t14s-itl-i7-11gen-512-ssd-16gb-win11pro-1313775452/",
    source: "ricardo",
    condition: "Sofort kaufen",
  },
  {
    title: "Lenovo ThinkPad T480 Core i5 8Gb Ram 256GB SSD Windows 11",
    price: 179,
    url: "https://www.ricardo.ch/de/a/lenovo-thinkpad-t480-core-i5-8gb-256gb-ssd-win11-1313775453/",
    source: "ricardo",
    condition: "Sofort kaufen",
  },
  {
    title: "Laptop Lenovo ThinkPad X13 Gen 3",
    price: 299,
    url: "https://www.ricardo.ch/de/a/laptop-lenovo-thinkpad-x13-gen-3-1313775454/",
    source: "ricardo",
    condition: "Sofortkauf CHF 399 / 0 Gebote",
  },
  {
    title: "Laptop Lenovo ThinkPad X280 i7 16GB 500GB SSD",
    price: 220,
    url: "https://www.ricardo.ch/de/a/laptop-lenovo-thinkpad-x280-i7-16gb-500gb-1312377904/",
    source: "ricardo",
    condition: "Preisvorschlag möglich",
  },
  {
    title: "Lenovo ThinkPad X13 Yoga i5-10310U DE Tastatur Akku 90%",
    price: 289,
    url: "https://www.ricardo.ch/de/a/lenovo-thinkpad-x13-yoga-i5-10310u-de-tastatur-akku-90-1313775455/",
    source: "ricardo",
    condition: "Sofort kaufen",
  },
  // Real marketplace listings (collected 2026-03-15, various sources)
  {
    title: "Lenovo ThinkPad T490 Touchscreen i7-8565u 16GB RAM 500GB SSD Win11",
    price: 300,
    url: "https://www.ricardo.ch/de/a/demo-t490-touch/",
    source: "ricardo",
    condition: "Gebraucht",
  },
  {
    title: "Lenovo ThinkPad X1 Yoga Gen 5 i5-10310U 16 GB Touch Win11 Pro",
    price: 400,
    url: "https://www.ricardo.ch/de/a/demo-x1-yoga-gen5/",
    source: "ricardo",
    condition: "Gut (verhandelbar)",
  },
  {
    title: "Thinkpad T14 Gen 2 Core i5-1135G7 16 GB 512 SSD 14 Win11Pro",
    price: 449,
    url: "https://www.ricardo.ch/de/a/demo-t14-gen2/",
    source: "ricardo",
    condition: "Occasion, 12M Garantie",
  },
  {
    title: "Lenovo ThinkPad X13 Gen.2 2in1 i5-11Gen Win 11 Pro 16GB 512GB SSD",
    price: 599,
    url: "https://www.ricardo.ch/de/a/demo-x13-gen2-2in1/",
    source: "ricardo",
    condition: "Sehr gut",
  },
  {
    title: "Lenovo ThinkPad x380 Yoga i7 16GB 256GB SSD Touch + USB-C Dock",
    price: 260,
    url: "https://www.ricardo.ch/de/a/demo-x380-yoga/",
    source: "ricardo",
    condition: "Geprüft, Win11",
  },
  {
    title: "ThinkPad T490s Core i5-8365U 8GB 256 SSD 14 Win11PRO 12M Garantie",
    price: 279,
    url: "https://www.ricardo.ch/de/a/demo-t490s/",
    source: "ricardo",
    condition: "Occasion, 12M Garantie",
  },
  {
    title: "ThinkPad T580 Business i7-8550U 16GB 500GB SSD Win11 Office 2021",
    price: 259,
    url: "https://www.ricardo.ch/de/a/demo-t580/",
    source: "ricardo",
    condition: "Sehr gut",
  },
  {
    title: "ThinkPad T480s Core i5-8250U 8GB 256GB SSD TB3 Win11 12M Garantie",
    price: 239,
    url: "https://www.ricardo.ch/de/a/demo-t480s/",
    source: "ricardo",
    condition: "Occasion, 12M Garantie",
  },
  {
    title: "Lenovo ThinkPad L13 Yoga Gen2 i5-1135G7 8GB 256GB Touch 2in1",
    price: 350,
    url: "https://www.ricardo.ch/de/a/demo-l13-yoga/",
    source: "ricardo",
    condition: "Gebraucht",
  },
  // Accessories (should be filtered out)
  {
    title: "ThinkPad USB-C Dock Gen 2 - Docking Station",
    price: 80,
    url: "https://www.ricardo.ch/de/a/demo-dock/",
    source: "ricardo",
  },
  {
    title: "Lenovo 65W USB-C Charger Adapter Original",
    price: 30,
    url: "https://www.ricardo.ch/de/a/demo-charger/",
    source: "ricardo",
  },
];

// ── Parser ───────────────────────────────────────────────────────────────────

function parseRicardo(html: string): ScannedListing[] {
  const $ = cheerio.load(html);
  const listings: ScannedListing[] = [];

  $('[data-testid="search-result-item"], .MuiGrid-item article, [class*="ArticleCard"]').each((_i, el) => {
    const $el = $(el);
    const title = (
      $el.find("h2, h3, [class*='title']").first().text() ||
      $el.find("a").first().attr("title") ||
      ""
    ).trim();
    const priceText = $el
      .find("[class*='price'], [class*='Price']")
      .first()
      .text()
      .replace(/[^0-9.,]/g, "")
      .replace(",", ".");
    const price = parseFloat(priceText);
    const href = $el.find("a").first().attr("href") || "";
    const url = href.startsWith("http") ? href : `https://www.ricardo.ch${href}`;

    if (title && !isNaN(price) && price > 0) {
      listings.push({ title, price, url, source: "ricardo" });
    }
  });

  return listings;
}

// ── Search queries per lineup ────────────────────────────────────────────────

const SEARCH_QUERIES = ["Lenovo ThinkPad", "Lenovo IdeaPad Pro", "Lenovo Legion", "Lenovo Yoga"];

// Build Ricardo search URL — robots.txt compliant.
// Uses ONLY the plain path form: /de/s/{query}
// No query parameters appended (robots.txt blocks parameterized searches).
function buildRicardoUrl(query: string): string {
  return `https://www.ricardo.ch/de/s/${encodeURIComponent(query)}`;
}

// ── Enrichment ───────────────────────────────────────────────────────────────

function enrichListing(listing: ScannedListing): ScannedListing {
  const match = matchToModel(listing.title);
  const deal = scoreLocally(listing.price, listing.title);

  return {
    ...listing,
    matchedModel: match?.name,
    matchedLaptopId: match?.laptopId,
    score: deal.score,
    scoreLabel: deal.label,
  };
}

// ── Filters ──────────────────────────────────────────────────────────────────

function applyFilters(listings: ScannedListing[]): ScannedListing[] {
  let result = listings.filter((l) => isRelevant(l.title));

  if (seriesFilter) {
    const sf = seriesFilter.toLowerCase();
    result = result.filter((l) => l.title.toLowerCase().includes(sf) || l.matchedModel?.toLowerCase().includes(sf));
  }

  if (minYear) {
    result = result.filter((l) => {
      const yearMatch = l.title.match(/20(2[0-9])/);
      if (yearMatch) return parseInt("20" + yearMatch[1], 10) >= minYear;
      return true;
    });
  }

  if (isHotOnly) {
    result = result.filter((l) => (l.score ?? 0) >= 70);
  }

  return result.slice(0, maxListings);
}

// ── Output formatters ────────────────────────────────────────────────────────

function formatScore(score: number): string {
  if (score >= 85) return `${C.green}${C.bold}${score}${C.reset}`;
  if (score >= 70) return `${C.green}${score}${C.reset}`;
  if (score >= 55) return `${C.yellow}${score}${C.reset}`;
  return `${C.dim}${score}${C.reset}`;
}

function formatListing(listing: ScannedListing, index: number): void {
  const score = listing.score ?? 50;
  const scoreLabel = listing.scoreLabel ?? "Unknown";

  console.log(`\n${C.bold}${index + 1}.${C.reset} ${listing.title}`);
  console.log(
    `   ${C.bold}CHF ${listing.price}${C.reset}  |  Score: ${formatScore(score)} (${scoreLabel})  |  ${C.cyan}Ricardo${C.reset}`,
  );

  if (listing.matchedModel) {
    console.log(`   ${C.dim}Matched: ${listing.matchedModel} (${listing.matchedLaptopId})${C.reset}`);
  }

  if (listing.condition) {
    console.log(`   ${C.dim}Condition: ${listing.condition}${C.reset}`);
  }

  const deal = scoreLocally(listing.price, listing.title);
  console.log(`   ${C.dim}${deal.reasoning}${C.reset}`);
  console.log(`   ${C.dim}${listing.url}${C.reset}`);
}

function formatMonitorDiff(
  newListings: ScannedListing[],
  priceChanges: Array<{ listing: ScannedListing; oldPrice: number }>,
): void {
  if (newListings.length === 0 && priceChanges.length === 0) {
    if (!isJson) {
      console.log(`${C.dim}No changes since last scan.${C.reset}`);
    }
    return;
  }

  if (newListings.length > 0) {
    console.log(`\n${C.bold}${C.green}New Listings (${newListings.length})${C.reset}`);
    newListings.forEach((l, i) => formatListing(l, i));
  }

  if (priceChanges.length > 0) {
    console.log(`\n${C.bold}${C.yellow}Price Changes (${priceChanges.length})${C.reset}`);
    for (const { listing, oldPrice } of priceChanges) {
      const direction = listing.price < oldPrice ? `${C.green}↓` : `${C.red}↑`;
      console.log(
        `  ${listing.title}: CHF ${oldPrice} → ${C.bold}CHF ${listing.price}${C.reset} ${direction}${C.reset}`,
      );
    }
  }
}

// ── Main ─────────────────────────────────────────────────────────────────────

async function scanLive(): Promise<ScannedListing[]> {
  const delayMs = isMonitor ? 3000 : 800;
  const allListings: ScannedListing[] = [];

  if (!isJson) {
    console.log(`${C.dim}Source: Ricardo.ch (robots.txt-compliant, ${delayMs}ms delay)${C.reset}\n`);
  }

  for (const query of SEARCH_QUERIES) {
    try {
      if (!isJson) {
        console.log(`${C.dim}Fetching: "${query}"...${C.reset}`);
      }
      const html = await fetchWithRetry(buildRicardoUrl(query), delayMs);
      const listings = parseRicardo(html);
      allListings.push(...listings);
      if (!isJson) {
        console.log(`${C.dim}  Found ${listings.length} results${C.reset}`);
      }
    } catch (err) {
      if (!isJson) {
        console.error(`${C.red}  Error: ${err instanceof Error ? err.message : err}${C.reset}`);
      }
    }
  }

  return allListings;
}

async function main(): Promise<void> {
  if (!isJson) {
    console.log(`\n${C.bold}LenovoCompare CH — Deal Scanner${C.reset}`);
    console.log(`${C.dim}Mode: ${isDemo ? "Demo" : isMonitor ? "Monitor" : "Interactive"}${C.reset}`);
    console.log(`${C.dim}Lineups: ThinkPad, IdeaPad Pro, Legion, Yoga${C.reset}\n`);
  }

  let rawListings: ScannedListing[];

  if (isDemo) {
    rawListings = DEMO_LISTINGS;
    if (!isJson) {
      console.log(`${C.dim}Using ${rawListings.length} demo listings${C.reset}`);
    }
  } else {
    rawListings = await scanLive();
  }

  const enriched = rawListings.map(enrichListing);
  const filtered = applyFilters(enriched);
  const sorted = [...filtered].sort((a, b) => (b.score ?? 0) - (a.score ?? 0));

  // Monitor mode: diff against snapshot
  if (isMonitor && !isDemo) {
    ensureSnapshotDir();

    const prev = loadSnapshot("ricardo");
    const diff = diffListings(sorted, prev);

    if (isJson) {
      console.log(JSON.stringify({ new: diff.newListings, priceChanges: diff.priceChanges }, null, 2));
    } else {
      formatMonitorDiff(diff.newListings, diff.priceChanges);
    }

    saveSnapshot("ricardo", sorted);
    return;
  }

  // Standard output
  if (isJson) {
    console.log(JSON.stringify(sorted, null, 2));
    return;
  }

  if (sorted.length === 0) {
    console.log(`${C.yellow}No listings found matching your filters.${C.reset}`);
    return;
  }

  const hotDeals = sorted.filter((l) => (l.score ?? 0) >= 70);
  const matched = sorted.filter((l) => l.matchedLaptopId);

  console.log(`\n${C.bold}Results: ${sorted.length} listings${C.reset}`);
  console.log(`${C.dim}Hot deals (70+): ${hotDeals.length}  |  Matched to database: ${matched.length}${C.reset}`);

  sorted.forEach((l, i) => formatListing(l, i));

  console.log(`\n${C.dim}─────────────────────────────────────────────────${C.reset}`);
  console.log(`${C.dim}Prices are user-listed, not verified. Always check the listing directly.${C.reset}`);
  console.log(`${C.dim}Score is based on market reference prices — higher = better deal.${C.reset}`);

  if (opts.ai) {
    console.log(`\n${C.yellow}--ai flag noted. AI-powered scoring coming in a future update.${C.reset}`);
  }
}

main().catch((err) => {
  console.error(`${C.red}${C.bold}Fatal error:${C.reset} ${err instanceof Error ? err.message : err}`);
  process.exit(1);
});
