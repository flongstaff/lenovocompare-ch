/**
 * Horizontal score bar with gradient fill and optional label.
 * IMPORTANT: `color` must be a raw hex value (e.g. "#0f62fe"), NOT a CSS variable.
 * The "90" suffix is appended to create hex opacity for the gradient start color.
 */
export const getScoreLabel = (score: number): { text: string; color: string } => {
  if (score >= 80) return { text: "Excellent", color: "#42be65" };
  if (score >= 60) return { text: "Good", color: "#4589ff" };
  if (score >= 40) return { text: "Fair", color: "#f1c21b" };
  return { text: "Low", color: "#a8a8a8" };
};

interface ScoreBarProps {
  readonly score: number;
  readonly max?: number;
  readonly maxRef?: number;
  readonly label?: string;
  readonly color?: string;
  readonly showValue?: boolean;
  readonly showLabel?: boolean;
  readonly size?: "sm" | "md";
}

export const ScoreBar = ({
  score,
  max = 100,
  maxRef,
  label,
  color = "#0f62fe",
  showValue = true,
  showLabel = false,
  size = "sm",
}: ScoreBarProps) => {
  const pct = Math.min(100, Math.max(0, (score / max) * 100));
  const isMd = size === "md";
  const scoreLabel = showLabel ? getScoreLabel(score) : null;

  return (
    <div className="flex items-center gap-2">
      {label && (
        <span
          className={`${isMd ? "w-20 text-[11px]" : "w-16 text-[10px]"} shrink-0 font-mono uppercase tracking-wider text-carbon-500`}
        >
          {label}
        </span>
      )}
      <div className={`relative flex-1 ${isMd ? "h-2.5" : "h-1.5"} rounded-full bg-carbon-600/50`}>
        <div
          className="score-fill h-full overflow-hidden rounded-full transition-all duration-700 ease-out"
          style={{
            width: `${Math.max(pct, 8)}%`,
            background: `linear-gradient(90deg, ${color}90, ${color})`,
          }}
        />
        {maxRef !== undefined && maxRef > 0 && (
          <div
            className="absolute top-0 h-full w-px"
            style={{
              left: `${Math.min(99.5, (maxRef / max) * 100)}%`,
              background: "var(--muted)",
              opacity: 0.4,
            }}
          />
        )}
      </div>
      {showValue && (
        <span
          className={`${isMd ? "text-[11px]" : "text-[10px]"} w-7 text-right font-mono tabular-nums`}
          style={{ color: getScoreLabel(score).color }}
        >
          {Math.round(score)}
        </span>
      )}
      {scoreLabel && (
        <span className="w-14 font-mono text-[9px] uppercase tracking-wider" style={{ color: scoreLabel.color }}>
          {scoreLabel.text}
        </span>
      )}
    </div>
  );
};
