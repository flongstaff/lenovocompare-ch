"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import type { Laptop } from "@/lib/types";
import { formatWeight } from "@/lib/formatters";
import { COMPARE_COLORS } from "@/lib/constants";

interface PhysicalSizeComparisonProps {
  readonly models: readonly Laptop[];
}

const MAX_WIDTH_PX = 200;
const MAX_HEIGHT_BAR_PX = 20;

export const PhysicalSizeComparison = ({ models }: PhysicalSizeComparisonProps) => {
  const [expanded, setExpanded] = useState(true);

  const modelsWithDims = models.filter((m) => m.dimensions != null);

  if (modelsWithDims.length === 0) return null;

  const maxWidth = Math.max(...modelsWithDims.map((m) => m.dimensions!.widthMm));
  const maxHeight = Math.max(...modelsWithDims.map((m) => m.dimensions!.heightMm));
  const scale = maxWidth > 0 ? MAX_WIDTH_PX / maxWidth : 1;
  const heightScale = maxHeight > 0 ? MAX_HEIGHT_BAR_PX / maxHeight : 1;

  return (
    <div className="carbon-card overflow-hidden">
      <button
        className="flex w-full items-center justify-between p-4"
        onClick={() => setExpanded((v) => !v)}
        aria-expanded={expanded}
        aria-controls="physical-comparison-content"
      >
        <h2 className="font-mono text-sm font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>
          Physical Comparison
        </h2>
        {expanded ? (
          <ChevronUp size={16} style={{ color: "var(--muted)" }} />
        ) : (
          <ChevronDown size={16} style={{ color: "var(--muted)" }} />
        )}
      </button>

      {expanded && (
        <div id="physical-comparison-content" className="px-4 pb-6">
          <div className="flex flex-wrap gap-8">
            {models.map((model, index) => {
              const color = COMPARE_COLORS[index % COMPARE_COLORS.length];
              const dims = model.dimensions;

              if (!dims) {
                return (
                  <div key={model.id} className="flex flex-col items-center gap-2">
                    <div
                      className="flex items-center justify-center rounded"
                      style={{
                        width: MAX_WIDTH_PX,
                        height: Math.round(MAX_WIDTH_PX * 0.65),
                        border: `2px dashed ${color}`,
                        opacity: 0.4,
                      }}
                    >
                      <span className="text-xs" style={{ color: "var(--muted)" }}>
                        Dimensions unavailable
                      </span>
                    </div>
                    <div
                      className="rounded"
                      style={{
                        width: MAX_WIDTH_PX,
                        height: MAX_HEIGHT_BAR_PX,
                        border: `1px dashed ${color}`,
                        opacity: 0.3,
                      }}
                    />
                    <div className="mt-1 max-w-[200px] text-center">
                      <p className="truncate text-xs font-medium" style={{ color: "var(--foreground)" }}>
                        {model.name}
                      </p>
                      <p className="text-xs" style={{ color: "var(--muted)" }}>
                        {formatWeight(model.weight)}
                      </p>
                    </div>
                  </div>
                );
              }

              const rectWidth = Math.round(dims.widthMm * scale);
              const rectHeight = Math.round(dims.depthMm * scale);
              const barHeight = Math.max(3, Math.round(dims.heightMm * heightScale));

              return (
                <div key={model.id} className="flex flex-col items-center gap-2">
                  {/* Top-down footprint view */}
                  <div
                    className="rounded"
                    style={{
                      width: rectWidth,
                      height: rectHeight,
                      border: `2px solid ${color}`,
                      backgroundColor: `${color}18`,
                    }}
                  />
                  {/* Side profile thickness bar */}
                  <div
                    className="rounded"
                    style={{
                      width: rectWidth,
                      height: barHeight,
                      border: `1px solid ${color}`,
                      backgroundColor: `${color}30`,
                    }}
                    title={`Thickness: ${dims.heightMm} mm`}
                  />
                  {/* Labels */}
                  <div className="mt-1 text-center" style={{ maxWidth: rectWidth + 8 }}>
                    <p className="truncate text-xs font-medium" style={{ color: "var(--foreground)" }}>
                      {model.name}
                    </p>
                    <p className="text-xs tabular-nums" style={{ color: "var(--muted)" }}>
                      {dims.widthMm} &times; {dims.depthMm} &times; {dims.heightMm} mm
                    </p>
                    <p className="text-xs" style={{ color: "var(--muted)" }}>
                      {formatWeight(model.weight)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
          <p className="mt-4 text-xs" style={{ color: "var(--muted)" }}>
            Top view shows footprint (width &times; depth). Bar below shows relative thickness. Scaled proportionally.
          </p>
        </div>
      )}
    </div>
  );
};

export default PhysicalSizeComparison;
