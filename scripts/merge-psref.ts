#!/usr/bin/env npx tsx
/**
 * Merge scraped PSREF data into data/laptops.ts.
 *
 * Reads psref-data.json and patches laptops.ts with new processorOptions,
 * displayOptions, ramOptions, storageOptions, and gpuOptions arrays.
 *
 * Usage:
 *   npx tsx scripts/merge-psref.ts              # Full merge
 *   npx tsx scripts/merge-psref.ts --dry-run    # Preview only
 *   npx tsx scripts/merge-psref.ts --id x1-carbon-gen12
 */
import * as fs from "fs";
import * as path from "path";
import { cpuBenchmarksExpanded } from "../data/cpu-benchmarks";
import { gpuBenchmarks } from "../data/gpu-benchmarks";

// ── Types (matching scraper output) ────────────────────────────────────────

interface ScrapedProcessor {
  name: string;
  rawName: string;
  cores: number;
  threads: number;
  baseClock: number;
  boostClock: number;
  tdp: number;
  inBenchmarks: boolean;
}

interface ScrapedDisplay {
  size: number;
  resolution: string;
  resolutionLabel: string;
  panel: "IPS" | "OLED" | "TN";
  refreshRate: number;
  nits: number;
  touchscreen: boolean;
}

interface ScrapedRam {
  size: number;
  type: "DDR4" | "DDR5" | "LPDDR5" | "LPDDR5x";
  speed: number;
  maxSize: number;
  slots: number;
  soldered: boolean;
}

interface ScrapedStorage {
  type: "NVMe" | "SSD";
  size: number;
  slots: number;
}

interface ScrapedGpu {
  name: string;
  rawName: string;
  vram?: number;
  integrated: boolean;
  inBenchmarks: boolean;
}

interface ScrapedModel {
  id: string;
  name: string;
  psrefUrl: string;
  scrapedAt: string;
  processors: ScrapedProcessor[];
  displays: ScrapedDisplay[];
  rams: ScrapedRam[];
  storages: ScrapedStorage[];
  gpus: ScrapedGpu[];
  warnings: string[];
  error?: string;
}

interface ScrapeResult {
  models: Record<string, ScrapedModel>;
}

// ── CLI args ───────────────────────────────────────────────────────────────

const args = process.argv.slice(2);
const getArg = (flag: string): string | undefined => {
  const idx = args.indexOf(flag);
  return idx !== -1 && idx + 1 < args.length ? args[idx + 1] : undefined;
};
const hasFlag = (flag: string) => args.includes(flag);

const dryRun = hasFlag("--dry-run");
const filterId = getArg("--id");

// ── Constants ──────────────────────────────────────────────────────────────

const DATA_PATH = path.join(__dirname, "psref-data.json");
const LAPTOPS_PATH = path.join(__dirname, "..", "data", "laptops.ts");

const RED = "\x1b[31m";
const GREEN = "\x1b[32m";
const YELLOW = "\x1b[33m";
const CYAN = "\x1b[36m";
const DIM = "\x1b[2m";
const BOLD = "\x1b[1m";
const RESET = "\x1b[0m";

const knownCpus = new Set(Object.keys(cpuBenchmarksExpanded));
const knownGpus = new Set(Object.keys(gpuBenchmarks));

// ── Helpers ────────────────────────────────────────────────────────────────

/** Find the byte range for a model's object block in laptops.ts */
const findModelBlock = (
  source: string,
  modelId: string,
): { start: number; end: number; closingBrace: number } | null => {
  // Find the id line for this model
  const idPattern = new RegExp(`id:\\s*"${modelId.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}"`, "g");
  const match = idPattern.exec(source);
  if (!match) return null;

  // Walk backwards to find the opening brace
  let braceCount = 0;
  let start = match.index;
  while (start > 0) {
    start--;
    if (source[start] === "{") {
      braceCount++;
      if (braceCount === 1) break;
    } else if (source[start] === "}") {
      braceCount--;
    }
  }

  // Walk forwards from the id to find the closing brace
  braceCount = 1;
  let end = match.index;
  // Skip past the opening brace
  while (end > start && source[end] !== "{") end--;
  end++; // move past the {

  while (end < source.length && braceCount > 0) {
    if (source[end] === "{") braceCount++;
    else if (source[end] === "}") braceCount--;
    end++;
  }

  // The closing brace is at end - 1
  return { start, end, closingBrace: end - 1 };
};

