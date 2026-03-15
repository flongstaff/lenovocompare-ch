/**
 * Shared utilities for the deal scanner.
 *
 * - fetchHTML(): rate-limited HTTP fetch with retry and honest User-Agent
 * - scoreLocally(): score a deal against market reference prices
 * - matchToModel(): fuzzy-match a listing title to a known laptopId
 * - isRelevant(): filter out accessories, docks, chargers
 * - MARKET_REFERENCE: per-lineup price reference table
 */

import { laptops } from "../../data/laptops";
import type { Laptop, Lineup } from "../../lib/types";

// ── ANSI colors ──────────────────────────────────────────────────────────────

export const C = {
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  green: "\x1b[32m",
  cyan: "\x1b[36m",
  dim: "\x1b[2m",
  bold: "\x1b[1m",
  reset: "\x1b[0m",
} as const;

// ── Rate limiting ────────────────────────────────────────────────────────────

const sleep = (ms: number): Promise<void> => new Promise((r) => setTimeout(r, ms));

let lastFetch = 0;

export async function fetchHTML(url: string, delayMs: number): Promise<string> {
  const now = Date.now();
  const elapsed = now - lastFetch;
  if (elapsed < delayMs) {
    await sleep(delayMs - elapsed);
  }
  lastFetch = Date.now();

  const res = await fetch(url, {
    headers: {
      "User-Agent": "LenovoCompare-CH/1.0 (price-monitor; https://github.com/flongstaff/lenovocompare-ch)",
      Accept: "text/html,application/xhtml+xml",
      "Accept-Language": "de-CH,de;q=0.9,en;q=0.5",
    },
  });

  if (!res.ok) {
    throw new Error(`HTTP ${res.status} for ${url}`);
  }

  return res.text();
}

export async function fetchWithRetry(url: string, delayMs: number, retries = 2): Promise<string> {
  for (let i = 0; i <= retries; i++) {
    try {
      return await fetchHTML(url, delayMs);
    } catch (err) {
      if (i === retries) throw err;
      console.error(`${C.dim}  Retry ${i + 1}/${retries} for ${url}${C.reset}`);
      await sleep(2000 * (i + 1));
    }
  }
  throw new Error("unreachable");
}

// ── Market reference prices (CHF) ───────────────────────────────────────────

export interface MarketRef {
  readonly model: string;
  readonly pattern: RegExp;
  readonly lineup: Lineup;
  readonly newPriceCHF: number;
  readonly fairUsedCHF: number;
}

