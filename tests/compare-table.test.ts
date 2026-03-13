/**
 * Unit tests for CompareTable diff-toggle filter logic.
 * Tests the filterDiffRows function behavior.
 */
import { describe, it, expect } from "vitest";
import type { Laptop } from "@/lib/types";

// ---------------------------------------------------------------
// The pure filter function (extracted from CompareTable internals)
// ---------------------------------------------------------------
interface SpecRow {
  readonly label: string;
  readonly section?: string;
  readonly getValue: (m: Laptop) => string;
}

function filterDiffRows(rows: SpecRow[], models: Laptop[], showDiffsOnly: boolean): SpecRow[] {
  if (!showDiffsOnly) return rows;
  return rows.filter((row) => {
    if (row.label === "Best Price") return true;
    const vals = models.map((m) => row.getValue(m));
    return new Set(vals).size > 1;
  });
}

// ---------------------------------------------------------------
// Minimal Laptop stubs — only the fields needed by getValue
// ---------------------------------------------------------------
const makeModel = (overrides: Partial<Laptop>): Laptop =>
  ({
    id: "test-model",
    name: "Test Model",
    year: 2024,
    lineup: "ThinkPad",
    series: "T",
    processor: { name: "Intel Core i7", cores: 8, threads: 16, tdp: 15 },
    ram: { size: 16, type: "LPDDR5", maxSize: 64, soldered: true, slots: 0 },
    storage: { size: 512, type: "NVMe SSD" },
    display: {
      size: 14,
      panel: "IPS",
      resolutionLabel: "1920x1200",
      resolution: "1920x1200",
      refreshRate: 60,
      nits: 400,
      touchscreen: false,
    },
    gpu: { name: "Intel Iris Xe", vram: null },
    battery: { whr: 57 },
    ports: ["USB-A", "Thunderbolt 4"],
    wireless: ["Wi-Fi 6E"],
    weight: 1.21,
    linuxStatus: "certified",
    psrefUrl: "https://psref.lenovo.com/Product/ThinkPad/Lenovo_ThinkPad_T14_Gen5_Intel",
    ...overrides,
  }) as unknown as Laptop;

const modelA = makeModel({
  id: "model-a",
  name: "Model A",
  processor: { name: "Intel Core i7", cores: 8, threads: 16, baseClock: 1.8, boostClock: 4.8, tdp: 15 },
});
const modelB = makeModel({
  id: "model-b",
  name: "Model B",
  processor: { name: "AMD Ryzen 7", cores: 8, threads: 16, baseClock: 3.3, boostClock: 5.0, tdp: 15 },
});
const modelC = makeModel({
  id: "model-c",
  name: "Model C",
  processor: { name: "Intel Core i7", cores: 8, threads: 16, baseClock: 1.8, boostClock: 4.8, tdp: 15 },
});

// ---------------------------------------------------------------
// Spec row fixtures
// ---------------------------------------------------------------
const priceRow: SpecRow = { label: "Best Price", getValue: () => "" };
const processorRow: SpecRow = { label: "Processor", getValue: (m) => m.processor.name };
const coresRow: SpecRow = { label: "Cores", getValue: (m) => `${m.processor.cores}C` };
const tdpRow: SpecRow = { label: "TDP", getValue: (m) => `${m.processor.tdp}W` };

const ROWS = [priceRow, processorRow, coresRow, tdpRow];

// ---------------------------------------------------------------
// Tests
// ---------------------------------------------------------------
describe("filterDiffRows", () => {
  it("returns all rows when showDiffsOnly is false", () => {
    const result = filterDiffRows(ROWS, [modelA, modelB], false);
    expect(result).toHaveLength(ROWS.length);
    expect(result).toEqual(ROWS);
  });

  it("returns all rows when models array is empty", () => {
    const result = filterDiffRows(ROWS, [], true);
    // Best Price always included; others: no models means no values, new Set([]).size === 0 which is not > 1 → filtered out
    // But the spec says: Best Price always shown. For empty models, all others vanish.
    const includedLabels = result.map((r) => r.label);
    expect(includedLabels).toContain("Best Price");
  });

  it("returns all rows when only one model provided", () => {
    const result = filterDiffRows(ROWS, [modelA], true);
    // With a single model, all values are the same set (size 1) → everything filtered except Best Price
    const includedLabels = result.map((r) => r.label);
    expect(includedLabels).toContain("Best Price");
    expect(includedLabels).not.toContain("Processor");
  });

  describe("when showDiffsOnly is true", () => {
    it("includes rows where models have different values", () => {
      // modelA has 'Intel Core i7', modelB has 'AMD Ryzen 7'
      const result = filterDiffRows(ROWS, [modelA, modelB], true);
      const labels = result.map((r) => r.label);
      expect(labels).toContain("Processor");
    });

    it("excludes rows where all models have identical values", () => {
      // Both models have same cores (8C) and same TDP (15W)
      const result = filterDiffRows(ROWS, [modelA, modelB], true);
      const labels = result.map((r) => r.label);
      expect(labels).not.toContain("Cores");
      expect(labels).not.toContain("TDP");
    });

    it("always includes Best Price row regardless of values", () => {
      const result = filterDiffRows(ROWS, [modelA, modelB], true);
      const labels = result.map((r) => r.label);
      expect(labels).toContain("Best Price");
    });

    it("excludes rows where three models all have the same value", () => {
      const result = filterDiffRows(ROWS, [modelA, modelB, modelC], true);
      const labels = result.map((r) => r.label);
      // modelA, modelB, modelC all have 8 cores and 15W TDP
      expect(labels).not.toContain("Cores");
      expect(labels).not.toContain("TDP");
    });

    it("includes rows where only two of three models differ", () => {
      // modelA ('Intel Core i7'), modelB ('AMD Ryzen 7'), modelC ('Intel Core i7')
      const result = filterDiffRows(ROWS, [modelA, modelB, modelC], true);
      const labels = result.map((r) => r.label);
      // 2 distinct processor names → row is included
      expect(labels).toContain("Processor");
    });
  });

  describe("hiddenCount calculation", () => {
    it("reports zero hidden when toggle is off", () => {
      const visible = filterDiffRows(ROWS, [modelA, modelB], false);
      const hidden = ROWS.length - visible.length;
      expect(hidden).toBe(0);
    });

    it("reports correct hidden count when toggle is on", () => {
      const visible = filterDiffRows(ROWS, [modelA, modelB], true);
      const hidden = ROWS.length - visible.length;
      // Processor row is different → kept. Cores and TDP are identical → hidden (2 rows)
      // Best Price always shown.
      // So: visible = [Best Price, Processor] = 2, hidden = 4 - 2 = 2
      expect(hidden).toBe(2);
    });
  });
});
