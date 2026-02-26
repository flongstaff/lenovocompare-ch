#!/usr/bin/env npx tsx
/**
 * Generate public/data/prices.json from seed-prices + community-submitted prices.
 *
 * Usage:
 *   npx tsx scripts/generate-prices-json.ts
 *
 * Sources (merged in order):
 *   1. data/seed-prices.ts           — hardcoded baseline prices
 *   2. data/community-prices.json    — prices submitted via GitHub Issues (if exists)
 *
 * Output:
 *   public/data/prices.json — flat array of SwissPrice objects, deduplicated by id
 *
 * The GitHub Action (update-prices.yml) runs this daily and commits changes.
 */
import { writeFileSync, readFileSync, existsSync } from "fs";
import { resolve } from "path";
import { seedPrices } from "../data/seed-prices";

const ROOT = resolve(__dirname, "..");
const COMMUNITY_PATH = resolve(ROOT, "data/community-prices.json");
const OUTPUT_PATH = resolve(ROOT, "public/data/prices.json");

interface PriceEntry {
  id: string;
  laptopId: string;
  retailer: string;
  price: number;
  url?: string;
  dateAdded: string;
  isUserAdded: boolean;
  priceType?: string;
  note?: string;
}

const isValidPrice = (item: unknown): item is PriceEntry => {
  if (typeof item !== "object" || item === null) return false;
  const obj = item as Record<string, unknown>;
  return (
    typeof obj.id === "string" &&
    typeof obj.laptopId === "string" &&
    typeof obj.retailer === "string" &&
    typeof obj.price === "number" &&
    obj.price > 0 &&
    obj.price <= 99999 &&
    typeof obj.dateAdded === "string" &&
    /^\d{4}-\d{2}-\d{2}$/.test(obj.dateAdded)
  );
};

// 1. Start with seed prices
const prices = new Map<string, PriceEntry>();
for (const sp of seedPrices) {
  prices.set(sp.id, { ...sp });
}

// 2. Merge community-submitted prices (if file exists)
if (existsSync(COMMUNITY_PATH)) {
  try {
    const raw = readFileSync(COMMUNITY_PATH, "utf-8");
    const community: unknown = JSON.parse(raw);
    if (Array.isArray(community)) {
      let added = 0;
      let skipped = 0;
      for (const entry of community) {
        if (isValidPrice(entry)) {
          prices.set(entry.id, entry);
          added++;
        } else {
          skipped++;
        }
      }
      console.log(`Community prices: ${added} added, ${skipped} skipped`);
    }
  } catch (err) {
    console.error("Warning: Failed to parse community-prices.json:", err);
  }
} else {
  console.log("No community-prices.json found — using seed prices only");
}

// 3. Sort by id for stable diffs
const sorted = Array.from(prices.values()).sort((a, b) => {
  // Sort sp-* first (by number), then community-*, then user-*
  const getOrder = (id: string): [number, number] => {
    if (id.startsWith("sp-")) return [0, parseInt(id.slice(3), 10)];
    if (id.startsWith("community-")) return [1, parseInt(id.slice(10), 10)];
    return [2, 0];
  };
  const [aGroup, aNum] = getOrder(a.id);
  const [bGroup, bNum] = getOrder(b.id);
  if (aGroup !== bGroup) return aGroup - bGroup;
  return aNum - bNum;
});

// 4. Write output
const output = {
  generated: new Date().toISOString(),
  count: sorted.length,
  prices: sorted,
};

writeFileSync(OUTPUT_PATH, JSON.stringify(output, null, 2) + "\n");
console.log(`Generated ${OUTPUT_PATH}: ${sorted.length} prices`);