export const MARKET_REFERENCE: readonly MarketRef[] = [
  // ThinkPad X1 (current gen — new retail prices)
  {
    model: "X1 Carbon Gen 12",
    pattern: /x1\s*carbon.*gen\s*1[23]/i,
    lineup: "ThinkPad",
    newPriceCHF: 2200,
    fairUsedCHF: 1400,
  },
  {
    model: "X1 Carbon Gen 11",
    pattern: /x1\s*carbon.*gen\s*11/i,
    lineup: "ThinkPad",
    newPriceCHF: 1900,
    fairUsedCHF: 1100,
  },
  {
    model: "X1 Carbon Gen 10",
    pattern: /x1\s*carbon.*gen\s*10/i,
    lineup: "ThinkPad",
    newPriceCHF: 1600,
    fairUsedCHF: 490,
  },
  {
    model: "X1 Carbon Gen 8-9",
    pattern: /x1\s*carbon.*gen\s*[89]/i,
    lineup: "ThinkPad",
    newPriceCHF: 1400,
    fairUsedCHF: 400,
  },
  {
    model: "X1 Carbon Gen 6-7",
    pattern: /x1\s*carbon.*gen\s*[67]/i,
    lineup: "ThinkPad",
    newPriceCHF: 1200,
    fairUsedCHF: 280,
  },
  {
    model: "X1 Yoga Gen 5+",
    pattern: /x1\s*yoga.*gen\s*[5-9]/i,
    lineup: "ThinkPad",
    newPriceCHF: 2400,
    fairUsedCHF: 460,
  },
  { model: "X1 Yoga Gen 4", pattern: /x1\s*yoga.*gen\s*4/i, lineup: "ThinkPad", newPriceCHF: 1800, fairUsedCHF: 360 },
  { model: "X1 Nano Gen 3", pattern: /x1\s*nano/i, lineup: "ThinkPad", newPriceCHF: 2000, fairUsedCHF: 1200 },
  // ThinkPad T (current gen)
  { model: "T14s Gen 6", pattern: /t14s.*gen\s*[56]/i, lineup: "ThinkPad", newPriceCHF: 1800, fairUsedCHF: 1100 },
  { model: "T14s Gen 3-4", pattern: /t14s.*gen\s*[34]/i, lineup: "ThinkPad", newPriceCHF: 1400, fairUsedCHF: 750 },
  {
    model: "T14s Gen 2",
    pattern: /t14s.*g2|t14s.*gen\s*2|t14s\s+itl/i,
    lineup: "ThinkPad",
    newPriceCHF: 1200,
    fairUsedCHF: 340,
  },
  { model: "T14 Gen 5", pattern: /t14\b.*gen\s*[45]/i, lineup: "ThinkPad", newPriceCHF: 1400, fairUsedCHF: 800 },
  { model: "T14 Gen 3", pattern: /t14\b.*gen\s*3/i, lineup: "ThinkPad", newPriceCHF: 1200, fairUsedCHF: 450 },
  { model: "T14 Gen 2", pattern: /t14\b.*gen\s*2/i, lineup: "ThinkPad", newPriceCHF: 1000, fairUsedCHF: 370 },
  { model: "T14 Gen 1", pattern: /t14\b.*gen\s*1/i, lineup: "ThinkPad", newPriceCHF: 900, fairUsedCHF: 320 },
  { model: "T16 Gen 3", pattern: /t16.*gen\s*[23]/i, lineup: "ThinkPad", newPriceCHF: 1500, fairUsedCHF: 850 },
  { model: "T15 Gen 1-2", pattern: /t15\b/i, lineup: "ThinkPad", newPriceCHF: 1100, fairUsedCHF: 340 },
  // ThinkPad T (older — used market only, Swiss 2026 prices)
  { model: "T490s", pattern: /t490s/i, lineup: "ThinkPad", newPriceCHF: 900, fairUsedCHF: 245 },
  { model: "T490", pattern: /t490\b/i, lineup: "ThinkPad", newPriceCHF: 900, fairUsedCHF: 270 },
  { model: "T480s", pattern: /t480s/i, lineup: "ThinkPad", newPriceCHF: 800, fairUsedCHF: 220 },
  { model: "T480", pattern: /t480\b/i, lineup: "ThinkPad", newPriceCHF: 800, fairUsedCHF: 180 },
  { model: "T580", pattern: /t580/i, lineup: "ThinkPad", newPriceCHF: 800, fairUsedCHF: 230 },
  { model: "T570", pattern: /t570/i, lineup: "ThinkPad", newPriceCHF: 700, fairUsedCHF: 170 },
  { model: "T470s", pattern: /t470s/i, lineup: "ThinkPad", newPriceCHF: 700, fairUsedCHF: 140 },
  { model: "T470", pattern: /t470\b/i, lineup: "ThinkPad", newPriceCHF: 700, fairUsedCHF: 120 },
  // ThinkPad X (older — used market only)
  { model: "X13 Gen 3", pattern: /x13.*gen\s*3/i, lineup: "ThinkPad", newPriceCHF: 1200, fairUsedCHF: 470 },
  { model: "X13 Gen 2", pattern: /x13.*gen\s*2/i, lineup: "ThinkPad", newPriceCHF: 1000, fairUsedCHF: 390 },
  {
    model: "X13 Gen 1",
    pattern: /x13.*gen\s*1|x13\s*yoga.*gen\s*1|x13\b(?!.*gen)/i,
    lineup: "ThinkPad",
    newPriceCHF: 900,
    fairUsedCHF: 320,
  },
  { model: "X390", pattern: /x390/i, lineup: "ThinkPad", newPriceCHF: 700, fairUsedCHF: 240 },
  { model: "X380", pattern: /x380/i, lineup: "ThinkPad", newPriceCHF: 700, fairUsedCHF: 230 },
  { model: "X280", pattern: /x280/i, lineup: "ThinkPad", newPriceCHF: 600, fairUsedCHF: 195 },
  // ThinkPad P
  { model: "P1 Gen 7", pattern: /p1.*gen\s*[67]/i, lineup: "ThinkPad", newPriceCHF: 3000, fairUsedCHF: 1800 },
  { model: "P14s Gen 5", pattern: /p14s.*gen\s*[45]/i, lineup: "ThinkPad", newPriceCHF: 1600, fairUsedCHF: 900 },
  { model: "P16s Gen 3", pattern: /p16s.*gen\s*[23]/i, lineup: "ThinkPad", newPriceCHF: 1500, fairUsedCHF: 900 },
  // ThinkPad L
  { model: "L14 Gen 5", pattern: /l14.*gen\s*[45]/i, lineup: "ThinkPad", newPriceCHF: 900, fairUsedCHF: 500 },
  { model: "L13 Yoga", pattern: /l13\s*yoga/i, lineup: "ThinkPad", newPriceCHF: 800, fairUsedCHF: 350 },
  { model: "L16 Gen 1", pattern: /l16/i, lineup: "ThinkPad", newPriceCHF: 1000, fairUsedCHF: 600 },
  // ThinkPad E
  { model: "E14 Gen 6", pattern: /e14.*gen\s*[56]/i, lineup: "ThinkPad", newPriceCHF: 800, fairUsedCHF: 450 },
  { model: "E16 Gen 2", pattern: /e16/i, lineup: "ThinkPad", newPriceCHF: 850, fairUsedCHF: 480 },
  // IdeaPad Pro
  {
    model: "IdeaPad Pro 5 16",
    pattern: /ideapad\s*pro\s*5.*16/i,
    lineup: "IdeaPad Pro",
    newPriceCHF: 1300,
    fairUsedCHF: 750,
  },
  {
    model: "IdeaPad Pro 5 14",
    pattern: /ideapad\s*pro\s*5.*14/i,
    lineup: "IdeaPad Pro",
    newPriceCHF: 1100,
    fairUsedCHF: 650,
  },
  {
    model: "IdeaPad Pro 5i",
    pattern: /ideapad\s*pro\s*5i/i,
    lineup: "IdeaPad Pro",
    newPriceCHF: 1200,
    fairUsedCHF: 700,
  },
  // Legion
  { model: "Legion Pro 7i", pattern: /legion\s*pro\s*7i/i, lineup: "Legion", newPriceCHF: 3200, fairUsedCHF: 2000 },
  { model: "Legion Pro 5i", pattern: /legion\s*pro\s*5i/i, lineup: "Legion", newPriceCHF: 2400, fairUsedCHF: 1500 },
  { model: "Legion 7i", pattern: /legion\s*7i/i, lineup: "Legion", newPriceCHF: 2800, fairUsedCHF: 1700 },
  { model: "Legion 5i", pattern: /legion\s*5i/i, lineup: "Legion", newPriceCHF: 1600, fairUsedCHF: 950 },
  { model: "Legion 5", pattern: /legion\s*5\b/i, lineup: "Legion", newPriceCHF: 1400, fairUsedCHF: 850 },
  { model: "Legion Slim 5", pattern: /legion\s*slim/i, lineup: "Legion", newPriceCHF: 1500, fairUsedCHF: 900 },
  // Yoga
  { model: "Yoga 9i", pattern: /yoga\s*9i?/i, lineup: "Yoga", newPriceCHF: 2200, fairUsedCHF: 1300 },
  { model: "Yoga 7", pattern: /yoga\s*7\b/i, lineup: "Yoga", newPriceCHF: 1200, fairUsedCHF: 700 },
  { model: "Yoga Slim 7", pattern: /yoga\s*slim\s*7/i, lineup: "Yoga", newPriceCHF: 1300, fairUsedCHF: 750 },
  { model: "Yoga 6", pattern: /yoga\s*6\b/i, lineup: "Yoga", newPriceCHF: 900, fairUsedCHF: 500 },
  { model: "Yoga Book 9i", pattern: /yoga\s*book/i, lineup: "Yoga", newPriceCHF: 2500, fairUsedCHF: 1500 },
];

