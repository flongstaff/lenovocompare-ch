"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { AlertTriangle, CheckCircle, ChevronDown, ChevronRight, Info, XCircle } from "lucide-react";
import {
  validateAllData,
  groupByCategory,
  ORPHAN_CATEGORIES,
  type ValidationIssue,
  type ValidationCategory,
} from "@/lib/validate-data";

const ValidateClient = () => {
  const result = useMemo(() => {
    try {
      return validateAllData();
    } catch (err) {
      const crashError: ValidationIssue = {
        level: "error",
        category: "Critical",
        message: `Validation engine crashed: ${err instanceof Error ? err.message : String(err)}. This likely indicates severely malformed data.`,
      };
      return { errors: [crashError] as const, warnings: [] as const, info: [] as const };
    }
  }, []);

  const errorGroups = useMemo(() => groupByCategory(result.errors), [result.errors]);
  const warningGroups = useMemo(() => groupByCategory(result.warnings), [result.warnings]);
  const infoGroups = useMemo(() => groupByCategory(result.info), [result.info]);

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-6">
      <h1 className="text-2xl font-bold text-white">Data Validation</h1>

      {/* Summary strip */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <SummaryCard
          label="Errors"
          count={result.errors.length}
          color="var(--trackpoint)"
          icon={<XCircle size={20} />}
        />
        <SummaryCard
          label="Warnings"
          count={result.warnings.length}
          color="#f1c21b"
          icon={<AlertTriangle size={20} />}
        />
        <SummaryCard label="Stats" count={result.info.length} color="#42be65" icon={<CheckCircle size={20} />} />
      </div>

      {/* Errors */}
      {errorGroups.length > 0 && (
        <Section title="Errors" color="var(--trackpoint)">
          {errorGroups.map(([category, issues]) => (
            <CategoryGroup
              key={category}
              category={category as ValidationCategory}
              issues={issues}
              defaultOpen
              dotColor="var(--trackpoint)"
            />
          ))}
        </Section>
      )}

      {/* Warnings */}
      {warningGroups.length > 0 && (
        <Section title="Warnings" color="#f1c21b">
          {warningGroups.map(([category, issues]) => (
            <CategoryGroup
              key={category}
              category={category as ValidationCategory}
              issues={issues}
              defaultOpen={false}
              dotColor="#f1c21b"
            />
          ))}
        </Section>
      )}

      {/* Stats */}
      {infoGroups.length > 0 && (
        <Section title="Stats" color="#42be65">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {result.info.map((item, i) => (
              <div key={i} className="carbon-card flex items-center gap-2 px-4 py-3">
                <Info size={14} style={{ color: "#42be65", flexShrink: 0 }} />
                <span className="text-sm text-carbon-300">{item.message}</span>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Pass/fail banner */}
      <div
        className="carbon-card px-4 py-3 text-center font-medium"
        style={{
          borderColor: result.errors.length > 0 ? "var(--trackpoint)" : "#42be65",
          color: result.errors.length > 0 ? "var(--trackpoint)" : "#42be65",
        }}
      >
        {result.errors.length > 0
          ? `Validation failed — ${result.errors.length} error(s) must be fixed`
          : "All checks passed"}
      </div>
    </div>
  );
};

export default ValidateClient;

// --- Sub-components ---

const SummaryCard = ({
  label,
  count,
  color,
  icon,
}: {
  label: string;
  count: number;
  color: string;
  icon: React.ReactNode;
}) => (
  <div className="carbon-card flex items-center gap-3 px-4 py-4" style={{ borderLeftColor: color, borderLeftWidth: 3 }}>
    <span style={{ color }}>{icon}</span>
    <div>
      <div className="text-2xl font-bold text-white">{count}</div>
      <div className="font-mono text-xs uppercase tracking-wider text-carbon-400">{label}</div>
    </div>
  </div>
);

const Section = ({ title, color, children }: { title: string; color: string; children: React.ReactNode }) => (
  <div className="space-y-3">
    <h2 className="text-lg font-semibold" style={{ color }}>
      {title}
    </h2>
    {children}
  </div>
);

const CategoryGroup = ({
  category,
  issues,
  defaultOpen,
  dotColor,
}: {
  category: ValidationCategory;
  issues: readonly ValidationIssue[];
  defaultOpen: boolean;
  dotColor: string;
}) => {
  const [open, setOpen] = useState(defaultOpen);
  const isOrphan = ORPHAN_CATEGORIES.has(category);

  return (
    <div className="carbon-card overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center gap-2 px-4 py-3 text-left text-sm font-medium text-white hover:bg-white/5"
      >
        {open ? (
          <ChevronDown size={16} className="text-carbon-400" />
        ) : (
          <ChevronRight size={16} className="text-carbon-400" />
        )}
        <span>{category}</span>
        <span className="ml-auto text-xs text-carbon-500">{issues.length}</span>
      </button>
      {open && (
        <div className="border-t border-white/5 px-4 py-2">
          {issues.map((issue, i) => (
            <div key={i} className="flex items-start gap-2 py-1.5 text-sm text-carbon-300">
              <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full" style={{ backgroundColor: dotColor }} />
              {issue.modelId ? (
                <span>
                  {isOrphan ? (
                    <code className="font-mono text-xs text-carbon-500 line-through">{issue.modelId}</code>
                  ) : (
                    <Link
                      href={`/model/${issue.modelId}`}
                      className="font-mono text-xs hover:underline"
                      style={{ color: "var(--accent)" }}
                    >
                      {issue.modelId}
                    </Link>
                  )}{" "}
                  {issue.message}
                </span>
              ) : (
                <span>{issue.message}</span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
