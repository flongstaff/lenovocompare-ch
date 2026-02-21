#!/usr/bin/env npx tsx
/**
 * PSREF Configuration Scraper — extracts processor/display/memory/storage/GPU
 * options from PSREF Specifications tab using Playwright.
 *
 * The Specifications tab has structured tables for each spec category:
 * - Processor: tab-delimited table [Name, Cores, Threads, BaseFrq, MaxFrq, Cache, GPU, NPU]
 * - Display: tab-delimited table [Size, Resolution, Touch, Type, Brightness, ...]
 * - Graphics: tab-delimited table [Graphics, Type, Memory, Features]
 * - Memory: "Max Memory" list + "Memory Type" text
 * - Storage: "Storage Type" list + slot info
 *
 * Usage:
 *   npx tsx scripts/scrape-psref.ts                    # Scrape all models
 *   npx tsx scripts/scrape-psref.ts --id x1-carbon-gen12
 *   npx tsx scripts/scrape-psref.ts --lineup ThinkPad
 *   npx tsx scripts/scrape-psref.ts --missing-only     # Only models without options
 *   npx tsx scripts/scrape-psref.ts --resume            # Resume from psref-data.json
 *   npx tsx scripts/scrape-psref.ts --headful           # Show browser window
 */
import { chromium, type Page } from "playwright";
import * as fs from "fs";
import * as path from "path";
import { laptops } from "../data/laptops";
import { cpuBenchmarksExpanded } from "../data/cpu-benchmarks";
import { gpuBenchmarks } from "../data/gpu-benchmarks";
import { normalizeCpuName, normalizeGpuName } from "./psref-name-map";

// ── Types ──────────────────────────────────────────────────────────────────

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
  scrapedAt: string;
  totalModels: number;
  successCount: number;
  failCount: number;
  warningCount: number;
  models: Record<string, ScrapedModel>;
}

// ── CLI args ───────────────────────────────────────────────────────────────

const args = process.argv.slice(2);
const getArg = (flag: string): string | undefined => {
  const idx = args.indexOf(flag);
  return idx !== -1 && idx + 1 < args.length ? args[idx + 1] : undefined;
};
const hasFlag = (flag: string) => args.includes(flag);

const filterId = getArg("--id");
const filterLineup = getArg("--lineup");
const missingOnly = hasFlag("--missing-only");
const resume = hasFlag("--resume");
const headful = hasFlag("--headful");

// ── Constants ──────────────────────────────────────────────────────────────

const OUTPUT_PATH = path.join(__dirname, "psref-data.json");
const DELAY_MS = 3000;
const PAGE_TIMEOUT = 90000;
const MAX_RETRIES = 2;

const RED = "\x1b[31m";
const GREEN = "\x1b[32m";
const YELLOW = "\x1b[33m";
const CYAN = "\x1b[36m";
const DIM = "\x1b[2m";
const BOLD = "\x1b[1m";
const RESET = "\x1b[0m";

// ── Known benchmark keys (for cross-reference) ────────────────────────────

const knownCpus = new Set(Object.keys(cpuBenchmarksExpanded));
const knownGpus = new Set(Object.keys(gpuBenchmarks));

// ── Section extraction helpers ─────────────────────────────────────────────

/**
 * Extract text between two "**" section markers from the Specifications tab.
 * Returns lines between `startMarker**` and the next `**` marker.
 */
const extractSection = (text: string, sectionName: string): string[] => {
  const marker = `${sectionName}**`;
  const start = text.indexOf(marker);
  if (start < 0) return [];

  // Find the end: next line containing "**" (another section header)
  const afterMarker = start + marker.length;
  const nextSection = text.indexOf("**", afterMarker);
  const sectionText =
    nextSection > 0 ? text.substring(afterMarker, nextSection) : text.substring(afterMarker, afterMarker + 3000);

  return sectionText
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l.length > 0);
};

// ── Parsers ────────────────────────────────────────────────────────────────

/**
 * Parse processor rows from Specifications tab.
 * Format: "Core Ultra 5 125H\t14 (4 P-core + ...)\t18\tP-core 1.2GHz ...\tP-core 4.5GHz ...\t..."
 * First line is the header row.
 */
