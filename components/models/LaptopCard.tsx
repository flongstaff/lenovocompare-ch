"use client";
import { memo } from "react";

import Link from "next/link";
import { Cpu, Monitor, HardDrive, Weight, Battery, GitCompareArrows } from "lucide-react";
import { Laptop, SwissPrice } from "@/lib/types";
import { ScoreBar } from "@/components/ui/ScoreBar";
import { LinuxBadge } from "@/components/ui/LinuxBadge";
import { formatCHF, formatWeight, formatStorage } from "@/lib/formatters";
import { getModelScores } from "@/lib/scoring";
import { SERIES_ACCENT } from "@/lib/constants";
import { GamingTierBadge } from "@/components/models/GamingTierBadge";
import { MiniRadar } from "@/components/models/MiniRadar";
import { modelEditorial } from "@/data/model-editorial";
import { priceBaselines } from "@/data/price-baselines";

interface LaptopCardProps {
  readonly model: Laptop;
  readonly prices: readonly SwissPrice[];
  readonly isCompareSelected: boolean;
  readonly onToggleCompare: (id: string) => void;
  readonly index?: number;
  readonly precomputedScores?: ReturnType<typeof getModelScores>;
}

const getEditorialSnippet = (modelId: string): string | null => {
  const editorial = modelEditorial[modelId];
  if (!editorial?.editorialNotes) return null;
  const firstSentence = editorial.editorialNotes.split(". ")[0];
  return firstSentence.length > 80 ? firstSentence.slice(0, 77) + "..." : firstSentence + ".";
};

const isBestValue = (modelId: string, lowestPrice: number | null): boolean => {
  if (lowestPrice === null) return false;
  const baseline = priceBaselines[modelId];
  if (!baseline?.historicalLow) return false;
  return lowestPrice <= baseline.historicalLow * 1.05;
};

