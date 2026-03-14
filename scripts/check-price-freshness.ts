#!/usr/bin/env npx tsx
/**
 * Reports stale seed prices and retailer coverage gaps.
 * Usage: npx tsx scripts/check-price-freshness.ts [--warn-days=90] [--quiet]
 *
 * Exit codes: 0 = OK, 1 = stale current-gen prices found
 */
import { seedPrices } from "../data/seed-prices";
import { laptops } from "../data/laptops";

const RED = "\x1b[31m";
const YELLOW = "\x1b[33m";
const GREEN = "\x1b[32m";
const DIM = "\x1b[2m";
const BOLD = "\x1b[1m";
const RESET = "\x1b[0m";

const MAIN_RETAILERS = ["Digitec", "Galaxus", "Brack", "Lenovo CH", "Interdiscount", "Fust", "MediaMarkt"] as const;

const args = process.argv.slice(2);
const quiet = args.includes("--quiet");
const warnDays = parseInt(args.find((a) => a.startsWith("--warn-days="))?.split("=")[1] ?? "90", 10);

const today = new Date();
const currentYear = today.getFullYear();

const daysSince = (dateStr: string): number => {
  const d = new Date(dateStr);
  return Math.floor((today.getTime() - d.getTime()) / 86_400_000);
};

interface ModelFreshness {
  id: string;
  name: string;
  year: number;
  isCurrentGen: boolean;
  newestDate: string;
  ageDays: number;
  retailerCount: number;
  missingRetailers: readonly string[];
}

const results: ModelFreshness[] = [];

for (const laptop of laptops) {
  const prices = seedPrices.filter((p) => p.laptopId === laptop.id);
  const mainRetailerPrices = prices.filter((p) => (MAIN_RETAILERS as readonly string[]).includes(p.retailer));

  const newestDate =
    prices.length > 0 ? prices.reduce((a, b) => (a.dateAdded > b.dateAdded ? a : b)).dateAdded : "never";

  const presentRetailers = new Set(mainRetailerPrices.map((p) => p.retailer));
  const missing = MAIN_RETAILERS.filter((r) => !presentRetailers.has(r));

  results.push({
    id: laptop.id,
    name: laptop.name,
    year: laptop.year,
    isCurrentGen: laptop.year >= currentYear - 1,
    newestDate,
    ageDays: newestDate === "never" ? 9999 : daysSince(newestDate),
    retailerCount: presentRetailers.size,
    missingRetailers: missing,
  });
}

const stale = results.filter((r) => r.ageDays > warnDays);
const staleCurrentGen = stale.filter((r) => r.isCurrentGen);
const lowCoverage = results.filter((r) => r.isCurrentGen && r.retailerCount < 3);

if (quiet) {
  // Quiet mode for SessionStart hook — one-line summary
  if (staleCurrentGen.length > 0) {
    console.log(
      `${YELLOW}${staleCurrentGen.length} current-gen model(s) have prices older than ${warnDays} days. Run /price-refresh to update.${RESET}`,
    );
    process.exit(1);
  } else {
    console.log(`${GREEN}All current-gen prices are fresh (<${warnDays}d).${RESET}`);
    process.exit(0);
  }
}

// Full report mode
console.log(`\n${BOLD}Price Freshness Report${RESET}  ${DIM}${today.toISOString().slice(0, 10)}${RESET}\n`);

const totalModels = results.length;
const currentGenCount = results.filter((r) => r.isCurrentGen).length;
const avgAge = Math.round(
  results.filter((r) => r.ageDays < 9999).reduce((s, r) => s + r.ageDays, 0) /
    Math.max(results.filter((r) => r.ageDays < 9999).length, 1),
);

console.log(`  Models: ${totalModels} total, ${currentGenCount} current-gen`);
console.log(`  Stale (>${warnDays}d): ${stale.length} total, ${staleCurrentGen.length} current-gen`);
console.log(`  Average price age: ${avgAge} days\n`);

const printTable = (items: ModelFreshness[], label: string, color: string) => {
  if (items.length === 0) return;
  console.log(`${color}${BOLD}${label}${RESET} ${DIM}(${items.length})${RESET}`);
  const sorted = [...items].sort((a, b) => b.ageDays - a.ageDays);
  for (const m of sorted) {
    const age = m.ageDays === 9999 ? "never" : `${m.ageDays}d`;
    const cov = `${m.retailerCount}/7`;
    const miss = m.missingRetailers.length > 0 ? ` ${DIM}missing: ${m.missingRetailers.join(", ")}${RESET}` : "";
    console.log(`  ${color}*${RESET} ${m.name} ${DIM}(${m.year})${RESET}  age: ${age}  retailers: ${cov}${miss}`);
  }
  console.log();
};

// Critical: current-gen, all prices > warnDays
printTable(
  staleCurrentGen.filter((r) => r.ageDays > warnDays),
  "Critical — current-gen, stale prices",
  RED,
);

// High: current-gen with low coverage
printTable(
  lowCoverage.filter((r) => !staleCurrentGen.includes(r)),
  "High — current-gen, low retailer coverage",
  YELLOW,
);

// Medium: older models with stale prices
printTable(
  stale.filter((r) => !r.isCurrentGen),
  "Medium — older models, stale prices",
  DIM,
);

// Summary
if (staleCurrentGen.length > 0) {
  console.log(`${RED}${BOLD}${staleCurrentGen.length} current-gen model(s) need price refresh.${RESET}`);
  console.log(`Run ${BOLD}/price-refresh {model-id}${RESET} to update.\n`);
  process.exit(1);
} else {
  console.log(`${GREEN}${BOLD}All current-gen prices are fresh.${RESET}\n`);
}