/** Check if model already has the given option key */
const hasOption = (source: string, modelBlock: { start: number; end: number }, key: string): boolean => {
  const block = source.slice(modelBlock.start, modelBlock.end);
  return new RegExp(`${key}:\\s*\\[`).test(block);
};

/** Format a processor option as TypeScript */
const formatProcessor = (p: ScrapedProcessor, indent: string): string => {
  return `${indent}  { name: "${p.name}", cores: ${p.cores}, threads: ${p.threads}, baseClock: ${p.baseClock}, boostClock: ${p.boostClock}, tdp: ${p.tdp} },`;
};

/** Format a display option as TypeScript */
const formatDisplay = (d: ScrapedDisplay, indent: string): string => {
  return `${indent}  { size: ${d.size}, resolution: "${d.resolution}", resolutionLabel: "${d.resolutionLabel}", panel: "${d.panel}", refreshRate: ${d.refreshRate}, nits: ${d.nits}, touchscreen: ${d.touchscreen} },`;
};

/** Format a RAM option as TypeScript */
const formatRam = (r: ScrapedRam, indent: string): string => {
  return `${indent}  { size: ${r.size}, type: "${r.type}", speed: ${r.speed}, maxSize: ${r.maxSize}, slots: ${r.slots}, soldered: ${r.soldered} },`;
};

/** Format a storage option as TypeScript */
const formatStorage = (s: ScrapedStorage, indent: string): string => {
  return `${indent}  { type: "${s.type}", size: ${s.size}, slots: ${s.slots} },`;
};

/** Format a GPU option as TypeScript */
const formatGpu = (g: ScrapedGpu, indent: string): string => {
  const vramPart = g.vram ? `, vram: ${g.vram}` : "";
  return `${indent}  { name: "${g.name}"${vramPart}, integrated: ${g.integrated} },`;
};

// ── Main ───────────────────────────────────────────────────────────────────

