"use client";

import { useState } from "react";
import type { SaleEvent } from "@/lib/types";

interface SeasonalCalendarProps {
  readonly events: readonly SaleEvent[];
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"] as const;

const eventColors: Record<string, string> = {
  all: "#4589ff",
  Digitec: "#0f62fe",
  Brack: "#42be65",
  "Lenovo CH": "#da1e28",
  Interdiscount: "#a56eff",
  Galaxus: "#0f62fe",
};

const SeasonalCalendar = ({ events }: SeasonalCalendarProps) => {
  const [hoveredEvent, setHoveredEvent] = useState<SaleEvent | null>(null);
  const currentMonth = new Date().getMonth();

  const w = 960;
  const padding = { top: 36, bottom: 60, left: 10, right: 10 };
  const chartW = w - padding.left - padding.right;
  const monthW = chartW / 12;
  const laneH = 24;
  const laneGap = 5;

  const lanes: { event: SaleEvent; lane: number }[] = [];
  for (const event of events) {
    let lane = 0;
    const eventStart = event.typicalMonth - 1;
    const eventEnd = eventStart + event.durationDays / 30;
    while (
      lanes.some(
        (l) =>
          l.lane === lane &&
          l.event.typicalMonth - 1 < eventEnd &&
          l.event.typicalMonth - 1 + l.event.durationDays / 30 > eventStart,
      )
    ) {
      lane++;
    }
    lanes.push({ event, lane });
  }

  const maxLane = Math.max(0, ...lanes.map((l) => l.lane));
  const totalH = padding.top + (maxLane + 1) * (laneH + laneGap) + padding.bottom;

  return (
    <div className="carbon-card overflow-hidden p-5">
      <h3 className="mb-4 text-sm font-semibold" style={{ color: "var(--foreground)" }}>
        Swiss Sale Calendar
      </h3>
      <div className="scrollbar-thin overflow-x-auto">
        <svg
          viewBox={`0 0 ${w} ${totalH}`}
          className="w-full"
          style={{ minWidth: 640, maxHeight: 200 }}
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            {Object.entries(eventColors).map(([key, color]) => (
              <linearGradient key={key} id={`grad-${key.replace(/\s/g, "")}`} x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor={color} stopOpacity={0.85} />
                <stop offset="100%" stopColor={color} stopOpacity={0.55} />
              </linearGradient>
            ))}
          </defs>

          {/* Month columns */}
          {MONTHS.map((month, i) => {
            const x = padding.left + i * monthW;
            const isCurrent = i === currentMonth;
            return (
              <g key={month}>
                {isCurrent && (
                  <rect
                    x={x + 1}
                    y={padding.top - 4}
                    width={monthW - 2}
                    height={totalH - padding.top - padding.bottom + 14}
                    fill="#4589ff"
                    opacity={0.06}
                    rx={6}
                  />
                )}
                {i > 0 && (
                  <line
                    x1={x}
                    y1={padding.top}
                    x2={x}
                    y2={totalH - padding.bottom + 10}
                    stroke="var(--border-subtle)"
                    strokeWidth={0.5}
                    opacity={0.3}
                    strokeDasharray="2,3"
                  />
                )}
                <text
                  x={x + monthW / 2}
                  y={padding.top - 12}
                  textAnchor="middle"
                  fill={isCurrent ? "#4589ff" : "var(--muted)"}
                  fontSize={11}
                  fontWeight={isCurrent ? 700 : 400}
                  fontFamily="var(--font-geist-sans)"
                >
                  {month}
                </text>
                {isCurrent && (
                  <g>
                    <text
                      x={x + monthW / 2}
                      y={totalH - padding.bottom + 28}
                      textAnchor="middle"
                      fill="#4589ff"
                      fontSize={8}
                      fontWeight={700}
                      fontFamily="var(--font-geist-mono)"
                      letterSpacing="0.1em"
                    >
                      ▲ NOW
                    </text>
                  </g>
                )}
              </g>
            );
          })}

          {/* Event bars */}
          {lanes.map(({ event, lane }) => {
            const startX = padding.left + (event.typicalMonth - 1) * monthW;
            const barW = Math.max(monthW * 0.85, (event.durationDays / 30) * monthW);
            const y = padding.top + lane * (laneH + laneGap);
            const color = eventColors[event.retailer] ?? "#a8a8a8";
            const gradId = `grad-${event.retailer.replace(/\s/g, "")}`;
            const isHovered = hoveredEvent?.id === event.id;
            const maxChars = Math.floor(barW / 6.5);
            const label = event.name.length > maxChars ? event.name.slice(0, maxChars - 1) + "…" : event.name;

            return (
              <g
                key={event.id}
                tabIndex={0}
                role="button"
                aria-label={`${event.name} — ${event.retailer === "all" ? "All retailers" : event.retailer}`}
                onMouseEnter={() => setHoveredEvent(event)}
                onMouseLeave={() => setHoveredEvent(null)}
                onFocus={() => setHoveredEvent(event)}
                onBlur={() => setHoveredEvent(null)}
                style={{ cursor: "pointer", outline: "none" }}
              >
                <rect
                  x={startX}
                  y={y}
                  width={barW}
                  height={laneH}
                  rx={4}
                  fill={`url(#${gradId})`}
                  opacity={isHovered ? 1 : 0.75}
                  stroke={isHovered ? color : "transparent"}
                  strokeWidth={isHovered ? 1 : 0}
                />
                <text
                  x={startX + 7}
                  y={y + laneH / 2 + 1}
                  dominantBaseline="central"
                  fill="white"
                  fontSize={10}
                  fontWeight={500}
                  fontFamily="var(--font-geist-sans)"
                  style={{ pointerEvents: "none" }}
                >
                  {label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Hover detail panel */}
      {hoveredEvent && (
        <div className="mt-4 border-t pt-3" style={{ borderColor: "var(--border-subtle)" }}>
          <div className="flex items-center gap-3">
            <div
              className="h-2.5 w-2.5 rounded-sm"
              style={{ background: eventColors[hoveredEvent.retailer] ?? "#a8a8a8" }}
            />
            <span className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>
              {hoveredEvent.name}
            </span>
            <span className="text-xs" style={{ color: "var(--muted)" }}>
              {hoveredEvent.retailer === "all" ? "All retailers" : hoveredEvent.retailer}
            </span>
          </div>
          <div className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1 pl-5 text-xs" style={{ color: "var(--muted)" }}>
            <span>
              Typical discount: {hoveredEvent.typicalDiscountRange[0]}–{hoveredEvent.typicalDiscountRange[1]}% off
            </span>
            <span>{hoveredEvent.durationDays} days</span>
          </div>
          {hoveredEvent.bestFor.length > 0 && (
            <div className="mt-1 pl-5 text-xs" style={{ color: "var(--muted)" }}>
              Best for: {hoveredEvent.bestFor.join(", ")}
            </div>
          )}
          {hoveredEvent.note && (
            <p className="mt-1.5 pl-5 text-xs" style={{ color: "var(--foreground)" }}>
              {hoveredEvent.note}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default SeasonalCalendar;