const LaptopCard = ({
  model,
  prices,
  isCompareSelected,
  onToggleCompare,
  index = 0,
  precomputedScores,
}: LaptopCardProps) => {
  const scores = precomputedScores ?? getModelScores(model, prices);
  const accent = SERIES_ACCENT[model.series] ?? "#4589ff";
  const snippet = getEditorialSnippet(model.id);
  const showBestValue = isBestValue(model.id, scores.lowestPrice);

  return (
    <div
      className="carbon-card card-glow group flex animate-card-in flex-col"
      style={{ color: accent, animationDelay: `${Math.min(index * 40, 600)}ms` }}
    >
      {/* Series accent bar with gradient fade */}
      <div
        className="h-[3px]"
        style={{ background: `linear-gradient(90deg, ${accent}, ${accent}80 60%, transparent)` }}
      />

      <div className="relative flex flex-1 flex-col p-5">
        {/* Header */}
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <span
              className="px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wider"
              style={{ background: accent + "15", color: accent, border: `1px solid ${accent}30` }}
            >
              {model.lineup !== "ThinkPad" ? `${model.lineup} ${model.series}` : `${model.series} Series`}
            </span>
            <h3 className="mt-2 text-[17px] font-semibold leading-tight text-carbon-50">
              <Link href={`/model/${model.id}`} className="transition-colors duration-200 hover:text-accent-light">
                {model.name}
              </Link>
            </h3>
            <p className="mt-0.5 font-mono text-xs text-carbon-400">{model.year}</p>
            <div className="mt-1.5 flex flex-wrap gap-1">
              {model.year >= 2025 && (
                <span className="inline-flex items-center border border-accent/40 bg-accent/10 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wider text-accent-light">
                  {model.year}
                </span>
              )}
              {showBestValue && (
                <span className="carbon-chip-success inline-flex items-center px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wider">
                  Best Value
                </span>
              )}
              {model.linuxStatus && model.linuxStatus !== "unknown" && <LinuxBadge status={model.linuxStatus} />}
              <GamingTierBadge tier={scores.gamingTier} />
            </div>
            {snippet && (
              <p className="mt-1.5 line-clamp-1 text-[11px] italic leading-snug text-carbon-400">{snippet}</p>
            )}
          </div>

          <button
            onClick={() => onToggleCompare(model.id)}
            title={isCompareSelected ? "Remove from compare" : "Add to compare"}
            className={`group/cmp shrink-0 p-2 transition-all duration-200 ${
              isCompareSelected
                ? "bg-accent text-white shadow-[0_0_12px_rgba(15,98,254,0.3)]"
                : "border border-carbon-500 text-carbon-400 hover:border-accent hover:bg-accent/10 hover:text-accent hover:shadow-[0_0_8px_rgba(15,98,254,0.15)]"
            }`}
            aria-label={isCompareSelected ? `Remove ${model.name} from comparison` : `Add ${model.name} to comparison`}
            aria-pressed={isCompareSelected}
          >
            <GitCompareArrows size={16} className="transition-transform duration-200 group-hover/cmp:scale-110" />
          </button>
        </div>

        {/* Specs */}
        <div className="flex-1 space-y-2.5 text-sm">
          <div className="flex items-center gap-2.5">
            <Cpu size={13} className="shrink-0 text-carbon-500" />
            <span className="truncate text-[13px] text-carbon-200">{model.processor.name}</span>
          </div>
          <div className="flex items-center gap-2.5">
            <Monitor size={13} className="shrink-0 text-carbon-500" />
            <span className="text-[13px] text-carbon-200">
              {model.display.size}&quot;{" "}
              {model.display.panel === "OLED"
                ? model.display.resolutionLabel.replace(/\s*OLED\s*/gi, " ").trim()
                : model.display.resolutionLabel}
              {model.display.panel === "OLED" && (
                <span className="ml-1.5 border border-accent/30 bg-accent/10 px-1 py-0.5 font-mono text-[9px] uppercase text-accent-light">
                  OLED
                </span>
              )}
            </span>
          </div>
          <div className="flex items-center gap-2.5">
            <HardDrive size={13} className="shrink-0 text-carbon-500" />
            <span className="text-[13px] text-carbon-200">
              {model.ram.size}GB {model.ram.type} · {formatStorage(model.storage.size)}
            </span>
          </div>
          <div className="flex items-center gap-2.5">
            <Weight size={13} className="shrink-0 text-carbon-500" />
            <span className="text-[13px] text-carbon-200">{formatWeight(model.weight)}</span>
          </div>
          <div className="flex items-center gap-2.5">
            <Battery size={13} className="shrink-0 text-carbon-500" />
            <span className="text-[13px] text-carbon-200">{model.battery.whr} Wh</span>
          </div>
        </div>

        {/* Scores */}
        {scores.perf > 0 && (
          <div className="mt-4 space-y-1.5 border-t border-carbon-600/60 pt-3">
            <div className="mb-2 flex justify-center">
              <MiniRadar
                scores={{
                  perf: scores.perf,
                  display: scores.display,
                  memory: scores.memory,
                  gpu: scores.gpu,
                  portability: scores.portability,
                }}
                color={accent}
              />
            </div>
            <ScoreBar score={scores.perf} label="Perf" color={accent} size="md" showLabel />
            <ScoreBar score={scores.display} label="Display" color="#ee5396" size="md" showLabel />
            <ScoreBar score={scores.memory} label="Memory" color="#be95ff" size="md" showLabel />
            {scores.gpu > 0 && (
              <div className="flex items-center gap-1">
                <div className="flex-1">
                  <ScoreBar score={scores.gpu} label="GPU" color="#42be65" size="md" showLabel />
                </div>
                <span className="font-mono text-[8px] uppercase tracking-wider text-carbon-500">
                  {model.gpu.integrated ? "iGPU" : "dGPU"}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Price + Action */}
        <div className="mt-4 flex items-end justify-between border-t border-carbon-600/60 pt-3">
          <div>
            {scores.lowestPrice !== null ? (
              <>
                <p className="font-mono text-[10px] uppercase tracking-wider text-carbon-500">From</p>
                <p className="font-mono text-xl font-semibold tracking-tight text-carbon-50">
                  {formatCHF(scores.lowestPrice)}
                </p>
              </>
            ) : (
              <p className="text-sm italic text-carbon-500">No price yet</p>
            )}
          </div>
          <Link
            href={`/model/${model.id}`}
            className="carbon-btn-ghost !px-3 !py-1.5 !text-xs opacity-70 transition-opacity duration-200 group-hover:opacity-100"
          >
            Details →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default memo(
  LaptopCard,
  (prev, next) =>
    prev.model.id === next.model.id && prev.isCompareSelected === next.isCompareSelected && prev.prices === next.prices,
);
