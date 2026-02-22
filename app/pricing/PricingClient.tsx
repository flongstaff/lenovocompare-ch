"use client";

import { useState, useMemo } from "react";
import { Download, Upload, TrendingDown } from "lucide-react";
import { useLaptops } from "@/lib/hooks/useLaptops";
import { usePrices } from "@/lib/hooks/usePrices";
import { useToast } from "@/lib/hooks/useToast";
import { PriceEntryForm } from "@/components/pricing/PriceEntryForm";
import { PriceDisplay } from "@/components/pricing/PriceDisplay";
import { Toast } from "@/components/ui/Toast";
import { formatCHF, getPriceDiscount } from "@/lib/formatters";
import type { SwissPrice, Laptop, PriceBaseline } from "@/lib/types";

/** Tiny inline SVG sparkline showing price trend over time */
const PriceSparkline = ({ prices }: { readonly prices: readonly SwissPrice[] }) => {
  // Need at least 2 chronologically sorted points
  const sorted = [...prices]
    .map((p) => ({ ts: new Date(p.dateAdded).getTime(), price: p.price }))
    .filter((p) => !isNaN(p.ts))
    .sort((a, b) => a.ts - b.ts);
  if (sorted.length < 2) return null;

  const w = 80;
  const h = 24;
  const pad = 2;
  const minP = Math.min(...sorted.map((p) => p.price));
  const maxP = Math.max(...sorted.map((p) => p.price));
  const range = maxP - minP || 1;
  const minT = sorted[0].ts;
  const maxT = sorted[sorted.length - 1].ts;
  const tRange = maxT - minT || 1;

  const points = sorted.map((p) => {
    const x = pad + ((p.ts - minT) / tRange) * (w - pad * 2);
    const y = pad + (1 - (p.price - minP) / range) * (h - pad * 2);
    return `${x},${y}`;
  });

  const trending = sorted[sorted.length - 1].price <= sorted[0].price;
  const color = trending ? "#42be65" : "#da1e28";

  return (
    <svg width={w} height={h} className="ml-2 inline-block align-middle">
      <polyline
        points={points.join(" ")}
        fill="none"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={0.8}
      />
      {sorted.map((p, i) => {
        const x = pad + ((p.ts - minT) / tRange) * (w - pad * 2);
        const y = pad + (1 - (p.price - minP) / range) * (h - pad * 2);
        return <circle key={i} cx={x} cy={y} r={2} fill={color} opacity={0.9} />;
      })}
    </svg>
  );
};

const BaselineStrip = ({ baseline, bestPrice }: { baseline: PriceBaseline; bestPrice: number | null }) => {
  const pctOff = bestPrice ? getPriceDiscount(bestPrice, baseline.msrp) : null;
  return (
    <div
      className="flex flex-wrap gap-x-4 gap-y-1 px-3 py-2 text-xs"
      style={{ background: "var(--surface-alt)", borderBottom: "1px solid var(--border-subtle)" }}
    >
      <span style={{ color: "var(--muted)" }}>
        MSRP <span style={{ color: "var(--foreground)" }}>{formatCHF(baseline.msrp)}</span>
      </span>
      <span style={{ color: "var(--muted)" }}>
        Typical <span style={{ color: "var(--foreground)" }}>{formatCHF(baseline.typicalRetail)}</span>
      </span>
      <span style={{ color: "var(--muted)" }}>
        Low <span className="text-green-400">{formatCHF(baseline.historicalLow)}</span>
      </span>
      {pctOff !== null && pctOff > 0 && (
        <span className="flex items-center gap-0.5 text-green-400">
          <TrendingDown size={10} /> {pctOff}% off MSRP
        </span>
      )}
    </div>
  );
};

interface PriceGroup {
  model: Laptop | undefined;
  baseline: PriceBaseline | null;
  prices: SwissPrice[];
  bestPrice: number | null;
}

