import { describe, it, expect } from "vitest";
import { polarToCartesian, pointsToPolygon, computeEfficiencyFrontier } from "../chart-utils";

describe("polarToCartesian", () => {
  it("converts 0 degrees to top of circle", () => {
    const [x, y] = polarToCartesian(50, 50, 30, -Math.PI / 2);
    expect(x).toBeCloseTo(50);
    expect(y).toBeCloseTo(20);
  });

  it("converts 90 degrees to right of circle", () => {
    const [x, y] = polarToCartesian(50, 50, 30, 0);
    expect(x).toBeCloseTo(80);
    expect(y).toBeCloseTo(50);
  });
});

describe("pointsToPolygon", () => {
  it("joins coordinate pairs into SVG polygon string", () => {
    const result = pointsToPolygon([
      [10, 20],
      [30, 40],
    ]);
    expect(result).toBe("10,20 30,40");
  });
});

describe("computeEfficiencyFrontier", () => {
  it("returns models on the frontier (highest perf at each price point)", () => {
    const models = [
      { id: "a", price: 500, perf: 40 },
      { id: "b", price: 500, perf: 60 },
      { id: "c", price: 1000, perf: 70 },
      { id: "d", price: 1000, perf: 50 },
      { id: "e", price: 1500, perf: 90 },
    ];
    const frontier = computeEfficiencyFrontier(models);
    expect(frontier.map((m) => m.id)).toEqual(["b", "c", "e"]);
  });

  it("excludes models dominated by cheaper+better alternatives", () => {
    const models = [
      { id: "a", price: 500, perf: 70 },
      { id: "b", price: 800, perf: 60 }, // dominated by a
      { id: "c", price: 1000, perf: 80 },
    ];
    const frontier = computeEfficiencyFrontier(models);
    expect(frontier.map((m) => m.id)).toEqual(["a", "c"]);
  });
});