const parseSpecsProcessors = (lines: string[]): Array<Omit<ScrapedProcessor, "inBenchmarks">> => {
  const results: Array<Omit<ScrapedProcessor, "inBenchmarks">> = [];

  let seenData = false;
  // Skip header row (starts with "Processor Name")
  for (const line of lines) {
    if (line.startsWith("Processor Name") || line.startsWith("Notes:")) continue;
    // Stop at non-processor content only after we've seen data rows
    if (!line.includes("\t")) {
      if (seenData) break;
      continue;
    }
    seenData = true;

    const cols = line.split("\t");
    if (cols.length < 3) continue;

    const rawName = cols[0].replace(/[®™©]/g, "").trim();
    if (!rawName || /^(AI |Operating|NPU|Notes)/.test(rawName)) continue;

    const name = normalizeCpuName(rawName);

    // Cores: "14 (4 P-core + 8 E-core + 2 LP E-core)" → 14
    const coresMatch = cols[1]?.match(/^(\d+)/);
    const cores = coresMatch ? parseInt(coresMatch[1]) : 0;

    // Threads
    const threads = parseInt(cols[2]) || cores;

    // Base clock: "P-core 1.2GHz / E-core 700MHz / LP E-core 700MHz" → 1.2
    const baseCol = cols[3] || "";
    const baseMatch = baseCol.match(/P-core\s+([\d.]+)\s*GHz/i) || baseCol.match(/([\d.]+)\s*GHz/i);
    const baseClock = baseMatch ? parseFloat(baseMatch[1]) : 0;

    // Boost clock: "P-core 4.5GHz / E-core 3.6GHz / LP E-core 2.5GHz" → 4.5
    const boostCol = cols[4] || "";
    const boostMatch = boostCol.match(/P-core\s+([\d.]+)\s*GHz/i) || boostCol.match(/([\d.]+)\s*GHz/i);
    const boostClock = boostMatch ? parseFloat(boostMatch[1]) : 0;

    if (!cores) continue;

    results.push({ name, rawName, cores, threads, baseClock, boostClock, tdp: 0 });
  }

  return results;
};

/**
 * Parse display rows from Specifications tab.
 * Format: "14"\tWUXGA (1920x1200)\tNon-touch\tIPS[1]\t400nits\tAnti-glare\t16:10\t...\t60Hz\t..."
 */
const parseSpecsDisplays = (lines: string[]): ScrapedDisplay[] => {
  const results: ScrapedDisplay[] = [];
  let seenData = false;

  for (const line of lines) {
    if (line.startsWith("Size") || line.startsWith("Notes:") || line.startsWith("Touchscreen")) continue;
    if (!line.includes("\t")) {
      // Break only after we've seen data rows (end of table)
      // Skip footnote refs like "[1]" before the header
      if (seenData) break;
      continue;
    }

    seenData = true;
    const cols = line.split("\t");
    if (cols.length < 5) continue;

    // Size
    const sizeMatch = cols[0]?.match(/([\d.]+)/);
    const size = sizeMatch ? parseFloat(sizeMatch[1]) : 0;
    if (!size) continue;

    // Resolution: "WUXGA (1920x1200)" → extract both label and resolution
    const resCol = cols[1] || "";
    const resMatch = resCol.match(/(\d{3,4})\s*x\s*(\d{3,4})/);
    const resolution = resMatch ? `${resMatch[1]}x${resMatch[2]}` : "";
    if (!resolution) continue;

    // Touch
    const touchCol = cols[2] || "";
    const touchscreen = /touch/i.test(touchCol) && !/non-touch/i.test(touchCol);

    // Panel type
    const typeCol = cols[3] || "";
    const panel: "IPS" | "OLED" | "TN" = /OLED/i.test(typeCol) ? "OLED" : /TN/i.test(typeCol) ? "TN" : "IPS";

    // Brightness: "400nits"
    const nitsCol = cols[4] || "";
    const nitsMatch = nitsCol.match(/(\d+)\s*nit/i);
    const nits = nitsMatch ? parseInt(nitsMatch[1]) : 300;

    // Refresh rate — find column containing "Hz"
    let refreshRate = 60;
    for (const col of cols) {
      const rrMatch = col.match(/^(\d+)\s*Hz$/i);
      if (rrMatch) {
        refreshRate = parseInt(rrMatch[1]);
        break;
      }
    }

    // Build resolution label
    const resLabel = buildResolutionLabel(resolution, panel, resCol);

    results.push({ size, resolution, resolutionLabel: resLabel, panel, refreshRate, nits, touchscreen });
  }

  return results;
};