const PricingClient = () => {
  const models = useLaptops();
  const { allPrices, addPrice, removePrice, exportPrices, importPrices, getBaseline } = usePrices();
  const { toasts, addToast, dismissToast } = useToast();
  const [importText, setImportText] = useState("");
  const [showImport, setShowImport] = useState(false);

  const priceGroups = useMemo<PriceGroup[]>(() => {
    const grouped = new Map<string, SwissPrice[]>();
    for (const p of allPrices) {
      const existing = grouped.get(p.laptopId);
      if (existing) existing.push(p);
      else grouped.set(p.laptopId, [p]);
    }
    return Array.from(grouped.entries())
      .map(([id, prices]) => {
        const sorted = [...prices].sort((a, b) => a.price - b.price);
        return {
          model: models.find((m) => m.id === id),
          baseline: getBaseline(id),
          prices: sorted,
          bestPrice: sorted.length > 0 ? sorted[0].price : null,
        };
      })
      .sort((a, b) => (a.model?.name ?? "").localeCompare(b.model?.name ?? ""));
  }, [allPrices, models, getBaseline]);

  const handleExport = () => {
    try {
      const json = exportPrices();
      const blob = new Blob([json], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "lenovocompare-prices.json";
      a.click();
      URL.revokeObjectURL(url);
      addToast("Prices exported", "success");
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Unknown error";
      console.warn("[PricingClient] Export failed:", error);
      addToast(`Export failed: ${msg}`, "error");
    }
  };

  const handleImport = () => {
    const result = importPrices(importText);
    if (result.error) {
      addToast(result.error, "error");
    } else {
      addToast(
        `Imported ${result.imported} price${result.imported !== 1 ? "s" : ""}${result.skipped > 0 ? `, ${result.skipped} skipped` : ""}`,
        "success",
      );
    }
    setImportText("");
    setShowImport(false);
  };

  return (
    <div className="animate-fade-in space-y-6">
      <div>
        <h1 className="text-2xl font-bold" style={{ color: "var(--foreground)" }}>
          Swiss Pricing
        </h1>
        <p className="mt-1 text-sm" style={{ color: "var(--muted)" }}>
          All prices are user-contributed and stored in your browser. Prices include Swiss VAT (8.1%).
        </p>
      </div>

      <PriceEntryForm models={models} onAdd={addPrice} onToast={addToast} />

      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold" style={{ color: "var(--foreground)" }}>
          All Prices ({allPrices.length})
        </h2>
        <div className="flex gap-2">
          <button onClick={handleExport} className="carbon-btn-ghost !px-3 !py-1.5 text-sm">
            <Download size={14} /> Export
          </button>
          <button onClick={() => setShowImport(!showImport)} className="carbon-btn-ghost !px-3 !py-1.5 text-sm">
            <Upload size={14} /> Import
          </button>
        </div>
      </div>

      {showImport && (
        <div className="carbon-card space-y-3 rounded-lg p-4">
          <textarea
            value={importText}
            onChange={(e) => setImportText(e.target.value)}
            placeholder="Paste exported JSON here..."
            className="carbon-input !h-24 resize-none"
            aria-label="Import price data in JSON format"
          />
          <button onClick={handleImport} className="carbon-btn text-sm">
            Import Prices
          </button>
        </div>
      )}

      {priceGroups.length > 0 ? (
        priceGroups.map((group) => (
          <div key={group.model?.id ?? "unknown"} className="carbon-card overflow-hidden rounded-lg">
            <div className="flex items-center px-3 py-2" style={{ borderBottom: "1px solid var(--border-subtle)" }}>
              <span className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>
                {group.model?.name ?? "Unknown Model"}
              </span>
              <span className="ml-2 text-xs" style={{ color: "var(--muted)" }}>
                {group.prices.length} price{group.prices.length !== 1 ? "s" : ""}
              </span>
              <PriceSparkline prices={group.prices} />
            </div>
            {group.baseline && <BaselineStrip baseline={group.baseline} bestPrice={group.bestPrice} />}
            {group.prices.map((price) => (
              <PriceDisplay key={price.id} price={price} onRemove={removePrice} />
            ))}
          </div>
        ))
      ) : (
        <div className="carbon-card rounded-lg p-6 text-center">
          <p className="text-sm" style={{ color: "var(--muted)" }}>
            No prices yet. Add one above.
          </p>
        </div>
      )}

      <Toast toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
};

export default PricingClient;
