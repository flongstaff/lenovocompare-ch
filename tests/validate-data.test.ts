import { describe, it, expect, vi, beforeEach } from "vitest";

// Minimal fixture laptop — only fields accessed by validateAllData
const makeFixtureLaptop = (overrides: Record<string, unknown> = {}) => ({
  id: "test-laptop-1",
  name: "Test Laptop 1",
  lineup: "ThinkPad" as const,
  series: "X1" as const,
  year: 2024,
  psrefUrl: "https://psref.lenovo.com/Product/ThinkPad/Lenovo_ThinkPad_X1_Carbon_Gen12_21KC",
  processor: { name: "Intel Core Ultra 7 155H", cores: 16, threads: 22 },
  gpu: { name: "Intel Arc Graphics (MTL)", type: "Integrated" as const },
  ram: { size: 16, type: "LPDDR5x" },
  storage: { size: 512, type: "NVMe" },
  display: { size: 14, resolution: "2880x1800", nits: 400, panel: "IPS" },
  battery: { whr: 57 },
  weight: 1.24,
  keyboard: { backlit: true },
  ...overrides,
});

// Mock all data modules before any imports of validate-data
vi.mock("@/data/laptops", () => ({
  laptops: [makeFixtureLaptop()],
}));

vi.mock("@/data/cpu-benchmarks", () => ({
  cpuBenchmarks: { "Intel Core Ultra 7 155H": 78 },
  cpuBenchmarksExpanded: {
    "Intel Core Ultra 7 155H": { singleCore: 80, multiCore: 76, composite: 78, tdp: 28 },
  },
}));

vi.mock("@/data/gpu-benchmarks", () => ({
  gpuBenchmarks: { "Intel Arc Graphics (MTL)": { score: 22, tier: "integrated" } },
}));

vi.mock("@/data/model-benchmarks", () => ({
  modelBenchmarks: {
    "test-laptop-1": { sources: ["notebookcheck"] },
  },
}));

vi.mock("@/data/linux-compat", () => ({
  linuxCompat: { "test-laptop-1": { status: "certified" } },
}));

vi.mock("@/data/model-editorial", () => ({
  modelEditorial: { "test-laptop-1": { summary: "Test editorial" } },
}));

vi.mock("@/data/seed-prices", () => ({
  seedPrices: [
    {
      id: "sp-test-1",
      laptopId: "test-laptop-1",
      price: 1499,
      dateAdded: "2025-12-01",
      retailer: "digitec",
      priceType: "regular",
      note: "",
    },
  ],
}));

vi.mock("@/data/price-baselines", () => ({
  priceBaselines: {
    "test-laptop-1": { msrp: 1799, typicalRetail: 1599, historicalLow: 1399 },
  },
}));

vi.mock("@/data/hardware-guide", () => ({
  cpuGuide: { "Intel Core Ultra 7 155H": { summary: "Good CPU" } },
  gpuGuide: { "Intel Arc Graphics (MTL)": { summary: "Good iGPU" } },
}));

describe("validateAllData", () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it("reports Invalid PSREF URL when psrefUrl prefix mismatches lineup", async () => {
    // Re-mock laptops with a ThinkPad that has an IdeaPad URL
    vi.doMock("@/data/laptops", () => ({
      laptops: [
        makeFixtureLaptop({
          psrefUrl: "https://psref.lenovo.com/Product/IdeaPad/IdeaPad_Pro_5_16AHP9",
        }),
      ],
    }));

    const { validateAllData } = await import("@/lib/validate-data");
    const result = validateAllData();

    const psrefErrors = result.errors.filter((e) => e.category === "Invalid PSREF URL");
    expect(psrefErrors.length).toBeGreaterThanOrEqual(1);
    expect(psrefErrors[0].modelId).toBe("test-laptop-1");
  });

  it("reports Seed Price Out of Range for negative price", async () => {
    vi.doMock("@/data/seed-prices", () => ({
      seedPrices: [
        {
          id: "sp-bad",
          laptopId: "test-laptop-1",
          price: -10,
          dateAdded: "2025-12-01",
          retailer: "digitec",
          priceType: "regular",
          note: "",
        },
      ],
    }));

    const { validateAllData } = await import("@/lib/validate-data");
    const result = validateAllData();

    const rangeErrors = result.errors.filter((e) => e.category === "Seed Price Out of Range");
    expect(rangeErrors.length).toBeGreaterThanOrEqual(1);
    expect(rangeErrors[0].message).toContain("-10");
  });

  it("reports Price Inversion when msrp < typicalRetail", async () => {
    vi.doMock("@/data/price-baselines", () => ({
      priceBaselines: {
        "test-laptop-1": { msrp: 800, typicalRetail: 1000, historicalLow: 700 },
      },
    }));

    const { validateAllData } = await import("@/lib/validate-data");
    const result = validateAllData();

    const inversionErrors = result.errors.filter((e) => e.category === "Price Inversion");
    expect(inversionErrors.length).toBeGreaterThanOrEqual(1);
    expect(inversionErrors[0].message).toContain("800");
    expect(inversionErrors[0].message).toContain("1000");
  });
});

describe("groupByCategory", () => {
  it("groups issues by their category field", async () => {
    const { groupByCategory } = await import("@/lib/validate-data");

    const issues = [
      { level: "error" as const, category: "Duplicate ID" as const, message: "dup 1" },
      { level: "error" as const, category: "Duplicate ID" as const, message: "dup 2" },
      { level: "warning" as const, category: "Spec Outlier" as const, message: "outlier 1" },
    ];

    const grouped = groupByCategory(issues);
    const map = new Map(grouped);

    expect(map.has("Duplicate ID")).toBe(true);
    expect(map.get("Duplicate ID")?.length).toBe(2);
    expect(map.has("Spec Outlier")).toBe(true);
    expect(map.get("Spec Outlier")?.length).toBe(1);
  });
});
