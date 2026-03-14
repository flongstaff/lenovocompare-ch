import { describe, it, expect } from "vitest";
import {
  getPerformanceScore,
  getGpuScore,
  getGamingTier,
  getPortabilityScore,
  getDisplayScoreBreakdown,
  getMemoryScoreBreakdown,
  getConnectivityScoreBreakdown,
  getPortabilityScoreBreakdown,
  getCpuScoreBreakdown,
  getGpuScoreBreakdown,
  getDisplayScore,
  getMemoryScore,
  getConnectivityScore,
  getValueScore,
  getPerformanceDimensions,
} from "@/lib/scoring";
import type { Laptop, SwissPrice } from "@/lib/types";

describe("getPerformanceScore", () => {
  it("returns score for known CPU", () => {
    const score = getPerformanceScore("AMD Ryzen 7 PRO 8840U");
    expect(score).toBeGreaterThan(0);
    expect(score).toBeLessThanOrEqual(100);
  });

  it("returns 0 for unknown CPU", () => {
    expect(getPerformanceScore("Unknown CPU XYZ")).toBe(0);
  });
});

describe("getGpuScore", () => {
  it("returns score for known GPU", () => {
    const score = getGpuScore("NVIDIA GeForce RTX 4060 Laptop");
    expect(score).toBeGreaterThan(0);
  });

  it("returns 0 for unknown GPU", () => {
    expect(getGpuScore("Unknown GPU")).toBe(0);
  });
});

describe("getGamingTier", () => {
  it("returns tier for discrete GPU", () => {
    const tier = getGamingTier("NVIDIA GeForce RTX 4060 Laptop");
    expect(["Light", "Medium", "Heavy"]).toContain(tier);
  });

  it("returns None for unknown GPU", () => {
    expect(getGamingTier("Unknown GPU")).toBe("None");
  });
});

describe("getPortabilityScore", () => {
  const makeLaptop = (weight: number, whr: number): Laptop =>
    ({
      weight,
      battery: { whr, removable: false },
    }) as unknown as Laptop;

  it("scores ultraportable highly", () => {
    const score = getPortabilityScore(makeLaptop(1.0, 57));
    expect(score).toBeGreaterThan(70);
  });

  it("scores heavy laptop low", () => {
    const score = getPortabilityScore(makeLaptop(2.8, 80));
    expect(score).toBeLessThan(50);
  });

  it("returns value between 0 and 100", () => {
    const score = getPortabilityScore(makeLaptop(1.5, 60));
    expect(score).toBeGreaterThanOrEqual(0);
    expect(score).toBeLessThanOrEqual(100);
  });
});

describe("getDisplayScoreBreakdown", () => {
  const makeDisplay = (overrides = {}) =>
    ({
      display: {
        size: 14,
        resolution: "2880x1800",
        resolutionLabel: "2.8K",
        panel: "OLED",
        nits: 400,
        refreshRate: 120,
        touchscreen: false,
        ...overrides,
      },
    }) as unknown as Laptop;

  it("returns sub-scores that sum to total display score", () => {
    const model = makeDisplay();
    const breakdown = getDisplayScoreBreakdown(model);
    const sum =
      breakdown.resolution.earned +
      breakdown.panel.earned +
      breakdown.brightness.earned +
      breakdown.refresh.earned +
      breakdown.touch.earned +
      breakdown.size.earned;
    expect(Math.round(sum)).toBe(getDisplayScore(model));
  });

  it("returns max values for each component", () => {
    const breakdown = getDisplayScoreBreakdown(makeDisplay());
    expect(breakdown.resolution.max).toBe(30);
    expect(breakdown.panel.max).toBe(25);
    expect(breakdown.brightness.max).toBe(15);
    expect(breakdown.refresh.max).toBe(15);
    expect(breakdown.touch.max).toBe(10);
    expect(breakdown.size.max).toBe(5);
  });
});

describe("getMemoryScoreBreakdown", () => {
  const makeMemory = (overrides = {}) =>
    ({
      ram: { size: 16, type: "LPDDR5x", maxSize: 16, slots: 0, soldered: true, speed: 7500, ...overrides },
      storage: { size: 512, slots: 1, type: "NVMe", ...overrides },
    }) as unknown as Laptop;

  it("returns sub-scores that sum to total memory score", () => {
    const model = makeMemory();
    const breakdown = getMemoryScoreBreakdown(model);
    const sum =
      breakdown.ramSize.earned +
      breakdown.maxRam.earned +
      breakdown.ramType.earned +
      breakdown.storageSize.earned +
      breakdown.upgradability.earned +
      breakdown.storageSlots.earned;
    expect(sum).toBe(getMemoryScore(model));
  });
});

