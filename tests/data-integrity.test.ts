import { describe, it, expect } from "vitest";
import { laptops } from "@/data/laptops";
import { cpuBenchmarks, cpuBenchmarksExpanded } from "@/data/cpu-benchmarks";
import { gpuBenchmarks } from "@/data/gpu-benchmarks";
import { modelBenchmarks } from "@/data/model-benchmarks";
import { linuxCompat } from "@/data/linux-compat";
import { modelEditorial } from "@/data/model-editorial";
import { priceBaselines } from "@/data/price-baselines";
import { seedPrices } from "@/data/seed-prices";

describe("data integrity", () => {
  it("has no duplicate laptop IDs", () => {
    const ids = laptops.map((l) => l.id);
    const unique = new Set(ids);
    expect(unique.size).toBe(ids.length);
  });

  it("every laptop CPU (base + options) has a benchmark entry", () => {
    const missing: string[] = [];
    for (const l of laptops) {
      const allCpus = [l.processor.name, ...(l.processorOptions?.map((p) => p.name) ?? [])];
      for (const cpu of allCpus) {
        if (!cpuBenchmarks[cpu]) missing.push(`${l.id}: ${cpu}`);
      }
    }
    expect(missing).toEqual([]);
  });

  it("every laptop GPU (base + options) has a benchmark entry", () => {
    const missing: string[] = [];
    for (const l of laptops) {
      const allGpus = [l.gpu.name, ...(l.gpuOptions?.map((g) => g.name) ?? [])];
      for (const gpu of allGpus) {
        if (!gpuBenchmarks[gpu]) missing.push(`${l.id}: ${gpu}`);
      }
    }
    expect(missing).toEqual([]);
  });

  it("every model-benchmarks key matches a laptop ID", () => {
    const laptopIds = new Set(laptops.map((l) => l.id));
    const orphaned = Object.keys(modelBenchmarks).filter((k) => !laptopIds.has(k));
    expect(orphaned).toEqual([]);
  });

  it("all model-benchmarks have valid sources", () => {
    const validSources = new Set([
      "notebookcheck",
      "geekbench",
      "tomshardware",
      "jarrodtech",
      "justjoshtech",
      "community",
    ]);
    const invalid: string[] = [];
    for (const [id, bench] of Object.entries(modelBenchmarks)) {
      if (bench.sources) {
        for (const src of bench.sources) {
          if (!validSources.has(src)) {
            invalid.push(`${id}: ${src}`);
          }
        }
      }
    }
    expect(invalid).toEqual([]);
  });

  it("every laptop CPU option has expanded benchmark data (single/multi core)", () => {
    const missing: string[] = [];
    for (const l of laptops) {
      const allCpus = [l.processor.name, ...(l.processorOptions?.map((p) => p.name) ?? [])];
      for (const cpu of allCpus) {
        if (!cpuBenchmarksExpanded[cpu]) missing.push(`${l.id}: ${cpu}`);
      }
    }
    expect(missing).toEqual([]);
  });

  it("every laptop has a model-benchmarks entry", () => {
    const missing = laptops.filter((l) => !modelBenchmarks[l.id]);
    expect(missing.map((l) => l.id)).toEqual([]);
  });

  it("every laptop has a linux-compat entry", () => {
    const missing = laptops.filter((l) => !linuxCompat[l.id]);
    expect(missing.map((l) => l.id)).toEqual([]);
  });

  it("every laptop has an editorial entry", () => {
    const missing = laptops.filter((l) => !modelEditorial[l.id]);
    expect(missing.map((l) => l.id)).toEqual([]);
  });

  it("every laptop has a price-baseline entry", () => {
    const missing = laptops.filter((l) => !priceBaselines[l.id]);
    expect(missing.map((l) => l.id)).toEqual([]);
  });

  it("every laptop has at least one seed price", () => {
    const priced = new Set(seedPrices.map((p) => p.laptopId));
    const missing = laptops.filter((l) => !priced.has(l.id));
    expect(missing.map((l) => l.id)).toEqual([]);
  });

  it("thermal values are plausible", () => {
    const issues: string[] = [];
    for (const [id, bench] of Object.entries(modelBenchmarks)) {
      if (bench.thermals) {
        if (bench.thermals.keyboardMaxC > 60 || bench.thermals.keyboardMaxC < 20) {
          issues.push(`${id}: keyboard ${bench.thermals.keyboardMaxC}°C out of range`);
        }
        if (bench.thermals.undersideMaxC > 65 || bench.thermals.undersideMaxC < 20) {
          issues.push(`${id}: underside ${bench.thermals.undersideMaxC}°C out of range`);
        }
      }
    }
    expect(issues).toEqual([]);
  });
});
