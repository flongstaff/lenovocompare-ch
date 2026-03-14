"use client";

import { useState, useCallback, useRef, memo, useMemo } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import type { Laptop, SwissPrice } from "@/lib/types";
import { ScoreBar } from "@/components/ui/ScoreBar";
import { LinuxBadge } from "@/components/ui/LinuxBadge";
import { formatCHF, formatWeight, formatStorage } from "@/lib/formatters";
import { getModelScores, getModelBenchmarks } from "@/lib/scoring";
import { generateAnalysis } from "@/lib/analysis";
import { laptops } from "@/data/laptops";
import dynamic from "next/dynamic";
import ChartErrorBoundary from "@/components/ui/ChartErrorBoundary";

const ChartSkeleton = () => (
  <div className="animate-pulse rounded" style={{ height: 200, background: "var(--carbon-700)" }} />
);
const PerformanceRadar = dynamic(() => import("@/components/charts/PerformanceRadar"), { ssr: false });
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

interface MobileCompareCardsProps {
  readonly models: Laptop[];
  readonly prices: readonly SwissPrice[];
  readonly onRemove: (id: string) => void;
}

const SpecItem = ({ label, value }: { label: string; value: string }) => (
  <div className="flex justify-between py-1.5" style={{ borderBottom: "1px solid var(--border-subtle)" }}>
    <span className="text-xs" style={{ color: "var(--muted)" }}>
      {label}
    </span>
    <span className="text-right text-sm font-medium" style={{ color: "var(--foreground)" }}>
      {value}
    </span>
  </div>
);

const CHART_SLIDES = [
  { key: "cpu", label: "CPU Benchmarks", chartName: "CPU Benchmarks" },
  { key: "gpu", label: "GPU Scores", chartName: "GPU Scores" },
  { key: "portability", label: "Weight & Battery", chartName: "Portability Compare" },
  { key: "thermal", label: "Thermals & Noise", chartName: "Thermals & Noise" },
  { key: "battery", label: "Battery Life", chartName: "Battery Life" },
] as const;

