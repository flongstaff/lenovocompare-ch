"use client";

import { useState, useCallback, memo } from "react";
import Link from "next/link";
import { motion, type PanInfo } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { Laptop, SwissPrice } from "@/lib/types";
import { ScoreBar } from "@/components/ui/ScoreBar";
import { LinuxBadge } from "@/components/ui/LinuxBadge";
import { formatCHF, formatWeight, formatStorage } from "@/lib/formatters";
import { getModelScores } from "@/lib/scoring";
import dynamic from "next/dynamic";

const PerformanceRadar = dynamic(() => import("@/components/charts/PerformanceRadar"), { ssr: false });

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

export const MobileCompareCards = memo(({ models, prices, onRemove }: MobileCompareCardsProps) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const clampedIndex = Math.min(activeIndex, models.length - 1);

  const handleDragEnd = useCallback(
    (_e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
      const threshold = 50;
      if (info.offset.x < -threshold) {
        setActiveIndex((i) => Math.min(models.length - 1, i + 1));
      } else if (info.offset.x > threshold) {
        setActiveIndex((i) => Math.max(0, i - 1));
      }
    },
    [models.length],
  );

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
              className={`h-2 rounded-full transition-all ${i === clampedIndex ? "bg-accent w-6" : "bg-carbon-500 w-2"}`}
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

      <motion.div
        key={model.id}
        className="carbon-card touch-pan-y overflow-hidden rounded-lg"
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.2}
        onDragEnd={handleDragEnd}
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.2 }}
      >
        <div className="flex items-center justify-between p-4" style={{ background: "var(--accent)" }}>
          <div>
            <Link href={`/model/${model.id}`} className="font-semibold text-white hover:underline">
              {model.name}
            </Link>
            <p className="mt-0.5 text-xs text-blue-200">{model.year}</p>
          </div>
          <button
            onClick={() => onRemove(model.id)}
            className="p-1 text-blue-200 hover:text-white"
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

          <div className="space-y-2 pt-3">
            <ScoreBar score={s.perf} label="Perf" color="#0f62fe" size="md" />
            <ScoreBar score={s.display} label="Display" color="#ee5396" size="md" />
            <ScoreBar score={s.memory} label="Memory" color="#be95ff" size="md" />
            <ScoreBar score={s.connectivity} label="Connect" color="#08bdba" size="md" />
            <ScoreBar score={s.portability} label="Port" color="#42be65" size="md" />
            {s.value !== null && <ScoreBar score={Math.min(100, s.value)} label="Value" color="#f1c21b" size="md" />}
          </div>

          <div className="pt-4">
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>
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
      </motion.div>
    </div>
  );
});

MobileCompareCards.displayName = "MobileCompareCards";
