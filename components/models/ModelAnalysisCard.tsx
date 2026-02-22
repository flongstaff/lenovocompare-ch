"use client";

import Link from "next/link";
import { CheckCircle, AlertTriangle, ArrowRight } from "lucide-react";
import { ModelAnalysis } from "@/lib/types";
import { USE_CASE_COLORS } from "@/lib/constants";

interface ModelAnalysisCardProps {
  readonly analysis: ModelAnalysis;
}

const ModelAnalysisCard = ({ analysis }: ModelAnalysisCardProps) => {
  return (
    <div className="carbon-card space-y-4 rounded-lg p-4">
      <h2 className="text-lg font-semibold" style={{ color: "var(--foreground)" }}>
        Analysis
      </h2>

      {analysis.useCases.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {analysis.useCases.map((uc) => {
            const colors = USE_CASE_COLORS[uc];
            return (
              <span
                key={uc}
                className={`inline-block rounded px-2 py-0.5 text-xs font-medium ${colors.bg} ${colors.text}`}
              >
                {uc}
              </span>
            );
          })}
        </div>
      )}

      <p className="text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
        {analysis.summary}
      </p>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {analysis.pros.length > 0 && (
          <div className="rounded-lg border p-3" style={{ borderColor: "#393939", borderLeft: "3px solid #42be65" }}>
            <h3 className="mb-2 font-mono text-[10px] font-bold uppercase tracking-widest" style={{ color: "#42be65" }}>
              Strengths
            </h3>
            <ul className="space-y-1.5">
              {analysis.pros.map((pro) => (
                <li key={pro} className="flex items-start gap-1.5 text-sm" style={{ color: "var(--foreground)" }}>
                  <CheckCircle size={13} className="mt-0.5 shrink-0" style={{ color: "#42be65" }} />
                  {pro}
                </li>
              ))}
            </ul>
          </div>
        )}

        {analysis.cons.length > 0 && (
          <div className="rounded-lg border p-3" style={{ borderColor: "#393939", borderLeft: "3px solid #f1c21b" }}>
            <h3 className="mb-2 font-mono text-[10px] font-bold uppercase tracking-widest" style={{ color: "#f1c21b" }}>
              Limitations
            </h3>
            <ul className="space-y-1.5">
              {analysis.cons.map((con) => (
                <li key={con} className="flex items-start gap-1.5 text-sm" style={{ color: "var(--foreground)" }}>
                  <AlertTriangle size={13} className="mt-0.5 shrink-0" style={{ color: "#f1c21b" }} />
                  {con}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {analysis.upgradePath && (
        <div className="pt-2" style={{ borderTop: "1px solid var(--border-subtle)" }}>
          <Link
            href={`/model/${analysis.upgradePath.id}`}
            className="inline-flex items-center gap-1.5 text-sm font-medium hover:underline"
            style={{ color: "var(--accent-light)" }}
          >
            <ArrowRight size={14} />
            Upgrade path: {analysis.upgradePath.name}
          </Link>
        </div>
      )}

      <p className="text-[10px] italic" style={{ color: "var(--muted)" }}>
        Analysis derived from public PSREF specifications
      </p>
    </div>
  );
};

export default ModelAnalysisCard;
