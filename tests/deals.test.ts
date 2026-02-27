import { describe, it, expect } from "vitest";
import { computeBuySignal } from "@/lib/deals";
import type { PriceBaseline, SaleEvent, ComponentMarket } from "@/lib/types";

const makeBaseline = (overrides: Partial<PriceBaseline> = {}): PriceBaseline => ({
  laptopId: "test-model",
  msrp: 2000,
  typicalRetail: 1800,
  historicalLow: 1500,
  historicalLowDate: "2024-11-29",
  historicalLowRetailer: "Digitec",
  ...overrides,
});

const noEvents: readonly SaleEvent[] = [];
const noMarkets: readonly ComponentMarket[] = [];

describe("computeBuySignal", () => {
  it("returns 'buy-now' when price is at or below 105% of historical low", () => {
    const baseline = makeBaseline({ historicalLow: 1500 });
    expect(computeBuySignal(baseline, 1500, noEvents, noMarkets)).toBe("buy-now");
    expect(computeBuySignal(baseline, 1575, noEvents, noMarkets)).toBe("buy-now");
  });

  it("returns 'good-deal' when price <= typical retail and > 10% off MSRP", () => {
    const baseline = makeBaseline({ msrp: 2000, typicalRetail: 1800, historicalLow: 1500 });
    expect(computeBuySignal(baseline, 1700, noEvents, noMarkets)).toBe("good-deal");
  });

  it("returns 'hold' when near typical retail and sale event within 45 days", () => {
    const baseline = makeBaseline({ msrp: 2000, typicalRetail: 1800, historicalLow: 1500 });
    const now = new Date();
    const nextMonth = new Date(now);
    nextMonth.setDate(nextMonth.getDate() + 30);
    const upcomingSale: SaleEvent[] = [
      {
        id: "bf",
        name: "Black Friday",
        retailer: "all",
        typicalMonth: nextMonth.getMonth() + 1,
        durationDays: 7,
        typicalDiscountRange: [15, 35],
        bestFor: ["ThinkPad X1"],
      },
    ];
    expect(computeBuySignal(baseline, 1810, upcomingSale, noMarkets)).toBe("hold");
  });

  it("returns 'wait' when at or above typical retail with no upcoming sales", () => {
    const baseline = makeBaseline({ msrp: 2000, typicalRetail: 1800, historicalLow: 1500 });
    expect(computeBuySignal(baseline, 1950, noEvents, noMarkets)).toBe("wait");
  });

  it("returns 'buy-now' for price exactly at historical low", () => {
    const baseline = makeBaseline({ historicalLow: 1500 });
    expect(computeBuySignal(baseline, 1500, noEvents, noMarkets)).toBe("buy-now");
  });

  it("handles edge case of msrp 0 gracefully", () => {
    const baseline = makeBaseline({ msrp: 0, typicalRetail: 0, historicalLow: 0 });
    expect(computeBuySignal(baseline, 100, noEvents, noMarkets)).toBe("wait");
  });
});
