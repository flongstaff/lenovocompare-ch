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

  const w = 720;
  const padding = { top: 30, bottom: 60, left: 10, right: 10 };
  const chartW = w - padding.left - padding.right;
  const monthW = chartW / 12;
  const laneH = 18;

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
  const totalH = padding.top + (maxLane + 1) * (laneH + 4) + padding.bottom;

  return (
    <div className="carbon-card overflow-hidden p-4">
      <h3 className="mb-3 text-sm font-semibold" style={{ color: "var(--foreground)" }}>
        Swiss Sale Calendar
      </h3>
      <div className="overflow-x-auto">
        <svg width={w} height={totalH} viewBox={`0 0 ${w} ${totalH}`} className="min-w-[600px]">
          {MONTHS.map((month, i) => {
            const x = padding.left + i * monthW;
            const isCurrent = i === currentMonth;
            return (
              <g key={month}>
                {isCurrent && (
                  <rect
                    x={x}
                    y={padding.top - 5}
                    width={monthW}
                    height={totalH - padding.top - padding.bottom + 15}
                    fill="#4589ff"
                    opacity={0.08}
                    rx={4}
                  />
                )}
                <line
                  x1={x}
                  y1={padding.top}
                  x2={x}
                  y2={totalH - padding.bottom + 10}
                  stroke="var(--border-subtle)"
                  strokeWidth={0.5}
                  opacity={0.4}
                />
                <text
                  x={x + monthW / 2}
                  y={padding.top - 10}
                  textAnchor="middle"
                  fill={isCurrent ? "#4589ff" : "var(--muted)"}
                  fontSize={11}
                  fontWeight={isCurrent ? 600 : 400}
                  fontFamily="var(--font-geist-sans)"
                >
                  {month}
                </text>
                {isCurrent && (
                  <text
                    x={x + monthW / 2}
                    y={totalH - padding.bottom + 25}
                    textAnchor="middle"
                    fill="#4589ff"
                    fontSize={9}
                    fontWeight={600}
                    fontFamily="var(--font-geist-sans)"
                  >
                    ▲ NOW
                  </text>
                )}
              </g>
            );
          })}
          {lanes.map(({ event, lane }) => {
            const startX = padding.left + (event.typicalMonth - 1) * monthW;
            const barW = Math.max(monthW * 0.3, (event.durationDays / 30) * monthW);
            const y = padding.top + lane * (laneH + 4);
            const color = eventColors[event.retailer] ?? "#a8a8a8";
            const isHovered = hoveredEvent?.id === event.id;
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
                  fill={color}
                  opacity={isHovered ? 0.9 : 0.6}
                />
                <text
                  x={startX + 6}
                  y={y + laneH / 2 + 1}
                  dominantBaseline="central"
                  fill="white"
                  fontSize={9}
                  fontWeight={500}
                  fontFamily="var(--font-geist-sans)"
                >
                  {event.name.length > barW / 6 ? event.name.slice(0, Math.floor(barW / 6)) + "…" : event.name}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
      {hoveredEvent && (
        <div
          className="mt-3 border px-3 py-2 text-xs"
          style={{ borderColor: "var(--border-subtle)", background: "var(--surface-alt)" }}
        >
          <div className="flex items-center gap-2">
            <span className="font-semibold" style={{ color: "var(--foreground)" }}>
              {hoveredEvent.name}
            </span>
            <span style={{ color: "var(--muted)" }}>
              {hoveredEvent.retailer === "all" ? "All retailers" : hoveredEvent.retailer}
            </span>
          </div>
          <div className="mt-1" style={{ color: "var(--muted)" }}>
            Typical discount: {hoveredEvent.typicalDiscountRange[0]}–{hoveredEvent.typicalDiscountRange[1]}% off ·{" "}
            {hoveredEvent.durationDays} days
          </div>
          {hoveredEvent.bestFor.length > 0 && (
            <div className="mt-1" style={{ color: "var(--muted)" }}>
              Best for: {hoveredEvent.bestFor.join(", ")}
            </div>
          )}
          {hoveredEvent.note && (
            <p className="mt-1" style={{ color: "var(--foreground)" }}>
              {hoveredEvent.note}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default SeasonalCalendar;
