#!/usr/bin/env tsx
/**
 * Merges seed prices (data/seed-prices.ts) + community prices (data/community-prices.json)
 * into a single public/data/prices.json for client-side fetching.
 *
 * Run: npx tsx scripts/generate-prices-json.ts
 * Wired into build via package.json "generate-prices" script.
 */
import fs from "fs";
import path from "path";
import { seedPrices } from "../data/seed-prices";

interface CommunityPrice {
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

const communityPath = path.resolve(__dirname, "../data/community-prices.json");
const outDir = path.resolve(__dirname, "../public/data");
const outPath = path.join(outDir, "prices.json");

const main = () => {
  let communityPrices: CommunityPrice[] = [];
  if (fs.existsSync(communityPath)) {
    try {
      const raw = fs.readFileSync(communityPath, "utf-8");
      communityPrices = JSON.parse(raw);
      console.log(`[generate-prices] Loaded ${communityPrices.length} community prices`);
    } catch (err) {
      console.error("[generate-prices] Failed to parse community-prices.json:", err);
      process.exit(1);
    }
  } else {
    console.log("[generate-prices] No community-prices.json found, using seed prices only");
  }

  // Deduplicate by id — community prices override seed prices with same id
  const byId = new Map<string, CommunityPrice>();
  for (const p of seedPrices) {
    byId.set(p.id, p as unknown as CommunityPrice);
  }
  for (const p of communityPrices) {
    byId.set(p.id, p);
  }

  const merged = Array.from(byId.values());
  merged.sort((a, b) => a.id.localeCompare(b.id, undefined, { numeric: true }));

  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  fs.writeFileSync(outPath, JSON.stringify(merged, null, 2) + "\n");
  console.log(`[generate-prices] Wrote ${merged.length} prices to ${outPath}`);
};

main();
