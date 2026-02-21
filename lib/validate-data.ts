/**
 * Data validation engine — shared by CLI script and /validate page.
 * Checks all data files for consistency errors and coverage warnings.
 */
import type { Lineup, Series } from "@/lib/types";
import { laptops } from "@/data/laptops";
import { cpuBenchmarksExpanded } from "@/data/cpu-benchmarks";
import { gpuBenchmarks } from "@/data/gpu-benchmarks";
import { linuxCompat } from "@/data/linux-compat";
import { modelEditorial } from "@/data/model-editorial";
import { seedPrices } from "@/data/seed-prices";
import { priceBaselines } from "@/data/price-baselines";
import { cpuGuide, gpuGuide } from "@/data/hardware-guide";
import { modelBenchmarks } from "@/data/model-benchmarks";

// --- Types ---

export type IssueLevel = "error" | "warning" | "info";

export type ValidationCategory =
  | "Critical"
  | "Validation Crash"
  | "Duplicate ID"
  | "Invalid Lineup/Series"
  | "Missing CPU Benchmark"
  | "Missing GPU Benchmark"
  | "Impossible Spec"
  | "Spec Outlier"
  | "Missing Linux Compat"
  | "Missing Editorial"
  | "Missing Seed Price"
  | "Missing Price Baseline"
  | "Price Inversion"
  | "Orphan Seed Price"
  | "Orphan Price Baseline"
  | "Orphan Linux Compat"
  | "Orphan Editorial"
  | "Duplicate Seed Price ID"
  | "Missing CPU Guide"
  | "Missing GPU Guide"
  | "Unused CPU Benchmark"
  | "Unused GPU Benchmark"
  | "Missing Model Benchmark"
  | "Orphan Model Benchmark"
  | "Model Count"
  | "Benchmark Count"
  | "Coverage";

export interface ValidationIssue {
  readonly level: IssueLevel;
  readonly category: ValidationCategory;
  readonly modelId?: string;
  readonly message: string;
}

export interface ValidationResult {
  readonly errors: readonly ValidationIssue[];
  readonly warnings: readonly ValidationIssue[];
  readonly info: readonly ValidationIssue[];
}

// --- Valid combos ---

const VALID_SERIES = {
  ThinkPad: ["X1", "T", "P", "L", "E"],
  "IdeaPad Pro": ["Pro 5", "Pro 5i", "Pro 7"],
  Legion: ["5", "5i", "7", "7i", "Pro", "Slim"],
} as const satisfies Record<Lineup, readonly Series[]>;

// --- Issue dispatcher (keeps level and array in sync) ---

const createDispatcher = () => {
  const errors: ValidationIssue[] = [];
  const warnings: ValidationIssue[] = [];
  const info: ValidationIssue[] = [];

  const push = (level: IssueLevel, category: ValidationCategory, message: string, modelId?: string) => {
    const entry: ValidationIssue = { level, category, modelId, message };
    if (level === "error") errors.push(entry);
    else if (level === "warning") warnings.push(entry);
    else info.push(entry);
  };

  return { errors, warnings, info, push };
};

// --- Core validation ---

