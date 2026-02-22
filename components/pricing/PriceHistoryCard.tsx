"use client";

import { TrendingDown, TrendingUp, Minus, Tag } from "lucide-react";
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
  CartesianGrid,
} from "recharts";
import type { SwissPrice, PriceBaseline } from "@/lib/types";
import { formatCHF, formatDate } from "@/lib/formatters";

interface PriceHistoryCardProps {
  readonly baseline: PriceBaseline | null;
  readonly priceHistory: readonly SwissPrice[];
}

const getPriceColor = (price: number, baseline: PriceBaseline): string => {
  const pctOff = ((baseline.msrp - price) / baseline.msrp) * 100;
  if (pctOff >= 25) return "var(--green, #42be65)";
  if (pctOff >= 10) return "var(--yellow, #f1c21b)";
  return "var(--red, #da1e28)";
};

const getPriceBadge = (price: number, baseline: PriceBaseline) => {
  const pctOff = Math.round(((baseline.msrp - price) / baseline.msrp) * 100);
  if (pctOff <= 0) return null;

  const color = pctOff >= 25 ? "green" : pctOff >= 10 ? "yellow" : "red";
  const bgMap = {
    green: "bg-green-900/40 text-green-400 border-green-700",
    yellow: "bg-yellow-900/40 text-yellow-400 border-yellow-700",
    red: "bg-red-900/40 text-red-400 border-red-700",
  };

  return <span className={`border px-1.5 py-0.5 text-[10px] ${bgMap[color]}`}>{pctOff}% off MSRP</span>;
};

const PriceTypeLabel = ({ type }: { type?: string }) => {
  if (!type) return null;
  const styles: Record<string, string> = {
    msrp: "bg-blue-900/30 text-blue-400 border-blue-700",
    retail: "bg-slate-700/30 text-slate-300 border-slate-600",
    sale: "bg-green-900/30 text-green-400 border-green-700",
    used: "bg-amber-900/30 text-amber-400 border-amber-700",
    refurbished: "bg-teal-900/30 text-teal-400 border-teal-700",
  };
  return (
    <span className={`border px-1 py-0.5 text-[10px] uppercase tracking-wider ${styles[type] ?? styles.retail}`}>
      {type}
    </span>
  );
};

const RETAILER_COLORS: Record<string, string> = {
  Digitec: "#0f62fe",
  Galaxus: "#0f62fe",
  Brack: "#42be65",
  "Lenovo CH": "#da1e28",
  Interdiscount: "#a56eff",
  Fust: "#ff832b",
  MediaMarkt: "#ee5396",
  Toppreise: "#f1c21b",
  Revendo: "#08bdba",
  "Back Market": "#4589ff",
  "Galaxus Used": "#78a9ff",
  Ricardo: "#be95ff",
  Tutti: "#3ddbd9",
};

const getRetailerColor = (retailer: string): string => RETAILER_COLORS[retailer] ?? "#c6c6c6";

interface ChartPoint {
  timestamp: number;
  price: number;
  retailer: string;
  dateLabel: string;
}

