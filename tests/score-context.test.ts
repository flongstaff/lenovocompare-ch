import { describe, it, expect } from "vitest";
import { getScoreContext, getInterpretation } from "@/lib/score-context";
import { laptops } from "@/data/laptops";

describe("getScoreContext", () => {
  const model = laptops[0];

  it("returns series average when series has 3+ models", () => {
    const ctx = getScoreContext("cpu", model);
    expect(ctx.average).toBeGreaterThan(0);
    expect(ctx.average).toBeLessThanOrEqual(100);
    expect(ctx.groupLabel).toBeTruthy();
  });

  it("returns percentile across all models", () => {
    const ctx = getScoreContext("cpu", model);
    expect(ctx.percentile).toBeGreaterThan(0);
    expect(ctx.percentile).toBeLessThanOrEqual(100);
  });

  it("returns comparison text", () => {
    const ctx = getScoreContext("cpu", model);
    expect(ctx.comparisonText).toBeTruthy();
    expect(typeof ctx.comparisonText).toBe("string");
  });
});

describe("getInterpretation", () => {
  it("returns text for each dimension and score range", () => {
    const dims = ["cpu", "gpu", "memory", "display", "connectivity", "portability"] as const;
    for (const dim of dims) {
      for (const score of [90, 70, 50, 20]) {
        const text = getInterpretation(dim, score);
        expect(text).toBeTruthy();
        expect(text.length).toBeGreaterThan(10);
      }
    }
  });
});
