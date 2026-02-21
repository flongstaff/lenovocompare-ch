/**
 * Horizontal score bar with gradient fill and optional label.
 * IMPORTANT: `color` must be a raw hex value (e.g. "#0f62fe"), NOT a CSS variable.
 * The "90" suffix is appended to create hex opacity for the gradient start color.
 */
interface ScoreBarProps {
  readonly score: number;
  readonly max?: number;
  readonly label?: string;
  readonly color?: string;
  readonly showValue?: boolean;
  readonly size?: "sm" | "md";
}

export const ScoreBar = ({
  score,
  max = 100,
  label,
  color = "#0f62fe",
  showValue = true,
  size = "sm",
}: ScoreBarProps) => {
  const pct = Math.min(100, Math.max(0, (score / max) * 100));
  const isMd = size === "md";

  return (
    <div className="flex items-center gap-2">
      {label && (
        <span
          className={`${isMd ? "w-20 text-[11px]" : "w-16 text-[10px]"} shrink-0 font-mono uppercase tracking-wider text-carbon-500`}
        >
          {label}
        </span>
      )}
      <div className={`flex-1 ${isMd ? "h-2.5" : "h-1.5"} overflow-hidden rounded-full bg-carbon-600/50`}>
        <div
          className="score-shine h-full rounded-full transition-all duration-700 ease-out"
          style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${color}90, ${color})` }}
        />
      </div>
      {showValue && (
        <span
          className={`${isMd ? "text-[11px]" : "text-[10px]"} w-7 text-right font-mono tabular-nums text-carbon-400`}
        >
          {Math.round(score)}
        </span>
      )}
    </div>
  );
};
