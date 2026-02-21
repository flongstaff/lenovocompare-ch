"use client";

import {
  CheckCircle,
  AlertTriangle,
  Target,
  Ban,
  Thermometer,
  Clock,
  ArrowRight,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useState } from "react";
import type { HardwareGuideEntry } from "@/lib/types";

interface ChipDetailCardProps {
  readonly name: string;
  readonly entry: HardwareGuideEntry;
  readonly score?: number;
  readonly type: "cpu" | "gpu";
  readonly compact?: boolean;
}

const ChipDetailCard = ({ name, entry, score, type, compact = false }: ChipDetailCardProps) => {
  const [expanded, setExpanded] = useState(!compact);

  return (
    <div className="carbon-card overflow-hidden rounded-lg">
      {/* Header */}
      <button
        onClick={() => setExpanded((prev) => !prev)}
        className="hover:bg-carbon-600/20 flex w-full items-center justify-between p-4 text-left transition-colors"
      >
        <div className="flex min-w-0 items-center gap-3">
          <div
            className="h-8 w-2 shrink-0 rounded-full"
            style={{ backgroundColor: type === "cpu" ? "var(--accent)" : "#42be65" }}
          />
          <div className="min-w-0">
            <h3 className="truncate text-base font-semibold" style={{ color: "var(--foreground)" }}>
              {name}
            </h3>
            <div className="mt-0.5 flex items-center gap-2">
              <span
                className="rounded px-1.5 py-0.5 text-xs"
                style={{ backgroundColor: "var(--surface-hover)", color: "var(--muted)" }}
              >
                {entry.architecture}
              </span>
              {score !== undefined && (
                <span className="text-xs" style={{ color: "var(--muted)" }}>
                  Score: {score}
                </span>
              )}
            </div>
          </div>
        </div>
        {compact && (
          <span style={{ color: "var(--muted)" }}>
            {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </span>
        )}
      </button>

      {/* Body */}
      {expanded && (
        <div className="space-y-4 px-4 pb-4">
          {/* Summary */}
          <p className="text-sm leading-relaxed" style={{ color: "var(--carbon-300)" }}>
            {entry.summary}
          </p>

          {/* Strengths & Weaknesses */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider" style={{ color: "#42be65" }}>
                Strengths
              </h4>
              <ul className="space-y-1.5">
                {entry.strengths.map((s) => (
                  <li key={s} className="flex items-start gap-2 text-sm" style={{ color: "var(--carbon-300)" }}>
                    <CheckCircle size={14} className="mt-0.5 shrink-0" style={{ color: "#42be65" }} />
                    {s}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider" style={{ color: "#f1c21b" }}>
                Weaknesses
              </h4>
              <ul className="space-y-1.5">
                {entry.weaknesses.map((w) => (
                  <li key={w} className="flex items-start gap-2 text-sm" style={{ color: "var(--carbon-300)" }}>
                    <AlertTriangle size={14} className="mt-0.5 shrink-0" style={{ color: "#f1c21b" }} />
                    {w}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Best For & Avoid If */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <h4
                className="mb-2 text-xs font-semibold uppercase tracking-wider"
                style={{ color: "var(--accent-light)" }}
              >
                <Target size={12} className="mr-1 inline" />
                Best For
              </h4>
              <ul className="space-y-1">
                {entry.bestFor.map((b) => (
                  <li key={b} className="pl-4 text-sm" style={{ color: "var(--carbon-300)" }}>
                    {b}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4
                className="mb-2 text-xs font-semibold uppercase tracking-wider"
                style={{ color: "var(--trackpoint)" }}
              >
                <Ban size={12} className="mr-1 inline" />
                Avoid If
              </h4>
              <ul className="space-y-1">
                {entry.avoidIf.map((a) => (
                  <li key={a} className="pl-4 text-sm" style={{ color: "var(--carbon-300)" }}>
                    {a}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Thermal Notes */}
          <div
            className="rounded-lg border p-3"
            style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--surface-hover)" }}
          >
            <h4
              className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider"
              style={{ color: "#ff832b" }}
            >
              <Thermometer size={12} />
              Thermal Notes
            </h4>
            <p className="text-sm" style={{ color: "var(--carbon-300)" }}>
              {entry.thermalNotes}
            </p>
          </div>

          {/* Generation Context */}
          <div>
            <h4
              className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider"
              style={{ color: "var(--muted)" }}
            >
              <Clock size={12} />
              Generation Context
            </h4>
            <p className="text-sm" style={{ color: "var(--carbon-300)" }}>
              {entry.generationContext}
            </p>
          </div>

          {/* Alternatives */}
          {entry.alternatives.length > 0 && (
            <div>
              <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>
                Alternatives
              </h4>
              <div className="space-y-2">
                {entry.alternatives.map((alt) => (
                  <div
                    key={alt.name}
                    className="flex items-start gap-2 rounded p-2 text-sm"
                    style={{ backgroundColor: "var(--surface-hover)" }}
                  >
                    <ArrowRight size={14} className="mt-0.5 shrink-0" style={{ color: "var(--accent-light)" }} />
                    <div>
                      <span className="font-medium" style={{ color: "var(--foreground)" }}>
                        {alt.name}
                      </span>
                      <span className="mx-1.5" style={{ color: "var(--muted)" }}>
                        &mdash;
                      </span>
                      <span style={{ color: "var(--carbon-300)" }}>{alt.comparison}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ChipDetailCard;
