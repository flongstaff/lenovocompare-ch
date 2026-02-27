"use client";

import { useState, useMemo } from "react";
import { useLaptops } from "@/lib/hooks/useLaptops";
import { usePrices } from "@/lib/hooks/usePrices";
import { computeBuySignal } from "@/lib/deals";
import { marketSummary, componentMarkets, saleEvents, dealHighlights } from "@/data/market-insights";
import MarketAlertBanner from "@/components/deals/MarketAlertBanner";
import DealCard from "@/components/deals/DealCard";
import BuyWaitSignal from "@/components/deals/BuyWaitSignal";
import SeasonalCalendar from "@/components/deals/SeasonalCalendar";
import ComponentTracker from "@/components/deals/ComponentTracker";
import { LINEUP_COLORS } from "@/lib/constants";
import type { Laptop, BuySignal, Lineup } from "@/lib/types";

type LineupFilter = Lineup | "All";

const DealsClient = () => {
  const models = useLaptops();
  const { allPrices, getBaseline } = usePrices();
  const [lineupFilter, setLineupFilter] = useState<LineupFilter>("All");

  const modelMap = useMemo(() => {
    const map = new Map<string, Laptop>();
    for (const m of models) map.set(m.id, m);
    return map;
  }, [models]);

  const bestPrices = useMemo(() => {
    const map = new Map<string, number>();
    for (const p of allPrices) {
      const current = map.get(p.laptopId);
      if (current === undefined || p.price < current) {
        map.set(p.laptopId, p.price);
      }
    }
    return map;
  }, [allPrices]);

  const filteredDeals = useMemo(() => {
    if (lineupFilter === "All") return dealHighlights;
    return dealHighlights.filter((d) => {
      const model = modelMap.get(d.laptopId);
      return model?.lineup === lineupFilter;
    });
  }, [lineupFilter, modelMap]);

  const buySignals = useMemo(() => {
    const signals: {
      model: Laptop;
      signal: BuySignal;
      bestPrice: number;
      baseline: NonNullable<ReturnType<typeof getBaseline>>;
    }[] = [];
    for (const model of models) {
      const baseline = getBaseline(model.id);
      const best = bestPrices.get(model.id);
      if (!baseline || best === undefined) continue;
      const signal = computeBuySignal(baseline, best, saleEvents, componentMarkets);
      signals.push({ model, signal, bestPrice: best, baseline });
    }
    const order: Record<BuySignal, number> = { "buy-now": 0, "good-deal": 1, hold: 2, wait: 3 };
    return signals.sort((a, b) => order[a.signal] - order[b.signal]);
  }, [models, getBaseline, bestPrices]);

  const filteredSignals = useMemo(() => {
    if (lineupFilter === "All") return buySignals;
    return buySignals.filter((s) => s.model.lineup === lineupFilter);
  }, [buySignals, lineupFilter]);

  const lineups: LineupFilter[] = ["All", "ThinkPad", "Yoga", "IdeaPad Pro", "Legion"];

  const signalCounts = useMemo(() => {
    const counts = { "buy-now": 0, "good-deal": 0, hold: 0, wait: 0 };
    for (const s of filteredSignals) counts[s.signal]++;
    return counts;
  }, [filteredSignals]);

  return (
    <div className="animate-fade-in space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight" style={{ color: "var(--foreground)" }}>
          Deals & Market
        </h1>
        <p className="mt-1.5 text-sm" style={{ color: "var(--muted)" }}>
          Current deals, buying signals, and component market conditions for Swiss Lenovo laptops.
        </p>
      </div>

      <MarketAlertBanner
        severity={marketSummary.severity}
        headline={marketSummary.headline}
        detail={marketSummary.detail}
        updatedDate={marketSummary.updatedDate}
        componentMarkets={componentMarkets}
      />

      {/* Lineup filter pills */}
      <div className="flex flex-wrap gap-2">
        {lineups.map((l) => {
          const isActive = lineupFilter === l;
          const lineupAccent = l !== "All" ? LINEUP_COLORS[l].accent : "#0f62fe";
          return (
            <button
              key={l}
              onClick={() => setLineupFilter(l)}
              aria-pressed={isActive}
              className="rounded-full px-3.5 py-1.5 text-xs font-medium transition-all duration-150"
              style={
                isActive
                  ? {
                      background: lineupAccent,
                      color: "#fff",
                      boxShadow: `0 0 12px ${lineupAccent}40`,
                    }
                  : {
                      background: "var(--surface-alt)",
                      color: "var(--muted)",
                    }
              }
            >
              {l}
            </button>
          );
        })}
      </div>

      {/* Top Deals */}
      <section>
        <h2 className="mb-4 text-lg font-semibold" style={{ color: "var(--foreground)" }}>
          Top Deals
          <span className="ml-2 text-sm font-normal" style={{ color: "var(--muted)" }}>
            {filteredDeals.length}
          </span>
        </h2>
        {filteredDeals.length > 0 ? (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {filteredDeals.map((deal) => (
              <DealCard
                key={deal.id}
                deal={deal}
                model={modelMap.get(deal.laptopId)}
                baseline={getBaseline(deal.laptopId)}
              />
            ))}
          </div>
        ) : (
          <div className="carbon-card p-6 text-center">
            <p className="text-sm" style={{ color: "var(--muted)" }}>
              No deals for this lineup right now.
            </p>
          </div>
        )}
      </section>

      {/* Buy / Wait Signals */}
      <section>
        <div className="mb-4 flex items-baseline justify-between">
          <h2 className="text-lg font-semibold" style={{ color: "var(--foreground)" }}>
            Buy / Wait Signals
            <span className="ml-2 text-sm font-normal" style={{ color: "var(--muted)" }}>
              {filteredSignals.length}
            </span>
          </h2>
          <div className="hidden gap-3 sm:flex">
            {signalCounts["buy-now"] > 0 && (
              <span className="text-xs font-medium text-status-success">{signalCounts["buy-now"]} buy now</span>
            )}
            {signalCounts["good-deal"] > 0 && (
              <span className="text-xs font-medium" style={{ color: "var(--accent-light)" }}>
                {signalCounts["good-deal"]} good deal
              </span>
            )}
            {signalCounts.hold > 0 && (
              <span className="text-xs font-medium" style={{ color: "var(--status-warning)" }}>
                {signalCounts.hold} hold
              </span>
            )}
            {signalCounts.wait > 0 && (
              <span className="text-xs font-medium" style={{ color: "var(--muted)" }}>
                {signalCounts.wait} wait
              </span>
            )}
          </div>
        </div>
        <div className="space-y-1.5">
          {filteredSignals.map((s) => (
            <BuyWaitSignal
              key={s.model.id}
              model={s.model}
              baseline={s.baseline}
              bestPrice={s.bestPrice}
              signal={s.signal}
            />
          ))}
        </div>
      </section>

      {/* When to Buy */}
      <section>
        <h2 className="mb-4 text-lg font-semibold" style={{ color: "var(--foreground)" }}>
          When to Buy
        </h2>
        <SeasonalCalendar events={saleEvents} />
      </section>

      {/* Component Tracker */}
      <section>
        <ComponentTracker markets={componentMarkets} />
      </section>
    </div>
  );
};

export default DealsClient;
