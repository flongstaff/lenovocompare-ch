"use client";
/** Quick verdict panel — compares models across CPU, display, portability, and value categories, then determines an overall winner by most category wins. */

import { Trophy, Zap, Monitor, Feather, Coins } from "lucide-react";
import type { Laptop, SwissPrice } from "@/lib/types";
import {
  getPerformanceScore,
  getDisplayScore,
  getPortabilityScore,
  getValueScore,
  getLowestPrice,
} from "@/lib/scoring";
import { formatCHF, formatWeight, shortName } from "@/lib/formatters";
import { COMPARE_COLORS } from "@/lib/constants";

interface QuickVerdictProps {
  readonly models: readonly Laptop[];
  readonly prices: readonly SwissPrice[];
}

interface CategoryWinner {
  readonly label: string;
  readonly icon: React.ReactNode;
  readonly winner: Laptop;
  readonly winnerIndex: number;
  readonly detail: string;
}

const getWinners = (models: readonly Laptop[], prices: readonly SwissPrice[]): CategoryWinner[] => {
  const winners: CategoryWinner[] = [];

  // Performance
  let bestPerf = 0;
  let bestPerfIdx = 0;
  models.forEach((m, i) => {
    const s = getPerformanceScore(m.processor.name);
    if (s > bestPerf) {
      bestPerf = s;
      bestPerfIdx = i;
    }
  });
  winners.push({
    label: "Performance",
    icon: <Zap size={14} />,
    winner: models[bestPerfIdx],
    winnerIndex: bestPerfIdx,
    detail: `Score: ${bestPerf}`,
  });

  // Display
  let bestDisp = 0;
  let bestDispIdx = 0;
  models.forEach((m, i) => {
    const s = getDisplayScore(m);
    if (s > bestDisp) {
      bestDisp = s;
      bestDispIdx = i;
    }
  });
  winners.push({
    label: "Display",
    icon: <Monitor size={14} />,
    winner: models[bestDispIdx],
    winnerIndex: bestDispIdx,
    detail: `Score: ${bestDisp}`,
  });

  // Portability
  let bestPort = 0;
  let bestPortIdx = 0;
  models.forEach((m, i) => {
    const s = getPortabilityScore(m);
    if (s > bestPort) {
      bestPort = s;
      bestPortIdx = i;
    }
  });
  winners.push({
    label: "Portability",
    icon: <Feather size={14} />,
    winner: models[bestPortIdx],
    winnerIndex: bestPortIdx,
    detail: formatWeight(models[bestPortIdx].weight),
  });

  // Value
  let bestVal = 0;
  let bestValIdx = -1;
  models.forEach((m, i) => {
    const s = getValueScore(m, prices);
    if (s !== null && s > bestVal) {
      bestVal = s;
      bestValIdx = i;
    }
  });
  if (bestValIdx >= 0) {
    const price = getLowestPrice(models[bestValIdx].id, prices);
    winners.push({
      label: "Value",
      icon: <Coins size={14} />,
      winner: models[bestValIdx],
      winnerIndex: bestValIdx,
      detail: price ? `from ${formatCHF(price)}` : `Score: ${bestVal}`,
    });
  }

  return winners;
};

// Count category wins per model — returns all models tied for most wins
const getOverallResult = (winners: CategoryWinner[], models: readonly Laptop[]) => {
  const wins = new Map<number, number>();
  winners.forEach((w) => wins.set(w.winnerIndex, (wins.get(w.winnerIndex) ?? 0) + 1));
  let bestWins = 0;
  wins.forEach((count) => {
    if (count > bestWins) bestWins = count;
  });
  const tiedIndices: number[] = [];
  wins.forEach((count, idx) => {
    if (count === bestWins) tiedIndices.push(idx);
  });
  return {
    tiedModels: tiedIndices.map((idx) => ({ model: models[idx], index: idx })),
    wins: bestWins,
    total: winners.length,
    isTied: tiedIndices.length > 1,
  };
};

export const QuickVerdict = ({ models, prices }: QuickVerdictProps) => {
  const winners = getWinners(models, prices);
  const overall = getOverallResult(winners, models);

  return (
    <div className="carbon-card p-4">
      <div className="mb-3 flex items-center gap-2">
        <Trophy size={16} style={{ color: "#f1c21b" }} />
        <h2 className="font-mono text-sm font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>
          Quick Verdict
        </h2>
      </div>

      {/* Overall winner or tie */}
      <div
        className="mb-4 flex items-center gap-3 p-3"
        style={{
          background: overall.isTied ? "rgba(241, 194, 27, 0.08)" : "rgba(15, 98, 254, 0.1)",
          border: overall.isTied ? "1px solid rgba(241, 194, 27, 0.3)" : "1px solid rgba(15, 98, 254, 0.3)",
        }}
      >
        <div className="flex items-center gap-1.5">
          {overall.tiedModels.map((t) => (
            <div
              key={t.index}
              className="h-3 w-3 flex-shrink-0"
              style={{ background: COMPARE_COLORS[t.index % COMPARE_COLORS.length] }}
            />
          ))}
        </div>
        <div>
          {overall.isTied ? (
            <>
              <span className="text-sm font-semibold" style={{ color: "#f1c21b" }}>
                Tied
              </span>
              <span className="ml-2 text-xs" style={{ color: "var(--muted)" }}>
                {overall.tiedModels.map((t) => shortName(t.model.name)).join(" & ")} — {overall.wins} of {overall.total}{" "}
                categories each
              </span>
            </>
          ) : (
            <>
              <span className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>
                {overall.tiedModels[0].model.name}
              </span>
              <span className="ml-2 text-xs" style={{ color: "var(--muted)" }}>
                wins {overall.wins} of {overall.total} categories
              </span>
            </>
          )}
        </div>
      </div>

      {/* Per-category winners */}
      <div className="grid grid-cols-2 gap-2 lg:grid-cols-4">
        {winners.map((w) => (
          <div
            key={w.label}
            className="p-2.5"
            style={{ background: "var(--surface)", border: "1px solid var(--border-subtle)" }}
          >
            <div className="mb-1 flex items-center gap-1.5">
              <span style={{ color: COMPARE_COLORS[w.winnerIndex % COMPARE_COLORS.length] }}>{w.icon}</span>
              <span
                className="font-mono text-[11px] font-semibold uppercase tracking-wide"
                style={{ color: "var(--muted)" }}
              >
                {w.label}
              </span>
            </div>
            <div className="truncate text-xs font-medium" style={{ color: "var(--foreground)" }}>
              {shortName(w.winner.name)}
            </div>
            <div className="mt-0.5 text-[11px]" style={{ color: "var(--muted)" }}>
              {w.detail}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
