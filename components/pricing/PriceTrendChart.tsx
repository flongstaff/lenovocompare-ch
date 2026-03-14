"use client";

import { useState, useMemo, useCallback } from "react";
import type { SwissPrice, PriceBaseline } from "@/lib/types";
import { formatCHF, formatDate } from "@/lib/formatters";
import { RETAILER_COLORS } from "@/lib/constants";

interface PriceTrendChartProps {
  readonly prices: readonly SwissPrice[];
  readonly baseline: PriceBaseline | null;
}

interface DataPoint {
  timestamp: number;
  price: number;
  retailer: string;
  dateLabel: string;
  priceType?: string;
}

const CHART_PADDING = { top: 16, right: 70, bottom: 32, left: 56 };
const DOT_RADIUS = 5;
const DOT_RADIUS_HOVER = 7;

const getRetailerColor = (retailer: string): string => RETAILER_COLORS[retailer] ?? "#c6c6c6";

/**
 * Format a timestamp to a compact date label for axis ticks.
 * Uses UTC to avoid timezone mismatch with stored ISO dates.
 */
const formatAxisDate = (ts: number): string => {
  const d = new Date(ts);
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${d.getUTCDate()} ${months[d.getUTCMonth()]}`;
};

/**
 * Generate nicely spaced Y-axis tick values covering the data range.
 */
const getYTicks = (min: number, max: number, targetCount: number): number[] => {
  const range = max - min;
  if (range === 0) return [min];

  // Choose a "nice" step size
  const rawStep = range / (targetCount - 1);
  const magnitude = Math.pow(10, Math.floor(Math.log10(rawStep)));
  const niceSteps = [1, 2, 5, 10];
  const step = niceSteps.find((s) => s * magnitude >= rawStep)! * magnitude;

  const ticks: number[] = [];
  const start = Math.floor(min / step) * step;
  for (let v = start; v <= max + step * 0.5; v += step) {
    ticks.push(v);
  }
  return ticks;
};

/**
 * Pure SVG price trend chart. Shows price history over time as a scatter+line
 * chart with per-retailer colors, hover tooltips, and optional baseline
 * reference lines. No recharts dependency.
 */
const PriceTrendChart = ({ prices, baseline }: PriceTrendChartProps) => {
  const [hoveredPoint, setHoveredPoint] = useState<DataPoint | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });

  // Parse and group data points by retailer
  const { points, retailers, xDomain, yDomain } = useMemo(() => {
    const parsed: DataPoint[] = [];
    for (const p of prices) {
      const ts = new Date(p.dateAdded).getTime();
      if (isNaN(ts)) continue;
      parsed.push({
        timestamp: ts,
        price: p.price,
        retailer: p.retailer,
        dateLabel: formatDate(p.dateAdded),
        priceType: p.priceType,
      });
    }

    const retailerSet = new Set(parsed.map((p) => p.retailer));
    const allRetailers = Array.from(retailerSet);

    const allPriceValues = parsed.map((p) => p.price);
    const baselineValues = baseline ? [baseline.msrp, baseline.typicalRetail, baseline.historicalLow] : [];
    const allValues = [...allPriceValues, ...baselineValues];

    if (allValues.length === 0 || parsed.length === 0) {
      return {
        points: [],
        retailers: [],
        xDomain: [0, 1] as [number, number],
        yDomain: [0, 1] as [number, number],
      };
    }

    const timestamps = parsed.map((p) => p.timestamp);
    const xMin = Math.min(...timestamps);
    const xMax = Math.max(...timestamps);
    // Add padding to X axis so dots aren't clipped at edges
    const xPad = xMin === xMax ? 86400000 * 7 : (xMax - xMin) * 0.04;

    const rawYMin = Math.min(...allValues);
    const rawYMax = Math.max(...allValues);
    const yPad = rawYMin === rawYMax ? 50 : (rawYMax - rawYMin) * 0.08;

    return {
      points: parsed,
      retailers: allRetailers,
      xDomain: [xMin - xPad, xMax + xPad] as [number, number],
      yDomain: [rawYMin - yPad, rawYMax + yPad] as [number, number],
    };
  }, [prices, baseline]);

  // Adaptive chart height based on data density
  const chartHeight = points.length <= 3 ? 140 : points.length <= 8 ? 170 : 200;
  const chartWidth = "100%";

  // Coordinate mapping functions
  const toX = useCallback(
    (ts: number, width: number) => {
      const plotWidth = width - CHART_PADDING.left - CHART_PADDING.right;
      return CHART_PADDING.left + ((ts - xDomain[0]) / (xDomain[1] - xDomain[0])) * plotWidth;
    },
    [xDomain],
  );

  const toY = useCallback(
    (price: number) => {
      const plotHeight = chartHeight - CHART_PADDING.top - CHART_PADDING.bottom;
      // Invert Y: higher prices at top
      return CHART_PADDING.top + (1 - (price - yDomain[0]) / (yDomain[1] - yDomain[0])) * plotHeight;
    },
    [yDomain, chartHeight],
  );

  const handleDotEnter = useCallback((point: DataPoint, e: React.MouseEvent) => {
    setHoveredPoint(point);
    setTooltipPos({ x: e.clientX + 12, y: e.clientY - 40 });
  }, []);

  const handleDotMove = useCallback((e: React.MouseEvent) => {
    setTooltipPos({ x: e.clientX + 12, y: e.clientY - 40 });
  }, []);

  if (points.length === 0) return null;

  // Build per-retailer sorted point arrays for line paths
  const retailerPoints = new Map<string, DataPoint[]>();
  for (const p of points) {
    const arr = retailerPoints.get(p.retailer) ?? [];
    arr.push(p);
    retailerPoints.set(p.retailer, arr);
  }
  for (const arr of retailerPoints.values()) {
    arr.sort((a, b) => a.timestamp - b.timestamp);
  }

  // Y-axis ticks
  const yTicks = getYTicks(yDomain[0], yDomain[1], 4);

  // X-axis ticks: spread evenly across the timestamp range
  const xTickCount = Math.min(points.length, 5);
  const xTicks: number[] = [];
  if (xTickCount > 0) {
    const step = (xDomain[1] - xDomain[0]) / (xTickCount + 1);
    for (let i = 1; i <= xTickCount; i++) {
      xTicks.push(xDomain[0] + step * i);
    }
  }

  return (
    <div className="mb-3">
      <svg
        width={chartWidth}
        height={chartHeight}
        viewBox={`0 0 600 ${chartHeight}`}
        preserveAspectRatio="xMidYMid meet"
        style={{ overflow: "visible" }}
        role="img"
        aria-label="Price trend chart showing price history over time by retailer"
      >
        {/* Grid lines */}
        {yTicks.map((v) => {
          const y = toY(v);
          return (
            <line
              key={`grid-${v}`}
              x1={CHART_PADDING.left}
              y1={y}
              x2={600 - CHART_PADDING.right}
              y2={y}
              stroke="#262626"
              strokeDasharray="4 4"
            />
          );
        })}

        {/* Y-axis labels */}
        {yTicks.map((v) => {
          const y = toY(v);
          return (
            <text
              key={`ylabel-${v}`}
              x={CHART_PADDING.left - 8}
              y={y + 3}
              fill="#a8a8a8"
              fontSize={10}
              textAnchor="end"
              fontFamily="monospace"
            >
              {Math.round(v)}
            </text>
          );
        })}

        {/* X-axis labels */}
        {xTicks.map((ts) => {
          const x = toX(ts, 600);
          return (
            <text
              key={`xlabel-${ts}`}
              x={x}
              y={chartHeight - 6}
              fill="#a8a8a8"
              fontSize={10}
              textAnchor="middle"
              fontFamily="monospace"
            >
              {formatAxisDate(ts)}
            </text>
          );
        })}

        {/* Baseline reference lines */}
        {baseline && (
          <>
            {/* MSRP */}
            <line
              x1={CHART_PADDING.left}
              y1={toY(baseline.msrp)}
              x2={600 - CHART_PADDING.right}
              y2={toY(baseline.msrp)}
              stroke="#da1e28"
              strokeDasharray="6 4"
              strokeOpacity={0.35}
              strokeWidth={0.8}
            />
            <text
              x={600 - CHART_PADDING.right + 4}
              y={toY(baseline.msrp) + 3}
              fill="#da1e28"
              fillOpacity={0.5}
              fontSize={9}
              fontFamily="monospace"
            >
              MSRP
            </text>

            {/* Typical retail */}
            <line
              x1={CHART_PADDING.left}
              y1={toY(baseline.typicalRetail)}
              x2={600 - CHART_PADDING.right}
              y2={toY(baseline.typicalRetail)}
              stroke="#a8a8a8"
              strokeDasharray="6 4"
              strokeOpacity={0.3}
              strokeWidth={0.8}
            />
            <text
              x={600 - CHART_PADDING.right + 4}
              y={toY(baseline.typicalRetail) + 3}
              fill="#a8a8a8"
              fillOpacity={0.45}
              fontSize={9}
              fontFamily="monospace"
            >
              Typical
            </text>

            {/* Historical low */}
            <line
              x1={CHART_PADDING.left}
              y1={toY(baseline.historicalLow)}
              x2={600 - CHART_PADDING.right}
              y2={toY(baseline.historicalLow)}
              stroke="#42be65"
              strokeDasharray="6 4"
              strokeOpacity={0.35}
              strokeWidth={0.8}
            />
            <text
              x={600 - CHART_PADDING.right + 4}
              y={toY(baseline.historicalLow) + 3}
              fill="#42be65"
              fillOpacity={0.5}
              fontSize={9}
              fontFamily="monospace"
            >
              Hist. Low
            </text>
          </>
        )}

        {/* Lines connecting dots per retailer */}
        {retailers.map((retailer) => {
          const pts = retailerPoints.get(retailer);
          if (!pts || pts.length < 2) return null;
          const pathData = pts
            .map((p, i) => `${i === 0 ? "M" : "L"} ${toX(p.timestamp, 600)} ${toY(p.price)}`)
            .join(" ");
          return (
            <path
              key={`line-${retailer}`}
              d={pathData}
              fill="none"
              stroke={getRetailerColor(retailer)}
              strokeWidth={2}
              strokeOpacity={0.6}
            />
          );
        })}

        {/* Data points (dots) */}
        {points.map((p, i) => {
          const cx = toX(p.timestamp, 600);
          const cy = toY(p.price);
          const isHovered =
            hoveredPoint?.timestamp === p.timestamp &&
            hoveredPoint?.retailer === p.retailer &&
            hoveredPoint?.price === p.price;
          return (
            <circle
              key={`dot-${i}`}
              cx={cx}
              cy={cy}
              r={isHovered ? DOT_RADIUS_HOVER : DOT_RADIUS}
              fill={getRetailerColor(p.retailer)}
              stroke={isHovered ? "#f4f4f4" : "#161616"}
              strokeWidth={2}
              style={{ cursor: "pointer", transition: "r 0.1s ease" }}
              onMouseEnter={(e) => handleDotEnter(p, e)}
              onMouseMove={handleDotMove}
              onMouseLeave={() => setHoveredPoint(null)}
            />
          );
        })}
      </svg>

      {/* Tooltip */}
      {hoveredPoint && (
        <div
          className="pointer-events-none fixed z-50"
          style={{
            left: tooltipPos.x,
            top: tooltipPos.y,
          }}
        >
          <div
            style={{
              background: "#262626",
              border: "1px solid #525252",
              borderRadius: 0,
              padding: "8px 12px",
              boxShadow: "0 4px 16px rgba(0,0,0,0.5)",
              minWidth: 140,
            }}
          >
            <p
              style={{
                color: "#a8a8a8",
                fontSize: 11,
                marginBottom: 4,
                fontFamily: "monospace",
              }}
            >
              {hoveredPoint.dateLabel}
            </p>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                fontSize: 12,
              }}
            >
              <span
                style={{
                  width: 8,
                  height: 8,
                  background: getRetailerColor(hoveredPoint.retailer),
                  flexShrink: 0,
                }}
              />
              <span style={{ color: "#c6c6c6" }}>{hoveredPoint.retailer}</span>
              <span
                style={{
                  marginLeft: "auto",
                  fontWeight: 600,
                  color: "#f4f4f4",
                  fontFamily: "monospace",
                }}
              >
                {formatCHF(hoveredPoint.price)}
              </span>
            </div>
            {hoveredPoint.priceType && (
              <div
                style={{
                  marginTop: 4,
                  fontSize: 10,
                  color: "#6f6f6f",
                  fontFamily: "monospace",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                {hoveredPoint.priceType}
              </div>
            )}
            {baseline && (
              <div style={{ marginTop: 4, fontSize: 10, color: "#6f6f6f" }}>
                {(() => {
                  const pctOff = Math.round(((baseline.msrp - hoveredPoint.price) / baseline.msrp) * 100);
                  if (pctOff > 0) return <span style={{ color: "#42be65" }}>{pctOff}% below MSRP</span>;
                  if (pctOff < 0) return <span style={{ color: "#da1e28" }}>{Math.abs(pctOff)}% above MSRP</span>;
                  return <span>At MSRP</span>;
                })()}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="flex flex-wrap justify-center gap-3 pt-1">
        {retailers.map((r) => (
          <div key={r} className="flex items-center gap-1.5 text-[10px]" style={{ color: "#c6c6c6" }}>
            <span className="inline-block h-2 w-2" style={{ background: getRetailerColor(r) }} />
            {r}
          </div>
        ))}
        {baseline && (
          <>
            <div className="flex items-center gap-1.5 text-[10px]" style={{ color: "#da1e28" }}>
              <span className="inline-block w-3 border-t border-dashed" style={{ borderColor: "#da1e28" }} />
              MSRP
            </div>
            <div className="flex items-center gap-1.5 text-[10px]" style={{ color: "#a8a8a8" }}>
              <span className="inline-block w-3 border-t border-dashed" style={{ borderColor: "#a8a8a8" }} />
              Typical
            </div>
            <div className="flex items-center gap-1.5 text-[10px]" style={{ color: "#42be65" }}>
              <span className="inline-block w-3 border-t border-dashed" style={{ borderColor: "#42be65" }} />
              Hist. Low
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export { PriceTrendChart };