const buildResolutionLabel = (resolution: string, panel: "IPS" | "OLED" | "TN", text: string): string => {
  const labelMap: Record<string, string> = {
    "1920x1080": "FHD",
    "1920x1200": "WUXGA",
    "2560x1440": "QHD",
    "2560x1600": "2.5K",
    "2880x1800": "2.8K",
    "2880x1920": "2.8K",
    "3072x1920": "3K",
    "3200x2000": "3.2K",
    "3840x2160": "4K UHD",
    "3840x2400": "4K",
  };
  let label = labelMap[resolution] || resolution;

  if (/WUXGA/i.test(text)) label = "WUXGA";
  if (/WQXGA/i.test(text)) label = "WQXGA";
  if (/Privacy/i.test(text)) label += " Privacy";

  if (panel === "OLED") label += " OLED";
  else if (panel !== "IPS") label += ` ${panel}`;
  else label += " IPS";

  return label;
};

/**
 * Parse graphics rows from Specifications tab.
 * Format: "Intel® Arc™ Graphics\tIntegrated\tShared\tDirectX® 12.2"
 */
const parseSpecsGpus = (lines: string[]): Array<Omit<ScrapedGpu, "inBenchmarks">> => {
  const results: Array<Omit<ScrapedGpu, "inBenchmarks">> = [];

  for (const line of lines) {
    // Skip header row
    if (line.startsWith("Graphics\tType")) continue;
    // Stop at non-GPU sections
    if (line.startsWith("Notes:") || line.startsWith("Monitor")) break;
    if (!line.includes("\t")) {
      if (/Monitor|Chipset|Memory/i.test(line)) break;
      continue;
    }

    const cols = line.split("\t");
    if (cols.length < 2) continue;

    const rawName = cols[0]
      .replace(/[®™©]/g, "")
      .replace(/\[\d+\]/g, "")
      .trim();
    if (!rawName || rawName === "Graphics") continue;

    const name = normalizeGpuName(rawName);
    const typeCol = cols[1] || "";
    const integrated = /integrated|shared/i.test(typeCol) && !/discrete/i.test(typeCol);

    // VRAM from memory column
    const memCol = cols[2] || "";
    const vramMatch = memCol.match(/(\d+)\s*GB/i);
    const vram = vramMatch ? parseInt(vramMatch[1]) : undefined;

    results.push({ name, rawName, vram, integrated });
  }

  return results;
};

/**
 * Parse memory info from the Specifications tab.
 * "Max Memory" lines: "16GB soldered memory, not upgradable", "32GB...", "64GB..."
 * "Memory Type" line: "LPDDR5x-6400"
 * "Memory Slots" line: "Memory soldered to systemboard, no slots, 8-channel" or "2x SO-DIMM slot"
 */
const parseSpecsMemory = (text: string): ScrapedRam[] => {
  const results: ScrapedRam[] = [];

  // Extract memory type (may have footnote like "Memory Type\nLPDDR5x-6400[1]")
  const typeMatch = text.match(/Memory Type(?:\[\d+\])?\n(.*?)(?:\n|$)/i) || text.match(/(LPDDR5x?-\d+|DDR[45]-\d+)/i);
  let memType: "DDR4" | "DDR5" | "LPDDR5" | "LPDDR5x" = "DDR5";
  let speed = 0;
  if (typeMatch) {
    const typeStr = typeMatch[1] || typeMatch[0];
    if (/LPDDR5x/i.test(typeStr)) memType = "LPDDR5x";
    else if (/LPDDR5/i.test(typeStr)) memType = "LPDDR5";
    else if (/DDR4/i.test(typeStr)) memType = "DDR4";
    const speedMatch = typeStr.match(/(\d{3,5})/);
    if (speedMatch) speed = parseInt(speedMatch[1]);
  }

  // Soldered or slots
  const soldered = /soldered/i.test(text) && /no slots/i.test(text);
  const slotMatch = text.match(/(\d+)\s*x?\s*(?:SO-?DIMM|DIMM|slot)/i);
  const slots = soldered ? 0 : slotMatch ? parseInt(slotMatch[1]) : 2;

  // Extract max memory sizes from "Max Memory" section (may have footnote like "Max Memory[1]")
  const maxMemSection = text.match(/Max Memory(?:\[\d+\])?\n([\s\S]*?)(?:Memory Slots|Memory Type|Storage|$)/i);
  if (maxMemSection) {
    const sizeMatches = maxMemSection[1].matchAll(/(\d+)\s*GB/gi);
    const sizes: number[] = [];
    for (const m of sizeMatches) {
      const s = parseInt(m[1]);
      if (!sizes.includes(s)) sizes.push(s);
    }

    const maxSize = sizes.length > 0 ? Math.max(...sizes) : 0;

    for (const size of sizes) {
      results.push({ size, type: memType, speed, maxSize, slots, soldered });
    }
  }

  return results;
};

