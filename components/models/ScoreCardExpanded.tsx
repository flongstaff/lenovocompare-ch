"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import type { Laptop } from "@/lib/types";
import type { ScoreComponent } from "@/lib/scoring";
import {
  getDisplayScoreBreakdown,
  getMemoryScoreBreakdown,
  getConnectivityScoreBreakdown,
  getPortabilityScoreBreakdown,
  getCpuScoreBreakdown,
  getGpuScoreBreakdown,
} from "@/lib/scoring";
import { getScoreContext, getInterpretation } from "@/lib/score-context";
import { getScoreLabel } from "@/components/ui/ScoreBar";

type Dimension = "cpu" | "gpu" | "memory" | "display" | "connectivity" | "portability";

interface DimensionRow {
  readonly key: Dimension;
  readonly label: string;
  readonly score: number;
  readonly color: string;
  readonly detail: string;
}

interface Props {
  readonly dimensions: readonly DimensionRow[];
  readonly model: Laptop;
}

const MiniBar = ({ earned, max, color }: { earned: number; max: number; color: string }) => (
  <div className="h-1.5 w-full rounded-full" style={{ background: "var(--border-subtle)" }}>
    <div
      className="h-full rounded-full"
      style={{ width: `${(earned / max) * 100}%`, background: color, opacity: 0.7 }}
    />
  </div>
);

const SubScore = ({ component, color }: { component: ScoreComponent; color: string }) => (
  <div className="flex items-center gap-2">
    <span className="w-16 shrink-0 text-xs" style={{ color: "var(--muted)" }}>
      {component.label}
    </span>
    <div className="flex-1">
      <MiniBar earned={component.earned} max={component.max} color={color} />
    </div>
    <span className="w-10 shrink-0 text-right font-mono text-xs" style={{ color: "var(--muted)" }}>
      {Math.round(component.earned)}/{component.max}
    </span>
  </div>
);

const getBreakdownComponents = (dim: Dimension, model: Laptop): ScoreComponent[] => {
  switch (dim) {
    case "cpu": {
      const b = getCpuScoreBreakdown(model.processor.name);
      return [
        { label: "Single", earned: b.singleCore, max: 100 },
        { label: "Multi", earned: b.multiCore, max: 100 },
      ];
    }
    case "gpu": {
      const b = getGpuScoreBreakdown(model.gpu.name);
      return [{ label: "Score", earned: b.score, max: 100 }];
    }
    case "display":
      return Object.values(getDisplayScoreBreakdown(model));
    case "memory":
      return Object.values(getMemoryScoreBreakdown(model));
    case "connectivity":
      return Object.values(getConnectivityScoreBreakdown(model));
    case "portability":
      return Object.values(getPortabilityScoreBreakdown(model));
  }
};

const ScoreCardExpanded = ({ dimensions, model }: Props) => {
  const [expanded, setExpanded] = useState<Dimension | null>(null);

  return (
    <div className="space-y-0">
      {dimensions.map((dim) => {
        const isOpen = expanded === dim.key;
        return (
          <div key={dim.key}>
            <button
              type="button"
              className="flex w-full items-center gap-3 py-1.5 text-left"
              style={{ borderBottom: "1px solid var(--border-subtle)" }}
              onClick={() => setExpanded(isOpen ? null : dim.key)}
            >
              <span className="w-8 text-right font-mono text-lg font-bold" style={{ color: dim.color }}>
                {dim.score}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-semibold" style={{ color: "var(--foreground)" }}>
                    {dim.label}
                  </span>
                  <span className="text-xs font-medium" style={{ color: getScoreLabel(dim.score).color }}>
                    {getScoreLabel(dim.score).text}
                  </span>
                </div>
                <div className="truncate text-xs" style={{ color: "var(--muted)" }}>
                  {dim.detail}
                </div>
              </div>
              <div className="h-2 w-24 shrink-0 rounded-full" style={{ background: "var(--surface)" }}>
                <div className="h-full rounded-full" style={{ width: `${dim.score}%`, background: dim.color }} />
              </div>
              <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }} className="shrink-0">
                <ChevronDown size={14} style={{ color: "var(--muted)" }} />
              </motion.div>
            </button>
            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="mb-1 rounded-md p-3" style={{ background: "var(--surface)" }}>
                    {/* Score Breakdown */}
                    <div className="mb-2 space-y-1">
                      <span
                        className="text-xs font-semibold uppercase tracking-wider"
                        style={{ color: "var(--muted)" }}
                      >
                        Breakdown
                      </span>
                      {dim.key === "gpu" && (
                        <div className="text-xs" style={{ color: "var(--muted)" }}>
                          Tier: {getGpuScoreBreakdown(model.gpu.name).tier}
                        </div>
                      )}
                      {getBreakdownComponents(dim.key, model).map((comp) => (
                        <SubScore key={comp.label} component={comp} color={dim.color} />
                      ))}
                    </div>

                    {/* Contextual Comparison */}
                    <div className="mb-2 text-xs" style={{ color: "var(--muted)" }}>
                      {getScoreContext(dim.key, model).comparisonText}
                    </div>

                    {/* Practical Interpretation */}
                    <div className="text-xs italic" style={{ color: "var(--muted)" }}>
                      {getInterpretation(dim.key, dim.score)}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
};

export default ScoreCardExpanded;
