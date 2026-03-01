"use client";

import { useState, useCallback, useMemo } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  ExternalLink,
  TrendingDown,
  TrendingUp,
  Minus,
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

import { formatCHF, formatWeight, formatStorage, formatDate } from "@/lib/formatters";
import { getModelScores, getPricesForModel, getScorePercentile, getLineupMaxScore } from "@/lib/scoring";
import { generateAnalysis } from "@/lib/analysis";
import { getPsrefSearchUrl } from "@/lib/retailers";
import { modelEditorial } from "@/data/model-editorial";
import { linuxCompat } from "@/data/linux-compat";
import dynamic from "next/dynamic";

const ChartSkeleton = () => <div className="carbon-card animate-pulse" style={{ height: 200 }} />;
const PerformanceRadar = dynamic(() => import("@/components/charts/PerformanceRadar"), {
  ssr: false,
  loading: ChartSkeleton,
});
const BenchmarkBar = dynamic(() => import("@/components/charts/BenchmarkBar"), { ssr: false, loading: ChartSkeleton });
const GamingSection = dynamic(() => import("@/components/models/GamingSection"), {
  ssr: false,
  loading: ChartSkeleton,
});
const BenchmarksSection = dynamic(() => import("@/components/models/BenchmarksSection"), {
  ssr: false,
  loading: ChartSkeleton,
});
const ScoreCardExpanded = dynamic(() => import("@/components/models/ScoreCardExpanded"), {
  ssr: false,
  loading: ChartSkeleton,
});
const AiDevReadiness = dynamic(() => import("@/components/models/AiDevReadiness"), {
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
const BlueprintDiagram = dynamic(
  () => import("@/components/models/BlueprintDiagram").then((m) => ({ default: m.BlueprintDiagram })),
  { loading: SectionSkeleton },
);
import SectionErrorBoundary from "@/components/ui/SectionErrorBoundary";

const SpecRow = ({
  label,
  value,
  icon: Icon,
  even,
}: {
  label: string;
  value: string;
  icon?: React.ComponentType<{ size?: string | number; className?: string; style?: React.CSSProperties }>;
  even?: boolean;
}) => (
  <div
    className="flex items-start gap-3 px-2 py-2"
    style={{ background: even ? "var(--surface-inset)" : "transparent" }}
  >
    {Icon && <Icon size={15} style={{ color: "var(--icon-muted)" }} className="mt-0.5 shrink-0" />}
    <span
      className="w-20 shrink-0 font-mono text-[11px] font-medium uppercase tracking-wider"
      style={{ color: "var(--muted)" }}
    >
      {label}
    </span>
    <span className="text-sm leading-snug" style={{ color: "var(--foreground)" }}>
      {value}
    </span>
  </div>
);

/** Parse port strings like "2x Thunderbolt 4" into structured data */
const parsePortBreakdown = (ports: readonly string[]) => {
  const tb: string[] = [];
  const usbC: string[] = [];
  const usbA: string[] = [];
  const video: string[] = [];
  const other: string[] = [];

  for (const p of ports) {
    const lower = p.toLowerCase();
    if (lower.includes("thunderbolt")) tb.push(p);
    else if (lower.includes("usb-c") || lower.includes("usb c")) usbC.push(p);
    else if (lower.includes("usb-a") || lower.includes("usb a")) usbA.push(p);
    else if (lower.includes("hdmi") || lower.includes("displayport") || lower.includes("vga")) video.push(p);
    else other.push(p);
  }
  return { tb, usbC, usbA, video, other };
};

const PortChip = ({ label, accent }: { label: string; accent: string }) => (
  <span
    className="inline-flex items-center px-1.5 py-0.5 font-mono text-[10px] font-medium"
    style={{ background: `${accent}15`, color: accent, border: `1px solid ${accent}25` }}
  >
    {label}
  </span>
);

const PhysicalStat = ({ label, value, unit }: { label: string; value: string; unit?: string }) => (
  <div className="flex flex-col items-center">
    <span className="font-mono text-sm font-semibold leading-tight" style={{ color: "var(--foreground)" }}>
      {value}
      {unit && (
        <span className="ml-0.5 text-[10px] font-normal" style={{ color: "var(--muted)" }}>
          {unit}
        </span>
      )}
    </span>
    <span className="font-mono text-[10px] uppercase tracking-wider" style={{ color: "var(--muted)" }}>
      {label}
    </span>
  </div>
);

const FormFactorConnectivity = ({
  model,
  configuredModel,
}: {
  readonly model: Laptop;
  readonly configuredModel: Laptop;
}) => {
  const portInfo = parsePortBreakdown(model.ports);
  const totalPorts = model.ports.reduce((sum, p) => {
    const match = p.match(/^(\d+)x\s/);
    return sum + (match ? parseInt(match[1], 10) : 1);
  }, 0);

  return (
    <div id="form-factor" className="carbon-card scroll-mt-14 p-4">
      <h2 className="mb-3 text-base font-semibold sm:text-lg" style={{ color: "var(--foreground)" }}>
        Form Factor
      </h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* Blueprint diagram */}
        <div className="flex items-center justify-center">
          <BlueprintDiagram
            displaySize={configuredModel.display.size}
            weight={configuredModel.weight}
            lineup={configuredModel.lineup}
            series={configuredModel.series}
          />
        </div>

        {/* Physical build context — unique info not in Specs */}
        <div className="flex flex-col justify-between gap-3">
          {/* Quick physical stats — 2x2 grid */}
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            <div
              className="border px-2.5 py-2"
              style={{ borderColor: "var(--border-subtle)", background: "var(--surface-inset)" }}
            >
              <PhysicalStat label="Weight" value={formatWeight(model.weight)} />
            </div>
            <div
              className="border px-2.5 py-2"
              style={{ borderColor: "var(--border-subtle)", background: "var(--surface-inset)" }}
            >
              <PhysicalStat label="Battery" value={`${model.battery.whr}`} unit="Wh" />
            </div>
            <div
              className="border px-2.5 py-2"
              style={{ borderColor: "var(--border-subtle)", background: "var(--surface-inset)" }}
            >
              <PhysicalStat label="Screen" value={`${configuredModel.display.size}"`} />
            </div>
            <div
              className="border px-2.5 py-2"
              style={{ borderColor: "var(--border-subtle)", background: "var(--surface-inset)" }}
            >
              <PhysicalStat label="Total I/O" value={`${totalPorts}`} unit="ports" />
            </div>
          </div>

          {/* Port breakdown */}
          <div className="space-y-1.5">
            <span
              className="font-mono text-[10px] font-medium uppercase tracking-widest"
              style={{ color: "var(--muted)" }}
            >
              I/O Breakdown
            </span>
            <div className="flex flex-wrap gap-1.5">
              {portInfo.tb.map((p) => (
                <PortChip key={p} label={p} accent="#0f62fe" />
              ))}
              {portInfo.usbC.map((p) => (
                <PortChip key={p} label={p} accent="#08bdba" />
              ))}
              {portInfo.usbA.map((p) => (
                <PortChip key={p} label={p} accent="#be95ff" />
              ))}
              {portInfo.video.map((p) => (
                <PortChip key={p} label={p} accent="#f1c21b" />
              ))}
              {portInfo.other.map((p) => (
                <PortChip key={p} label={p} accent="#6f6f6f" />
              ))}
            </div>
          </div>

          {/* Connectivity + build details */}
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs" style={{ color: "var(--muted)" }}>
            {model.wireless.map((w) => (
              <span key={w}>
                <Wifi size={11} className="mr-1 inline" style={{ color: "var(--muted)" }} />
                {w}
              </span>
            ))}
            {model.keyboard && (
              <span>
                <KeyboardIcon size={11} className="mr-1 inline" style={{ color: "var(--muted)" }} />
                {model.keyboard.layout}
                {model.keyboard.backlit ? " · Backlit" : ""}
                {model.keyboard.trackpoint ? " · TrackPoint" : ""}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

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

      {/* Quick score strip — at-a-glance summary (RTINGS-inspired) */}
      <div className="flex flex-wrap gap-2">
        {[
          { label: "CPU", score: sc.dimensions.cpu, color: "#0f62fe" },
          { label: "GPU", score: sc.dimensions.gpu, color: "#42be65" },
          { label: "Display", score: sc.dimensions.display, color: "#ee5396" },
          { label: "Memory", score: sc.dimensions.memory, color: "#be95ff" },
          { label: "Connect", score: sc.dimensions.connectivity, color: "#08bdba" },
          { label: "Portable", score: sc.dimensions.portability, color: "#42be65" },
        ].map((d) => (
          <div
            key={d.label}
            className="flex items-center gap-1.5 border px-2 py-1"
            style={{ borderColor: "#393939", background: "var(--surface-inset)" }}
          >
            <span className="font-mono text-[10px] uppercase tracking-wider" style={{ color: "var(--muted)" }}>
              {d.label}
            </span>
            <span className="font-mono text-sm font-semibold" style={{ color: d.color }}>
              {d.score}
            </span>
          </div>
        ))}
      </div>

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
        {/* Specifications — 2-column on large screens */}
        <div id="specs" className="carbon-card scroll-mt-14 p-3">
          <h2 className="mb-2 text-base font-semibold sm:text-lg" style={{ color: "var(--foreground)" }}>
            Specifications
          </h2>
          <div className="grid grid-cols-1 gap-x-4 lg:grid-cols-2">
            <div>
              <SpecRow
                icon={Cpu}
                label="CPU"
                even
                value={`${configuredModel.processor.name} (${configuredModel.processor.cores}C/${configuredModel.processor.threads}T, ${configuredModel.processor.boostClock} GHz, ${configuredModel.processor.tdp}W)`}
              />
              <SpecRow
                icon={Monitor}
                label="Display"
                value={`${configuredModel.display.size}" ${configuredModel.display.resolutionLabel} ${configuredModel.display.panel} · ${configuredModel.display.refreshRate}Hz · ${configuredModel.display.nits} nits${configuredModel.display.touchscreen ? " · Touch" : ""}`}
              />
              <SpecRow
                icon={HardDrive}
                label="RAM"
                even
                value={`${configuredModel.ram.size}GB ${configuredModel.ram.type}-${configuredModel.ram.speed}${configuredModel.ram.soldered ? " (soldered)" : ` (${configuredModel.ram.slots} slot${configuredModel.ram.slots > 1 ? "s" : ""})`} · max ${configuredModel.ram.maxSize}GB`}
              />
              <SpecRow
                icon={HardDrive}
                label="Storage"
                value={`${formatStorage(configuredModel.storage.size)} ${configuredModel.storage.type} (${configuredModel.storage.slots} slot${configuredModel.storage.slots > 1 ? "s" : ""})`}
              />
              <SpecRow
                label="GPU"
                even
                value={`${configuredModel.gpu.name}${configuredModel.gpu.vram ? ` ${configuredModel.gpu.vram}GB` : ""} · ${configuredModel.gpu.integrated ? "integrated" : "discrete"}`}
              />
            </div>
            <div>
              <SpecRow
                icon={Battery}
                label="Battery"
                even
                value={`${model.battery.whr} Wh${model.battery.removable ? " · Removable" : ""}`}
              />
              <SpecRow icon={Weight} label="Weight" value={formatWeight(model.weight)} />
              <SpecRow icon={Usb} label="Ports" even value={model.ports.join(", ")} />
              <SpecRow icon={Wifi} label="Wireless" value={model.wireless.join(", ")} />
              {model.keyboard && (
                <SpecRow
                  icon={KeyboardIcon}
                  label="Input"
                  even
                  value={`${model.keyboard.layout}${model.keyboard.backlit ? " · Backlit" : ""}${model.keyboard.trackpoint ? " · TrackPoint" : ""}`}
                />
              )}
            </div>
          </div>
        </div>

        {/* Form Factor */}
        <FormFactorConnectivity model={model} configuredModel={configuredModel} />

        {/* Upgrade Simulator */}
        <div className="carbon-card p-4">
          <UpgradeSimulator
            key={`${configuredModel.ram.size}-${configuredModel.storage.size}`}
            model={configuredModel}
          />
        </div>

        {/* Performance Overview */}
        <SectionErrorBoundary section="Performance Overview">
          <div id="performance" className="carbon-card scroll-mt-14 p-4">
            <h2 className="mb-3 text-lg font-semibold sm:text-xl" style={{ color: "var(--foreground)" }}>
              Performance Overview
            </h2>
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <div className="space-y-4">
                <PerformanceRadar models={[{ name: model.name, dimensions: sc.dimensions }]} />
                <AiDevReadiness
                  ramGb={configuredModel.ram.size}
                  cores={configuredModel.processor.cores}
                  threads={configuredModel.processor.threads}
                />
              </div>
              <div className="space-y-2">
                {/* Dimension score cards */}
                <ScoreCardExpanded
                  model={configuredModel}
                  dimensions={[
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
                  ]}
                />
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
