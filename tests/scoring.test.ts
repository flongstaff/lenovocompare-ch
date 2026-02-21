import { describe, it, expect } from "vitest";
import { getPerformanceScore, getGpuScore, getGamingTier, getPortabilityScore } from "@/lib/scoring";
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
