"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";

interface BatteryCompareBarProps {
  readonly pluggedIn: number;
  readonly onBattery: number;
  readonly label?: string;
}

const BAR_HEIGHT = 18;
const ROW_HEIGHT = 36;
const LABEL_WIDTH = 85;
const RIGHT_MARGIN = 30;
const PADDING_Y = 0;

const BatteryCompareBar = ({ pluggedIn, onBattery, label = "Cinebench 2024 Multi" }: BatteryCompareBarProps) => {
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

  const delta = pluggedIn > 0 ? Math.round(((pluggedIn - onBattery) / pluggedIn) * 100) : 0;
  const data = [
    { name: "Plugged In", score: pluggedIn },
    { name: "On Battery", score: onBattery },
  ];
  const colors = ["#0f62fe", "#6929c4"];

  const maxScore = Math.max(pluggedIn, onBattery, 1);
  const xMax = Math.ceil(maxScore / 10) * 10 || 10;
  const barAreaWidth = Math.max(50, width - LABEL_WIDTH - RIGHT_MARGIN);
  const svgHeight = data.length * ROW_HEIGHT + PADDING_Y * 2;

  // X-axis ticks
  const tickStep = xMax <= 50 ? 10 : xMax <= 100 ? 20 : 50;
  const xTicks: number[] = [];
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
      <div className="mb-2 flex items-center justify-between">
        <span className="text-xs" style={{ color: "var(--muted)" }}>
          {label}
        </span>
        <span
          className="font-mono text-xs"
          style={{ color: delta > 5 ? "#da1e28" : delta > 0 ? "#f1c21b" : "#42be65" }}
        >
          {delta > 0 ? `-${delta}% on battery` : "No loss on battery"}
        </span>
      </div>
      <svg width={width} height={svgHeight} viewBox={`0 0 ${width} ${svgHeight}`}>
        {/* Vertical grid lines */}
        {xTicks.map((tick) => {
          const x = LABEL_WIDTH + (tick / xMax) * barAreaWidth;
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

        {/* X-axis */}
        <line x1={LABEL_WIDTH} y1={svgHeight} x2={LABEL_WIDTH + barAreaWidth} y2={svgHeight} stroke="#525252" />

        {/* X-axis labels */}
        {xTicks.map((tick) => {
          const x = LABEL_WIDTH + (tick / xMax) * barAreaWidth;
          return (
            <text key={`t-${tick}`} x={x} y={svgHeight + 14} textAnchor="middle" fill="#a8a8a8" fontSize={11}>
              {tick}
            </text>
          );
        })}

        {/* Y-axis */}
        <line x1={LABEL_WIDTH} y1={PADDING_Y} x2={LABEL_WIDTH} y2={svgHeight} stroke="#525252" />

        {data.map((d, i) => {
          const y = PADDING_Y + i * ROW_HEIGHT + (ROW_HEIGHT - BAR_HEIGHT) / 2;
          const barWidth = Math.max(0, (d.score / xMax) * barAreaWidth);

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
              <rect x={LABEL_WIDTH} y={y} width={barWidth} height={BAR_HEIGHT} fill={colors[i]} />
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
            <p style={{ color: "#f4f4f4", fontSize: 12, fontWeight: 600, marginBottom: 2 }}>{data[hovered].name}</p>
            <p style={{ color: "#f4f4f4", fontSize: 13, fontWeight: 600, fontFamily: "monospace" }}>
              Score: {data[hovered].score}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default BatteryCompareBar;