/**
 * Parse storage info from the Specifications tab.
 * "Storage Type" section lists available SSD options.
 * "Storage Slot" tells us slot count.
 */
const parseSpecsStorage = (text: string): ScrapedStorage[] => {
  const results: ScrapedStorage[] = [];

  // Storage slot count (may have footnote like "Storage Slot[2]")
  const slotText = text.match(/Storage Slot(?:\[\d+\])?\n(.*?)(?:\n|$)/i);
  let slotCount = 1;
  if (slotText) {
    const st = slotText[1];
    if (/two|2\s*x/i.test(st)) slotCount = 2;
    else if (/three|3\s*x/i.test(st)) slotCount = 3;
  }

  // Storage type section — tab-delimited table with "Offering" column
  // Format: "M.2 2280 SSD\tPCIe NVMe, PCIe 4.0 x4\t256GB / 512GB / 1TB\tOpal 2.0"
  // Header: "Disk Type\tInterface\tOffering\tSecurity"
  const storSection = text.match(/Storage Type\*{0,2}\n([\s\S]*?)(?:Removable Storage|Optical|Card Reader|Audio|$)/i);
  if (storSection) {
    const lines = storSection[1]
      .split("\n")
      .map((l) => l.trim())
      .filter((l) => l.length > 0);
    for (const line of lines) {
      if (/^Notes:/i.test(line)) break;
      if (line.startsWith("Disk Type")) continue; // header

      // Check if tab-delimited table row
      if (line.includes("\t")) {
        const cols = line.split("\t");
        // Offering column (usually col 2) has sizes like "256GB / 512GB / 1TB"
        const offeringCol = cols[2] || "";
        const isNvme = /NVMe|PCIe|M\.2/i.test(line);
        const sizeType: "NVMe" | "SSD" = isNvme ? "NVMe" : "SSD";

        // Extract all sizes from offering
        const sizeStrs = offeringCol.split(/\s*\/\s*/);
        for (const sizeStr of sizeStrs) {
          const tbMatch = sizeStr.match(/([\d.]+)\s*TB/i);
          const gbMatch = sizeStr.match(/(\d+)\s*GB/i);
          let size = 0;
          if (tbMatch) size = Math.round(parseFloat(tbMatch[1]) * 1024);
          else if (gbMatch) size = parseInt(gbMatch[1]);
          if (!size) continue;
          if (!results.some((s) => s.size === size && s.type === sizeType)) {
            results.push({ type: sizeType, size, slots: slotCount });
          }
        }
      } else {
        // Simple text line with size
        const tbMatch = line.match(/([\d.]+)\s*TB/i);
        const gbMatch = line.match(/(\d+)\s*GB/i);
        let size = 0;
        if (tbMatch) size = Math.round(parseFloat(tbMatch[1]) * 1024);
        else if (gbMatch) size = parseInt(gbMatch[1]);
        if (!size) continue;
        const sizeType: "NVMe" | "SSD" = /NVMe|PCIe|M\.2/i.test(line) ? "NVMe" : "SSD";
        if (!results.some((s) => s.size === size && s.type === sizeType)) {
          results.push({ type: sizeType, size, slots: slotCount });
        }
      }
    }
  }

  return results;
};

/**
 * Extract GPU names from the processor table's GPU column (for models without a Graphics** section).
 * The processor table has columns: [Name, Cores, Threads, BaseFrq, MaxFrq, Cache, GPU, NPU]
 */
