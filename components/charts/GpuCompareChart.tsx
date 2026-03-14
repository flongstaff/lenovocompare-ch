"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import type { Laptop } from "@/lib/types";
import { getGpuScore, getGamingTier } from "@/lib/scoring";
import { COMPARE_COLORS } from "@/lib/constants";
import { shortName } from "@/lib/formatters";

interface GpuCompareChartProps {
  readonly models: readonly Laptop[];
}

const TIER_LABELS: Record<string, string> = {
  Heavy: "Heavy Gaming",
  Medium: "Medium Gaming",
  Light: "Light Gaming",
  None: "No Gaming",
};

const TIER_ABBREV: Record<string, string> = {
  Heavy: "H",
  Medium: "M",
  Light: "L",
  None: "\u2014",
};

const getTierColor = (tier: string): string => {
  if (tier === "Heavy") return "#42be65";
  if (tier === "Medium") return "#f1c21b";
  if (tier === "Light") return "#ff832b";
  return "#6f6f6f";
};

const LABEL_WIDTH = 140;
const RIGHT_MARGIN = 30;
const PADDING_Y = 5;
const MAX_SCORE = 100;

const GpuCompareChart = ({ models }: GpuCompareChartProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(400);
  const [hovered, setHovered] = useState<number | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null);
  const hasInitRef = useRef(false);

  useEffect(() => {
    if (hasInitRef.current) return;
    hasInitRef.current = true;
    const measure = () => {
      if (containerRef.current) setWidth(containerRef.current.clientWidth);
    };
    measure();
    if (typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(measure);
    if (containerRef.current) ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  const data = models.map((m, i) => {
    const tier = getGamingTier(m.gpu.name);
    return {
      name: shortName(m.name),
      score: getGpuScore(m.gpu.name),
      tier,
      tierLabel: TIER_LABELS[tier] ?? tier,
      gpu: m.gpu.name,
      color: COMPARE_COLORS[i % COMPARE_COLORS.length],
    };
  });

  const barSize = models.length >= 4 ? 10 : models.length >= 3 ? 12 : 16;
  const rowHeight = barSize + 20;
  const chartHeight = Math.max(100, models.length * rowHeight + PADDING_Y * 2 + 16);
  const barAreaWidth = Math.max(50, width - LABEL_WIDTH - RIGHT_MARGIN);

  const xTicks = [0, 25, 50, 75, 100];

  const handleMouseEnter = useCallback((index: number, e: React.MouseEvent) => {
    setHovered(index);
    const rect = containerRef.current?.getBoundingClientRect();
    if (rect) {
      setTooltipPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    }
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (rect) {
      setTooltipPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
    setHovered(null);
    setTooltipPos(null);
  }, []);

  const modelNames = models.map((m) => shortName(m.name)).join(" vs ");

  return (
    <div ref={containerRef} className="relative w-full" aria-label={`GPU comparison chart: ${modelNames}`}>
      <svg width={width} height={chartHeight} viewBox={`0 0 ${width} ${chartHeight}`}>
        {/* Vertical grid lines */}
        {xTicks.map((tick) => {
          const x = LABEL_WIDTH + (tick / MAX_SCORE) * barAreaWidth;
          return (
            <line
              key={tick}
              x1={x}
              y1={PADDING_Y}
              x2={x}
              y2={chartHeight - PADDING_Y - 16}
              stroke="var(--chart-grid)"
              strokeDasharray="3 3"
            />
          );
        })}

        {/* X-axis */}
        <line
          x1={LABEL_WIDTH}
          y1={chartHeight - PADDING_Y - 16}
          x2={LABEL_WIDTH + barAreaWidth}
          y2={chartHeight - PADDING_Y - 16}
          stroke="var(--chart-grid)"
        />

        {/* X-axis labels */}
        {xTicks.map((tick) => {
          const x = LABEL_WIDTH + (tick / MAX_SCORE) * barAreaWidth;
          return (
            <text
              key={`t-${tick}`}
              x={x}
              y={chartHeight - PADDING_Y}
              textAnchor="middle"
              fill="var(--chart-tick)"
              fontSize={10}
            >
              {tick}
            </text>
          );
        })}

        {/* Y-axis */}
        <line
          x1={LABEL_WIDTH}
          y1={PADDING_Y}
          x2={LABEL_WIDTH}
          y2={chartHeight - PADDING_Y - 16}
          stroke="var(--chart-grid)"
        />

        {data.map((d, i) => {
          const y = PADDING_Y + i * rowHeight + (rowHeight - barSize) / 2;
          const barWidth = Math.max(0, (d.score / MAX_SCORE) * barAreaWidth);

          return (
            <g key={d.name}>
              {/* Y-axis label */}
              <text
                x={LABEL_WIDTH - 8}
                y={y + barSize / 2}
                textAnchor="end"
                dominantBaseline="central"
                fill="var(--chart-text)"
                fontSize={11}
              >
                {d.name}
              </text>

              {/* Hit area */}
              <rect
                x={LABEL_WIDTH}
                y={y - 4}
                width={barAreaWidth}
                height={barSize + 8}
                fill="transparent"
                onMouseEnter={(e) => handleMouseEnter(i, e)}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                style={{ cursor: "default" }}
              />

              {/* Hover highlight */}
              {hovered === i && (
                <rect
                  x={LABEL_WIDTH}
                  y={y - 4}
                  width={barAreaWidth}
                  height={barSize + 8}
                  fill="rgba(255,255,255,0.03)"
                  pointerEvents="none"
                />
              )}

              {/* Bar */}
              <rect x={LABEL_WIDTH} y={y} width={barWidth} height={barSize} fill={d.color} />

              {/* Tier abbreviation label */}
              <text
                x={LABEL_WIDTH + barWidth + 6}
                y={y + barSize / 2}
                dominantBaseline="central"
                fill="var(--chart-tick)"
                fontSize={10}
                fontWeight={600}
              >
                {TIER_ABBREV[d.tier] ?? d.tier}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Tooltip */}
      {hovered !== null && tooltipPos && (
        <div
          className="pointer-events-none absolute z-10"
          style={{
            left: tooltipPos.x + 12,
            top: tooltipPos.y - 60,
          }}
        >
          <div
            style={{
              background: "var(--chart-tooltip-bg)",
              border: "1px solid var(--chart-tooltip-border)",
              borderRadius: 0,
              padding: "8px 12px",
              boxShadow: "0 4px 16px rgba(0,0,0,0.5)",
            }}
          >
            <p style={{ color: "var(--chart-text)", fontSize: 12, fontWeight: 600, marginBottom: 2 }}>
              {data[hovered].name}
            </p>
            <p style={{ color: "var(--chart-tick)", fontSize: 11, marginBottom: 4 }}>{data[hovered].gpu}</p>
            <div style={{ display: "flex", gap: 12, fontSize: 11 }}>
              <span style={{ color: "var(--chart-text)", fontFamily: "monospace", fontWeight: 600 }}>
                {data[hovered].score}/100
              </span>
              <span style={{ color: getTierColor(data[hovered].tier) }}>{data[hovered].tierLabel}</span>
            </div>
          </div>
        </div>
      )}

      <details className="sr-only">
        <summary>View data table</summary>
        <table>
          <caption>GPU scores: {modelNames}</caption>
          <thead>
            <tr>
              <th scope="col">Model</th>
              <th scope="col">GPU</th>
              <th scope="col">Score</th>
              <th scope="col">Gaming Tier</th>
            </tr>
          </thead>
          <tbody>
            {data.map((entry) => (
              <tr key={entry.name}>
                <td>{entry.name}</td>
                <td>{entry.gpu}</td>
                <td>{entry.score}/100</td>
                <td>{entry.tierLabel}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </details>
    </div>
  );
};

export default GpuCompareChart;
