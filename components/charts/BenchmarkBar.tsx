"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";

interface BenchmarkItem {
  readonly label: string;
  readonly value: number;
  readonly color?: string;
}

interface BenchmarkBarProps {
  readonly items: readonly BenchmarkItem[];
  readonly maxValue?: number;
}

const DEFAULT_COLOR = "#4589ff";
const BAR_HEIGHT = 20;
const ROW_HEIGHT = 36;
const LABEL_WIDTH = 85;
const RIGHT_MARGIN = 40;
const PADDING_Y = 8;

const BenchmarkBar = ({ items, maxValue = 100 }: BenchmarkBarProps) => {
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

  const svgHeight = items.length * ROW_HEIGHT + PADDING_Y * 2;
  const barAreaWidth = width - LABEL_WIDTH - RIGHT_MARGIN;

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

  // X-axis ticks
  const tickCount = 5;
  const step = maxValue / tickCount;
  const xTicks: number[] = [];
  for (let i = 0; i <= tickCount; i++) {
    xTicks.push(Math.round(step * i));
  }

  return (
    <div ref={containerRef} className="relative w-full" aria-label="Benchmark scores bar chart">
      <svg width={width} height={svgHeight} viewBox={`0 0 ${width} ${svgHeight}`}>
        {/* Vertical grid lines */}
        {xTicks.map((tick) => {
          const x = LABEL_WIDTH + (tick / maxValue) * barAreaWidth;
          return (
            <line
              key={tick}
              x1={x}
              y1={PADDING_Y}
              x2={x}
              y2={svgHeight - PADDING_Y}
              stroke="#262626"
              strokeDasharray="4 4"
            />
          );
        })}

        {/* X-axis line */}
        <line
          x1={LABEL_WIDTH}
          y1={svgHeight - PADDING_Y}
          x2={LABEL_WIDTH + barAreaWidth}
          y2={svgHeight - PADDING_Y}
          stroke="#393939"
        />

        {/* X-axis tick labels */}
        {xTicks.map((tick) => {
          const x = LABEL_WIDTH + (tick / maxValue) * barAreaWidth;
          return (
            <text key={`t-${tick}`} x={x} y={svgHeight} textAnchor="middle" fill="#a8a8a8" fontSize={11}>
              {tick}
            </text>
          );
        })}

        {items.map((item, i) => {
          const y = PADDING_Y + i * ROW_HEIGHT + (ROW_HEIGHT - BAR_HEIGHT) / 2;
          const barWidth = Math.max(0, (item.value / maxValue) * barAreaWidth);
          const color = item.color ?? DEFAULT_COLOR;

          return (
            <g key={item.label}>
              {/* Y-axis label */}
              <text
                x={LABEL_WIDTH - 8}
                y={y + BAR_HEIGHT / 2}
                textAnchor="end"
                dominantBaseline="central"
                fill="#a8a8a8"
                fontSize={11}
              >
                {item.label}
              </text>

              {/* Hit area */}
              <rect
                x={LABEL_WIDTH}
                y={y - 2}
                width={barAreaWidth}
                height={BAR_HEIGHT + 4}
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
                  y={y - 2}
                  width={barAreaWidth}
                  height={BAR_HEIGHT + 4}
                  fill="rgba(255,255,255,0.03)"
                  pointerEvents="none"
                />
              )}

              {/* Bar */}
              <rect x={LABEL_WIDTH} y={y} width={barWidth} height={BAR_HEIGHT} fill={color} />

              {/* Value label */}
              <text
                x={LABEL_WIDTH + barWidth + 6}
                y={y + BAR_HEIGHT / 2}
                dominantBaseline="central"
                fill="#f4f4f4"
                fontSize={11}
                fontWeight={600}
                fontFamily="monospace"
              >
                {item.value}
              </text>
            </g>
          );
        })}

        {/* Y-axis line */}
        <line x1={LABEL_WIDTH} y1={PADDING_Y} x2={LABEL_WIDTH} y2={svgHeight - PADDING_Y} stroke="#393939" />
      </svg>

      {/* Tooltip */}
      {hovered !== null && tooltipPos && (
        <div
          className="pointer-events-none absolute z-10"
          style={{
            left: tooltipPos.x + 12,
            top: tooltipPos.y - 40,
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
            <p style={{ color: "#f4f4f4", fontSize: 12, fontWeight: 600, marginBottom: 2 }}>{items[hovered].label}</p>
            <p style={{ color: "#f4f4f4", fontSize: 13, fontWeight: 600, fontFamily: "monospace" }}>
              {items[hovered].value}/{maxValue}
            </p>
          </div>
        </div>
      )}

      <details className="sr-only">
        <summary>View data table</summary>
        <table>
          <caption>Benchmark scores</caption>
          <thead>
            <tr>
              <th scope="col">Benchmark</th>
              <th scope="col">Score</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.label}>
                <td>{item.label}</td>
                <td>
                  {item.value}/{maxValue}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </details>
    </div>
  );
};

export default BenchmarkBar;
