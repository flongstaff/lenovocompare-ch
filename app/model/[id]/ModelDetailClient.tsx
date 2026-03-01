"use client";

import { useState, useCallback, useMemo } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ExternalLink, TrendingDown, TrendingUp, Minus } from "lucide-react";
import type { Laptop } from "@/lib/types";
import { laptops } from "@/data/laptops";
import { usePrices } from "@/lib/hooks/usePrices";
import { ScoreBar } from "@/components/ui/ScoreBar";

import { formatCHF, formatDate } from "@/lib/formatters";
import { getModelScores, getPricesForModel, getScorePercentile, getLineupMaxScore } from "@/lib/scoring";
import { generateAnalysis } from "@/lib/analysis";
import { modelEditorial } from "@/data/model-editorial";
import { linuxCompat } from "@/data/linux-compat";
import dynamic from "next/dynamic";

const ChartSkeleton = () => <div className="carbon-card animate-pulse" style={{ height: 200 }} />;
const GamingSection = dynamic(() => import("@/components/models/GamingSection"), {
  ssr: false,
  loading: ChartSkeleton,
});
const BenchmarksSection = dynamic(() => import("@/components/models/BenchmarksSection"), {
  ssr: false,
  loading: ChartSkeleton,
});
const SectionSkeleton = () => <div className="carbon-card animate-pulse" style={{ height: 120 }} />;
const PriceCheck = dynamic(() => import("@/components/pricing/PriceCheck").then((m) => ({ default: m.PriceCheck })), {
  loading: SectionSkeleton,
});
const ValueScoring = dynamic(
  () => import("@/components/pricing/ValueScoring").then((m) => ({ default: m.ValueScoring })),
  { loading: SectionSkeleton },
);
const PriceHistoryCard = dynamic(() => import("@/components/pricing/PriceHistoryCard"), {
  ssr: false,
  loading: SectionSkeleton,
});
const DeepDive = dynamic(() => import("@/components/models/DeepDive").then((m) => ({ default: m.DeepDive })), {
  loading: SectionSkeleton,
});
const ModelAnalysisCard = dynamic(() => import("@/components/models/ModelAnalysisCard"), {
  loading: SectionSkeleton,
});
const EditorialCard = dynamic(() => import("@/components/models/EditorialCard"), { loading: SectionSkeleton });
const UpgradeSimulator = dynamic(() => import("@/components/models/UpgradeSimulator"), {
  loading: SectionSkeleton,
});
const UseCaseScenarios = dynamic(() => import("@/components/models/UseCaseScenarios"), {
  loading: SectionSkeleton,
});
const LinuxSection = dynamic(() => import("@/components/models/LinuxSection"), { loading: SectionSkeleton });
const HardwareGuide = dynamic(() => import("@/components/models/HardwareGuide"), { loading: SectionSkeleton });
const ConfigSelector = dynamic(() => import("@/components/models/ConfigSelector"), { loading: SectionSkeleton });
import SectionErrorBoundary from "@/components/ui/SectionErrorBoundary";
import { FormFactorSection } from "@/components/models/FormFactorSection";
import { SpecificationsCard } from "@/components/models/SpecificationsCard";
import { ModelHeader } from "@/components/models/ModelHeader";
import { PerformanceOverview } from "@/components/models/PerformanceOverview";