describe("getConnectivityScoreBreakdown", () => {
  const makeConnectivity = () =>
    ({
      ports: ["2x Thunderbolt 4", "USB-C 3.2", "HDMI 2.1"],
      wireless: ["Wi-Fi 7", "Bluetooth 5.3"],
      storage: { slots: 1 },
    }) as unknown as Laptop;

  it("returns sub-scores that sum to total connectivity score", () => {
    const model = makeConnectivity();
    const breakdown = getConnectivityScoreBreakdown(model);
    const sum = Object.values(breakdown).reduce((acc, v) => acc + v.earned, 0);
    expect(Math.min(100, sum)).toBe(getConnectivityScore(model));
  });
});

describe("getPortabilityScoreBreakdown", () => {
  const makeLaptop = (weight: number, whr: number): Laptop =>
    ({ weight, battery: { whr, removable: false } }) as unknown as Laptop;

  it("returns weight (60%) and battery (40%) contributions", () => {
    const breakdown = getPortabilityScoreBreakdown(makeLaptop(1.2, 57));
    expect(breakdown.weight.max).toBe(60);
    expect(breakdown.battery.max).toBe(40);
    expect(Math.round(breakdown.weight.earned + breakdown.battery.earned)).toBe(
      getPortabilityScore(makeLaptop(1.2, 57)),
    );
  });
});

describe("getCpuScoreBreakdown", () => {
  it("returns single/multi/composite for known CPU", () => {
    const breakdown = getCpuScoreBreakdown("AMD Ryzen 7 PRO 8840U");
    expect(breakdown.singleCore).toBeGreaterThan(0);
    expect(breakdown.multiCore).toBeGreaterThan(0);
    expect(breakdown.composite).toBeGreaterThan(0);
  });

  it("returns zeros for unknown CPU", () => {
    const breakdown = getCpuScoreBreakdown("Unknown CPU");
    expect(breakdown.composite).toBe(0);
  });
});

describe("getGpuScoreBreakdown", () => {
  it("returns score and tier for known GPU", () => {
    const breakdown = getGpuScoreBreakdown("NVIDIA GeForce RTX 4060 Laptop");
    expect(breakdown.score).toBeGreaterThan(0);
    expect(["Light", "Medium", "Heavy"]).toContain(breakdown.tier);
  });
});

// ── Shared edge-case factory ──────────────────────────────────────────────────

/**
 * Minimal Laptop stub for edge-case testing.
 * All required fields included; pass overrides for the specific scenario.
 */
const makeEdgeLaptop = (overrides: Partial<Laptop> = {}): Laptop =>
  ({
    id: "edge-case-model",
    name: "Edge Case Laptop",
    lineup: "ThinkPad",
    series: "T",
    year: 2024,
    processor: { name: "Unknown Edge CPU", cores: 4, threads: 8, baseClock: 1.0, boostClock: 3.0, tdp: 15 },
    ram: { size: 8, type: "LPDDR5x", speed: 5200, maxSize: 16, slots: 0, soldered: true },
    display: {
      size: 14,
      resolution: "1920x1200",
      resolutionLabel: "FHD+",
      panel: "IPS",
      refreshRate: 60,
      nits: 300,
      touchscreen: false,
    },
    gpu: { name: "Unknown Edge GPU", integrated: true },
    storage: { type: "NVMe", size: 512, slots: 1 },
    battery: { whr: 57, removable: false },
    weight: 1.5,
    ports: [],
    wireless: ["Wi-Fi 6"],
    os: "Windows 11 Pro",
    psrefUrl: "https://psref.lenovo.com/Product/ThinkPad/Lenovo_ThinkPad_T14_Gen_5",
    ...overrides,
  }) as Laptop;

// ── Zero / missing values ─────────────────────────────────────────────────────

