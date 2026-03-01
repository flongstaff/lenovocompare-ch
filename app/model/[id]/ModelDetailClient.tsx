"use client";

import { useState, useCallback, useMemo } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import type { Laptop } from "@/lib/types";
import { laptops } from "@/data/laptops";
import { usePrices } from "@/lib/hooks/usePrices";
import { getModelScores, getPricesForModel } from "@/lib/scoring";
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
import { DashboardStrip } from "@/components/models/DashboardStrip";

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

      <DashboardStrip
        model={model}
        configuredModel={configuredModel}
        sc={sc}
        modelPrices={modelPrices}
        baseline={baseline}
      />

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
