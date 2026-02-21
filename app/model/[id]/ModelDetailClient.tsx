"use client";

import { useState, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  ExternalLink,
  Cpu,
  Monitor,
  HardDrive,
  Wifi,
  Battery,
  Weight,
  Usb,
  Keyboard as KeyboardIcon,
} from "lucide-react";
import type { Laptop } from "@/lib/types";
import { laptops } from "@/data/laptops";
import { usePrices } from "@/lib/hooks/usePrices";
import { SeriesBadge } from "@/components/models/SeriesBadge";
import { ScoreBar } from "@/components/ui/ScoreBar";
import { LinuxBadge } from "@/components/ui/LinuxBadge";
import { PriceCheck } from "@/components/pricing/PriceCheck";
import { ValueScoring } from "@/components/pricing/ValueScoring";
import PriceHistoryCard from "@/components/pricing/PriceHistoryCard";
import { DeepDive } from "@/components/models/DeepDive";
import ModelAnalysisCard from "@/components/models/ModelAnalysisCard";
import EditorialCard from "@/components/models/EditorialCard";
import UpgradeSimulator from "@/components/models/UpgradeSimulator";
import { formatCHF, formatWeight, formatStorage, formatDate } from "@/lib/formatters";
import { getModelScores, getPricesForModel } from "@/lib/scoring";
import { generateAnalysis } from "@/lib/analysis";
import { getPsrefSearchUrl } from "@/lib/retailers";
import { modelEditorial } from "@/data/model-editorial";
import { linuxCompat } from "@/data/linux-compat";
import dynamic from "next/dynamic";

const PerformanceRadar = dynamic(() => import("@/components/charts/PerformanceRadar"), { ssr: false });
const BenchmarkBar = dynamic(() => import("@/components/charts/BenchmarkBar"), { ssr: false });
const GamingSection = dynamic(() => import("@/components/models/GamingSection"), { ssr: false });
const BenchmarksSection = dynamic(() => import("@/components/models/BenchmarksSection"), { ssr: false });
import UseCaseScenarios from "@/components/models/UseCaseScenarios";
import LinuxSection from "@/components/models/LinuxSection";
import HardwareGuide from "@/components/models/HardwareGuide";
import ConfigSelector from "@/components/models/ConfigSelector";

const SpecRow = ({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon?: React.ComponentType<{ size?: string | number; className?: string; style?: React.CSSProperties }>;
}) => (
  <div className="flex items-start gap-3 py-2" style={{ borderBottom: "1px solid var(--border-subtle)" }}>
    {Icon && <Icon size={16} style={{ color: "var(--muted)" }} className="mt-0.5 shrink-0" />}
    <span className="w-32 shrink-0 text-sm" style={{ color: "var(--muted)" }}>
      {label}
    </span>
    <span className="text-sm" style={{ color: "var(--foreground)" }}>
      {value}
    </span>
  </div>
);

