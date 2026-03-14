import React from "react";

/* ── dB reference points for noise scale ─────────────────── */
const NOISE_REFS = [
  { db: 25, label: "Library" },
  { db: 35, label: "Quiet office" },
  { db: 45, label: "Conversation" },
  { db: 55, label: "Street traffic" },
] as const;

export const StatBox = ({
  label,
  value,
  unit,
  color,
}: {
  label: string;
  value: number | string;
  unit?: string;
  color?: string;
}) => (
  <div
    className="border px-3 py-2.5"
    style={{ borderColor: "var(--border-subtle)", background: "var(--surface-inset)" }}
  >
    <div className="mb-0.5 text-xs tracking-wide" style={{ color: "var(--muted)" }}>
      {label}
    </div>
    <div className="font-mono text-lg font-semibold leading-tight" style={{ color: color ?? "var(--foreground)" }}>
      {value}
      {unit && (
        <span className="ml-0.5 text-xs font-normal" style={{ color: "var(--muted)" }}>
          {unit}
        </span>
      )}
    </div>
  </div>
);

export const MiniBar = ({
  label,
  value,
  maxValue,
  color,
  unit,
}: {
  label: string;
  value: number;
  maxValue: number;
  color: string;
  unit?: string;
}) => {
  const pct = Math.min(100, (value / maxValue) * 100);
  return (
    <div className="space-y-1">
      <div className="flex items-baseline justify-between gap-2 text-sm">
        <span className="truncate" style={{ color: "var(--muted)" }}>
          {label}
        </span>
        <span className="shrink-0 font-mono text-xs font-medium tabular-nums" style={{ color }}>
          {value.toLocaleString()}
          {unit && ` ${unit}`}
        </span>
      </div>
      <div className="h-1.5 rounded-full" style={{ background: "var(--surface-inset)" }}>
        <div
          className="h-full rounded-full transition-all"
          style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${color}66, ${color})` }}
        />
      </div>
    </div>
  );
};

export const CategoryHeader = ({ title, accent }: { title: string; accent: string }) => (
  <div className="flex items-center gap-2">
    <div className="h-4 w-1 rounded-full" style={{ background: accent }} />
    <h4 className="font-mono text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--muted)" }}>
      {title}
    </h4>
  </div>
);

export const SubSection = ({
  title,
  accent,
  children,
}: {
  title: string;
  accent: string;
  children: React.ReactNode;
}) => (
  <div
    className="flex flex-col gap-2.5 border p-3"
    style={{ borderColor: "var(--border-subtle)", background: "var(--surface)" }}
  >
    <CategoryHeader title={title} accent={accent} />
    {children}
  </div>
);

export const Divider = ({ label }: { label: string }) => (
  <div className="flex items-center gap-3 px-1">
    <div className="h-px flex-1" style={{ background: "var(--border-subtle)" }} />
    <span className="font-mono text-[10px] font-medium uppercase tracking-[0.15em]" style={{ color: "var(--muted)" }}>
      {label}
    </span>
    <div className="h-px flex-1" style={{ background: "var(--border-subtle)" }} />
  </div>
);

export const InsightRow = ({ label, value, color }: { label: string; value: string; color?: string }) => (
  <div className="flex items-start gap-2 py-0.5">
    <span
      className="shrink-0 font-mono text-[10px] font-semibold uppercase tracking-wide"
      style={{ color: color ?? "var(--muted)", minWidth: 60 }}
    >
      {label}
    </span>
    <span className="text-xs" style={{ color: "var(--muted)" }}>
      {value}
    </span>
  </div>
);

export const NoiseScale = ({ dbValue }: { dbValue: number }) => {
  const pct = Math.min(100, Math.max(0, ((dbValue - 20) / 40) * 100));
  return (
    <div className="space-y-1">
      <div className="relative h-2 rounded-full" style={{ background: "var(--surface-inset)" }}>
        <div
          className="absolute inset-y-0 left-0 rounded-full"
          style={{
            width: "100%",
            background: "linear-gradient(90deg, #42be65 0%, #f1c21b 50%, #ff832b 80%, #da1e28 100%)",
            opacity: 0.25,
          }}
        />
        <div
          className="absolute top-1/2 h-3 w-3 -translate-y-1/2 rounded-full border-2"
          style={{
            left: `${pct}%`,
            background: dbValue > 45 ? "#ff832b" : dbValue > 35 ? "#f1c21b" : "#42be65",
            borderColor: "#161616",
            transform: `translate(-50%, -50%)`,
          }}
        />
      </div>
      <div className="flex justify-between">
        {NOISE_REFS.map((ref) => (
          <span
            key={ref.db}
            className="text-[9px]"
            style={{
              color: Math.abs(dbValue - ref.db) < 5 ? "var(--foreground)" : "var(--icon-muted)",
              fontWeight: Math.abs(dbValue - ref.db) < 5 ? 600 : 400,
            }}
          >
            {ref.label}
          </span>
        ))}
      </div>
    </div>
  );
};