const extractGpusFromProcessorTable = (procLines: string[]): Array<Omit<ScrapedGpu, "inBenchmarks">> => {
  const seen = new Set<string>();
  const results: Array<Omit<ScrapedGpu, "inBenchmarks">> = [];

  for (const line of procLines) {
    if (!line.includes("\t")) continue;
    if (line.startsWith("Processor Name")) continue;

    const cols = line.split("\t");
    // GPU column is typically at index 6 (after Name, Cores, Threads, BaseFrq, MaxFrq, Cache)
    for (let i = 5; i < cols.length; i++) {
      const col = cols[i]
        .replace(/[®™©]/g, "")
        .replace(/\[\d+\]/g, "")
        .trim();
      if (/Intel.*Graphics|Radeon|GeForce|RTX|GPU/i.test(col) && col.length > 3) {
        const name = normalizeGpuName(col);
        if (!seen.has(name)) {
          seen.add(name);
          results.push({ name, rawName: col, integrated: true });
        }
      }
    }
  }

  return results;
};

// ── Page extraction ────────────────────────────────────────────────────────

/**
 * Navigate to Specifications tab and extract structured data.
 */
const extractSpecsFromPage = async (
  page: Page,
): Promise<{
  processors: Array<Omit<ScrapedProcessor, "inBenchmarks">>;
  displays: ScrapedDisplay[];
  gpus: Array<Omit<ScrapedGpu, "inBenchmarks">>;
  rams: ScrapedRam[];
  storages: ScrapedStorage[];
}> => {
  // Click "Specifications" tab
  const clicked = await page.evaluate(() => {
    const spans = document.querySelectorAll("span");
    for (const span of spans) {
      if (span.textContent?.trim() === "Specifications") {
        (span as HTMLElement).click();
        return true;
      }
    }
    return false;
  });

  if (!clicked) {
    throw new Error("Could not find Specifications tab");
  }

  // Wait for spec content to load (Processor** marker)
  await page.waitForFunction(() => (document.body?.innerText || "").includes("Processor**"), { timeout: 15000 });
  await page.waitForTimeout(2000);

  const fullText = await page.evaluate(() => document.body?.innerText || "");

  // Parse each section
  const procLines = extractSection(fullText, "Processor");
  const displayLines = extractSection(fullText, "Display");
  const gfxLines = extractSection(fullText, "Graphics");

  // Memory: search for "Max Memory" after Processor** section to avoid sidebar nav
  const procMarker = fullText.indexOf("Processor**");
  const searchFrom = procMarker > 0 ? procMarker : 0;
  const memoryStart = fullText.indexOf("Max Memory", searchFrom);
  const memoryText = memoryStart >= 0 ? fullText.substring(memoryStart, memoryStart + 1500) : "";

  // Storage: search for "Storage Type**" specifically to avoid sidebar nav matches
  const storTypeMarker = fullText.indexOf("Storage Type**", searchFrom);
  // If no "Storage Type**", look for "Storage Slot" + nearby content
  const storSlotMarker = storTypeMarker < 0 ? fullText.indexOf("Storage Slot", searchFrom) : -1;
  const storageStart = storTypeMarker >= 0 ? storTypeMarker - 200 : storSlotMarker >= 0 ? storSlotMarker - 200 : -1;
  const storageText =
    storageStart >= 0 ? fullText.substring(Math.max(searchFrom, storageStart), storageStart + 2000) : "";

  // GPU: if no Graphics** section, extract from processor table GPU column
  let gpus = parseSpecsGpus(gfxLines);
  if (gpus.length === 0 && procLines.length > 0) {
    gpus = extractGpusFromProcessorTable(procLines);
  }

  return {
    processors: parseSpecsProcessors(procLines),
    displays: parseSpecsDisplays(displayLines),
    gpus,
    rams: parseSpecsMemory(memoryText),
    storages: parseSpecsStorage(storageText),
  };
};

