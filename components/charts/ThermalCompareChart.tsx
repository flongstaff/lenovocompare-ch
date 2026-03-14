"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import type { Laptop } from "@/lib/types";
import { getModelBenchmarks } from "@/lib/scoring";
import { COMPARE_COLORS } from "@/lib/constants";
import { shortName } from "@/lib/formatters";

interface ThermalCompareChartProps {
  readonly models: readonly Laptop[];
}

const METRICS = ["Keyboard \u00B0C", "Underside \u00B0C", "Fan dB"] as const;
const LABEL_WIDTH = 90;
const RIGHT_MARGIN = 30;
const PADDING_Y = 5;

const ThermalCompareChart = ({ models }: ThermalCompareChartProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(400);
  const [hovered, setHovered] = useState<{ metric: number; model: number } | null>(null);
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

  // Scores per metric per model
  const scores = METRICS.map((metric) =>
    models.map((m) => {
      const benchmarks = getModelBenchmarks(m.id);
      if (metric === "Keyboard \u00B0C") return benchmarks?.thermals?.keyboardMaxC ?? 0;
      if (metric === "Underside \u00B0C") return benchmarks?.thermals?.undersideMaxC ?? 0;
      return benchmarks?.fanNoise ?? 0;
    }),
  );

  const barSize = models.length >= 4 ? 6 : models.length >= 3 ? 7 : 8;
  const barGap = 1;
  const groupHeight = models.length * (barSize + barGap) - barGap;
  const categoryGap = Math.max(groupHeight * 0.5, 12);
  const totalRowHeight = groupHeight + categoryGap;
  const chartHeight = Math.max(140, METRICS.length * totalRowHeight + PADDING_Y * 2 + 20);
  const barAreaWidth = Math.max(50, width - LABEL_WIDTH - RIGHT_MARGIN);

  // Compute max value for X-axis
  const allValues = scores.flat();
  const maxVal = Math.max(...allValues, 1);
  const xMax = Math.ceil(maxVal / 10) * 10;

  // X-axis ticks
  const tickStep = xMax <= 50 ? 10 : 20;
  const xTicks: number[] = [];
  for (let v = 0; v <= xMax; v += tickStep) {
    xTicks.push(v);
  }

  const handleMouseEnter = useCallback((metricIdx: number, modelIdx: number, e: React.MouseEvent) => {
    setHovered({ metric: metricIdx, model: modelIdx });
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

  return (
    <div ref={containerRef} className="relative w-full">
      <svg width={width} height={chartHeight} viewBox={`0 0 ${width} ${chartHeight}`}>
        {/* Vertical grid lines */}
        {xTicks.map((tick) => {
          const x = LABEL_WIDTH + (tick / xMax) * barAreaWidth;
          return (
            <line
              key={tick}
              x1={x}
              y1={PADDING_Y}
              x2={x}
              y2={chartHeight - PADDING_Y - 16}
              stroke="#393939"
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
          stroke="#393939"
        />

        {/* X-axis labels */}
        {xTicks.map((tick) => {
          const x = LABEL_WIDTH + (tick / xMax) * barAreaWidth;
          return (
            <text key={`t-${tick}`} x={x} y={chartHeight - PADDING_Y} textAnchor="middle" fill="#a8a8a8" fontSize={10}>
              {tick}
            </text>
          );
        })}

        {/* Y-axis */}
        <line x1={LABEL_WIDTH} y1={PADDING_Y} x2={LABEL_WIDTH} y2={chartHeight - PADDING_Y - 16} stroke="#393939" />

        {METRICS.map((metric, mi) => {
          const groupTop = PADDING_Y + mi * totalRowHeight + categoryGap / 2;

          return (
            <g key={metric}>
              {/* Metric label */}
              <text
                x={LABEL_WIDTH - 8}
                y={groupTop + groupHeight / 2}
                textAnchor="end"
                dominantBaseline="central"
                fill="#f4f4f4"
                fontSize={11}
                fontWeight={500}
              >
                {metric}
              </text>

              {/* Bars per model */}
              {models.map((m, modelIdx) => {
                const y = groupTop + modelIdx * (barSize + barGap);
                const value = scores[mi][modelIdx];
                const barWidth = Math.max(0, (value / xMax) * barAreaWidth);
                const color = COMPARE_COLORS[modelIdx % COMPARE_COLORS.length];

                return (
                  <g key={m.id}>
                    {/* Hit area */}
                    <rect
                      x={LABEL_WIDTH}
                      y={y - 1}
                      width={barAreaWidth}
                      height={barSize + 2}
                      fill="transparent"
                      onMouseEnter={(e) => handleMouseEnter(mi, modelIdx, e)}
                      onMouseMove={handleMouseMove}
                      onMouseLeave={handleMouseLeave}
                      style={{ cursor: "default" }}
                    />

                    {/* Hover highlight */}
                    {hovered?.metric === mi && hovered?.model === modelIdx && (
                      <rect
                        x={LABEL_WIDTH}
                        y={y - 1}
                        width={barAreaWidth}
                        height={barSize + 2}
                        fill="rgba(255,255,255,0.03)"
                        pointerEvents="none"
                      />
                    )}

                    {/* Bar */}
                    <rect x={LABEL_WIDTH} y={y} width={barWidth} height={barSize} fill={color} />
                  </g>
                );
              })}
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
            top: tooltipPos.y - 50,
          }}
        >
          <div
            style={{
              background: "#262626",
              border: "1px solid #525252",
              borderRadius: 0,
              padding: "8px 12px",
              boxShadow: "0 4px 16px rgba(0,0,0,0.5)",
            }}
          >
            <p style={{ color: "#f4f4f4", fontSize: 12, fontWeight: 600, marginBottom: 4 }}>
              {METRICS[hovered.metric]}
            </p>
            {models.map((m, i) => (
              <div
                key={m.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  fontSize: 11,
                  color: "#c6c6c6",
                  padding: "2px 0",
                }}
              >
                <span
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: 0,
                    background: COMPARE_COLORS[i % COMPARE_COLORS.length],
                    flexShrink: 0,
                  }}
                />
                <span>{shortName(m.name)}</span>
                <span style={{ marginLeft: "auto", fontWeight: 600, color: "#f4f4f4", fontFamily: "monospace" }}>
                  {scores[hovered.metric][i]}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-wrap justify-center gap-3 pb-1 pt-1">
        {models.map((m, i) => (
          <div key={m.id} className="flex items-center gap-1.5 text-xs" style={{ color: "#f4f4f4" }}>
            <span
              className="inline-block h-2.5 w-2.5"
              style={{ background: COMPARE_COLORS[i % COMPARE_COLORS.length] }}
            />
            {shortName(m.name)}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ThermalCompareChart;
