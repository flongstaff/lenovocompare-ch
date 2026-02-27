import type { DealHighlight, PriceBaseline, SaleEvent, ComponentMarket, BuySignal } from "./types";

/**
 * Determine buy/wait recommendation for a model based on current best price,
 * price baselines, upcoming sale events, and component market conditions.
 */
export const computeBuySignal = (
  baseline: PriceBaseline,
  currentBestPrice: number,
  saleEvents: readonly SaleEvent[],
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _componentMarkets: readonly ComponentMarket[],
): BuySignal => {
  if (baseline.msrp === 0 || baseline.historicalLow === 0) return "wait";
  if (currentBestPrice <= baseline.historicalLow * 1.05) return "buy-now";
  const discountPct = (baseline.msrp - currentBestPrice) / baseline.msrp;
  if (currentBestPrice <= baseline.typicalRetail && discountPct > 0.1) return "good-deal";
  const nearTypical = currentBestPrice <= baseline.typicalRetail * 1.1;
  const hasSaleSoon = saleEventWithinDays(saleEvents, 45);
  if (nearTypical && hasSaleSoon) return "hold";
  return "wait";
};

const saleEventWithinDays = (events: readonly SaleEvent[], days: number): boolean => {
  const now = new Date();
  const currentYear = now.getFullYear();
  for (const event of events) {
    const eventMonth = event.typicalMonth - 1;
    const eventDay = event.typicalWeek ? (event.typicalWeek - 1) * 7 + 1 : 1;
    for (const year of [currentYear, currentYear + 1]) {
      const eventDate = new Date(year, eventMonth, eventDay);
      const diffMs = eventDate.getTime() - now.getTime();
      const diffDays = diffMs / (1000 * 60 * 60 * 24);
      if (diffDays >= 0 && diffDays <= days) return true;
    }
  }
  return false;
};

/** Check if a deal's lastVerified date is older than thresholdDays (default 14). */
export const isDealStale = (deal: DealHighlight, thresholdDays = 14): boolean => {
  if (!deal.lastVerified) return true;
  const verifiedDate = new Date(deal.lastVerified);
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - verifiedDate.getTime()) / 86_400_000);
  return diffDays > thresholdDays;
};

/** Display metadata for each buy signal */
export const getBuySignalMeta = (signal: BuySignal): { label: string; color: string; chipClass: string } => {
  switch (signal) {
    case "buy-now":
      return { label: "Buy Now", color: "#42be65", chipClass: "carbon-verdict-excellent" };
    case "good-deal":
      return { label: "Good Deal", color: "#4589ff", chipClass: "carbon-verdict-good" };
    case "hold":
      return { label: "Hold", color: "#f1c21b", chipClass: "carbon-verdict-fair" };
    case "wait":
      return { label: "Wait", color: "#a8a8a8", chipClass: "carbon-verdict-low" };
  }
};

/** Get the trend display properties */
export const getTrendMeta = (
  trend: "rising" | "stable" | "falling",
): { label: string; color: string; arrow: string } => {
  switch (trend) {
    case "rising":
      return { label: "Rising", color: "#da1e28", arrow: "↑" };
    case "stable":
      return { label: "Stable", color: "#a8a8a8", arrow: "→" };
    case "falling":
      return { label: "Falling", color: "#42be65", arrow: "↓" };
  }
};
