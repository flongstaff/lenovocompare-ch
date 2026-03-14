#!/usr/bin/env npx tsx
/**
 * CLI data validation runner — exits 1 on errors, 2 on crashes.
 * Usage: npx tsx scripts/validate-data.ts
 */
import { validateAllData, groupByCategory } from "../lib/validate-data";

const RED = "\x1b[31m";
const YELLOW = "\x1b[33m";
const GREEN = "\x1b[32m";
const CYAN = "\x1b[36m";
const DIM = "\x1b[2m";
const BOLD = "\x1b[1m";
const RESET = "\x1b[0m";

try {
  const result = validateAllData();

  console.log(
    `\n${BOLD}Data Validation${RESET}  ${RED}${result.errors.length} errors${RESET}  ${YELLOW}${result.warnings.length} warnings${RESET}  ${CYAN}${result.info.length} info${RESET}\n`,
  );

  // Errors
  if (result.errors.length > 0) {
    const groups = groupByCategory(result.errors);
    for (const [category, issues] of groups) {
      console.log(`${RED}${BOLD}✗ ${category}${RESET} ${DIM}(${issues.length})${RESET}`);
      for (const issue of issues) {
        const id = issue.modelId ? `${DIM}[${issue.modelId}]${RESET} ` : "";
        console.log(`  ${RED}•${RESET} ${id}${issue.message}`);
      }
      console.log();
    }
  }

  // Warnings
  if (result.warnings.length > 0) {
    const groups = groupByCategory(result.warnings);
    for (const [category, issues] of groups) {
      console.log(`${YELLOW}${BOLD}⚠ ${category}${RESET} ${DIM}(${issues.length})${RESET}`);
      for (const issue of issues) {
        const id = issue.modelId ? `${DIM}[${issue.modelId}]${RESET} ` : "";
        console.log(`  ${YELLOW}•${RESET} ${id}${issue.message}`);
      }
      console.log();
    }
  }

  // Info
  if (result.info.length > 0) {
    const groups = groupByCategory(result.info);
    for (const [category, issues] of groups) {
      console.log(`${GREEN}${BOLD}ℹ ${category}${RESET}`);
      for (const issue of issues) {
        console.log(`  ${CYAN}•${RESET} ${issue.message}`);
      }
      console.log();
    }
  }

  // Exit code
  if (result.errors.length > 0) {
    console.log(`${RED}${BOLD}✗ Validation failed with ${result.errors.length} error(s)${RESET}\n`);
    process.exit(1);
  } else {
    console.log(`${GREEN}${BOLD}✓ Validation passed${RESET}\n`);
  }
} catch (err) {
  console.error(`${RED}${BOLD}FATAL: Validation script crashed${RESET}`);
  console.error(err instanceof Error ? err.stack : String(err));
  process.exit(2);
}