const ModelDetailClient = () => {
  const params = useParams();
  const { allPrices, getBaseline, getPriceHistory } = usePrices();
  const model = laptops.find((m) => m.id === params.id);
  const [configuredModel, setConfiguredModel] = useState<Laptop | null>(model ?? null);
  const handleConfigChange = useCallback((configured: Laptop) => setConfiguredModel(configured), []);

  if (!model || !configuredModel) {
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

  // Scores derived from configured model (respond to config changes)
  const sc = getModelScores(configuredModel, allPrices);
  const analysis = generateAnalysis(configuredModel, laptops);

  // Values tied to base model (prices, value, editorial, linux)
  const valScore = sc.value;
  const modelPrices = getPricesForModel(model.id, allPrices);
  const editorial = modelEditorial[model.id];
  const linux = linuxCompat[model.id];
  const baseline = getBaseline(model.id);
  const priceHistory = getPriceHistory(model.id);

  return (
    <div className="animate-fade-in space-y-6">
      <Link
        href="/"
        className="inline-flex items-center gap-1 text-sm hover:underline"
        style={{ color: "var(--accent-light)" }}
      >
        <ArrowLeft size={14} /> Back to models
      </Link>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2">
            <SeriesBadge series={model.series} />
            {model.linuxStatus && <LinuxBadge status={model.linuxStatus} />}
          </div>
          <h1 className="mt-2 text-2xl font-bold sm:text-3xl" style={{ color: "var(--foreground)" }}>
            {model.name}
          </h1>
          <p className="mt-1 text-sm" style={{ color: "var(--muted)" }}>
            {model.year} · {model.os}
          </p>
        </div>
        {model.psrefUrl && (
          <div className="flex flex-col items-end gap-1 self-start">
            <a
              href={model.psrefUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="carbon-btn-ghost !px-3 !py-1.5 text-sm"
            >
              PSREF <ExternalLink size={12} />
            </a>
            <a
              href={getPsrefSearchUrl(model)}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs hover:underline"
              style={{ color: "var(--muted)" }}
            >
              Search PSREF
            </a>
          </div>
        )}
      </div>

      <ConfigSelector model={model} onConfigChange={handleConfigChange} />

      {/* Jump-to navigation */}
      <nav className="scrollbar-thin sticky top-0 z-20 -mx-4 flex gap-1 overflow-x-auto bg-carbon-900/95 px-4 py-2 backdrop-blur-sm sm:gap-2" aria-label="Page sections">
        {[
          { id: "scores", label: "Scores" },
          { id: "specs", label: "Specs" },
          { id: "performance", label: "Performance" },
          { id: "benchmarks", label: "Benchmarks" },
          { id: "gaming", label: "Gaming" },
          { id: "use-cases", label: "Use Cases" },
          { id: "editorial", label: "Editorial" },
        ].map((s) => (
          <a
            key={s.id}
            href={`#${s.id}`}
            className="shrink-0 border border-carbon-600 px-2.5 py-1 text-[11px] font-medium text-carbon-400 transition-colors hover:border-accent hover:text-accent-light"
          >
            {s.label}
          </a>
        ))}
      </nav>

      {/* Dashboard strip */}
      <div id="scores" className="grid scroll-mt-14 grid-cols-1 gap-4 border-b border-carbon-600/60 pb-6 md:grid-cols-3">
        {/* Scores card */}
        <div className="carbon-card rounded-lg p-4">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-semibold" style={{ color: "var(--foreground)" }}>
              Scores
            </h2>
            <div className="flex gap-2 text-[9px] font-mono uppercase tracking-wider">
              <span style={{ color: "#42be65" }}>80+ Excellent</span>
              <span style={{ color: "#4589ff" }}>60+ Good</span>
              <span style={{ color: "#f1c21b" }}>40+ Fair</span>
            </div>
          </div>
          <div className="space-y-2.5">
            {sc.perf > 0 && <ScoreBar score={sc.perf} label="Perf" color="#0f62fe" size="md" />}
            {sc.singleCore > 0 && <ScoreBar score={sc.singleCore} label="Single" color="#4589ff" size="md" />}
            {sc.multiCore > 0 && <ScoreBar score={sc.multiCore} label="Multi" color="#ee5396" size="md" />}
            {sc.gpu > 0 && <ScoreBar score={sc.gpu} label="GPU" color="#42be65" size="md" />}
            <ScoreBar score={sc.display} label="Display" color="#ee5396" size="md" />
            <ScoreBar score={sc.memory} label="Memory" color="#be95ff" size="md" />
            <ScoreBar score={sc.connectivity} label="Connect" color="#08bdba" size="md" />
            <ScoreBar score={sc.portability} label="Port" color="#42be65" size="md" />
            {valScore !== null && <ScoreBar score={Math.min(100, valScore)} label="Value" color="#f1c21b" size="md" />}
          </div>
        </div>

        {/* Swiss Prices card */}
        <div className="carbon-card rounded-lg p-4">
          <h2 className="mb-3 text-lg font-semibold" style={{ color: "var(--foreground)" }}>
            Swiss Prices
          </h2>
          {modelPrices.length > 0 ? (
            <div className="space-y-2">
              {modelPrices.map((p) => (
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
                          className={`border px-1 py-0.5 text-[9px] uppercase tracking-wider ${
                            p.priceType === "sale"
                              ? "border-green-700 bg-green-900/30 text-green-400"
                              : p.priceType === "msrp"
                                ? "border-blue-700 bg-blue-900/30 text-blue-400"
                                : p.priceType === "used"
                                  ? "border-amber-700 bg-amber-900/30 text-amber-400"
                                  : "border-slate-600 bg-slate-700/30 text-slate-300"
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
                            Date.now() - new Date(p.dateAdded).getTime() < 7 * 86400000
                              ? "#42be65"
                              : Date.now() - new Date(p.dateAdded).getTime() < 30 * 86400000
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
              ))}
            </div>
          ) : (
            <p className="text-sm" style={{ color: "var(--muted)" }}>
              No prices available yet.
            </p>
          )}
          <Link href="/pricing" className="carbon-btn mt-3 w-full text-sm">
            Add Price
          </Link>
        </div>

        {/* Value Calculator card */}
        <div className="carbon-card rounded-lg p-4">
          <h2 className="mb-3 text-lg font-semibold" style={{ color: "var(--foreground)" }}>
            Value Calculator
          </h2>
          <ValueScoring model={model} />
        </div>
      </div>

      {/* Price History */}
      <PriceHistoryCard baseline={baseline} priceHistory={priceHistory} />

      {/* Full-width stacked sections */}
      <div className="space-y-6">
        {/* Specifications — 2-column on large screens */}
        <div id="specs" className="carbon-card scroll-mt-14 rounded-lg p-4">
          <h2 className="mb-3 text-lg font-semibold" style={{ color: "var(--foreground)" }}>
            Specifications
          </h2>
          <div className="grid grid-cols-1 gap-x-8 lg:grid-cols-2">
            <div>
              <SpecRow
                icon={Cpu}
                label="Processor"
                value={`${configuredModel.processor.name} (${configuredModel.processor.cores}C/${configuredModel.processor.threads}T, ${configuredModel.processor.boostClock} GHz, ${configuredModel.processor.tdp}W TDP)`}
              />
              <SpecRow
                icon={Monitor}
                label="Display"
                value={`${configuredModel.display.size}" ${configuredModel.display.resolutionLabel} (${configuredModel.display.resolution}) ${configuredModel.display.panel}, ${configuredModel.display.refreshRate}Hz, ${configuredModel.display.nits} nits${configuredModel.display.touchscreen ? ", Touch" : ""}`}
              />
              <SpecRow
                icon={HardDrive}
                label="Memory"
                value={`${configuredModel.ram.size}GB ${configuredModel.ram.type}-${configuredModel.ram.speed}${configuredModel.ram.soldered ? " (soldered)" : ` (${configuredModel.ram.slots} slots)`}, max ${configuredModel.ram.maxSize}GB`}
              />
              <SpecRow
                icon={HardDrive}
                label="Storage"
                value={`${formatStorage(configuredModel.storage.size)} ${configuredModel.storage.type} (${configuredModel.storage.slots} slot${configuredModel.storage.slots > 1 ? "s" : ""})`}
              />
              <SpecRow
                label="GPU"
                value={`${configuredModel.gpu.name}${configuredModel.gpu.vram ? ` ${configuredModel.gpu.vram}GB` : ""}${configuredModel.gpu.integrated ? " (integrated)" : " (discrete)"}`}
              />
            </div>
            <div>
              <SpecRow
                icon={Battery}
                label="Battery"
                value={`${model.battery.whr} Wh${model.battery.removable ? " (removable)" : ""}`}
              />
              <SpecRow icon={Weight} label="Weight" value={formatWeight(model.weight)} />
              <SpecRow icon={Usb} label="Ports" value={model.ports.join(", ")} />
              <SpecRow icon={Wifi} label="Wireless" value={model.wireless.join(", ")} />
              {model.keyboard && (
                <SpecRow
                  icon={KeyboardIcon}
                  label="Keyboard"
                  value={`${model.keyboard.layout}${model.keyboard.backlit ? ", backlit" : ""}${model.keyboard.trackpoint ? ", TrackPoint" : ""}`}
                />
              )}
            </div>
          </div>
        </div>

        {/* Upgrade Simulator */}
        <div className="carbon-card rounded-lg p-4">
          <UpgradeSimulator
            key={`${configuredModel.ram.size}-${configuredModel.storage.size}`}
            model={configuredModel}
          />
        </div>

        {/* Performance Overview */}
        <div id="performance" className="carbon-card scroll-mt-14 rounded-lg p-4">
          <h2 className="mb-3 text-lg font-semibold" style={{ color: "var(--foreground)" }}>
            Performance Overview
          </h2>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <PerformanceRadar models={[{ name: model.name, dimensions: sc.dimensions }]} />
            <div className="space-y-2">
              {/* Dimension score cards */}
              {(
                [
                  {
                    key: "cpu",
                    label: "CPU",
                    score: sc.dimensions.cpu,
                    color: "#0f62fe",
                    detail: `${configuredModel.processor.name} · ${configuredModel.processor.cores}C/${configuredModel.processor.threads}T`,
                  },
                  {
                    key: "gpu",
                    label: "GPU",
                    score: sc.dimensions.gpu,
                    color: "#42be65",
                    detail: `${configuredModel.gpu.name}${configuredModel.gpu.integrated ? " (iGPU)" : ""}`,
                  },
                  {
                    key: "memory",
                    label: "Memory",
                    score: sc.dimensions.memory,
                    color: "#be95ff",
                    detail: `${configuredModel.ram.size}GB ${configuredModel.ram.type} · ${formatStorage(configuredModel.storage.size)}`,
                  },
                  {
                    key: "display",
                    label: "Display",
                    score: sc.dimensions.display,
                    color: "#ee5396",
                    detail: `${configuredModel.display.size}" ${configuredModel.display.resolutionLabel} ${configuredModel.display.panel} ${configuredModel.display.refreshRate}Hz`,
                  },
                  {
                    key: "connectivity",
                    label: "Connect",
                    score: sc.dimensions.connectivity,
                    color: "#08bdba",
                    detail: `${configuredModel.ports.length} ports${model.wireless.length > 0 ? ` · ${model.wireless[0]}` : ""}`,
                  },
                  {
                    key: "portability",
                    label: "Portable",
                    score: sc.dimensions.portability,
                    color: "#42be65",
                    detail: `${formatWeight(model.weight)} · ${model.battery.whr} Wh`,
                  },
                ] as const
              ).map((dim) => (
                <div
                  key={dim.key}
                  className="flex items-center gap-3 py-1.5"
                  style={{ borderBottom: "1px solid var(--border-subtle)" }}
                >
                  <span className="w-8 text-right font-mono text-lg font-bold" style={{ color: dim.color }}>
                    {dim.score}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-semibold" style={{ color: "var(--foreground)" }}>
                        {dim.label}
                      </span>
                      <span
                        className="text-[10px] font-medium"
                        style={{
                          color:
                            dim.score >= 80
                              ? "#42be65"
                              : dim.score >= 60
                                ? "#4589ff"
                                : dim.score >= 40
                                  ? "#f1c21b"
                                  : "#a8a8a8",
                        }}
                      >
                        {dim.score >= 80 ? "Excellent" : dim.score >= 60 ? "Good" : dim.score >= 40 ? "Fair" : "Low"}
                      </span>
                    </div>
                    <div className="truncate text-[10px]" style={{ color: "var(--muted)" }}>
                      {dim.detail}
                    </div>
                  </div>
                  <div className="h-2 w-24 shrink-0 rounded-full" style={{ background: "var(--surface)" }}>
                    <div className="h-full rounded-full" style={{ width: `${dim.score}%`, background: dim.color }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
          {(sc.singleCore > 0 || sc.multiCore > 0 || sc.gpu > 0) && (
            <div className="mt-4">
              <BenchmarkBar
                items={[
                  ...(sc.singleCore > 0 ? [{ label: "Single-Core", value: sc.singleCore, color: "#4589ff" }] : []),
                  ...(sc.multiCore > 0 ? [{ label: "Multi-Core", value: sc.multiCore, color: "#ee5396" }] : []),
                  ...(sc.gpu > 0 ? [{ label: "GPU", value: sc.gpu, color: "#42be65" }] : []),
                ]}
              />
            </div>
          )}
        </div>

        <div id="benchmarks" className="carbon-card scroll-mt-14 rounded-lg p-4">
          <BenchmarksSection model={configuredModel} />
        </div>

        <div id="gaming" className="carbon-card scroll-mt-14 rounded-lg p-4">
          <GamingSection gpuName={configuredModel.gpu.name} gamingTier={sc.gamingTier} benchmark={sc.gpuBenchmark} />
        </div>

        <div className="carbon-card rounded-lg p-4">
          <HardwareGuide cpuName={configuredModel.processor.name} gpuName={configuredModel.gpu.name} />
        </div>

        {/* Use Case + Linux — side by side on desktop */}
        {((analysis.scenarios?.length ?? 0) > 0 || linux) && (
          <div id="use-cases" className="grid scroll-mt-14 grid-cols-1 gap-4 lg:grid-cols-2">
            {analysis.scenarios && analysis.scenarios.length > 0 && (
              <div className="carbon-card rounded-lg p-4">
                <UseCaseScenarios scenarios={analysis.scenarios} />
              </div>
            )}
            {linux && (
              <div className="carbon-card rounded-lg p-4">
                <LinuxSection compat={linux} />
              </div>
            )}
          </div>
        )}

        <ModelAnalysisCard analysis={analysis} />

        {editorial && (
          <div id="editorial" className="scroll-mt-14">
            <EditorialCard editorial={editorial} linuxStatus={model.linuxStatus} />
          </div>
        )}

        {/* Deep Dive + Price Check — compact row */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div className="carbon-card rounded-lg p-3">
            <DeepDive model={model} />
          </div>
          <div className="carbon-card rounded-lg p-3">
            <PriceCheck model={model} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModelDetailClient;