export const validateAllData = (): ValidationResult => {
  const { errors, warnings, info, push } = createDispatcher();

  // Early guard: empty laptops array means data file is broken
  if (laptops.length === 0) {
    push("error", "Critical", "laptops array is empty — data file may be broken or missing");
    return { errors, warnings, info };
  }

  const laptopIds = new Set<string>();
  const referencedCpus = new Set<string>();
  const referencedGpus = new Set<string>();

  for (const laptop of laptops) {
    try {
      // --- Duplicate IDs ---
      if (laptopIds.has(laptop.id)) {
        push("error", "Duplicate ID", `Duplicate laptop ID: "${laptop.id}"`, laptop.id);
      }
      laptopIds.add(laptop.id);

      // --- Invalid lineup/series combo ---
      const validSeries: readonly Series[] = VALID_SERIES[laptop.lineup];
      if (!validSeries?.includes(laptop.series)) {
        push(
          "error",
          "Invalid Lineup/Series",
          `Series "${laptop.series}" is not valid for lineup "${laptop.lineup}" (valid: ${validSeries?.join(", ")})`,
          laptop.id,
        );
      }

      // --- CPU benchmark missing ---
      const allCpus = [laptop.processor.name, ...(laptop.processorOptions?.map((p) => p.name) ?? [])];
      for (const cpuName of allCpus) {
        referencedCpus.add(cpuName);
        if (!Object.hasOwn(cpuBenchmarksExpanded, cpuName)) {
          push(
            "error",
            "Missing CPU Benchmark",
            `CPU "${cpuName}" not found in cpuBenchmarksExpanded — model will show score 0`,
            laptop.id,
          );
        }
      }

      // --- GPU benchmark missing ---
      const allGpus = [laptop.gpu.name, ...(laptop.gpuOptions?.map((g) => g.name) ?? [])];
      for (const gpuName of allGpus) {
        referencedGpus.add(gpuName);
        if (!Object.hasOwn(gpuBenchmarks, gpuName)) {
          push(
            "error",
            "Missing GPU Benchmark",
            `GPU "${gpuName}" not found in gpuBenchmarks — model will show GPU score 0`,
            laptop.id,
          );
        }
      }

      // --- Impossible specs ---
      if (laptop.weight <= 0) push("error", "Impossible Spec", `Weight is ${laptop.weight}kg (must be > 0)`, laptop.id);
      if (laptop.battery.whr <= 0)
        push("error", "Impossible Spec", `Battery is ${laptop.battery.whr}Whr (must be > 0)`, laptop.id);
      if (laptop.display.nits <= 0)
        push("error", "Impossible Spec", `Display brightness is ${laptop.display.nits} nits (must be > 0)`, laptop.id);
      if (laptop.processor.cores <= 0)
        push("error", "Impossible Spec", `Processor cores is ${laptop.processor.cores} (must be > 0)`, laptop.id);
      if (laptop.ram.size <= 0)
        push("error", "Impossible Spec", `RAM is ${laptop.ram.size}GB (must be > 0)`, laptop.id);
      if (laptop.storage.size <= 0)
        push("error", "Impossible Spec", `Storage is ${laptop.storage.size}GB (must be > 0)`, laptop.id);

      // --- Spec range outliers (warnings) ---
      if (laptop.weight > 4)
        push("warning", "Spec Outlier", `Weight ${laptop.weight}kg exceeds 4kg — verify this is correct`, laptop.id);
      if (laptop.battery.whr > 100)
        push(
          "warning",
          "Spec Outlier",
          `Battery ${laptop.battery.whr}Whr exceeds 100Whr — verify this is correct`,
          laptop.id,
        );
      if (laptop.display.nits < 200)
        push(
          "warning",
          "Spec Outlier",
          `Display brightness ${laptop.display.nits} nits is below 200 — verify this is correct`,
          laptop.id,
        );
      if (laptop.year < 2018 || laptop.year > 2026)
        push("warning", "Spec Outlier", `Year ${laptop.year} is outside expected range (2018–2026)`, laptop.id);

      // --- Missing coverage (warnings) ---
      if (!Object.hasOwn(linuxCompat, laptop.id))
        push("warning", "Missing Linux Compat", `No linux-compat entry for "${laptop.name}"`, laptop.id);
      if (!Object.hasOwn(modelEditorial, laptop.id))
        push("warning", "Missing Editorial", `No editorial entry for "${laptop.name}"`, laptop.id);
      if (!seedPrices.some((p) => p.laptopId === laptop.id))
        push("warning", "Missing Seed Price", `No seed prices for "${laptop.name}"`, laptop.id);
      if (!Object.hasOwn(priceBaselines, laptop.id))
        push("warning", "Missing Price Baseline", `No price baseline for "${laptop.name}"`, laptop.id);
    } catch (err) {
      push(
        "error",
        "Validation Crash",
        `Validator crashed processing this model: ${err instanceof Error ? err.message : String(err)}`,
        laptop?.id ?? "unknown",
      );
    }
  }

  // --- Price baseline inversions ---
  for (const [id, baseline] of Object.entries(priceBaselines)) {
    if (baseline.msrp < baseline.typicalRetail) {
      push("error", "Price Inversion", `MSRP (${baseline.msrp}) < typical retail (${baseline.typicalRetail})`, id);
    }
    if (baseline.typicalRetail < baseline.historicalLow) {
      push(
        "error",
        "Price Inversion",
        `Typical retail (${baseline.typicalRetail}) < historical low (${baseline.historicalLow})`,
        id,
      );
    }
  }

  // --- Seed price orphans + duplicate IDs ---
  const seedPriceIds = new Set<string>();
  for (const price of seedPrices) {
    if (!laptopIds.has(price.laptopId)) {
      push(
        "error",
        "Orphan Seed Price",
        `Seed price "${price.id}" references unknown laptop ID "${price.laptopId}"`,
        price.laptopId,
      );
    }
    if (seedPriceIds.has(price.id)) {
      push("error", "Duplicate Seed Price ID", `Duplicate seed price ID: "${price.id}"`, price.laptopId);
    }
    seedPriceIds.add(price.id);
  }

  // --- Price baseline orphans ---
  for (const id of Object.keys(priceBaselines)) {
    if (!laptopIds.has(id)) {
      push("error", "Orphan Price Baseline", `Price baseline references unknown laptop ID "${id}"`, id);
    }
  }

  // --- Linux compat orphans ---
  for (const id of Object.keys(linuxCompat)) {
    if (!laptopIds.has(id)) {
      push("warning", "Orphan Linux Compat", `Linux compat entry references unknown laptop ID "${id}"`, id);
    }
  }

  // --- Editorial orphans ---
  for (const id of Object.keys(modelEditorial)) {
    if (!laptopIds.has(id)) {
      push("warning", "Orphan Editorial", `Editorial entry references unknown laptop ID "${id}"`, id);
    }
  }

  // --- Model benchmark orphans ---
  for (const id of Object.keys(modelBenchmarks)) {
    if (!laptopIds.has(id)) {
      push("warning", "Orphan Model Benchmark", `Model benchmark entry references unknown laptop ID "${id}"`, id);
    }
  }

  // --- Missing hardware guide entries (warnings) ---
  for (const cpuName of Array.from(referencedCpus)) {
    if (!Object.hasOwn(cpuGuide, cpuName)) {
      push("warning", "Missing CPU Guide", `No hardware guide entry for CPU "${cpuName}"`);
    }
  }
  for (const gpuName of Array.from(referencedGpus)) {
    if (!Object.hasOwn(gpuGuide, gpuName)) {
      push("warning", "Missing GPU Guide", `No hardware guide entry for GPU "${gpuName}"`);
    }
  }

  // --- Unused benchmark entries (warnings) ---
  for (const cpuName of Object.keys(cpuBenchmarksExpanded)) {
    if (!referencedCpus.has(cpuName)) {
      push("warning", "Unused CPU Benchmark", `CPU benchmark "${cpuName}" is not referenced by any model`);
    }
  }
  for (const gpuName of Object.keys(gpuBenchmarks)) {
    if (!referencedGpus.has(gpuName)) {
      push("warning", "Unused GPU Benchmark", `GPU benchmark "${gpuName}" is not referenced by any model`);
    }
  }

  // --- Stats (info) ---
  const lineupCounts: Record<string, number> = {};
  for (const laptop of laptops) {
    lineupCounts[laptop.lineup] = (lineupCounts[laptop.lineup] ?? 0) + 1;
  }
  for (const [lineup, count] of Object.entries(lineupCounts)) {
    push("info", "Model Count", `${lineup}: ${count} models`);
  }
  push("info", "Model Count", `Total: ${laptops.length} models`);
  push(
    "info",
    "Benchmark Count",
    `CPU benchmarks: ${Object.keys(cpuBenchmarksExpanded).length} entries (${referencedCpus.size} referenced)`,
  );
  push(
    "info",
    "Benchmark Count",
    `GPU benchmarks: ${Object.keys(gpuBenchmarks).length} entries (${referencedGpus.size} referenced)`,
  );

  const total = laptops.length;
  const linuxCoverage = Math.round((Object.keys(linuxCompat).filter((id) => laptopIds.has(id)).length / total) * 100);
  const editorialCoverage = Math.round(
    (Object.keys(modelEditorial).filter((id) => laptopIds.has(id)).length / total) * 100,
  );
  const priceCoverage = Math.round(
    (Array.from(new Set(seedPrices.map((p) => p.laptopId).filter((id) => laptopIds.has(id)))).length / total) * 100,
  );
  const baselineCoverage = Math.round(
    (Object.keys(priceBaselines).filter((id) => laptopIds.has(id)).length / total) * 100,
  );

  const benchmarkCoverage = Math.round(
    (Object.keys(modelBenchmarks).filter((id) => laptopIds.has(id)).length / total) * 100,
  );

  push("info", "Coverage", `Linux compat: ${linuxCoverage}%`);
  push("info", "Coverage", `Editorial: ${editorialCoverage}%`);
  push("info", "Coverage", `Seed prices: ${priceCoverage}%`);
  push("info", "Coverage", `Price baselines: ${baselineCoverage}%`);
  push("info", "Coverage", `Model benchmarks: ${benchmarkCoverage}%`);

  return { errors, warnings, info };
};

// --- Helpers ---

/** Categories where modelId references a non-existent laptop (links would 404) */
export const ORPHAN_CATEGORIES: ReadonlySet<ValidationCategory> = new Set<ValidationCategory>([
  "Orphan Seed Price",
  "Orphan Price Baseline",
  "Orphan Linux Compat",
  "Orphan Editorial",
  "Orphan Model Benchmark",
]);

export const groupByCategory = (
  issues: readonly ValidationIssue[],
): readonly [string, readonly ValidationIssue[]][] => {
  const map = new Map<string, ValidationIssue[]>();
  for (const issue of issues) {
    const existing = map.get(issue.category);
    if (existing) {
      existing.push(issue);
    } else {
      map.set(issue.category, [issue]);
    }
  }
  return Array.from(map.entries());
};