const PriceTimelineChart = ({
  prices,
  baseline,
}: {
  readonly prices: readonly SwissPrice[];
  readonly baseline: PriceBaseline | null;
}) => {
  const byRetailer = new Map<string, ChartPoint[]>();
  for (const p of prices) {
    const ts = new Date(p.dateAdded).getTime();
    if (isNaN(ts)) continue;
    const point: ChartPoint = {
      timestamp: ts,
      price: p.price,
      retailer: p.retailer,
      dateLabel: formatDate(p.dateAdded),
    };
    const arr = byRetailer.get(p.retailer) ?? [];
    arr.push(point);
    byRetailer.set(p.retailer, arr);
  }

  const allPrices = prices.map((p) => p.price);
  const baselinePrices = baseline ? [baseline.msrp, baseline.typicalRetail, baseline.historicalLow] : [];
  const allValues = [...allPrices, ...baselinePrices];
  if (allValues.length === 0 || byRetailer.size === 0) return null;
  const rawMin = Math.min(...allValues);
  const rawMax = Math.max(...allValues);
  const padding = rawMin === rawMax ? 50 : 0;
  const minPrice = (rawMin - padding) * 0.95;
  const maxPrice = (rawMax + padding) * 1.05;

  const retailers = Array.from(byRetailer.keys());

  // Sort each retailer's points by timestamp for smooth line rendering
  retailers.forEach((r) => {
    const points = byRetailer.get(r);
    if (points) points.sort((a, b) => a.timestamp - b.timestamp);
  });

  // Build merged timeline data for ComposedChart lines
  const allTimestamps = new Set<number>();
  retailers.forEach((r) => {
    const points = byRetailer.get(r);
    if (points) points.forEach((p) => allTimestamps.add(p.timestamp));
  });
  const sortedTimestamps = Array.from(allTimestamps).sort((a, b) => a - b);
  const mergedData = sortedTimestamps.map((ts) => {
    const entry: Record<string, unknown> = { timestamp: ts };
    retailers.forEach((retailer) => {
      const points = byRetailer.get(retailer);
      const match = points?.find((p) => p.timestamp === ts);
      if (match) {
        entry[retailer] = match.price;
      }
    });
    return entry;
  });

  // Adaptive height: taller for more data, compact for sparse
  const chartHeight = sortedTimestamps.length <= 3 ? 140 : sortedTimestamps.length <= 8 ? 170 : 200;

  return (
    <div className="mb-3">
      <div style={{ height: chartHeight }}>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={mergedData} margin={{ left: 10, right: 50, top: 8, bottom: 4 }}>
            <CartesianGrid strokeDasharray="4 4" stroke="#2a2a2a" />
            <XAxis
              type="number"
              dataKey="timestamp"
              domain={["dataMin", "dataMax"]}
              scale="time"
              tickFormatter={(ts: number) => {
                const d = new Date(ts);
                return `${d.getUTCDate()}/${d.getUTCMonth() + 1}`;
              }}
              tick={{ fill: "#a8a8a8", fontSize: 10 }}
              stroke="#393939"
            />
            <YAxis
              type="number"
              domain={[Math.floor(minPrice), Math.ceil(maxPrice)]}
              tick={{ fill: "#a8a8a8", fontSize: 10 }}
              stroke="#393939"
              tickFormatter={(v: number) => `${v}`}
              width={50}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null;
                const items = payload.filter((p) => p.value != null);
                if (items.length === 0) return null;
                const ts = (items[0].payload as Record<string, unknown>).timestamp as number;
                const dateLabel = formatDate(new Date(ts).toISOString().split("T")[0]);
                return (
                  <div
                    style={{
                      background: "#262626",
                      border: "1px solid #525252",
                      borderRadius: 6,
                      padding: "8px 12px",
                      boxShadow: "0 4px 16px rgba(0,0,0,0.5)",
                    }}
                  >
                    <p style={{ color: "#a8a8a8", fontSize: 11, marginBottom: 4 }}>{dateLabel}</p>
                    {items.map((item) => {
                      const price = item.value as number;
                      const msrpPct = baseline ? Math.round(((baseline.msrp - price) / baseline.msrp) * 100) : null;
                      return (
                        <div
                          key={item.name}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                            fontSize: 11,
                            color: "#c6c6c6",
                            padding: "2px 0",
                          }}
                        >
                          <span
                            style={{
                              width: 8,
                              height: 8,
                              borderRadius: "50%",
                              background: getRetailerColor(item.name ?? ""),
                              flexShrink: 0,
                            }}
                          />
                          <span>{item.name}</span>
                          <span
                            style={{ marginLeft: "auto", fontWeight: 600, color: "#f4f4f4", fontFamily: "monospace" }}
                          >
                            {formatCHF(price)}
                          </span>
                          {msrpPct !== null && msrpPct > 0 && (
                            <span style={{ color: "#42be65", fontSize: 10 }}>-{msrpPct}%</span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                );
              }}
            />
            {baseline && (
              <>
                <ReferenceLine
                  y={baseline.msrp}
                  stroke="#da1e28"
                  strokeDasharray="6 4"
                  strokeOpacity={0.35}
                  strokeWidth={0.8}
                  label={{ value: "MSRP", fill: "#da1e2880", fontSize: 9, position: "right" }}
                />
                <ReferenceLine
                  y={baseline.typicalRetail}
                  stroke="#a8a8a8"
                  strokeDasharray="6 4"
                  strokeOpacity={0.3}
                  strokeWidth={0.8}
                  label={{ value: "Typical", fill: "#a8a8a870", fontSize: 9, position: "right" }}
                />
                <ReferenceLine
                  y={baseline.historicalLow}
                  stroke="#42be65"
                  strokeDasharray="6 4"
                  strokeOpacity={0.35}
                  strokeWidth={0.8}
                  label={{ value: "Hist. Low", fill: "#42be6580", fontSize: 9, position: "right" }}
                />
              </>
            )}
            {retailers.map((retailer) => (
              <Line
                key={retailer}
                type="monotone"
                dataKey={retailer}
                stroke={getRetailerColor(retailer)}
                strokeWidth={2}
                strokeOpacity={0.7}
                dot={{ r: 5, fill: getRetailerColor(retailer), stroke: "#161616", strokeWidth: 2 }}
                activeDot={{ r: 7, fill: getRetailerColor(retailer), stroke: "#f4f4f4", strokeWidth: 2 }}
                connectNulls={true}
                isAnimationActive={false}
              />
            ))}
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      <div className="flex flex-wrap justify-center gap-3 pt-1">
        {retailers.map((r) => (
          <div key={r} className="flex items-center gap-1.5 text-[10px]" style={{ color: "#c6c6c6" }}>
            <span className="inline-block h-2 w-2 rounded-full" style={{ background: getRetailerColor(r) }} />
            {r}
          </div>
        ))}
        {baseline && (
          <>
            <div className="flex items-center gap-1.5 text-[10px]" style={{ color: "#da1e28" }}>
              <span className="inline-block w-3 border-t border-dashed" style={{ borderColor: "#da1e28" }} />
              MSRP
            </div>
            <div className="flex items-center gap-1.5 text-[10px]" style={{ color: "#a8a8a8" }}>
              <span className="inline-block w-3 border-t border-dashed" style={{ borderColor: "#a8a8a8" }} />
              Typical
            </div>
            <div className="flex items-center gap-1.5 text-[10px]" style={{ color: "#42be65" }}>
              <span className="inline-block w-3 border-t border-dashed" style={{ borderColor: "#42be65" }} />
              Hist. Low
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const PriceHistoryCard = ({ baseline, priceHistory }: PriceHistoryCardProps) => {
  if (!baseline && priceHistory.length === 0) {
    return (
      <div className="carbon-card rounded-lg p-4">
        <h2 className="mb-2 text-lg font-semibold" style={{ color: "var(--foreground)" }}>
          Price History
        </h2>
        <p className="text-sm" style={{ color: "var(--muted)" }}>
          No price history yet.
        </p>
        <p className="mt-1 text-xs" style={{ color: "var(--border-subtle)" }}>
          Add prices on the Pricing page to build history for this model.
        </p>
      </div>
    );
  }

  const lowestCurrent = priceHistory.length > 0 ? Math.min(...priceHistory.map((p) => p.price)) : null;

  const nearHistoricalLow = baseline && lowestCurrent ? lowestCurrent <= baseline.historicalLow * 1.05 : false;

  return (
    <div className="carbon-card rounded-lg p-4">
      <h2 className="mb-3 text-lg font-semibold" style={{ color: "var(--foreground)" }}>
        Price History
      </h2>

      {/* Combined header: current best + baselines inline */}
      {(lowestCurrent !== null || baseline) && (
        <div className="mb-3 flex flex-wrap items-end gap-4 rounded-md p-3" style={{ background: "var(--surface)" }}>
          {/* Current best — prominent */}
          {lowestCurrent !== null && (
            <div className="flex items-center gap-2">
              {nearHistoricalLow ? (
                <TrendingDown size={16} style={{ color: "#42be65" }} />
              ) : baseline && lowestCurrent > baseline.typicalRetail ? (
                <TrendingUp size={16} style={{ color: "#da1e28" }} />
              ) : (
                <Minus size={16} style={{ color: "var(--muted)" }} />
              )}
              <div>
                <div className="text-[10px] uppercase tracking-wider" style={{ color: "var(--muted)" }}>
                  Best Price
                </div>
                <span
                  className="font-mono text-lg font-bold leading-tight"
                  style={{ color: baseline ? getPriceColor(lowestCurrent, baseline) : "var(--foreground)" }}
                >
                  {formatCHF(lowestCurrent)}
                </span>
              </div>
              {baseline && getPriceBadge(lowestCurrent, baseline)}
              {nearHistoricalLow && (
                <span className="border border-green-700 bg-green-900/40 px-1.5 py-0.5 text-[10px] text-green-400">
                  Near Low
                </span>
              )}
            </div>
          )}

          {/* Baselines — compact inline */}
          {baseline && (
            <div className="ml-auto flex gap-4">
              <div className="text-center">
                <div className="text-[9px] uppercase tracking-wider" style={{ color: "#da1e2890" }}>
                  MSRP
                </div>
                <div className="font-mono text-xs font-medium" style={{ color: "var(--muted)" }}>
                  {formatCHF(baseline.msrp)}
                </div>
              </div>
              <div className="text-center">
                <div className="text-[9px] uppercase tracking-wider" style={{ color: "var(--muted)" }}>
                  Typical
                </div>
                <div className="font-mono text-xs font-medium" style={{ color: "var(--muted)" }}>
                  {formatCHF(baseline.typicalRetail)}
                </div>
              </div>
              <div className="text-center">
                <div className="text-[9px] uppercase tracking-wider" style={{ color: "#42be6590" }}>
                  Hist. Low
                </div>
                <div className="font-mono text-xs font-medium" style={{ color: "#42be65" }}>
                  {formatCHF(baseline.historicalLow)}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Price timeline chart — only show when 3+ entries for meaningful visualization */}
      {priceHistory.length >= 3 && <PriceTimelineChart prices={priceHistory} baseline={baseline} />}

      {/* Price timeline */}
      {priceHistory.length > 0 && (
        <div className="space-y-0">
          <div className="mb-2 text-xs uppercase tracking-wider" style={{ color: "var(--muted)" }}>
            Timeline ({priceHistory.length} entries)
          </div>
          {priceHistory.map((p) => (
            <div
              key={p.id}
              className="flex items-center justify-between py-1.5"
              style={{ borderBottom: "1px solid var(--border-subtle)" }}
            >
              <div className="flex min-w-0 items-center gap-2">
                <span className="shrink-0 text-sm" style={{ color: "var(--foreground)" }}>
                  {p.retailer}
                </span>
                <PriceTypeLabel type={p.priceType} />
                {p.note && (
                  <span className="flex items-center gap-0.5 truncate text-[10px]" style={{ color: "var(--muted)" }}>
                    <Tag size={8} /> {p.note}
                  </span>
                )}
              </div>
              <div className="ml-2 flex shrink-0 items-center gap-2">
                <span className="text-xs" style={{ color: "var(--muted)" }}>
                  {formatDate(p.dateAdded)}
                </span>
                <span
                  className="font-mono text-sm font-semibold"
                  style={{ color: baseline ? getPriceColor(p.price, baseline) : "var(--foreground)" }}
                >
                  {formatCHF(p.price)}
                </span>
                {baseline && getPriceBadge(p.price, baseline)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PriceHistoryCard;
