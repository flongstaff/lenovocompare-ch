import { describe, it, expect } from "vitest";
import { laptops } from "@/data/laptops";
import { cpuBenchmarks } from "@/data/cpu-benchmarks";
import { gpuBenchmarks } from "@/data/gpu-benchmarks";
import { modelBenchmarks } from "@/data/model-benchmarks";

describe("data integrity", () => {
  it("has no duplicate laptop IDs", () => {
    const ids = laptops.map((l) => l.id);
    const unique = new Set(ids);
    expect(unique.size).toBe(ids.length);
  });

  it("every laptop has a CPU benchmark entry", () => {
    const missing = laptops.filter((l) => !cpuBenchmarks[l.processor.name]);
    expect(missing.map((l) => `${l.id}: ${l.processor.name}`)).toEqual([]);
  });

  it("every laptop has a GPU benchmark entry", () => {
    const missing = laptops.filter((l) => !gpuBenchmarks[l.gpu.name]);
    expect(missing.map((l) => `${l.id}: ${l.gpu.name}`)).toEqual([]);
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