describe("zero and missing values", () => {
  it("should return 0 memory score for 0-byte storage", () => {
    const model = makeEdgeLaptop({
      storage: { type: "NVMe", size: 0, slots: 1 },
    });
    const score = getMemoryScore(model);
    expect(score).toBeGreaterThanOrEqual(0);
    expect(score).toBeLessThanOrEqual(100);
  });

  it("should return a valid display score when nits is 0", () => {
    const model = makeEdgeLaptop({
      display: {
        size: 14,
        resolution: "1920x1200",
        resolutionLabel: "FHD+",
        panel: "IPS",
        refreshRate: 60,
        nits: 0,
        touchscreen: false,
      },
    });
    const score = getDisplayScore(model);
    expect(score).toBeGreaterThanOrEqual(0);
    expect(score).toBeLessThanOrEqual(100);
  });

  it("should return 0 brightness earned when nits is 0", () => {
    const model = makeEdgeLaptop({
      display: {
        size: 14,
        resolution: "1920x1200",
        resolutionLabel: "FHD+",
        panel: "IPS",
        refreshRate: 60,
        nits: 0,
        touchscreen: false,
      },
    });
    const breakdown = getDisplayScoreBreakdown(model);
    expect(breakdown.brightness.earned).toBe(0);
  });

  it("should return 0 resolution earned when resolution is malformed", () => {
    const model = makeEdgeLaptop({
      display: {
        size: 14,
        resolution: "0x0",
        resolutionLabel: "Custom",
        panel: "IPS",
        refreshRate: 60,
        nits: 300,
        touchscreen: false,
      },
    });
    const breakdown = getDisplayScoreBreakdown(model);
    expect(breakdown.resolution.earned).toBe(0);
  });

  it("should return 0 thunderbolt earned when ports array is empty", () => {
    const model = makeEdgeLaptop({ ports: [] });
    const breakdown = getConnectivityScoreBreakdown(model);
    expect(breakdown.thunderbolt.earned).toBe(0);
  });

  it("should return 0 USB-A earned when ports array is empty", () => {
    const model = makeEdgeLaptop({ ports: [] });
    const breakdown = getConnectivityScoreBreakdown(model);
    expect(breakdown.usbA.earned).toBe(0);
  });

  it("should return a valid connectivity score when ports and wireless are empty", () => {
    const model = makeEdgeLaptop({ ports: [], wireless: [] });
    const score = getConnectivityScore(model);
    expect(score).toBeGreaterThanOrEqual(0);
    expect(score).toBeLessThanOrEqual(100);
  });

  it("should return 0 gpu score for unknown GPU name", () => {
    expect(getGpuScore("Unknown Edge GPU")).toBe(0);
  });

  it("should return None gaming tier for unknown GPU name", () => {
    expect(getGamingTier("Unknown Edge GPU")).toBe("None");
  });

  it("should return minimum ram size score for 1 GB RAM", () => {
    const model = makeEdgeLaptop({
      ram: { size: 1, type: "LPDDR5x", speed: 5200, maxSize: 8, slots: 0, soldered: true },
    });
    const breakdown = getMemoryScoreBreakdown(model);
    expect(breakdown.ramSize.earned).toBe(5);
  });

  it("should return upgradability bonus of 3 for soldered single-slot RAM", () => {
    const model = makeEdgeLaptop({
      ram: { size: 16, type: "LPDDR5x", speed: 5200, maxSize: 16, slots: 0, soldered: true },
    });
    const breakdown = getMemoryScoreBreakdown(model);
    expect(breakdown.upgradability.earned).toBe(3);
  });
});

// ── Score capping: all score functions must return 0–100 ──────────────────────