export const MobileCompareCards = memo(({ models, prices, onRemove }: MobileCompareCardsProps) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const clampedIndex = Math.min(activeIndex, models.length - 1);
  const [dragOffset, setDragOffset] = useState(0);
  const dragStartRef = useRef<number | null>(null);

  // Chart swipe state
  const [activeChartIndex, setActiveChartIndex] = useState(0);
  const [chartDragOffset, setChartDragOffset] = useState(0);
  const chartDragStartRef = useRef<number | null>(null);

  const handlePointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    dragStartRef.current = e.clientX;
    (e.target as Element).setPointerCapture?.(e.pointerId);
  }, []);

  const handlePointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (dragStartRef.current === null) return;
    const dx = e.clientX - dragStartRef.current;
    setDragOffset(dx * 0.2); // elastic resistance
  }, []);

  const handlePointerUp = useCallback(() => {
    if (dragStartRef.current === null) return;
    const threshold = 10; // 50px * 0.2 elastic = 10px offset threshold
    if (dragOffset < -threshold) {
      setActiveIndex((i) => Math.min(models.length - 1, i + 1));
    } else if (dragOffset > threshold) {
      setActiveIndex((i) => Math.max(0, i - 1));
    }
    dragStartRef.current = null;
    setDragOffset(0);
  }, [dragOffset, models.length]);

  const handleChartPointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    chartDragStartRef.current = e.clientX;
    (e.target as Element).setPointerCapture?.(e.pointerId);
  }, []);

  const handleChartPointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (chartDragStartRef.current === null) return;
    const dx = e.clientX - chartDragStartRef.current;
    setChartDragOffset(dx * 0.2);
  }, []);

  const handleChartPointerUp = useCallback(() => {
    if (chartDragStartRef.current === null) return;
    const threshold = 10;
    if (chartDragOffset < -threshold) {
      setActiveChartIndex((i) => Math.min(CHART_SLIDES.length - 1, i + 1));
    } else if (chartDragOffset > threshold) {
      setActiveChartIndex((i) => Math.max(0, i - 1));
    }
    chartDragStartRef.current = null;
    setChartDragOffset(0);
  }, [chartDragOffset]);

  const analysisMap = useMemo(() => new Map(models.map((m) => [m.id, generateAnalysis(m, laptops)])), [models]);
  const benchmarkMap = useMemo(() => new Map(models.map((m) => [m.id, getModelBenchmarks(m.id)])), [models]);

  const model = models[clampedIndex];
  if (!model) return null;

  const s = getModelScores(model, prices);

  return (
    <div>
      <div className="mb-4 flex items-center justify-center gap-3">
        <button
          onClick={() => setActiveIndex((i) => Math.max(0, i - 1))}
          disabled={clampedIndex === 0}
          className="p-2 disabled:opacity-30"
          style={{ color: "var(--foreground)" }}
          aria-label="Previous model"
        >
          <ChevronLeft size={20} />
        </button>
        <div className="flex gap-1.5">
          {models.map((m, i) => (
            <button
              key={m.id}
              onClick={() => setActiveIndex(i)}
              className={`h-2 rounded-full transition-all ${i === clampedIndex ? "w-6 bg-accent" : "w-2 bg-carbon-500"}`}
              aria-label={`View ${m.name}`}
            />
          ))}
        </div>
        <button
          onClick={() => setActiveIndex((i) => Math.min(models.length - 1, i + 1))}
          disabled={clampedIndex === models.length - 1}
          className="p-2 disabled:opacity-30"
          style={{ color: "var(--foreground)" }}
          aria-label="Next model"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      <div
        key={model.id}
        className="carbon-card animate-card-in touch-pan-y overflow-hidden"
        style={{
          transform: dragOffset ? `translateX(${dragOffset}px) rotate(${dragOffset * 0.05}deg)` : undefined,
          opacity: dragOffset ? Math.max(0.7, 1 - Math.abs(dragOffset) / 80) : 1,
          transition: dragOffset ? "none" : "transform 0.3s ease-out, opacity 0.3s ease-out",
        }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        {/* Swipe direction hints */}
        {dragOffset < -5 && clampedIndex < models.length - 1 && (
          <div
            className="pointer-events-none absolute right-2 top-1/2 z-10 -translate-y-1/2 text-xs font-medium"
            style={{ color: "var(--muted)", opacity: Math.min(1, Math.abs(dragOffset) / 20) }}
          >
            <ChevronRight size={24} />
          </div>
        )}
        {dragOffset > 5 && clampedIndex > 0 && (
          <div
            className="pointer-events-none absolute left-2 top-1/2 z-10 -translate-y-1/2 text-xs font-medium"
            style={{ color: "var(--muted)", opacity: Math.min(1, Math.abs(dragOffset) / 20) }}
          >
            <ChevronLeft size={24} />
          </div>
        )}
        <div className="flex items-center justify-between p-4" style={{ background: "var(--accent)" }}>
          <div>
            <Link href={`/model/${model.id}`} className="font-semibold text-white hover:underline">
              {model.name}
            </Link>
            <p className="mt-0.5 text-xs text-carbon-200">{model.year}</p>
          </div>
          <button
            onClick={() => onRemove(model.id)}
            className="p-1 text-carbon-200 hover:text-white"
            aria-label={`Remove ${model.name}`}
          >
            <X size={16} />
          </button>
        </div>

        <div className="space-y-1 p-4">
          {s.lowestPrice !== null && (
            <div className="mb-3 text-center">
              <p className="text-xs" style={{ color: "var(--muted)" }}>
                Best Price
              </p>
              <p className="font-mono text-2xl font-bold" style={{ color: "var(--success)" }}>
                {formatCHF(s.lowestPrice)}
              </p>
            </div>
          )}

          {model.linuxStatus && (
            <div className="mb-3 flex justify-center">
              <LinuxBadge status={model.linuxStatus} />
            </div>
          )}

          <SpecItem label="Processor" value={model.processor.name} />
          <SpecItem label="Cores / Threads" value={`${model.processor.cores}C / ${model.processor.threads}T`} />
          <SpecItem label="TDP" value={`${model.processor.tdp}W`} />
          <SpecItem label="GPU" value={`${model.gpu.name}${model.gpu.vram ? ` ${model.gpu.vram}GB` : ""}`} />
          <SpecItem label="RAM" value={`${model.ram.size}GB ${model.ram.type}`} />
          <SpecItem label="Max RAM" value={`${model.ram.maxSize}GB`} />
          <SpecItem label="RAM Slots" value={model.ram.soldered ? "Soldered" : `${model.ram.slots} slots`} />
          <SpecItem label="Storage" value={`${formatStorage(model.storage.size)} ${model.storage.type}`} />
          <SpecItem label="Screen" value={`${model.display.size}" ${model.display.resolutionLabel}`} />
          <SpecItem label="Panel" value={model.display.panel} />
          <SpecItem label="Refresh Rate" value={`${model.display.refreshRate}Hz`} />
          <SpecItem label="Brightness" value={`${model.display.nits} nits`} />
          <SpecItem label="Touchscreen" value={model.display.touchscreen ? "Yes" : "No"} />
          <SpecItem label="Weight" value={formatWeight(model.weight)} />
          <SpecItem label="Battery" value={`${model.battery.whr} Wh`} />
          <SpecItem label="Ports" value={model.ports.join(", ")} />
          <SpecItem label="Wireless" value={model.wireless.join(", ")} />

          {(() => {
            const b = benchmarkMap.get(model.id);
            const a = analysisMap.get(model.id)!;
            return (
              <>
                {b?.thermals && (
                  <>
                    <SpecItem label="Keyboard Temp" value={`${b.thermals.keyboardMaxC}°C`} />
                    <SpecItem label="Underside Temp" value={`${b.thermals.undersideMaxC}°C`} />
                  </>
                )}
                {b?.fanNoise != null && <SpecItem label="Fan Noise" value={`${b.fanNoise} dB`} />}
                {b?.battery && (
                  <>
                    <SpecItem label="Office Hours" value={`${b.battery.officeHours}h`} />
                    <SpecItem label="Video Hours" value={`${b.battery.videoHours}h`} />
                  </>
                )}
                {b?.ssdSpeed && (
                  <>
                    <SpecItem label="SSD Read" value={`${b.ssdSpeed.seqReadMBs} MB/s`} />
                    <SpecItem label="SSD Write" value={`${b.ssdSpeed.seqWriteMBs} MB/s`} />
                  </>
                )}
                {b?.memoryBandwidthGBs != null && <SpecItem label="Memory BW" value={`${b.memoryBandwidthGBs} GB/s`} />}
                {b?.pugetPremiere != null && <SpecItem label="Premiere" value={`${b.pugetPremiere}`} />}
                {b?.pugetDavinci != null && <SpecItem label="DaVinci" value={`${b.pugetDavinci}`} />}
                {a.scenarios && a.scenarios.length > 0 && (
                  <>
                    {a.scenarios.map((s) => (
                      <SpecItem key={s.scenario} label={s.scenario} value={s.verdict} />
                    ))}
                  </>
                )}
              </>
            );
          })()}

          <div className="space-y-2 pt-3">
            <ScoreBar score={s.perf} label="Perf" color="#0f62fe" size="md" />
            <ScoreBar score={s.display} label="Display" color="#ee5396" size="md" />
            <ScoreBar score={s.memory} label="Memory" color="#be95ff" size="md" />
            <ScoreBar score={s.connectivity} label="Connect" color="#08bdba" size="md" />
            <ScoreBar score={s.portability} label="Port" color="#42be65" size="md" />
            {s.value !== null && <ScoreBar score={Math.min(100, s.value)} label="Value" color="#f1c21b" size="md" />}
          </div>

          <div className="pt-4">
            <h3
              className="mb-2 font-mono text-xs font-semibold uppercase tracking-wider"
              style={{ color: "var(--muted)" }}
            >
              Performance Radar
            </h3>
            <PerformanceRadar
              models={[
                {
                  name: model.name,
                  dimensions: s.dimensions,
                },
              ]}
            />
          </div>
        </div>
      </div>

      {/* Comparison Charts — swipeable section with all models */}
      {models.length >= 2 && (
        <div className="mt-6">
          <h2
            className="mb-3 font-mono text-sm font-semibold uppercase tracking-wider"
            style={{ color: "var(--muted)" }}
          >
            Comparison Charts
          </h2>

          <div className="mb-3 flex items-center justify-center gap-3">
            <button
              onClick={() => setActiveChartIndex((i) => Math.max(0, i - 1))}
              disabled={activeChartIndex === 0}
              className="p-2 disabled:opacity-30"
              style={{ color: "var(--foreground)" }}
              aria-label="Previous chart"
            >
              <ChevronLeft size={20} />
            </button>
            <div className="flex gap-1.5">
              {CHART_SLIDES.map((slide, i) => (
                <button
                  key={slide.key}
                  onClick={() => setActiveChartIndex(i)}
                  className={`h-2 rounded-full transition-all ${i === activeChartIndex ? "w-6 bg-accent" : "w-2 bg-carbon-500"}`}
                  aria-label={`View ${slide.label}`}
                />
              ))}
            </div>
            <button
              onClick={() => setActiveChartIndex((i) => Math.min(CHART_SLIDES.length - 1, i + 1))}
              disabled={activeChartIndex === CHART_SLIDES.length - 1}
              className="p-2 disabled:opacity-30"
              style={{ color: "var(--foreground)" }}
              aria-label="Next chart"
            >
              <ChevronRight size={20} />
            </button>
          </div>

          <div
            className="carbon-card touch-pan-y overflow-hidden p-4"
            style={{
              transform: chartDragOffset ? `translateX(${chartDragOffset}px)` : undefined,
              opacity: chartDragOffset ? Math.max(0.7, 1 - Math.abs(chartDragOffset) / 80) : 1,
              transition: chartDragOffset ? "none" : "transform 0.3s ease-out, opacity 0.3s ease-out",
            }}
            onPointerDown={handleChartPointerDown}
            onPointerMove={handleChartPointerMove}
            onPointerUp={handleChartPointerUp}
          >
            {chartDragOffset < -5 && activeChartIndex < CHART_SLIDES.length - 1 && (
              <div
                className="pointer-events-none absolute right-2 top-1/2 z-10 -translate-y-1/2"
                style={{ color: "var(--muted)", opacity: Math.min(1, Math.abs(chartDragOffset) / 20) }}
              >
                <ChevronRight size={24} />
              </div>
            )}
            {chartDragOffset > 5 && activeChartIndex > 0 && (
              <div
                className="pointer-events-none absolute left-2 top-1/2 z-10 -translate-y-1/2"
                style={{ color: "var(--muted)", opacity: Math.min(1, Math.abs(chartDragOffset) / 20) }}
              >
                <ChevronLeft size={24} />
              </div>
            )}

            <h3
              className="mb-3 font-mono text-xs font-semibold uppercase tracking-wider"
              style={{ color: "var(--muted)" }}
            >
              {CHART_SLIDES[activeChartIndex].label}
            </h3>

            <ChartErrorBoundary chartName={CHART_SLIDES[activeChartIndex].chartName}>
              {activeChartIndex === 0 && <CpuCompareChart models={models} />}
              {activeChartIndex === 1 && <GpuCompareChart models={models} />}
              {activeChartIndex === 2 && <PortabilityCompareChart models={models} />}
              {activeChartIndex === 3 && <ThermalCompareChart models={models} />}
              {activeChartIndex === 4 && <BatteryLifeCompareChart models={models} />}
            </ChartErrorBoundary>
          </div>

          <p className="mt-2 text-center text-xs" style={{ color: "var(--muted)" }}>
            {activeChartIndex + 1} / {CHART_SLIDES.length} — Swipe or tap dots to navigate
          </p>
        </div>
      )}
    </div>
  );
});

MobileCompareCards.displayName = "MobileCompareCards";
