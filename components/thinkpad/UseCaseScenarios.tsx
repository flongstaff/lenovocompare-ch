"use client";

import { Target } from "lucide-react";
import type { UseCaseScenario, ScenarioVerdict } from "@/lib/types";

interface UseCaseScenariosProps {
  readonly scenarios: readonly UseCaseScenario[];
}

const VERDICT_CONFIG: Record<ScenarioVerdict, { label: string; bg: string; text: string; border: string }> = {
  overkill: { label: "Overkill", bg: "bg-blue-900/30", text: "text-blue-400", border: "border-blue-700" },
  excellent: { label: "Excellent", bg: "bg-green-900/30", text: "text-green-400", border: "border-green-700" },
  good: { label: "Good", bg: "bg-teal-900/30", text: "text-teal-400", border: "border-teal-700" },
  marginal: { label: "Marginal", bg: "bg-yellow-900/30", text: "text-yellow-400", border: "border-yellow-700" },
  insufficient: { label: "Insufficient", bg: "bg-red-900/30", text: "text-red-400", border: "border-red-700" },
};

const UseCaseScenarios = ({ scenarios }: UseCaseScenariosProps) => (
  <div className="space-y-3">
    <div className="flex items-center gap-2">
      <Target size={16} style={{ color: "var(--muted)" }} />
      <h2 className="text-sm font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>
        Use Case Fit
      </h2>
    </div>

    <div className="grid grid-cols-1 gap-x-4 gap-y-1 sm:grid-cols-2">
      {scenarios.map((s) => {
        const config = VERDICT_CONFIG[s.verdict];
        return (
          <div
            key={s.scenario}
            className="flex items-center gap-2 py-1.5"
            style={{ borderBottom: "1px solid var(--border-subtle)" }}
          >
            <span
              className={`shrink-0 border px-1 py-0.5 text-[9px] font-semibold uppercase tracking-wider ${config.bg} ${config.text} ${config.border}`}
            >
              {config.label}
            </span>
            <span className="truncate text-sm" style={{ color: "var(--foreground)" }} title={s.explanation}>
              {s.scenario}
            </span>
          </div>
        );
      })}
    </div>
  </div>
);

export default UseCaseScenarios;
