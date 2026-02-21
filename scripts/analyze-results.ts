import * as fs from "fs";
const d = JSON.parse(fs.readFileSync("scripts/psref-data.json", "utf-8"));

interface Model {
  id: string;
  name: string;
  error?: string;
  processors: unknown[];
  displays: unknown[];
  rams: unknown[];
  storages: unknown[];
  gpus: unknown[];
  warnings: string[];
}

const models = Object.values(d.models) as Model[];
const succeeded = models.filter((m) => !m.error);
const failed = models.filter((m) => m.error);

console.log(`Total scraped: ${models.length}`);
console.log(`Success: ${succeeded.length}`);
console.log(`Failed: ${failed.length}\n`);

// Failure reasons
const reasons = new Map<string, number>();
for (const m of failed) {
  const reason = m.error?.includes("withdrawn")
    ? "Withdrawn (WDProduct)"
    : m.error?.includes("homepage")
      ? "Homepage redirect"
      : m.error?.includes("too short")
        ? "Page too short"
        : m.error || "unknown";
  reasons.set(reason, (reasons.get(reason) || 0) + 1);
}
console.log("Failure reasons:");
for (const [reason, count] of Array.from(reasons.entries())) {
  console.log(`  ${count}x ${reason}`);
}

// Successful models — completeness
console.log("\nSuccessful models:");
for (const m of succeeded) {
  const parts = [
    `${m.processors.length} CPU`,
    `${m.displays.length} disp`,
    `${m.rams.length} RAM`,
    `${m.storages.length} stor`,
    `${m.gpus.length} GPU`,
  ];
  const warns = m.warnings.length > 0 ? ` (${m.warnings.length} warns)` : "";
  console.log(`  ${m.name.padEnd(35)} ${parts.join(", ")}${warns}`);
}

// Data gaps in successful models
const noDisplay = succeeded.filter((m) => m.displays.length === 0);
const noRam = succeeded.filter((m) => m.rams.length === 0);
const noStorage = succeeded.filter((m) => m.storages.length === 0);
const noGpu = succeeded.filter((m) => m.gpus.length === 0);
console.log(`\nData gaps (in ${succeeded.length} successful):`);
console.log(`  No displays: ${noDisplay.length}`);
console.log(`  No RAM: ${noRam.length}`);
console.log(`  No storage: ${noStorage.length}`);
console.log(`  No GPU: ${noGpu.length}`);
