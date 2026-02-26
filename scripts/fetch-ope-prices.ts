#!/usr/bin/env npx tsx
/**
 * Fetch Lenovo laptop prices from the Open Price Engine API.
 *
 * The Open Price Engine (openpricengine.com) tracks electronics prices from
 * Swiss retailers including Interdiscount and Revendo. This script queries
 * their API and appends matching Lenovo laptop prices to community-prices.json.
 *
 * Prerequisites:
 *   1. Register for an API key: POST https://openpricengine.com/auth/new?email=YOU&api_key_name=lenovocompare
 *   2. Check your email for the API key from openpricengine@gmail.com
 *   3. Set the env var: export OPE_API_KEY=your_key_here
 *
 * NOTE: Electronics data requires at minimum the mid-tier plan (~$22/4 months).
 * The free plan only covers restaurant data. Verify coverage before purchasing.
 *
 * Usage:
 *   OPE_API_KEY=xxx npx tsx scripts/fetch-ope-prices.ts
 *   OPE_API_KEY=xxx npx tsx scripts/fetch-ope-prices.ts --dry-run
 *
 * After running, regenerate prices.json:
 *   npx tsx scripts/generate-prices-json.ts
 */
import { readFileSync, writeFileSync, existsSync } from "fs";
import { resolve } from "path";

const ROOT = resolve(__dirname, "..");
const COMMUNITY_PATH = resolve(ROOT, "data/community-prices.json");
const LAPTOPS_PATH = resolve(ROOT, "data/laptops.ts");

const API_BASE = "https://openpricengine.com/api/v1";
const API_KEY = process.env.OPE_API_KEY;

/** Swiss stores tracked by Open Price Engine */
const OPE_STORES = ["Interdiscount", "Revendo"] as const;

/** Map OPE store names to our retailer names (in constants.ts RETAILERS) */
const STORE_TO_RETAILER: Record<string, string> = {
  Interdiscount: "Interdiscount",
  Revendo: "Revendo",
};

interface OpeProduct {
  product_name?: string;
  name?: string;
  category?: string;
  price?: number;
  date?: string;
  store?: string;
  currency?: string;
}

interface CommunityPrice {
  id: string;
  laptopId: string;
  retailer: string;
  price: number;
  dateAdded: string;
  isUserAdded: boolean;
  priceType: string;
  note?: string;
}

// ── Helpers ──────────────────────────────────────────────────────────────

function loadLaptopIds(): string[] {
  const content = readFileSync(LAPTOPS_PATH, "utf-8");
  const ids: string[] = [];
  for (const match of content.matchAll(/id:\s*"([^"]+)"/g)) {
    ids.push(match[1]);
  }
  return ids;
}

