"use client";

import React, { useState } from "react";
import { polarToCartesian, equalAngles, gridRingPoints, mapRange } from "@/lib/chart-utils";
import type { PerformanceDimensions } from "@/lib/types";

const DIMENSIONS = ["cpu", "gpu", "memory", "display", "connectivity", "portability"] as const;

const DIMENSION_LABELS: Record<(typeof DIMENSIONS)[number], string> = {
  cpu: "CPU",
  gpu: "GPU",
  memory: "Memory",
  display: "Display",
  connectivity: "Connect",
  portability: "Portable",
};

const DIMENSION_COLORS: Record<(typeof DIMENSIONS)[number], string> = {
  cpu: "#4589ff",
  gpu: "#42be65",
  memory: "#be95ff",
  display: "#ee5396",
  connectivity: "#08bdba",
  portability: "#f1c21b",
};

const tierLabel = (score: number): string => {
  if (score >= 80) return "Excellent";
  if (score >= 60) return "Good";
  if (score >= 40) return "Fair";
  return "Low";
};

export interface CompareEntry {
  readonly name: string;
  readonly scores: PerformanceDimensions;
  readonly color: string;
}

interface PolarBarProps {
  readonly scores: PerformanceDimensions;
  readonly compact?: boolean;
  readonly color?: string;
  readonly compareScores?: readonly CompareEntry[];
}

const GRID_FRACTIONS = [0.25, 0.5, 0.75, 1.0] as const;
const AXIS_COUNT = 6;

/** Build an SVG arc path for a single petal (sector/wedge) */
const petalPath = (cx: number, cy: number, radius: number, startAngle: number, endAngle: number): string => {
  const [startX, startY] = polarToCartesian(cx, cy, radius, startAngle);
  const [endX, endY] = polarToCartesian(cx, cy, radius, endAngle);
  return `M ${cx} ${cy} L ${startX} ${startY} A ${radius} ${radius} 0 0 1 ${endX} ${endY} Z`;
};

const PolarBarInner = ({ scores, compact = false, color, compareScores }: PolarBarProps) => {
  const size = compact ? 80 : 200;
  const cx = size / 2;
  const cy = size / 2;
  const maxRadius = compact ? 30 : 80;
  const labelOffset = compact ? 0 : 14;

  const [hoveredDim, setHoveredDim] = useState<(typeof DIMENSIONS)[number] | null>(null);

  const angles = equalAngles(AXIS_COUNT);
  const sectorAngle = (Math.PI * 2) / AXIS_COUNT;
  const halfSector = sectorAngle / 2;

  const petalOpacity = (dim: (typeof DIMENSIONS)[number]): number => {
    if (compact) return 0.7;
    if (!hoveredDim) return 0.7;
    return dim === hoveredDim ? 0.9 : 0.4;
  };

  // Tooltip position
  const tooltipPos = hoveredDim
    ? (() => {
        const idx = DIMENSIONS.indexOf(hoveredDim);
        const angle = angles[idx];
        const [tx, ty] = polarToCartesian(cx, cy, maxRadius + 8, angle);
        return { x: tx, y: ty };
      })()
    : null;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        role="img"
        aria-label="Performance polar bar chart"
      >
        {/* Grid rings */}
        {GRID_FRACTIONS.map((frac) => (
          <polygon
            key={frac}
            data-grid-ring
            points={gridRingPoints(cx, cy, maxRadius * frac, AXIS_COUNT)}
            fill="none"
            stroke="#393939"
            strokeWidth={0.5}
          />
        ))}

        {/* Axis lines */}
        {angles.map((angle, i) => {
          const [x2, y2] = polarToCartesian(cx, cy, maxRadius, angle);
          return <line key={i} data-axis x1={cx} y1={cy} x2={x2} y2={y2} stroke="#393939" strokeWidth={0.5} />;
        })}

        {/* Compare petals (behind primary) */}
        {compareScores?.map((entry) =>
          DIMENSIONS.map((dim, i) => {
            const score = entry.scores[dim];
            const radius = mapRange(score, 0, 100, 0, maxRadius);
            const centerAngle = angles[i];
            const startAngle = centerAngle - halfSector * 0.8;
            const endAngle = centerAngle + halfSector * 0.8;
            return (
              <path
                key={`${entry.name}-${dim}`}
                data-compare-petal={dim}
                d={petalPath(cx, cy, radius, startAngle, endAngle)}
                fill={entry.color}
                fillOpacity={0.4}
                stroke={entry.color}
                strokeWidth={0.5}
              />
            );
          }),
        )}

        {/* Primary petals */}
        {DIMENSIONS.map((dim, i) => {
          const score = scores[dim];
          const radius = mapRange(score, 0, 100, 0, maxRadius);
          const centerAngle = angles[i];
          const startAngle = centerAngle - halfSector * 0.8;
          const endAngle = centerAngle + halfSector * 0.8;
          const fillColor = color ?? DIMENSION_COLORS[dim];

          return (
            <path
              key={dim}
              data-petal={dim}
              d={petalPath(cx, cy, radius, startAngle, endAngle)}
              fill={fillColor}
              fillOpacity={petalOpacity(dim)}
              stroke={fillColor}
              strokeWidth={1}
              onMouseEnter={compact ? undefined : () => setHoveredDim(dim)}
              onMouseLeave={compact ? undefined : () => setHoveredDim(null)}
              style={compact ? undefined : { cursor: "default" }}
            />
          );
        })}

        {/* Labels (normal mode only) */}
        {!compact &&
          DIMENSIONS.map((dim, i) => {
            const angle = angles[i];
            const [lx, ly] = polarToCartesian(cx, cy, maxRadius + labelOffset, angle);
            return (
              <text key={dim} x={lx} y={ly} textAnchor="middle" dominantBaseline="central" fontSize={10} fill="#c6c6c6">
                {DIMENSION_LABELS[dim]}
              </text>
            );
          })}
      </svg>

      {/* Hover tooltip */}
      {!compact && hoveredDim && tooltipPos && (
        <div
          className="pointer-events-none absolute z-10 rounded border px-2 py-1 text-xs"
          style={{
            left: tooltipPos.x,
            top: tooltipPos.y,
            transform: "translate(-50%, -100%)",
            background: "#262626",
            borderColor: "#525252",
            whiteSpace: "nowrap",
          }}
        >
          <span className="font-medium text-carbon-100">{DIMENSION_LABELS[hoveredDim]}</span>
          <span className="ml-1.5 text-carbon-400">
            {scores[hoveredDim]} · {tierLabel(scores[hoveredDim])}
          </span>
        </div>
      )}
    </div>
  );
};

export const PolarBar = React.memo(PolarBarInner);
PolarBar.displayName = "PolarBar";
