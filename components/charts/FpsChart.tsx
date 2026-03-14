"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import type { GpuFpsEstimate } from "@/lib/types";

interface FpsChartProps {
  readonly estimates: readonly GpuFpsEstimate[];
}

const getBarColor = (fps: number): string => {
  if (fps >= 60) return "#42be65";
  if (fps >= 30) return "#f1c21b";
  return "#ff832b";
};

const abbreviateRes = (res: string): string => {
  if (res.includes("1920") || res.includes("1080")) return "1080p";
  if (res.includes("2560") || res.includes("1440")) return "1440p";
  if (res.includes("3840") || res.includes("2160")) return "4K";
  return res;
};

const getPlayability = (fps: number): string => {
  if (fps >= 60) return "Smooth";
  if (fps >= 30) return "Playable";
  return "Unplayable";
};

const BAR_HEIGHT = 18;
const ROW_HEIGHT = 45;
const LABEL_WIDTH = 200;
const RIGHT_MARGIN = 50;
const PADDING_TOP = 20;
const PADDING_BOTTOM = 20;

const FpsChart = ({ estimates }: FpsChartProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(500);
  const [hovered, setHovered] = useState<number | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null);
  const hasInitRef = useRef(false);

  const data = estimates.map((e) => ({
    name: `${e.title} (${abbreviateRes(e.resolution)} ${e.settings})`,
    fps: e.fps,
    title: e.title,
    resolution: e.resolution,
    settings: e.settings,
  }));

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

  const svgHeight = data.length * ROW_HEIGHT + PADDING_TOP + PADDING_BOTTOM;
  const barAreaWidth = Math.max(50, width - LABEL_WIDTH - RIGHT_MARGIN);

  // Compute max FPS for X-axis domain
  const maxFps = Math.max(...data.map((d) => d.fps), 60);
  const xMax = Math.ceil(maxFps / 10) * 10;

  // X-axis ticks
  const xTicks: number[] = [];
  const tickStep = xMax <= 60 ? 10 : xMax <= 120 ? 20 : 30;
  for (let v = 0; v <= xMax; v += tickStep) {
    xTicks.push(v);
  }

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

  return (
    <div ref={containerRef} className="relative">
      <div className="mt-2 w-full">
        <svg width={width} height={svgHeight} viewBox={`0 0 ${width} ${svgHeight}`}>
          {/* Vertical grid lines */}
          {xTicks.map((tick) => {
            const x = LABEL_WIDTH + (tick / xMax) * barAreaWidth;
            return (
              <line
                key={tick}
                x1={x}
                y1={PADDING_TOP}
                x2={x}
                y2={svgHeight - PADDING_BOTTOM}
                stroke="#393939"
                strokeDasharray="3 3"
              />
            );
          })}

          {/* X-axis line */}
          <line
            x1={LABEL_WIDTH}
            y1={svgHeight - PADDING_BOTTOM}
            x2={LABEL_WIDTH + barAreaWidth}
            y2={svgHeight - PADDING_BOTTOM}
            stroke="#525252"
          />

          {/* X-axis tick labels */}
          {xTicks.map((tick) => {
            const x = LABEL_WIDTH + (tick / xMax) * barAreaWidth;
            return (
              <text key={`t-${tick}`} x={x} y={svgHeight - 4} textAnchor="middle" fill="#a8a8a8" fontSize={11}>
                {tick}
              </text>
            );
          })}

          {/* Reference lines at 30 and 60 FPS */}
          {[30, 60].map((refFps) => {
            if (refFps > xMax) return null;
            const x = LABEL_WIDTH + (refFps / xMax) * barAreaWidth;
            const color = refFps === 30 ? "#ff832b" : "#42be65";
            return (
              <g key={`ref-${refFps}`}>
                <line
                  x1={x}
                  y1={PADDING_TOP}
                  x2={x}
                  y2={svgHeight - PADDING_BOTTOM}
                  stroke={color}
                  strokeDasharray="4 4"
                  strokeWidth={1.5}
                />
                <text x={x} y={PADDING_TOP - 4} textAnchor="middle" fill={color} fontSize={10}>
                  {refFps}
                </text>
              </g>
            );
          })}

          {/* Y-axis line */}
          <line x1={LABEL_WIDTH} y1={PADDING_TOP} x2={LABEL_WIDTH} y2={svgHeight - PADDING_BOTTOM} stroke="#525252" />

          {data.map((d, i) => {
            const y = PADDING_TOP + i * ROW_HEIGHT + (ROW_HEIGHT - BAR_HEIGHT) / 2;
            const barWidth = Math.max(0, (d.fps / xMax) * barAreaWidth);
            const color = getBarColor(d.fps);

            return (
              <g key={d.name}>
                {/* Y-axis label */}
                <text
                  x={LABEL_WIDTH - 8}
                  y={y + BAR_HEIGHT / 2}
                  textAnchor="end"
                  dominantBaseline="central"
                  fill="#a8a8a8"
                  fontSize={11}
                >
                  {d.name}
                </text>

                {/* Hit area */}
                <rect
                  x={LABEL_WIDTH}
                  y={y - 4}
                  width={barAreaWidth}
                  height={BAR_HEIGHT + 8}
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
                    height={BAR_HEIGHT + 8}
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
                  fontSize={10}
                  fontWeight={600}
                  fontFamily="monospace"
                >
                  {d.fps}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

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
              background: "#262626",
              border: "1px solid #525252",
              borderRadius: 0,
              padding: "8px 12px",
              boxShadow: "0 4px 16px rgba(0,0,0,0.5)",
            }}
          >
            <p style={{ color: "#f4f4f4", fontSize: 12, fontWeight: 600, marginBottom: 2 }}>{data[hovered].title}</p>
            <p style={{ color: "#a8a8a8", fontSize: 11, marginBottom: 4 }}>
              {data[hovered].resolution} · {data[hovered].settings}
            </p>
            <div style={{ display: "flex", gap: 12, fontSize: 11 }}>
              <span style={{ color: "#f4f4f4", fontFamily: "monospace", fontWeight: 600 }}>
                {data[hovered].fps} FPS
              </span>
              <span style={{ color: getBarColor(data[hovered].fps) }}>{getPlayability(data[hovered].fps)}</span>
            </div>
          </div>
        </div>
      )}

      <div className="mb-2 mt-1 flex items-center gap-4 text-[10px]" style={{ color: "#a8a8a8" }}>
        <span className="flex items-center gap-1">
          <span className="inline-block h-2 w-2" style={{ backgroundColor: "#ff832b" }} /> &lt;30 FPS
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block h-2 w-2" style={{ backgroundColor: "#f1c21b" }} /> 30-59 FPS
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block h-2 w-2" style={{ backgroundColor: "#42be65" }} /> 60+ FPS
        </span>
      </div>
    </div>
  );
};

export default FpsChart;
