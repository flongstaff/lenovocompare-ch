"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Share2, ArrowLeft, Check } from "lucide-react";
import { useLaptops } from "@/lib/hooks/useLaptops";
import { usePrices } from "@/lib/hooks/usePrices";
import { useCompare } from "@/lib/hooks/useCompare";
import CompareTable from "@/components/compare/CompareTable";
import { MobileCompareCards } from "@/components/compare/MobileCompareCards";
import { CompareSearchSelector } from "@/components/compare/CompareSearchSelector";
import { MAX_COMPARE } from "@/lib/constants";
import dynamic from "next/dynamic";
import { getPerformanceDimensions } from "@/lib/scoring";

const ChartSkeleton = () => <div className="carbon-card animate-pulse" style={{ height: 200 }} />;
const PerformanceRadar = dynamic(() => import("@/components/charts/PerformanceRadar"), {
  ssr: false,
  loading: ChartSkeleton,
});
const CpuCompareChart = dynamic(() => import("@/components/charts/CpuCompareChart"), {
  ssr: false,
  loading: ChartSkeleton,
});
const GpuCompareChart = dynamic(() => import("@/components/charts/GpuCompareChart"), {
  ssr: false,
  loading: ChartSkeleton,
});
const PortabilityCompareChart = dynamic(() => import("@/components/charts/PortabilityCompareChart"), {
  ssr: false,
  loading: ChartSkeleton,
});
const ThermalCompareChart = dynamic(() => import("@/components/charts/ThermalCompareChart"), {
  ssr: false,
  loading: ChartSkeleton,
});
const BatteryLifeCompareChart = dynamic(() => import("@/components/charts/BatteryLifeCompareChart"), {
  ssr: false,
  loading: ChartSkeleton,
});
import { QuickVerdict } from "@/components/compare/QuickVerdict";
import { CompareConfigPanel } from "@/components/compare/CompareConfigPanel";
import { type ConfigState, buildConfiguredModel } from "@/lib/configUtils";