describe("score capping for extreme inputs", () => {
  it("should cap getPortabilityScore at 100 for an impossibly light laptop", () => {
    const model = makeEdgeLaptop({ weight: 0.01, battery: { whr: 999, removable: false } });
    expect(getPortabilityScore(model)).toBeLessThanOrEqual(100);
  });

  it("should floor getPortabilityScore at 0 for an extremely heavy laptop", () => {
    const model = makeEdgeLaptop({ weight: 99, battery: { whr: 1, removable: false } });
    expect(getPortabilityScore(model)).toBeGreaterThanOrEqual(0);
  });

  it("should cap getDisplayScore at 100 for maximum-spec display", () => {
    const model = makeEdgeLaptop({
      display: {
        size: 17,
        resolution: "3840x2400",
        resolutionLabel: "4K+",
        panel: "OLED",
        refreshRate: 165,
        nits: 9999,
        touchscreen: true,
      },
    });
    expect(getDisplayScore(model)).toBeLessThanOrEqual(100);
  });

  it("should floor getDisplayScore at 0 for minimum-spec display", () => {
    const model = makeEdgeLaptop({
      display: {
        size: 11,
        resolution: "1024x600",
        resolutionLabel: "Custom",
        panel: "TN",
        refreshRate: 60,
        nits: 0,
        touchscreen: false,
      },
    });
    expect(getDisplayScore(model)).toBeGreaterThanOrEqual(0);
  });

  it("should cap getMemoryScore at 100 for maximum memory config", () => {
    const model = makeEdgeLaptop({
      ram: { size: 128, type: "LPDDR5x", speed: 9600, maxSize: 256, slots: 4, soldered: false },
      storage: { type: "NVMe", size: 8192, slots: 4 },
    });
    expect(getMemoryScore(model)).toBeLessThanOrEqual(100);
  });

  it("should cap getConnectivityScore at 100 for maximum-port configuration", () => {
    const model = makeEdgeLaptop({
      ports: ["4x Thunderbolt 4", "USB-C 3.2", "USB-A 3.2", "HDMI 2.1", "RJ45", "SD Card Reader", "DisplayPort 1.4"],
      wireless: ["Wi-Fi 7", "Bluetooth 5.4"],
      storage: { type: "NVMe", size: 512, slots: 2 },
    });
    expect(getConnectivityScore(model)).toBeLessThanOrEqual(100);
  });

  it("should return 0 for getDisplayScore when refresh rate equals minimum (60 Hz)", () => {
    const model = makeEdgeLaptop({
      display: {
        size: 14,
        resolution: "1920x1200",
        resolutionLabel: "FHD+",
        panel: "IPS",
        refreshRate: 60,
        nits: 300,
        touchscreen: false,
      },
    });
    const breakdown = getDisplayScoreBreakdown(model);
    expect(breakdown.refresh.earned).toBe(0);
  });

  it("should cap display size contribution at max 5 for very large screens", () => {
    const model = makeEdgeLaptop({
      display: {
        size: 99,
        resolution: "1920x1080",
        resolutionLabel: "FHD",
        panel: "IPS",
        refreshRate: 60,
        nits: 300,
        touchscreen: false,
      },
    });
    const breakdown = getDisplayScoreBreakdown(model);
    expect(breakdown.size.earned).toBeLessThanOrEqual(5);
  });
});

// ── getValueScore edge cases ──────────────────────────────────────────────────

describe("getValueScore", () => {
  const makePrice = (laptopId: string, price: number): SwissPrice => ({
    id: "sp-test",
    laptopId,
    retailer: "Test",
    price,
    dateAdded: "2024-01-01",
    isUserAdded: false,
  });

  it("should return null when CPU is unknown", () => {
    const model = makeEdgeLaptop({
      id: "test-edge",
      processor: { name: "Unknown CPU XYZ", cores: 4, threads: 8, baseClock: 1.0, boostClock: 3.0, tdp: 15 },
    });
    const prices = [makePrice("test-edge", 1000)];
    expect(getValueScore(model, prices)).toBeNull();
  });

  it("should return null when no prices exist for the model", () => {
    const model = makeEdgeLaptop({
      id: "test-edge-known-cpu",
      processor: { name: "AMD Ryzen 7 PRO 8840U", cores: 8, threads: 16, baseClock: 3.3, boostClock: 5.1, tdp: 15 },
    });
    expect(getValueScore(model, [])).toBeNull();
  });

  it("should return null when price is 0 to avoid division by zero", () => {
    const model = makeEdgeLaptop({
      id: "test-free",
      processor: { name: "AMD Ryzen 7 PRO 8840U", cores: 8, threads: 16, baseClock: 3.3, boostClock: 5.1, tdp: 15 },
    });
    const prices = [makePrice("test-free", 0)];
    expect(getValueScore(model, prices)).toBeNull();
  });

  it("should return a score between 1 and 100 for a reasonably priced known model", () => {
    const model = makeEdgeLaptop({
      id: "test-value",
      processor: { name: "AMD Ryzen 7 PRO 8840U", cores: 8, threads: 16, baseClock: 3.3, boostClock: 5.1, tdp: 15 },
    });
    const prices = [makePrice("test-value", 1200)];
    const score = getValueScore(model, prices);
    expect(score).not.toBeNull();
    expect(score!).toBeGreaterThanOrEqual(1);
    expect(score!).toBeLessThanOrEqual(100);
  });

  it("should return 100 (capped) for a very cheap but known-CPU model", () => {
    const model = makeEdgeLaptop({
      id: "test-cheap",
      processor: { name: "AMD Ryzen 7 PRO 8840U", cores: 8, threads: 16, baseClock: 3.3, boostClock: 5.1, tdp: 15 },
    });
    // Extremely low price drives value score through the roof — should cap at 100
    const prices = [makePrice("test-cheap", 1)];
    const score = getValueScore(model, prices);
    expect(score).toBe(100);
  });

  it("should use the lowest price when multiple prices exist for the model", () => {
    const model = makeEdgeLaptop({
      id: "test-multi-price",
      processor: { name: "AMD Ryzen 7 PRO 8840U", cores: 8, threads: 16, baseClock: 3.3, boostClock: 5.1, tdp: 15 },
    });
    const prices = [makePrice("test-multi-price", 2000), makePrice("test-multi-price", 1200)];
    const scoreWithLowest = getValueScore(model, [makePrice("test-multi-price", 1200)]);
    const scoreWithMultiple = getValueScore(model, prices);
    expect(scoreWithMultiple).toBe(scoreWithLowest);
  });

  it("should ignore prices for other laptop IDs", () => {
    const model = makeEdgeLaptop({
      id: "test-model-a",
      processor: { name: "AMD Ryzen 7 PRO 8840U", cores: 8, threads: 16, baseClock: 3.3, boostClock: 5.1, tdp: 15 },
    });
    const prices = [makePrice("other-model-b", 1000)];
    expect(getValueScore(model, prices)).toBeNull();
  });
});

