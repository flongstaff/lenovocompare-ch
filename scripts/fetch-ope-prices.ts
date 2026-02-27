#!/usr/bin/env tsx
/**
 * Queries the Open Price Engine (OPE) API for Swiss retailer Lenovo laptop prices.
 * Targets: Interdiscount, Revendo
 *
 * Requires OPE_API_KEY env var (mid-tier plan ~$22/4mo for electronics data).
 * See: https://openpriceengine.com
 *
 * Run: OPE_API_KEY=... npx tsx scripts/fetch-ope-prices.ts
 */

const OPE_BASE = "https://api.openpriceengine.com/v1";

const RETAILER_MAP: Record<string, string> = {
  interdiscount: "Interdiscount",
  revendo: "Revendo",
};

const SEARCH_TERMS = [
  "Lenovo ThinkPad X1 Carbon",
  "Lenovo ThinkPad T14s",
  "Lenovo ThinkPad T14",
  "Lenovo Legion Pro 5i",
  "Lenovo IdeaPad Pro 5i",
];

const main = async () => {
  const apiKey = process.env.OPE_API_KEY;
  if (!apiKey) {
    console.log("Open Price Engine integration");
    console.log("=============================");
    console.log("");
    console.log("This script queries OPE for Interdiscount and Revendo Lenovo prices.");
    console.log("");
    console.log("Setup:");
    console.log("  1. Sign up at https://openpriceengine.com");
    console.log("  2. Subscribe to the electronics data plan (~$22/4 months)");
    console.log("  3. Run: OPE_API_KEY=your_key npx tsx scripts/fetch-ope-prices.ts");
    console.log("");
    console.log("The output will be appended to data/community-prices.json.");
    process.exit(0);
  }

  console.log("[fetch-ope] Querying Open Price Engine...");

  for (const term of SEARCH_TERMS) {
    for (const [retailerId, retailerName] of Object.entries(RETAILER_MAP)) {
      try {
        const url = `${OPE_BASE}/prices?q=${encodeURIComponent(term)}&retailer=${retailerId}&country=ch&limit=5`;
        const res = await fetch(url, {
          headers: { Authorization: `Bearer ${apiKey}` },
        });
        if (!res.ok) {
          console.warn(`[fetch-ope] ${retailerName} "${term}": HTTP ${res.status}`);
          continue;
        }
        const data = await res.json();
        console.log(`[fetch-ope] ${retailerName} "${term}": ${data.results?.length ?? 0} results`);
      } catch (err) {
        console.warn(`[fetch-ope] ${retailerName} "${term}": fetch error`, err);
      }
    }
  }

  console.log("[fetch-ope] Done. Review results and manually add confirmed prices to community-prices.json.");
};

main();