// ── Listing type ─────────────────────────────────────────────────────────────

export interface ScannedListing {
  readonly title: string;
  readonly price: number;
  readonly url: string;
  readonly source: "ricardo";
  readonly condition?: string;
  readonly matchedModel?: string;
  readonly matchedLaptopId?: string;
  readonly score?: number;
  readonly scoreLabel?: string;
}

// ── Relevance filter ─────────────────────────────────────────────────────────

const IRRELEVANT_PATTERNS = [
  /dock(?:ing)?/i,
  /charger|adapter|netzteil/i,
  /tastatur|keyboard/i,
  /maus|mouse/i,
  /tasche|bag|case|hülle/i,
  /ersatzteil|spare\s*part/i,
  /akku|battery(?!\s*life)/i,
  /bildschirm|monitor|screen(?!\s*size)/i,
  /ram\s*\d+gb\s*(?:ddr|stick)/i,
  /ssd\s*\d+(?:gb|tb)\s*(?:nvme|m\.2)/i,
  /only\s*(?:charger|dock|battery)/i,
  /desktop|tower|ideacentre|thinkcentre/i,
];

export function isRelevant(title: string): boolean {
  return !IRRELEVANT_PATTERNS.some((p) => p.test(title));
}

// ── Model matching ───────────────────────────────────────────────────────────

