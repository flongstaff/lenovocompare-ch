"use client";

import Link from "next/link";
import { ExternalLink, TrendingDown, TrendingUp, Minus } from "lucide-react";
import type { Laptop, SwissPrice, PriceBaseline } from "@/lib/types";
import type { getModelScores } from "@/lib/scoring";
import { getScorePercentile, getLineupMaxScore } from "@/lib/scoring";
import { formatCHF, formatDate } from "@/lib/formatters";
import { ScoreBar } from "@/components/ui/ScoreBar";
import dynamic from "next/dynamic";

const SectionSkeleton = () => <div className="carbon-card animate-pulse" style={{ height: 120 }} />;
const ValueScoring = dynamic(
  () => import("@/components/pricing/ValueScoring").then((m) => ({ default: m.ValueScoring })),
  { loading: SectionSkeleton },
);

export const DashboardStrip = ({
  model,
  configuredModel,
  sc,
  modelPrices,
  baseline,
}: {
  readonly model: Laptop;
  readonly configuredModel: Laptop;
  readonly sc: ReturnType<typeof getModelScores>;
  readonly modelPrices: readonly SwissPrice[];
  readonly baseline: PriceBaseline | null;
}) => {
  const valScore = sc.value;

  return (
    <div id="scores" className="grid scroll-mt-14 grid-cols-1 gap-4 border-b border-carbon-600/60 pb-6 md:grid-cols-3">
      {/* Scores card */}
      <div className="carbon-card-scores p-4">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold sm:text-xl" style={{ color: "var(--foreground)" }}>
            Scores
          </h2>
          <div className="flex gap-2 font-mono text-[9px] uppercase tracking-wider">
            <span style={{ color: "#42be65" }}>80+ Excellent</span>
            <span style={{ color: "#4589ff" }}>60+ Good</span>
            <span style={{ color: "#f1c21b" }}>40+ Fair</span>
          </div>
        </div>
        <div className="space-y-2.5">
          {sc.perf > 0 && (
            <>
              <ScoreBar
                score={sc.perf}
                label="Perf"
                color="#0f62fe"
                size="md"
                maxRef={getLineupMaxScore("cpu", model.lineup)}
              />
              <div className="pl-20 font-mono text-[9px] text-carbon-500">
                Top {100 - getScorePercentile(sc.perf, "cpu", model.lineup)}% of {model.lineup}
              </div>
            </>
          )}
          {sc.singleCore > 0 && <ScoreBar score={sc.singleCore} label="Single" color="#4589ff" size="md" />}
          {sc.multiCore > 0 && <ScoreBar score={sc.multiCore} label="Multi" color="#ee5396" size="md" />}
          {sc.gpu > 0 && (
            <>
              <ScoreBar
                score={sc.gpu}
                label="GPU"
                color="#42be65"
                size="md"
                maxRef={getLineupMaxScore("gpu", model.lineup)}
              />
              <div className="pl-20 font-mono text-[9px] text-carbon-500">
                Top {100 - getScorePercentile(sc.gpu, "gpu", model.lineup)}% of {model.lineup}
              </div>
            </>
          )}
          <>
            <ScoreBar
              score={sc.display}
              label="Display"
              color="#ee5396"
              size="md"
              maxRef={getLineupMaxScore("display", model.lineup)}
            />
            <div className="pl-20 font-mono text-[9px] text-carbon-500">
              Top {100 - getScorePercentile(sc.display, "display", model.lineup)}% of {model.lineup}
            </div>
          </>
          <>
            <ScoreBar
              score={sc.memory}
              label="Memory"
              color="#be95ff"
              size="md"
              maxRef={getLineupMaxScore("memory", model.lineup)}
            />
            <div className="pl-20 font-mono text-[9px] text-carbon-500">
              Top {100 - getScorePercentile(sc.memory, "memory", model.lineup)}% of {model.lineup}
            </div>
          </>
          <>
            <ScoreBar
              score={sc.connectivity}
              label="Connect"
              color="#08bdba"
              size="md"
              maxRef={getLineupMaxScore("connectivity", model.lineup)}
            />
            <div className="pl-20 font-mono text-[9px] text-carbon-500">
              Top {100 - getScorePercentile(sc.connectivity, "connectivity", model.lineup)}% of {model.lineup}
            </div>
          </>
          <>
            <ScoreBar
              score={sc.portability}
              label="Port"
              color="#42be65"
              size="md"
              maxRef={getLineupMaxScore("portability", model.lineup)}
            />
            <div className="pl-20 font-mono text-[9px] text-carbon-500">
              Top {100 - getScorePercentile(sc.portability, "portability", model.lineup)}% of {model.lineup}
            </div>
          </>
          {valScore !== null && <ScoreBar score={Math.min(100, valScore)} label="Value" color="#f1c21b" size="md" />}
        </div>
      </div>

      {/* Swiss Prices card */}
      <div className="carbon-card p-4">
        <h2 className="mb-3 text-lg font-semibold sm:text-xl" style={{ color: "var(--foreground)" }}>
          Swiss Prices
        </h2>
        {modelPrices.length > 0 ? (
          <div className="space-y-2">
            {(() => {
              const now = Date.now();
              return modelPrices.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between py-1.5"
                  style={{ borderBottom: "1px solid var(--border-subtle)" }}
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-medium" style={{ color: "var(--foreground)" }}>
                        {p.retailer}
                      </span>
                      {p.priceType && (
                        <span
                          className={`px-1 py-0.5 font-mono text-[9px] uppercase tracking-wider ${
                            p.priceType === "sale"
                              ? "carbon-verdict-excellent"
                              : p.priceType === "msrp"
                                ? "carbon-verdict-good"
                                : p.priceType === "used"
                                  ? "carbon-verdict-fair"
                                  : "border-carbon-600 bg-carbon-700/30 text-carbon-300"
                          }`}
                        >
                          {p.priceType}
                        </span>
                      )}
                    </div>
                    <span className="text-xs" style={{ color: "var(--muted)" }}>
                      <span
                        className="font-medium"
                        style={{
                          color:
                            now - new Date(p.dateAdded).getTime() < 7 * 86400000
                              ? "#42be65"
                              : now - new Date(p.dateAdded).getTime() < 30 * 86400000
                                ? "#f1c21b"
                                : "var(--muted)",
                        }}
                      >
                        {formatDate(p.dateAdded)}
                      </span>
                      {p.note && <span className="ml-1.5">· {p.note}</span>}
                    </span>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <span className="font-semibold" style={{ color: "var(--foreground)" }}>
                      {formatCHF(p.price)}
                    </span>
                    {p.url && (
                      <a
                        href={p.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: "var(--accent-light)" }}
                      >
                        <ExternalLink size={12} />
                      </a>
                    )}
                  </div>
                </div>
              ));
            })()}
          </div>
        ) : (
          <p className="text-sm" style={{ color: "var(--muted)" }}>
            No prices available yet.
          </p>
        )}
        {modelPrices.length > 0 &&
          baseline &&
          (() => {
            const lowest = Math.min(...modelPrices.map((p) => p.price));
            const nearLow = lowest <= baseline.historicalLow * 1.05;
            const belowMsrp = lowest < baseline.msrp;
            const aboveTypical = lowest > baseline.typicalRetail;
            const TrendIcon = nearLow ? TrendingDown : aboveTypical ? TrendingUp : Minus;
            const trendColor = nearLow ? "#42be65" : aboveTypical ? "#da1e28" : belowMsrp ? "#f1c21b" : "#6f6f6f";
            const trendText = nearLow
              ? "Near historical low"
              : aboveTypical
                ? "Above typical retail"
                : belowMsrp
                  ? "Below MSRP"
                  : "At typical price";
            return (
              <div className="mt-2 flex items-center gap-1.5 text-[11px]" style={{ color: trendColor }}>
                <TrendIcon size={12} />
                <span>{trendText}</span>
              </div>
            );
          })()}
        <Link href="/pricing" className="carbon-btn mt-3 w-full text-sm">
          Add Price
        </Link>
      </div>

      {/* Value Calculator card */}
      <div className="carbon-card p-4">
        <h2 className="mb-3 text-lg font-semibold sm:text-xl" style={{ color: "var(--foreground)" }}>
          Value Calculator
        </h2>
        <ValueScoring model={configuredModel} />
      </div>
    </div>
  );
};