function loadCommunityPrices(): CommunityPrice[] {
  if (!existsSync(COMMUNITY_PATH)) return [];
  try {
    const raw = readFileSync(COMMUNITY_PATH, "utf-8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function getNextCommunityId(existing: CommunityPrice[]): number {
  let max = 0;
  for (const p of existing) {
    const match = p.id.match(/^community-(\d+)$/);
    if (match) max = Math.max(max, parseInt(match[1], 10));
  }
  return max + 1;
}

/** Try to match an OPE product name to one of our laptop model IDs */
function matchProductToLaptopId(
  productName: string,
  laptopIds: string[],
): string | null {
  const lower = productName.toLowerCase();

  // Must be a Lenovo product
  if (!lower.includes("lenovo") && !lower.includes("thinkpad") && !lower.includes("ideapad") && !lower.includes("legion")) {
    return null;
  }

  // Try matching against known model patterns
  for (const id of laptopIds) {
    // Convert id like "x1-carbon-gen13" to search terms
    const parts = id.split("-");

    // Build search patterns based on common ID structures
    if (id.startsWith("x1-carbon-gen")) {
      const gen = id.match(/gen(\d+)/)?.[1];
      if (gen && lower.includes("x1 carbon") && lower.includes(`gen ${gen}`)) return id;
      if (gen && lower.includes("x1 carbon") && lower.includes(`gen. ${gen}`)) return id;
    }

    if (id.startsWith("t14s-gen")) {
      const gen = id.match(/gen(\d+)/)?.[1];
      const platform = id.includes("-intel") ? "intel" : id.includes("-amd") ? "amd" : null;
      if (gen && lower.includes("t14s") && lower.includes(`gen ${gen}`)) {
        if (!platform) return id;
        if (platform === "intel" && (lower.includes("intel") || lower.includes("ultra"))) return id;
        if (platform === "amd" && (lower.includes("amd") || lower.includes("ryzen"))) return id;
      }
    }

    if (id.startsWith("t14-gen") && !id.startsWith("t14s")) {
      const gen = id.match(/gen(\d+)/)?.[1];
      const platform = id.includes("-intel") ? "intel" : id.includes("-amd") ? "amd" : null;
      if (gen && lower.includes("t14 ") && !lower.includes("t14s") && lower.includes(`gen ${gen}`)) {
        if (!platform) return id;
        if (platform === "intel" && (lower.includes("intel") || lower.includes("ultra"))) return id;
        if (platform === "amd" && (lower.includes("amd") || lower.includes("ryzen"))) return id;
      }
    }

    if (id.startsWith("legion-")) {
      // Match "Legion 5i Gen 10", "Legion Pro 5i Gen 9", etc.
      const legionMatch = id.match(/^legion-(pro-)?(\w+)-(?:gen)?(\d+)(?:-(amd|intel))?$/);
      if (legionMatch) {
        const [, pro, model, gen] = legionMatch;
        const searchPro = pro ? "pro" : "";
        if (
          lower.includes("legion") &&
          lower.includes(model.replace("i", "i")) &&
          lower.includes(`gen ${gen}`) &&
          (searchPro ? lower.includes("pro") : !lower.includes("pro"))
        ) {
          return id;
        }
      }
    }

    if (id.startsWith("ideapad-pro-")) {
      const ipMatch = id.match(/^ideapad-pro-(\w+)-(\d+)-gen(\d+)(?:-(amd))?$/);
      if (ipMatch) {
        const [, variant, size, gen] = ipMatch;
        if (
          lower.includes("ideapad") &&
          lower.includes("pro") &&
          lower.includes(variant) &&
          lower.includes(size) &&
          lower.includes(`gen ${gen}`)
        ) {
          return id;
        }
      }
    }

    // Generic fallback: check if enough parts of the ID appear in the product name
    const keyParts = parts.filter((p) => p.length > 2 && p !== "gen");
    const matched = keyParts.filter((p) => lower.includes(p));
    if (matched.length >= 3 && keyParts.length <= 4) {
      return id;
    }
  }

  return null;
}

async function fetchJson(url: string, params: Record<string, string> = {}): Promise<unknown> {
  const searchParams = new URLSearchParams(params);
  const fullUrl = `${url}?${searchParams.toString()}`;

  const res = await fetch(fullUrl, {
    headers: {
      accept: "application/json",
      Authorization: API_KEY!,
    },
  });

  if (!res.ok) {
    throw new Error(`API request failed: ${res.status} ${res.statusText} for ${fullUrl}`);
  }

  return res.json();
}

// ── Main ──────────────────────────────────────────────────────────────

async function main() {
  const dryRun = process.argv.includes("--dry-run");

  if (!API_KEY) {
    console.error("Error: OPE_API_KEY environment variable is required.");
    console.error("");
    console.error("To get an API key:");
    console.error("  1. Register: curl -X POST 'https://openpricengine.com/auth/new?email=YOU@EMAIL&api_key_name=lenovocompare'");
    console.error("  2. Check your email for the key from openpricengine@gmail.com");
    console.error("  3. Run: OPE_API_KEY=your_key npx tsx scripts/fetch-ope-prices.ts");
    console.error("");
    console.error("NOTE: Electronics data requires the mid-tier plan (~$22/4 months).");
    console.error("      The free plan only covers restaurant data.");
    process.exit(1);
  }

  const laptopIds = loadLaptopIds();
  console.log(`Loaded ${laptopIds.length} laptop model IDs`);

  const existingPrices = loadCommunityPrices();
  let nextId = getNextCommunityId(existingPrices);
  const newPrices: CommunityPrice[] = [];
  const today = new Date().toISOString().split("T")[0];

  // Deduplicate: track existing (laptopId, retailer, price) combos
  const existingKeys = new Set(
    existingPrices.map((p) => `${p.laptopId}|${p.retailer}|${p.price}`),
  );

  for (const store of OPE_STORES) {
    console.log(`\nFetching products from ${store}...`);

    try {
      // First, get the product list
      const productsData = await fetchJson(`${API_BASE}/electronics/stores/products`, {
        store,
      });

      if (!Array.isArray(productsData)) {
        console.log(`  No products array returned for ${store}`);
        continue;
      }

      console.log(`  Found ${(productsData as OpeProduct[]).length} products`);

      // Filter for Lenovo-related products
      const lenovoProducts = (productsData as OpeProduct[]).filter((p) => {
        const name = (p.product_name ?? p.name ?? "").toLowerCase();
        return (
          name.includes("lenovo") ||
          name.includes("thinkpad") ||
          name.includes("ideapad") ||
          name.includes("legion")
        );
      });

      console.log(`  ${lenovoProducts.length} Lenovo products found`);

      for (const product of lenovoProducts) {
        const productName = product.product_name ?? product.name ?? "";
        const laptopId = matchProductToLaptopId(productName, laptopIds);

        if (!laptopId) {
          console.log(`  SKIP (no match): ${productName}`);
          continue;
        }

        const price = product.price;
        if (!price || price <= 0) {
          console.log(`  SKIP (no price): ${productName}`);
          continue;
        }

        const retailer = STORE_TO_RETAILER[store] ?? store;
        const key = `${laptopId}|${retailer}|${price}`;

        if (existingKeys.has(key)) {
          console.log(`  SKIP (duplicate): ${productName} → ${laptopId} @ CHF ${price}`);
          continue;
        }

        existingKeys.add(key);
        const newPrice: CommunityPrice = {
          id: `community-${nextId++}`,
          laptopId,
          retailer,
          price,
          dateAdded: product.date ?? today,
          isUserAdded: false,
          priceType: store === "Revendo" ? "refurbished" : "retail",
          note: `OPE: ${productName}`,
        };

        newPrices.push(newPrice);
        console.log(`  ADD: ${productName} → ${laptopId} @ ${retailer} CHF ${price}`);
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error(`  Error fetching from ${store}: ${msg}`);

      if (msg.includes("401") || msg.includes("403")) {
        console.error("  → Your API key may be invalid or expired. Check your OPE_API_KEY.");
        console.error("  → Electronics data requires the mid-tier plan (~$22/4 months).");
      }
    }
  }

  // Summary
  console.log(`\n--- Summary ---`);
  console.log(`New prices found: ${newPrices.length}`);

  if (newPrices.length === 0) {
    console.log("No new prices to add.");
    return;
  }

  if (dryRun) {
    console.log("\n[DRY RUN] Would add these prices:");
    for (const p of newPrices) {
      console.log(`  ${p.id}: ${p.laptopId} @ ${p.retailer} CHF ${p.price}`);
    }
    console.log("\nRun without --dry-run to save.");
    return;
  }

  // Append to community prices
  const merged = [...existingPrices, ...newPrices];
  writeFileSync(COMMUNITY_PATH, JSON.stringify(merged, null, 2) + "\n");
  console.log(`Saved ${merged.length} total prices to ${COMMUNITY_PATH}`);
  console.log(`\nRun 'npx tsx scripts/generate-prices-json.ts' to regenerate prices.json`);
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