const modelIndex: Array<{ id: string; name: string; lineup: Lineup; patterns: RegExp[] }> = laptops.map((l: Laptop) => {
  const patterns: RegExp[] = [];
  // Match full name loosely
  const escaped = l.name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  patterns.push(new RegExp(escaped, "i"));
  // Match model ID parts (e.g. "T14s Gen 5")
  const parts = l.id.split("-");
  if (parts.length >= 2) {
    const modelPart = parts.slice(0, -1).join("[\\s-]*");
    const genPart = parts[parts.length - 1];
    if (/^gen\d/.test(genPart)) {
      patterns.push(new RegExp(`${modelPart}.*${genPart.replace("gen", "gen\\s*")}`, "i"));
    }
  }
  return { id: l.id, name: l.name, lineup: l.lineup, patterns };
});

export function matchToModel(title: string): { laptopId: string; name: string; lineup: Lineup } | null {
  for (const entry of modelIndex) {
    for (const pattern of entry.patterns) {
      if (pattern.test(title)) {
        return { laptopId: entry.id, name: entry.name, lineup: entry.lineup };
      }
    }
  }
  return null;
}

// ── Deal scoring ─────────────────────────────────────────────────────────────

export interface DealScore {
  readonly score: number;
  readonly label: string;
  readonly reasoning: string;
}

export function scoreLocally(price: number, title: string): DealScore {
  // Find best matching market reference
  const ref = MARKET_REFERENCE.find((r) => r.pattern.test(title));
  if (!ref) {
    return { score: 50, label: "Unknown", reasoning: "No market reference found for this model" };
  }

  const savingsVsFair = ref.fairUsedCHF - price;
  const pctBelowFair = (savingsVsFair / ref.fairUsedCHF) * 100;
  const pctBelowNew = ((ref.newPriceCHF - price) / ref.newPriceCHF) * 100;

  if (price <= ref.fairUsedCHF * 0.6) {
    return {
      score: 95,
      label: "Incredible",
      reasoning: `CHF ${price} is ${Math.round(pctBelowFair)}% below fair used (CHF ${ref.fairUsedCHF}) — ${Math.round(pctBelowNew)}% off new`,
    };
  }
  if (price <= ref.fairUsedCHF * 0.75) {
    return {
      score: 85,
      label: "Great Deal",
      reasoning: `CHF ${price} is ${Math.round(pctBelowFair)}% below fair used (CHF ${ref.fairUsedCHF})`,
    };
  }
  if (price <= ref.fairUsedCHF * 0.9) {
    return {
      score: 70,
      label: "Good Price",
      reasoning: `CHF ${price} is ${Math.round(pctBelowFair)}% below fair used (CHF ${ref.fairUsedCHF})`,
    };
  }
  if (price <= ref.fairUsedCHF) {
    return {
      score: 55,
      label: "Fair",
      reasoning: `CHF ${price} is around fair used value (CHF ${ref.fairUsedCHF})`,
    };
  }
  return {
    score: 30,
    label: "Overpriced",
    reasoning: `CHF ${price} is above fair used value (CHF ${ref.fairUsedCHF}) — new is CHF ${ref.newPriceCHF}`,
  };
}

// ── Snapshot diffing (monitor mode) ──────────────────────────────────────────

import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import { join } from "path";

const SNAPSHOT_DIR = join(process.cwd(), "data", "price-snapshots");

export function ensureSnapshotDir(): void {
  if (!existsSync(SNAPSHOT_DIR)) {
    mkdirSync(SNAPSHOT_DIR, { recursive: true });
  }
}

export function loadSnapshot(source: string): Map<string, ScannedListing> {
  const file = join(SNAPSHOT_DIR, `${source}-latest.json`);
  if (!existsSync(file)) return new Map();

  try {
    const data: ScannedListing[] = JSON.parse(readFileSync(file, "utf-8"));
    return new Map(data.map((l) => [l.url, l]));
  } catch {
    return new Map();
  }
}

export function saveSnapshot(source: string, listings: readonly ScannedListing[]): void {
  ensureSnapshotDir();
  const file = join(SNAPSHOT_DIR, `${source}-latest.json`);
  writeFileSync(file, JSON.stringify(listings, null, 2));
}

export function diffListings(
  current: readonly ScannedListing[],
  previous: Map<string, ScannedListing>,
): { newListings: ScannedListing[]; priceChanges: Array<{ listing: ScannedListing; oldPrice: number }> } {
  const newListings: ScannedListing[] = [];
  const priceChanges: Array<{ listing: ScannedListing; oldPrice: number }> = [];

  for (const listing of current) {
    const prev = previous.get(listing.url);
    if (!prev) {
      newListings.push(listing);
    } else if (prev.price !== listing.price) {
      priceChanges.push({ listing, oldPrice: prev.price });
    }
  }

  return { newListings, priceChanges };
}