const ModelDetailClient = () => {
  const params = useParams();
  const { allPrices, getBaseline, getPriceHistory } = usePrices();
  const model = laptops.find((m) => m.id === params.id);
  const [configuredModel, setConfiguredModel] = useState<Laptop | null>(model ?? null);
  const handleConfigChange = useCallback((configured: Laptop) => setConfiguredModel(configured), []);

  // Scores derived from configured model (respond to config changes) — must be before early return
  const sc = useMemo(
    () => (configuredModel ? getModelScores(configuredModel, allPrices) : null),
    [configuredModel, allPrices],
  );
  const analysis = useMemo(
    () => (configuredModel ? generateAnalysis(configuredModel, laptops) : null),
    [configuredModel],
  );

  if (!model || !configuredModel || !sc || !analysis) {
    return (
      <div className="py-16 text-center">
        <p className="text-lg font-medium" style={{ color: "var(--foreground)" }}>
          Model not found
        </p>
        <Link href="/" className="carbon-btn mt-4 inline-flex">
          Back to models
        </Link>
      </div>
    );
  }

  // Values tied to base model (prices, value, editorial, linux)
  const valScore = sc.value;
  const modelPrices = getPricesForModel(model.id, allPrices);
  const editorial = modelEditorial[model.id];
  const linux = linuxCompat[model.id];
  const baseline = getBaseline(model.id);
  const priceHistory = getPriceHistory(model.id);

  return (
    <div className="animate-fade-in space-y-6">
      <ModelHeader model={model} sc={sc} />

      <ConfigSelector model={model} onConfigChange={handleConfigChange} />

      {/* Jump-to navigation */}
      <nav
        className="scrollbar-thin sticky top-0 z-20 -mx-4 flex gap-1.5 overflow-x-auto px-4 py-2.5 backdrop-blur-md sm:gap-2"
        style={{ background: "rgba(22, 22, 22, 0.92)", borderBottom: "1px solid #262626" }}
        aria-label="Page sections"
      >
        {[
          { id: "scores", label: "Scores" },
          { id: "specs", label: "Specs" },
          { id: "form-factor", label: "Form Factor" },
          { id: "performance", label: "Performance" },
          { id: "benchmarks", label: "Benchmarks" },
          { id: "gaming", label: "Gaming" },
          { id: "use-cases", label: "Use Cases" },
          { id: "editorial", label: "Editorial" },
          { id: "research", label: "Research" },
        ].map((s) => (
          <a
            key={s.id}
            href={`#${s.id}`}
            className="shrink-0 px-2.5 py-1 font-mono text-[10px] font-medium uppercase tracking-wider text-carbon-400 transition-all hover:bg-carbon-700/50 hover:text-accent-light"
          >
            {s.label}
          </a>
        ))}
      </nav>

      {/* Dashboard strip */}
      <div
        id="scores"
        className="grid scroll-mt-14 grid-cols-1 gap-4 border-b border-carbon-600/60 pb-6 md:grid-cols-3"
      >
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

      {/* Price History */}
      <SectionErrorBoundary section="Price History">
        <PriceHistoryCard baseline={baseline} priceHistory={priceHistory} />
      </SectionErrorBoundary>

      {/* Full-width stacked sections */}
      <div className="space-y-6">
        {/* Specifications */}
        <SpecificationsCard model={model} configuredModel={configuredModel} />

        {/* Form Factor */}
        <FormFactorSection model={model} configuredModel={configuredModel} />

        {/* Upgrade Simulator */}
        <div className="carbon-card p-4">
          <UpgradeSimulator
            key={`${configuredModel.ram.size}-${configuredModel.storage.size}`}
            model={configuredModel}
          />
        </div>

        {/* Performance Overview */}
        <SectionErrorBoundary section="Performance Overview">
          <PerformanceOverview model={model} configuredModel={configuredModel} sc={sc} />
        </SectionErrorBoundary>

        <SectionErrorBoundary section="Benchmarks">
          <div id="benchmarks" className="carbon-card scroll-mt-14 p-4">
            <BenchmarksSection model={configuredModel} />
          </div>
        </SectionErrorBoundary>

        <SectionErrorBoundary section="Gaming">
          <div id="gaming" className="carbon-card scroll-mt-14 p-4">
            <GamingSection gpuName={configuredModel.gpu.name} gamingTier={sc.gamingTier} benchmark={sc.gpuBenchmark} />
          </div>
        </SectionErrorBoundary>

        <SectionErrorBoundary section="Hardware Guide">
          <div className="carbon-card p-4">
            <HardwareGuide cpuName={configuredModel.processor.name} gpuName={configuredModel.gpu.name} />
          </div>
        </SectionErrorBoundary>

        {/* Use Case + Linux — side by side on desktop */}
        {((analysis.scenarios?.length ?? 0) > 0 || linux) && (
          <div id="use-cases" className="grid scroll-mt-14 grid-cols-1 gap-4 lg:grid-cols-2">
            {analysis.scenarios && analysis.scenarios.length > 0 && (
              <div className="carbon-card p-4">
                <UseCaseScenarios scenarios={analysis.scenarios} />
              </div>
            )}
            {linux && (
              <div className="carbon-card p-4">
                <LinuxSection compat={linux} />
              </div>
            )}
          </div>
        )}

        <SectionErrorBoundary section="Analysis">
          <ModelAnalysisCard analysis={analysis} />
        </SectionErrorBoundary>

        {editorial && (
          <SectionErrorBoundary section="Editorial">
            <div id="editorial" className="carbon-card-editorial scroll-mt-14 p-4">
              <EditorialCard editorial={editorial} linuxStatus={model.linuxStatus} />
            </div>
          </SectionErrorBoundary>
        )}

        {/* Deep Dive + Price Check — compact row */}
        <SectionErrorBoundary section="Research">
          <div id="research" className="grid scroll-mt-14 grid-cols-1 gap-4 lg:grid-cols-2">
            <div className="carbon-card p-3">
              <DeepDive model={model} />
            </div>
            <div className="carbon-card p-3">
              <PriceCheck model={model} />
            </div>
          </div>
        </SectionErrorBoundary>
      </div>
    </div>
  );
};

export default ModelDetailClient;
