"use client";
import { memo } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Cpu, Monitor, HardDrive, Weight, Battery, GitCompareArrows } from "lucide-react";
import { Laptop, SwissPrice } from "@/lib/types";
import { ScoreBar } from "@/components/ui/ScoreBar";
import { LinuxBadge } from "@/components/ui/LinuxBadge";
import { formatCHF, formatWeight, formatStorage } from "@/lib/formatters";
import { getModelScores } from "@/lib/scoring";
import { GamingTierBadge } from "@/components/thinkpad/GamingTierBadge";

interface ThinkPadCardProps {
  readonly model: Laptop;
  readonly prices: readonly SwissPrice[];
  readonly isCompareSelected: boolean;
  readonly onToggleCompare: (id: string) => void;
  readonly index?: number;
}

/** Series-specific accent colors for ScoreBar gradients. Must be raw hex — see ScoreBar color prop constraint. */
const SERIES_ACCENT: Record<string, string> = {
  // ThinkPad
  X1: "#ee5396",
  T: "#4589ff",
  P: "#f1c21b",
  L: "#42be65",
  E: "#be95ff",
  // IdeaPad Pro
  "Pro 5": "#33b1ff",
  "Pro 5i": "#6929c4",
  "Pro 7": "#a56eff",
  // Legion
  "5": "#ff832b",
  "5i": "#fa4d56",
  "7": "#da1e28",
  "7i": "#d12771",
  Pro: "#f1c21b",
  Slim: "#08bdba",
};

const ThinkPadCard = ({ model, prices, isCompareSelected, onToggleCompare, index = 0 }: ThinkPadCardProps) => {
  const scores = getModelScores(model, prices);
  const accent = SERIES_ACCENT[model.series] ?? "#4589ff";

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: Math.min(index * 0.04, 0.6), ease: [0.25, 0.46, 0.45, 0.94] }}
      className="carbon-card card-glow group flex flex-col"
      style={{ color: accent }}
    >
      {/* Series accent bar with gradient fade */}
      <div
        className="h-[2px]"
        style={{ background: `linear-gradient(90deg, ${accent}, ${accent}80 60%, transparent)` }}
      />

      <div className="flex flex-1 flex-col p-5">
        {/* Header */}
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <span
              className="rounded-sm px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wider"
              style={{ background: accent + "15", color: accent, border: `1px solid ${accent}30` }}
            >
              {model.lineup !== "ThinkPad" ? `${model.lineup} ${model.series}` : `${model.series} Series`}
            </span>
            <h3 className="text-carbon-50 mt-2 text-[15px] font-semibold leading-tight">
              <Link href={`/model/${model.id}`} className="hover:text-accent-light transition-colors duration-200">
                {model.name}
              </Link>
            </h3>
            <p className="text-carbon-400 mt-0.5 font-mono text-xs">{model.year}</p>
            <div className="mt-1.5 flex flex-wrap gap-1">
              {model.linuxStatus && model.linuxStatus !== "unknown" && <LinuxBadge status={model.linuxStatus} />}
              <GamingTierBadge tier={scores.gamingTier} />
            </div>
          </div>

          <button
            onClick={() => onToggleCompare(model.id)}
            className={`shrink-0 p-2 transition-all duration-200 ${
              isCompareSelected
                ? "bg-accent text-white shadow-[0_0_12px_rgba(15,98,254,0.3)]"
                : "border-carbon-500 text-carbon-400 hover:border-accent hover:text-accent border hover:shadow-[0_0_8px_rgba(15,98,254,0.15)]"
            }`}
            aria-label={isCompareSelected ? `Remove ${model.name} from comparison` : `Add ${model.name} to comparison`}
            aria-pressed={isCompareSelected}
          >
            <GitCompareArrows size={16} />
          </button>
        </div>

        {/* Specs */}
        <div className="flex-1 space-y-2.5 text-sm">
          <div className="flex items-center gap-2.5">
            <Cpu size={13} className="text-carbon-500 shrink-0" />
            <span className="text-carbon-200 truncate text-[13px]">{model.processor.name}</span>
          </div>
          <div className="flex items-center gap-2.5">
            <Monitor size={13} className="text-carbon-500 shrink-0" />
            <span className="text-carbon-200 text-[13px]">
              {model.display.size}&quot; {model.display.resolutionLabel}
              {model.display.panel === "OLED" && (
                <span className="ml-1.5 border border-purple-700/50 bg-purple-900/40 px-1 py-0.5 font-mono text-[9px] uppercase text-purple-300">
                  OLED
                </span>
              )}
            </span>
          </div>
          <div className="flex items-center gap-2.5">
            <HardDrive size={13} className="text-carbon-500 shrink-0" />
            <span className="text-carbon-200 text-[13px]">
              {model.ram.size}GB {model.ram.type} · {formatStorage(model.storage.size)}
            </span>
          </div>
          <div className="flex items-center gap-2.5">
            <Weight size={13} className="text-carbon-500 shrink-0" />
            <span className="text-carbon-200 text-[13px]">{formatWeight(model.weight)}</span>
          </div>
          <div className="flex items-center gap-2.5">
            <Battery size={13} className="text-carbon-500 shrink-0" />
            <span className="text-carbon-200 text-[13px]">{model.battery.whr} Wh</span>
          </div>
        </div>

        {/* Scores */}
        {scores.perf > 0 && (
          <div className="border-carbon-600/60 mt-4 space-y-1.5 border-t pt-3">
            <ScoreBar score={scores.perf} label="Perf" color={accent} size="md" />
            <ScoreBar score={scores.display} label="Display" color="#ee5396" size="md" />
            <ScoreBar score={scores.memory} label="Memory" color="#be95ff" size="md" />
          </div>
        )}

        {/* Price + Action */}
        <div className="border-carbon-600/60 mt-4 flex items-end justify-between border-t pt-3">
          <div>
            {scores.lowestPrice !== null ? (
              <>
                <p className="text-carbon-500 font-mono text-[10px] uppercase tracking-wider">From</p>
                <p className="text-carbon-50 font-mono text-xl font-semibold tracking-tight">
                  {formatCHF(scores.lowestPrice)}
                </p>
              </>
            ) : (
              <p className="text-carbon-500 text-sm italic">No price yet</p>
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
    </motion.div>
  );
};

export default memo(
  ThinkPadCard,
  (prev, next) =>
    prev.model.id === next.model.id && prev.isCompareSelected === next.isCompareSelected && prev.prices === next.prices,
);