const ComparePageContent = () => {
  const models = useLaptops();
  const { allPrices } = usePrices();
  const { selectedIds, toggleCompare, removeFromCompare, setIds } = useCompare();
  const searchParams = useSearchParams();
  const initRef = useRef(false);
  const [copied, setCopied] = useState(false);
  const [configOverrides, setConfigOverrides] = useState<Record<string, ConfigState>>({});

  const handleConfigChange = useCallback((laptopId: string, config: ConfigState) => {
    setConfigOverrides((prev) => ({ ...prev, [laptopId]: config }));
  }, []);

  const handleResetAllConfigs = useCallback(() => {
    setConfigOverrides({});
  }, []);

  // Load IDs from URL on mount
  useEffect(() => {
    if (initRef.current) return;
    initRef.current = true;
    const urlIds = searchParams.get("ids");
    if (urlIds) {
      const validIds = urlIds.split(",").filter((id) => models.some((m) => m.id === id));
      setIds(validIds);
    }
  }, [searchParams, models, setIds]);

  const selectedModels = selectedIds
    .map((id) => models.find((m) => m.id === id))
    .filter((m): m is NonNullable<typeof m> => m !== undefined);

  const configuredModels = selectedModels.map((m) => {
    const override = configOverrides[m.id];
    return override ? buildConfiguredModel(m, override) : m;
  });

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/compare?ids=${selectedIds.join(",")}`;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.warn("[Compare] Clipboard write failed:", error);
      window.prompt("Could not copy automatically. Copy this link:", shareUrl);
    }
  };

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-sm hover:underline"
            style={{ color: "var(--accent-light)" }}
          >
            <ArrowLeft size={14} /> Back to models
          </Link>
          <h1 className="mt-2 text-2xl font-bold" style={{ color: "var(--foreground)" }}>
            Compare Models
          </h1>
          <p className="mt-1 text-sm" style={{ color: "var(--muted)" }}>
            Select up to {MAX_COMPARE} models to compare side by side
          </p>
        </div>
        {selectedIds.length >= 2 && (
          <button
            onClick={handleShare}
            className="carbon-btn-ghost !px-3 !py-1.5 text-sm"
            aria-label="Copy comparison link to clipboard"
          >
            {copied ? <Check size={14} /> : <Share2 size={14} />}
            {copied ? "Copied!" : "Copy Link"}
          </button>
        )}
      </div>

      {selectedModels.length >= 2 ? (
        <>
          <QuickVerdict models={configuredModels} prices={allPrices} />
          <CompareConfigPanel
            models={selectedModels}
            configs={configOverrides}
            onConfigChange={handleConfigChange}
            onResetAll={handleResetAllConfigs}
          />
          <div className="hidden grid-cols-1 gap-4 sm:grid lg:grid-cols-2">
            <div className="carbon-card p-4">
              <h2
                className="mb-2 font-mono text-sm font-semibold uppercase tracking-wider"
                style={{ color: "var(--muted)" }}
              >
                Performance Comparison
              </h2>
              <PerformanceRadar
                models={configuredModels.map((m) => ({
                  name: m.name,
                  dimensions: getPerformanceDimensions(m),
                }))}
              />
            </div>
            <div className="carbon-card p-4">
              <h2
                className="mb-2 font-mono text-sm font-semibold uppercase tracking-wider"
                style={{ color: "var(--muted)" }}
              >
                Weight & Battery
              </h2>
              <PortabilityCompareChart models={configuredModels} />
            </div>
            <div className="carbon-card p-4">
              <h2
                className="mb-2 font-mono text-sm font-semibold uppercase tracking-wider"
                style={{ color: "var(--muted)" }}
              >
                CPU Benchmarks
              </h2>
              <CpuCompareChart models={configuredModels} />
            </div>
            <div className="carbon-card p-4">
              <h2
                className="mb-2 font-mono text-sm font-semibold uppercase tracking-wider"
                style={{ color: "var(--muted)" }}
              >
                GPU Scores
              </h2>
              <GpuCompareChart models={configuredModels} />
            </div>
            <div className="carbon-card p-4">
              <h2
                className="mb-2 font-mono text-sm font-semibold uppercase tracking-wider"
                style={{ color: "var(--muted)" }}
              >
                Thermals & Noise
              </h2>
              <ThermalCompareChart models={configuredModels} />
            </div>
            <div className="carbon-card p-4">
              <h2
                className="mb-2 font-mono text-sm font-semibold uppercase tracking-wider"
                style={{ color: "var(--muted)" }}
              >
                Battery Life
              </h2>
              <BatteryLifeCompareChart models={configuredModels} />
            </div>
          </div>
          <div className="carbon-card hidden overflow-hidden p-4 sm:block">
            <CompareTable models={configuredModels} prices={allPrices} onRemove={removeFromCompare} />
          </div>
          <div className="sm:hidden">
            <MobileCompareCards models={configuredModels} prices={allPrices} onRemove={removeFromCompare} />
          </div>
        </>
      ) : (
        <div className="py-8 text-center" style={{ color: "var(--muted)" }}>
          <p className="text-lg">Select at least 2 models to compare</p>
          <p className="mt-1 text-sm">
            Use the{" "}
            <Link href="/" className="hover:underline" style={{ color: "var(--accent-light)" }}>
              Models page
            </Link>{" "}
            to add models, or use the selector below.
          </p>
        </div>
      )}

      {selectedIds.length < MAX_COMPARE && (
        <CompareSearchSelector models={models} excludeIds={selectedIds} onSelect={toggleCompare} />
      )}
    </div>
  );
};

const CompareClient = () => (
  <Suspense fallback={<div className="py-16 text-center text-carbon-400">Loading...</div>}>
    <ComparePageContent />
  </Suspense>
);

export default CompareClient;