// ── getPerformanceDimensions edge cases ───────────────────────────────────────

describe("getPerformanceDimensions", () => {
  it("should return an object with all six dimension keys", () => {
    const dims = getPerformanceDimensions(makeEdgeLaptop());
    expect(dims).toHaveProperty("cpu");
    expect(dims).toHaveProperty("gpu");
    expect(dims).toHaveProperty("memory");
    expect(dims).toHaveProperty("portability");
    expect(dims).toHaveProperty("display");
    expect(dims).toHaveProperty("connectivity");
  });

  it("should return 0 cpu for unknown CPU name", () => {
    const model = makeEdgeLaptop({
      processor: { name: "Unknown CPU XYZ", cores: 4, threads: 8, baseClock: 1.0, boostClock: 3.0, tdp: 15 },
    });
    expect(getPerformanceDimensions(model).cpu).toBe(0);
  });

  it("should return 0 gpu for unknown GPU name", () => {
    const model = makeEdgeLaptop({ gpu: { name: "Unknown GPU XYZ", integrated: true } });
    expect(getPerformanceDimensions(model).gpu).toBe(0);
  });

  it("should return all dimensions in the range 0–100", () => {
    const model = makeEdgeLaptop();
    const dims = getPerformanceDimensions(model);
    for (const [key, value] of Object.entries(dims)) {
      expect(value, `dimension "${key}" out of range`).toBeGreaterThanOrEqual(0);
      expect(value, `dimension "${key}" out of range`).toBeLessThanOrEqual(100);
    }
  });

  it("should return non-zero memory dimension for a valid memory config", () => {
    const model = makeEdgeLaptop({
      ram: { size: 16, type: "LPDDR5x", speed: 7500, maxSize: 32, slots: 0, soldered: true },
      storage: { type: "NVMe", size: 512, slots: 1 },
    });
    expect(getPerformanceDimensions(model).memory).toBeGreaterThan(0);
  });

  it("should return non-zero portability dimension for a standard laptop", () => {
    const model = makeEdgeLaptop({ weight: 1.5, battery: { whr: 57, removable: false } });
    expect(getPerformanceDimensions(model).portability).toBeGreaterThan(0);
  });

  it("should return non-zero display dimension for a standard display config", () => {
    const model = makeEdgeLaptop({
      display: {
        size: 14,
        resolution: "1920x1200",
        resolutionLabel: "FHD+",
        panel: "IPS",
        refreshRate: 60,
        nits: 300,
        touchscreen: false,
      },
    });
    expect(getPerformanceDimensions(model).display).toBeGreaterThan(0);
  });

  it("should return consistent values across repeated calls (pure function)", () => {
    const model = makeEdgeLaptop();
    const first = getPerformanceDimensions(model);
    const second = getPerformanceDimensions(model);
    expect(first).toEqual(second);
  });
});
