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
} from "@/lib/scoring";
import type { Laptop } from "@/lib/types";

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