const scrapePsrefPage = async (page: Page, laptop: (typeof laptops)[number]): Promise<ScrapedModel> => {
  const warnings: string[] = [];
  const model: ScrapedModel = {
    id: laptop.id,
    name: laptop.name,
    psrefUrl: laptop.psrefUrl || "",
    scrapedAt: new Date().toISOString(),
    processors: [],
    displays: [],
    rams: [],
    storages: [],
    gpus: [],
    warnings,
  };

  if (!laptop.psrefUrl) {
    model.error = "No psrefUrl";
    return model;
  }

  try {
    await page.goto(laptop.psrefUrl, {
      waitUntil: "load",
      timeout: PAGE_TIMEOUT,
    });

    // Wait for page to have some content
    await page.waitForFunction(() => (document.body?.innerText || "").length > 200, { timeout: 30000 });
    await page.waitForTimeout(3000);

    // Detect homepage redirect or withdrawn product
    const currentUrl = page.url();
    if (currentUrl === "https://psref.lenovo.com/" || currentUrl === "https://psref.lenovo.com") {
      model.error = "Redirected to homepage — product URL may be invalid";
      return model;
    }
    if (currentUrl.includes("/WDProduct/")) {
      model.error = "Product withdrawn from PSREF (WDProduct redirect)";
      return model;
    }

    // Verify product page loaded (has product content, not just nav)
    const pageText = await page.evaluate(() => document.body?.innerText || "");
    if (pageText.length < 2000) {
      model.error = `Page too short (${pageText.length} chars) — may not have loaded`;
      return model;
    }

    const rawSpecs = await extractSpecsFromPage(page);

    // Process processors
    for (const proc of rawSpecs.processors) {
      if (model.processors.some((p) => p.name === proc.name)) continue;
      model.processors.push({
        ...proc,
        inBenchmarks: knownCpus.has(proc.name),
      });
      if (!knownCpus.has(proc.name)) {
        warnings.push(`Unknown CPU: "${proc.name}" (raw: "${proc.rawName}")`);
      }
    }

    // Process displays — dedup by resolution + panel + touch
    for (const disp of rawSpecs.displays) {
      const key = `${disp.resolution}-${disp.panel}-${disp.touchscreen}`;
      if (model.displays.some((d) => `${d.resolution}-${d.panel}-${d.touchscreen}` === key)) continue;
      model.displays.push(disp);
    }

    // Process GPUs
    for (const gpu of rawSpecs.gpus) {
      if (model.gpus.some((g) => g.name === gpu.name)) continue;
      model.gpus.push({
        ...gpu,
        inBenchmarks: knownGpus.has(gpu.name),
      });
      if (!knownGpus.has(gpu.name)) {
        warnings.push(`Unknown GPU: "${gpu.name}" (raw: "${gpu.rawName}")`);
      }
    }

    // Process RAM
    for (const ram of rawSpecs.rams) {
      if (model.rams.some((r) => r.size === ram.size && r.type === ram.type)) continue;
      model.rams.push(ram);
    }

    // Process storage
    for (const stor of rawSpecs.storages) {
      if (model.storages.some((s) => s.size === stor.size && s.type === stor.type)) continue;
      model.storages.push(stor);
    }

    // Warn if no data found
    if (model.processors.length === 0 && model.displays.length === 0) {
      warnings.push("No spec data extracted — page structure may differ");
    }
  } catch (err) {
    model.error = err instanceof Error ? err.message : String(err);
  }

  return model;
};

// ── Main ───────────────────────────────────────────────────────────────────