const main = () => {
  console.log(`\n${BOLD}PSREF Data Merger${dryRun ? ` ${YELLOW}(DRY RUN)${RESET}` : ""}${RESET}\n`);

  if (!fs.existsSync(DATA_PATH)) {
    console.error(`${RED}Error: ${DATA_PATH} not found. Run scrape-psref.ts first.${RESET}`);
    process.exit(1);
  }

  const data: ScrapeResult = JSON.parse(fs.readFileSync(DATA_PATH, "utf-8"));
  let source = fs.readFileSync(LAPTOPS_PATH, "utf-8");

  const unknownCpus = new Set<string>();
  const unknownGpus = new Set<string>();
  let modelsUpdated = 0;
  let optionsAdded = 0;

  const modelIds = filterId ? [filterId] : Object.keys(data.models);

  for (const modelId of modelIds) {
    const scraped = data.models[modelId];
    if (!scraped || scraped.error) continue;

    const block = findModelBlock(source, modelId);
    if (!block) {
      console.log(`${YELLOW}⚠${RESET} Model "${modelId}" not found in laptops.ts`);
      continue;
    }

    const insertions: string[] = [];
    const indent = "    "; // 4 spaces (standard indentation in laptops.ts)

    // Processor options — only include CPUs that exist in benchmarks
    if (!hasOption(source, block, "processorOptions") && scraped.processors.length > 1) {
      const validProcessors = scraped.processors.filter((p) => {
        if (!knownCpus.has(p.name)) {
          unknownCpus.add(p.name);
          return false;
        }
        return true;
      });
      if (validProcessors.length > 0) {
        const lines = validProcessors.map((p) => formatProcessor(p, indent));
        insertions.push(`${indent}processorOptions: [\n${lines.join("\n")}\n${indent}],`);
      }
    }

    // Display options
    if (!hasOption(source, block, "displayOptions") && scraped.displays.length > 1) {
      const lines = scraped.displays.map((d) => formatDisplay(d, indent));
      insertions.push(`${indent}displayOptions: [\n${lines.join("\n")}\n${indent}],`);
    }

    // RAM options
    if (!hasOption(source, block, "ramOptions") && scraped.rams.length > 1) {
      const lines = scraped.rams.map((r) => formatRam(r, indent));
      insertions.push(`${indent}ramOptions: [\n${lines.join("\n")}\n${indent}],`);
    }

    // Storage options
    if (!hasOption(source, block, "storageOptions") && scraped.storages.length > 1) {
      const lines = scraped.storages.map((s) => formatStorage(s, indent));
      insertions.push(`${indent}storageOptions: [\n${lines.join("\n")}\n${indent}],`);
    }

    // GPU options — only include GPUs that exist in benchmarks
    if (!hasOption(source, block, "gpuOptions") && scraped.gpus.length > 1) {
      const validGpus = scraped.gpus.filter((g) => {
        if (!knownGpus.has(g.name)) {
          unknownGpus.add(g.name);
          return false;
        }
        return true;
      });
      if (validGpus.length > 0) {
        const lines = validGpus.map((g) => formatGpu(g, indent));
        insertions.push(`${indent}gpuOptions: [\n${lines.join("\n")}\n${indent}],`);
      }
    }

    if (insertions.length > 0) {
      modelsUpdated++;
      optionsAdded += insertions.length;

      const insertText = "\n" + insertions.join("\n");

      if (dryRun) {
        console.log(`${CYAN}${modelId}${RESET} — would add ${insertions.length} option arrays`);
        for (const ins of insertions) {
          const key = ins.match(/(\w+Options):/)?.[1] || "unknown";
          console.log(`  ${DIM}+ ${key}${RESET}`);
        }
      } else {
        // Re-find block after prior insertions may have shifted offsets
        const freshBlock = findModelBlock(source, modelId);
        if (freshBlock) {
          // Insert before closing brace
          source =
            source.slice(0, freshBlock.closingBrace) +
            insertText +
            "\n" +
            indent.slice(0, 2) +
            source.slice(freshBlock.closingBrace);
        }
      }
    }
  }

  if (!dryRun && modelsUpdated > 0) {
    // Backup original
    const backupPath = LAPTOPS_PATH + ".bak";
    fs.copyFileSync(LAPTOPS_PATH, backupPath);
    console.log(`${DIM}Backup: ${backupPath}${RESET}`);

    fs.writeFileSync(LAPTOPS_PATH, source);
  }

  // Summary
  console.log(`\n${BOLD}Summary${RESET}`);
  console.log(`  ${GREEN}Models updated: ${modelsUpdated}${RESET}`);
  console.log(`  ${CYAN}Option arrays added: ${optionsAdded}${RESET}`);

  if (unknownCpus.size > 0) {
    console.log(`\n${YELLOW}${BOLD}Unknown CPUs (not in cpu-benchmarks.ts):${RESET}`);
    for (const cpu of Array.from(unknownCpus)) {
      console.log(`  ${YELLOW}• ${cpu}${RESET}`);
    }
  }

  if (unknownGpus.size > 0) {
    console.log(`\n${YELLOW}${BOLD}Unknown GPUs (not in gpu-benchmarks.ts):${RESET}`);
    for (const gpu of Array.from(unknownGpus)) {
      console.log(`  ${YELLOW}• ${gpu}${RESET}`);
    }
  }

  if (!dryRun && modelsUpdated > 0) {
    console.log(`\n${GREEN}Done. Run ${BOLD}npm run build${RESET}${GREEN} to verify.${RESET}\n`);
  } else if (modelsUpdated === 0) {
    console.log(`\n${GREEN}No changes needed.${RESET}\n`);
  }
};

main();
