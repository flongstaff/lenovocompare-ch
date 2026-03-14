#!/usr/bin/env npx tsx
/**
 * Reports deal verification status, staleness, and provides Toppreise lookup URLs.
 * Usage: npx tsx scripts/verify-deals.ts [--warn-days=14]
 *
 * Exit codes: 0 = all deals OK, 1 = stale or unverified deals found
 */
import { dealHighlights } from "../data/market-insights";
import { priceBaselines } from "../data/price-baselines";
import { laptops } from "../data/laptops";
import type { DealHighlight } from "../lib/types";

const RED = "\x1b[31m";
const YELLOW = "\x1b[33m";
const GREEN = "\x1b[32m";
const DIM = "\x1b[2m";
const BOLD = "\x1b[1m";
const RESET = "\x1b[0m";

const args = process.argv.slice(2);
const warnDays = parseInt(args.find((a) => a.startsWith("--warn-days="))?.split("=")[1] ?? "14", 10);

const today = new Date();

const daysSince = (dateStr: string): number => {
  const d = new Date(dateStr);
  return Math.floor((today.getTime() - d.getTime()) / 86_400_000);
};

const toppreiseUrl = (query: string): string => `https://www.toppreise.ch/search?q=${encodeURIComponent(query)}`;

type DealStatus = "OK" | "STALE" | "UNVERIFIED" | "EXPIRED";

const getDealStatus = (deal: DealHighlight): DealStatus => {
  if (deal.expiryDate && new Date(deal.expiryDate) < today) return "EXPIRED";
  if (!deal.lastVerified) return "UNVERIFIED";
  if (daysSince(deal.lastVerified) > warnDays) return "STALE";
  return "OK";
};

const statusColor = (status: DealStatus): string => {
  switch (status) {
    case "OK":
      return GREEN;
    case "STALE":
      return YELLOW;
    case "UNVERIFIED":
      return RED;
    case "EXPIRED":
      return DIM;
  }
};

// Report header
console.log(`\n${BOLD}Deal Verification Report${RESET}  ${DIM}${today.toISOString().slice(0, 10)}${RESET}`);
console.log(`${DIM}Stale threshold: ${warnDays} days${RESET}\n`);

let hasIssues = false;

for (const deal of dealHighlights) {
  const status = getDealStatus(deal);
  if (status !== "OK") hasIssues = true;

  const model = laptops.find((l) => l.id === deal.laptopId);
  const baseline = priceBaselines[deal.laptopId] ?? null;
  const color = statusColor(status);

  // Status line
  const modelName = model?.name ?? deal.laptopId;
  console.log(`${color}[${status}]${RESET} ${BOLD}${modelName}${RESET} ${DIM}(${deal.id})${RESET}`);

  // Price info
  const priceInfo = [`  Price: CHF ${deal.price}`, `Retailer: ${deal.retailer}`, `Type: ${deal.priceType}`];
  console.log(`  ${priceInfo.join("  |  ")}`);

  // MSRP and discount
  if (baseline) {
    const discountPct = Math.round(((baseline.msrp - deal.price) / baseline.msrp) * 100);
    console.log(
      `  ${DIM}MSRP: CHF ${baseline.msrp}  |  Discount: ${discountPct}%  |  Historical low: CHF ${baseline.historicalLow}${RESET}`,
    );
  }

  // Verification info
  if (deal.lastVerified) {
    const age = daysSince(deal.lastVerified);
    const ageColor = age > warnDays ? YELLOW : GREEN;
    console.log(`  Last verified: ${ageColor}${deal.lastVerified} (${age}d ago)${RESET}`);
  } else {
    console.log(`  ${RED}Never verified${RESET}`);
  }

  // Toppreise URL
  if (deal.toppreiseQuery) {
    console.log(`  ${DIM}Toppreise:${RESET} ${toppreiseUrl(deal.toppreiseQuery)}`);
  }

  // Deal URL
  if (deal.url) {
    console.log(`  ${DIM}Deal URL:${RESET} ${deal.url}`);
  }

  console.log();
}

// Summary
const counts = { OK: 0, STALE: 0, UNVERIFIED: 0, EXPIRED: 0 };
for (const deal of dealHighlights) {
  counts[getDealStatus(deal)]++;
}

console.log(`${BOLD}Summary${RESET}`);
console.log(
  `  ${GREEN}OK: ${counts.OK}${RESET}  ${YELLOW}Stale: ${counts.STALE}${RESET}  ${RED}Unverified: ${counts.UNVERIFIED}${RESET}  ${DIM}Expired: ${counts.EXPIRED}${RESET}`,
);

if (hasIssues) {
  console.log(`\n${RED}${BOLD}Action needed:${RESET} ${counts.STALE + counts.UNVERIFIED} deal(s) need verification.\n`);
  process.exit(1);
} else {
  console.log(`\n${GREEN}${BOLD}All deals verified and fresh.${RESET}\n`);
}
