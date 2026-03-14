"use client";

import { Target } from "lucide-react";
import type { UseCaseScenario, ScenarioVerdict } from "@/lib/types";

interface UseCaseScenariosProps {
  readonly scenarios: readonly UseCaseScenario[];
}

const VERDICT_CONFIG: Record<ScenarioVerdict, { label: string; className: string }> = {
  overkill: { label: "Overkill", className: "carbon-verdict-excellent" },
  excellent: { label: "Excellent", className: "carbon-verdict-excellent" },
  good: { label: "Good", className: "carbon-verdict-good" },
  marginal: { label: "Marginal", className: "carbon-verdict-fair" },
  insufficient: { label: "Insufficient", className: "carbon-verdict-low" },
};

const UseCaseScenarios = ({ scenarios }: UseCaseScenariosProps) => (
  <div className="space-y-3">
    <div className="flex items-center gap-2">
      <Target size={16} style={{ color: "var(--muted)" }} />
      <h2 className="font-mono text-sm font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>
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
              className={`shrink-0 px-1 py-0.5 font-mono text-[9px] font-semibold uppercase tracking-wider ${config.className}`}
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