const main = async () => {
  console.log(`\n${BOLD}PSREF Configuration Scraper${RESET}\n`);

  // Filter models
  let models = laptops.filter((l) => l.psrefUrl);
  if (filterId) models = models.filter((l) => l.id === filterId);
  if (filterLineup) models = models.filter((l) => l.lineup === filterLineup);
  if (missingOnly) {
    models = models.filter((l) => !l.processorOptions && !l.displayOptions);
  }

  // Load existing data if resuming
  let existing: ScrapeResult | null = null;
  if (resume && fs.existsSync(OUTPUT_PATH)) {
    existing = JSON.parse(fs.readFileSync(OUTPUT_PATH, "utf-8")) as ScrapeResult;
    const alreadyScraped = new Set(Object.keys(existing.models));
    models = models.filter((l) => !alreadyScraped.has(l.id));
    console.log(`${CYAN}Resuming — ${alreadyScraped.size} already scraped, ${models.length} remaining${RESET}\n`);
  }

  if (models.length === 0) {
    console.log(`${GREEN}No models to scrape.${RESET}`);
    return;
  }

  console.log(`${CYAN}Scraping ${models.length} model(s)...${RESET}\n`);

  const browser = await chromium.launch({ headless: !headful });
  const context = await browser.newContext({
    userAgent:
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  });
  const page = await context.newPage();

  // Accept cookies on PSREF homepage before scraping
  console.log(`${DIM}Accepting PSREF cookies...${RESET}`);
  try {
    await page.goto("https://psref.lenovo.com/", { waitUntil: "load", timeout: 30000 });
    await page.waitForTimeout(2000);
    await page.evaluate(() => {
      const buttons = document.querySelectorAll("button, a");
      for (const btn of buttons) {
        if (/^Accept$/i.test((btn as HTMLElement).textContent?.trim() || "")) {
          (btn as HTMLElement).click();
          return;
        }
      }
    });
    await page.waitForTimeout(1000);
  } catch {
    console.log(`${DIM}  Cookie acceptance skipped${RESET}`);
  }

  const result: ScrapeResult = existing || {
    scrapedAt: new Date().toISOString(),
    totalModels: 0,
    successCount: 0,
    failCount: 0,
    warningCount: 0,
    models: {},
  };

  let successCount = 0;
  let failCount = 0;
  let warningCount = 0;

  for (let i = 0; i < models.length; i++) {
    const laptop = models[i];
    const progress = `[${i + 1}/${models.length}]`;

    let scraped: ScrapedModel | null = null;
    for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
      try {
        scraped = await scrapePsrefPage(page, laptop);
        if (!scraped.error) break;
        if (attempt < MAX_RETRIES) {
          console.log(`  ${DIM}Retry ${attempt + 1}/${MAX_RETRIES}...${RESET}`);
          await page.waitForTimeout(DELAY_MS);
        }
      } catch (err) {
        if (attempt === MAX_RETRIES) {
          scraped = {
            id: laptop.id,
            name: laptop.name,
            psrefUrl: laptop.psrefUrl || "",
            scrapedAt: new Date().toISOString(),
            processors: [],
            displays: [],
            rams: [],
            storages: [],
            gpus: [],
            warnings: [],
            error: err instanceof Error ? err.message : String(err),
          };
        }
      }
    }

    if (!scraped) continue;

    result.models[laptop.id] = scraped;

    if (scraped.error) {
      failCount++;
      console.log(`${RED}✗${RESET} ${progress} ${laptop.name} — ${scraped.error}`);
    } else {
      successCount++;
      const procCount = scraped.processors.length;
      const dispCount = scraped.displays.length;
      const warns = scraped.warnings.length;

      if (warns > 0) {
        warningCount += warns;
        console.log(
          `${YELLOW}⚠${RESET} ${progress} ${laptop.name} — ${procCount} CPUs, ${dispCount} displays (${warns} warnings)`,
        );
        for (const w of scraped.warnings) {
          console.log(`  ${DIM}${w}${RESET}`);
        }
      } else {
        console.log(
          `${GREEN}✓${RESET} ${progress} ${laptop.name} — ${procCount} CPUs, ${dispCount} displays, ${scraped.rams.length} RAM, ${scraped.storages.length} storage, ${scraped.gpus.length} GPUs`,
        );
      }
    }

    // Save incrementally
    result.totalModels = Object.keys(result.models).length;
    result.successCount = (existing?.successCount || 0) + successCount;
    result.failCount = (existing?.failCount || 0) + failCount;
    result.warningCount = (existing?.warningCount || 0) + warningCount;
    fs.writeFileSync(OUTPUT_PATH, JSON.stringify(result, null, 2));

    // Rate limit
    if (i < models.length - 1) {
      await page.waitForTimeout(DELAY_MS);
    }
  }

  await browser.close();

  // Summary
  console.log(`\n${BOLD}Summary${RESET}`);
  console.log(`  ${GREEN}Success: ${successCount}${RESET}`);
  console.log(`  ${RED}Failed:  ${failCount}${RESET}`);
  console.log(`  ${YELLOW}Warnings: ${warningCount}${RESET}`);
  console.log(`  Output:  ${OUTPUT_PATH}\n`);
};

main().catch((err) => {
  console.error(`${RED}${BOLD}FATAL: Scraper crashed${RESET}`);
  console.error(err instanceof Error ? err.stack : String(err));
  process.exit(1);
});
