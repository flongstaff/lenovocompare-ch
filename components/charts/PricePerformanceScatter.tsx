"use client";

import React, { useState, useRef, useMemo, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { computeEfficiencyFrontier, mapRange, clamp } from "@/lib/chart-utils";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface ScatterDataPoint {
  readonly id: string;
  readonly name: string;
  readonly lineup: string;
  readonly price: number;
  readonly perf: number;
  readonly cpu?: string;
  readonly ram?: string;
  readonly display?: string;
  readonly msrp?: number;
  readonly dimensions?: {
    readonly cpu: number;
    readonly gpu: number;
    readonly memory: number;
    readonly display: number;
    readonly connectivity: number;
    readonly portability: number;
  };
}

interface PricePerformanceScatterProps {
  readonly models: readonly ScatterDataPoint[];
}

interface ZoomDomain {
  readonly xMin: number;
  readonly xMax: number;
  readonly yMin: number;
  readonly yMax: number;
}

interface DragRect {
  readonly startX: number;
  readonly startY: number;
  readonly currentX: number;
  readonly currentY: number;
}

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const LINEUP_COLORS: Record<string, string> = {
  ThinkPad: "#0f62fe",
  "IdeaPad Pro": "#be95ff",
  Legion: "#42be65",
} as const;

const DIMENSION_ENTRIES = [
  { key: "cpu", label: "CPU", color: "#4589ff" },
  { key: "gpu", label: "GPU", color: "#42be65" },
  { key: "memory", label: "Mem", color: "#be95ff" },
  { key: "display", label: "Disp", color: "#ee5396" },
  { key: "connectivity", label: "Conn", color: "#08bdba" },
  { key: "portability", label: "Port", color: "#f1c21b" },
] as const;

const scoreColor = (score: number): string => {
  if (score >= 80) return "#42be65";
  if (score >= 60) return "#f1c21b";
  if (score >= 40) return "#ff832b";
  return "#da1e28";
};

const MARGIN = { top: 20, right: 20, bottom: 40, left: 50 } as const;
const CHART_HEIGHT = 300;
const DEFAULT_OPACITY = 0.75;
const DIM_OPACITY = 0.4;
const SIBLING_OPACITY = 0.85;

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

const niceStep = (range: number, targetTicks: number): number => {
  const rough = range / targetTicks;
  const pow = Math.pow(10, Math.floor(Math.log10(rough)));
  const normalized = rough / pow;
  const nice = normalized < 1.5 ? 1 : normalized < 3 ? 2 : normalized < 7 ? 5 : 10;
  return nice * pow;
};

const niceRange = (min: number, max: number, targetTicks: number): readonly number[] => {
  const step = niceStep(max - min, targetTicks);
  const start = Math.floor(min / step) * step;
  const end = Math.ceil(max / step) * step;
  const ticks: number[] = [];
  for (let v = start; v <= end + step * 0.01; v += step) {
    ticks.push(Math.round(v * 100) / 100);
  }
  return ticks;
};

const scoreLabel = (perf: number): string => {
  if (perf >= 90) return "Excellent";
  if (perf >= 75) return "Good";
  if (perf >= 60) return "Fair";
  if (perf >= 40) return "Below avg";
  return "Poor";
};

const buildFrontierPath = (
  points: readonly ScatterDataPoint[],
  xScale: (v: number) => number,
  yScale: (v: number) => number,
  plotBottom: number,
): string => {
  if (points.length === 0) return "";
  if (points.length === 1) {
    const x = xScale(points[0].price);
    const y = yScale(points[0].perf);
    return `M${x},${plotBottom} L${x},${y} L${x},${plotBottom} Z`;
  }

  const sorted = [...points].sort((a, b) => a.price - b.price);
  const coords = sorted.map((p) => ({ x: xScale(p.price), y: yScale(p.perf) }));

  // Build the upper curve (quadratic bezier between frontier points)
  let path = `M${coords[0].x},${coords[0].y}`;
  for (let i = 1; i < coords.length; i++) {
    const prev = coords[i - 1];
    const curr = coords[i];
    const cpx = (prev.x + curr.x) / 2;
    path += ` Q${cpx},${prev.y} ${curr.x},${curr.y}`;
  }

  // Close below to form fill area
  path += ` L${coords[coords.length - 1].x},${plotBottom}`;
  path += ` L${coords[0].x},${plotBottom} Z`;
  return path;
};

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export const PricePerformanceScatter = ({ models }: PricePerformanceScatterProps) => {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const [width, setWidth] = useState(600);
  const [activeLineups, setActiveLineups] = useState<Set<string>>(() => new Set(Object.keys(LINEUP_COLORS)));
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [tooltip, setTooltip] = useState<{ model: ScatterDataPoint; x: number; y: number } | null>(null);
  const [zoom, setZoom] = useState<ZoomDomain | null>(null);
  const [drag, setDrag] = useState<DragRect | null>(null);
  const hasInitRef = useRef(false);
  const pointersRef = useRef<Map<number, { x: number; y: number }>>(new Map());
  const pinchStartDistRef = useRef<number | null>(null);
  const pinchStartDomainRef = useRef<ZoomDomain | null>(null);

  /* Measure container width */
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

  /* Plot area */
  const plotW = width - MARGIN.left - MARGIN.right;
  const plotH = CHART_HEIGHT - MARGIN.top - MARGIN.bottom;

  /* Domain */
  const fullDomain = useMemo((): ZoomDomain => {
    const prices = models.map((m) => m.price);
    const padX = (Math.max(...prices) - Math.min(...prices)) * 0.05 || 50;
    return {
      xMin: Math.min(...prices) - padX,
      xMax: Math.max(...prices) + padX,
      yMin: 0,
      yMax: 100,
    };
  }, [models]);

  const domain = zoom ?? fullDomain;

  /* Scales */
  const xScale = useCallback(
    (v: number) => MARGIN.left + ((v - domain.xMin) / (domain.xMax - domain.xMin)) * plotW,
    [domain, plotW],
  );
  const yScale = useCallback(
    (v: number) => MARGIN.top + plotH - ((v - domain.yMin) / (domain.yMax - domain.yMin)) * plotH,
    [domain, plotH],
  );

  /* Ticks */
  const xTicks = useMemo(() => niceRange(domain.xMin, domain.xMax, 6), [domain]);
  const yTicks = useMemo(() => niceRange(domain.yMin, domain.yMax, 5), [domain]);

  /* Frontier */
  const frontier = useMemo(() => computeEfficiencyFrontier(models), [models]);
  const frontierPath = useMemo(
    () => buildFrontierPath(frontier, xScale, yScale, MARGIN.top + plotH),
    [frontier, xScale, yScale, plotH],
  );

  /* Visible models */
  const visibleModels = useMemo(() => models.filter((m) => activeLineups.has(m.lineup)), [models, activeLineups]);

  /* Value zone boundaries (price 33rd/66th percentiles of visible models) */
  const valueZones = useMemo(() => {
    if (visibleModels.length < 3) return null;
    const sorted = [...visibleModels].map((m) => m.price).sort((a, b) => a - b);
    const p33 = sorted[Math.floor(sorted.length / 3)];
    const p66 = sorted[Math.floor((sorted.length * 2) / 3)];
    return { p33, p66 };
  }, [visibleModels]);

  /* Toggle lineup */
  const toggleLineup = (lineup: string) => {
    setActiveLineups((prev) => {
      const next = new Set(prev);
      if (next.has(lineup)) next.delete(lineup);
      else next.add(lineup);
      return next;
    });
  };

  /* Hover handlers */
  const handleMouseEnter = (model: ScatterDataPoint, e: React.MouseEvent<SVGCircleElement>) => {
    setHoveredId(model.id);
    const rect = containerRef.current?.getBoundingClientRect();
    if (rect) {
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      setTooltip({ model, x, y });
    }
  };

  const handleMouseLeave = () => {
    setHoveredId(null);
    setTooltip(null);
  };

  /* Click handler */
  const handleClick = (model: ScatterDataPoint) => {
    router.push(`/model/${model.id}`);
  };

  /* Pointer helpers */
  const getSvgCoords = (e: React.PointerEvent<SVGSVGElement>) => {
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect) return null;
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const getPinchDist = (): number | null => {
    const pts = Array.from(pointersRef.current.values());
    if (pts.length < 2) return null;
    return Math.hypot(pts[1].x - pts[0].x, pts[1].y - pts[0].y);
  };

  const getPinchMidpoint = (): { x: number; y: number } | null => {
    const pts = Array.from(pointersRef.current.values());
    if (pts.length < 2) return null;
    return { x: (pts[0].x + pts[1].x) / 2, y: (pts[0].y + pts[1].y) / 2 };
  };

  /* Drag-to-zoom + pinch-to-zoom (pointer events) */
  const handlePointerDown = (e: React.PointerEvent<SVGSVGElement>) => {
    const coords = getSvgCoords(e);
    if (!coords) return;
    pointersRef.current.set(e.pointerId, coords);
    (e.target as Element).setPointerCapture?.(e.pointerId);

    if (pointersRef.current.size === 2) {
      // Start pinch — cancel any drag
      setDrag(null);
      pinchStartDistRef.current = getPinchDist();
      pinchStartDomainRef.current = zoom ?? fullDomain;
    } else if (pointersRef.current.size === 1 && e.button === 0) {
      // Single pointer drag
      const { x, y } = coords;
      if (x < MARGIN.left || x > width - MARGIN.right || y < MARGIN.top || y > CHART_HEIGHT - MARGIN.bottom) return;
      setDrag({ startX: x, startY: y, currentX: x, currentY: y });
    }
  };

  const handlePointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    const coords = getSvgCoords(e);
    if (!coords) return;
    pointersRef.current.set(e.pointerId, coords);

    if (pointersRef.current.size >= 2 && pinchStartDistRef.current && pinchStartDomainRef.current) {
      // Pinch zoom
      const currentDist = getPinchDist();
      if (!currentDist || currentDist === 0) return;
      const scale = pinchStartDistRef.current / currentDist;
      const mid = getPinchMidpoint();
      if (!mid) return;

      const d = pinchStartDomainRef.current;
      // Convert midpoint to domain coordinates
      const mx = d.xMin + ((mid.x - MARGIN.left) / plotW) * (d.xMax - d.xMin);
      const my = d.yMin + ((MARGIN.top + plotH - mid.y) / plotH) * (d.yMax - d.yMin);

      setZoom({
        xMin: mx - (mx - d.xMin) * scale,
        xMax: mx + (d.xMax - mx) * scale,
        yMin: my - (my - d.yMin) * scale,
        yMax: my + (d.yMax - my) * scale,
      });
      return;
    }

    // Single pointer drag
    if (!drag || pointersRef.current.size !== 1) return;
    const x = clamp(coords.x, MARGIN.left, width - MARGIN.right);
    const y = clamp(coords.y, MARGIN.top, CHART_HEIGHT - MARGIN.bottom);
    setDrag({ ...drag, currentX: x, currentY: y });
  };

  const handlePointerUp = (e: React.PointerEvent<SVGSVGElement>) => {
    pointersRef.current.delete(e.pointerId);

    if (pinchStartDistRef.current) {
      // End pinch
      pinchStartDistRef.current = null;
      pinchStartDomainRef.current = null;
      if (pointersRef.current.size === 0) setDrag(null);
      return;
    }

    // End single pointer drag
    if (!drag) return;
    const dx = Math.abs(drag.currentX - drag.startX);
    const dy = Math.abs(drag.currentY - drag.startY);

    if (dx > 10 && dy > 10) {
      const x1 = Math.min(drag.startX, drag.currentX);
      const x2 = Math.max(drag.startX, drag.currentX);
      const y1 = Math.min(drag.startY, drag.currentY);
      const y2 = Math.max(drag.startY, drag.currentY);

      const xMin = domain.xMin + ((x1 - MARGIN.left) / plotW) * (domain.xMax - domain.xMin);
      const xMax = domain.xMin + ((x2 - MARGIN.left) / plotW) * (domain.xMax - domain.xMin);
      const yMax = domain.yMin + ((MARGIN.top + plotH - y1) / plotH) * (domain.yMax - domain.yMin);
      const yMin = domain.yMin + ((MARGIN.top + plotH - y2) / plotH) * (domain.yMax - domain.yMin);

      setZoom({ xMin, xMax, yMin, yMax });
    }
    setDrag(null);
  };

  /* Dot opacity */
  const dotOpacity = (model: ScatterDataPoint): number => {
    if (!hoveredId) return DEFAULT_OPACITY;
    if (model.id === hoveredId) return 1;
    const hovered = models.find((m) => m.id === hoveredId);
    if (hovered && hovered.lineup === model.lineup) return SIBLING_OPACITY;
    return DIM_OPACITY;
  };

  /* Tooltip position clamped */
  const tooltipStyle = useMemo(() => {
    if (!tooltip) return { display: "none" as const };
    const tx = clamp(tooltip.x + 12, 0, width - 210);
    const ty = clamp(tooltip.y - 60, 0, CHART_HEIGHT - 60);
    return { left: tx, top: ty, display: "block" as const };
  }, [tooltip, width]);

  return (
    <div ref={containerRef} className="relative w-full">
      {/* Lineup filter toggles */}
      <div className="mb-2 flex items-center gap-2">
        {Object.entries(LINEUP_COLORS).map(([lineup, color]) => {
          const active = activeLineups.has(lineup);
          return (
            <button
              key={lineup}
              onClick={() => toggleLineup(lineup)}
              className="flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] transition-colors"
              style={{
                borderColor: active ? color : "#525252",
                background: active ? `${color}20` : "transparent",
                color: active ? color : "#6f6f6f",
              }}
            >
              <span className="inline-block h-2 w-2 rounded-full" style={{ background: active ? color : "#525252" }} />
              {lineup}
            </button>
          );
        })}
        {zoom && (
          <button
            onClick={() => setZoom(null)}
            className="ml-auto rounded border border-carbon-600 px-2 py-0.5 text-[10px] text-carbon-400 transition-colors hover:border-carbon-400 hover:text-carbon-200"
          >
            Reset zoom
          </button>
        )}
      </div>

      {/* SVG Chart */}
      <svg
        ref={svgRef}
        width={width}
        height={CHART_HEIGHT}
        viewBox={`0 0 ${width} ${CHART_HEIGHT}`}
        className="select-none"
        style={{ touchAction: "none" }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={() => {
          pointersRef.current.clear();
          pinchStartDistRef.current = null;
          pinchStartDomainRef.current = null;
          setDrag(null);
          handleMouseLeave();
        }}
      >
        <defs>
          {/* Glow filters */}
          {Object.entries(LINEUP_COLORS).map(([lineup, color]) => (
            <filter key={lineup} id={`glow-${lineup.replace(/\s/g, "")}`} x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="blur" />
              <feFlood floodColor={color} floodOpacity="0.6" result="color" />
              <feComposite in="color" in2="blur" operator="in" result="glow" />
              <feMerge>
                <feMergeNode in="glow" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          ))}
          {/* Value zone gradients */}
          <linearGradient id="zone-great" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#42be65" stopOpacity={0.07} />
            <stop offset="100%" stopColor="#42be65" stopOpacity={0.02} />
          </linearGradient>
          <linearGradient id="zone-fair" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f1c21b" stopOpacity={0.05} />
            <stop offset="100%" stopColor="#f1c21b" stopOpacity={0.02} />
          </linearGradient>
          <linearGradient id="zone-premium" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#be95ff" stopOpacity={0.07} />
            <stop offset="100%" stopColor="#be95ff" stopOpacity={0.02} />
          </linearGradient>
        </defs>

        {/* Grid lines */}
        {xTicks.map((v) => {
          const x = xScale(v);
          if (x < MARGIN.left || x > width - MARGIN.right) return null;
          return (
            <line
              key={`gx-${v}`}
              x1={x}
              y1={MARGIN.top}
              x2={x}
              y2={MARGIN.top + plotH}
              stroke="#393939"
              strokeDasharray="3 3"
            />
          );
        })}
        {yTicks.map((v) => {
          const y = yScale(v);
          if (y < MARGIN.top || y > MARGIN.top + plotH) return null;
          return (
            <line
              key={`gy-${v}`}
              x1={MARGIN.left}
              y1={y}
              x2={MARGIN.left + plotW}
              y2={y}
              stroke="#393939"
              strokeDasharray="3 3"
            />
          );
        })}

        {/* Axes */}
        <line x1={MARGIN.left} y1={MARGIN.top} x2={MARGIN.left} y2={MARGIN.top + plotH} stroke="#525252" />
        <line
          x1={MARGIN.left}
          y1={MARGIN.top + plotH}
          x2={MARGIN.left + plotW}
          y2={MARGIN.top + plotH}
          stroke="#525252"
        />

        {/* X tick labels */}
        {xTicks.map((v) => {
          const x = xScale(v);
          if (x < MARGIN.left || x > width - MARGIN.right) return null;
          return (
            <text key={`xt-${v}`} x={x} y={MARGIN.top + plotH + 14} textAnchor="middle" fill="#a8a8a8" fontSize={10}>
              {Math.round(v)}
            </text>
          );
        })}

        {/* Y tick labels */}
        {yTicks.map((v) => {
          const y = yScale(v);
          if (y < MARGIN.top || y > MARGIN.top + plotH) return null;
          return (
            <text key={`yt-${v}`} x={MARGIN.left - 8} y={y + 3} textAnchor="end" fill="#a8a8a8" fontSize={10}>
              {Math.round(v)}
            </text>
          );
        })}

        {/* Axis labels */}
        <text x={MARGIN.left + plotW / 2} y={CHART_HEIGHT - 4} textAnchor="middle" fill="#a8a8a8" fontSize={11}>
          Price (CHF)
        </text>
        <text
          x={12}
          y={MARGIN.top + plotH / 2}
          textAnchor="middle"
          fill="#a8a8a8"
          fontSize={11}
          transform={`rotate(-90, 12, ${MARGIN.top + plotH / 2})`}
        >
          Performance
        </text>

        {/* Efficiency frontier fill + line */}
        {frontierPath && (
          <>
            <path d={frontierPath} fill="#525252" fillOpacity={0.08} stroke="none" data-frontier />
            <path d={frontierPath} fill="none" stroke="#525252" strokeWidth={1.5} strokeDasharray="6 3" data-frontier />
          </>
        )}

        {/* Value zones */}
        {valueZones &&
          (() => {
            const plotLeft = MARGIN.left;
            const plotTop = MARGIN.top;
            const plotRight = MARGIN.left + plotW;
            const x33 = clamp(xScale(valueZones.p33), plotLeft, plotRight);
            const x66 = clamp(xScale(valueZones.p66), plotLeft, plotRight);
            const zones = [
              { x: plotLeft, w: x33 - plotLeft, fill: "url(#zone-great)", label: "Great Value" },
              { x: x33, w: x66 - x33, fill: "url(#zone-fair)", label: "Fair" },
              { x: x66, w: plotRight - x66, fill: "url(#zone-premium)", label: "Premium" },
            ] as const;
            return zones.map((z) =>
              z.w > 0 ? (
                <g key={z.label} data-zone={z.label} pointerEvents="none">
                  <rect x={z.x} y={plotTop} width={z.w} height={plotH} fill={z.fill} />
                  <text x={z.x + 4} y={plotTop + 12} fontSize={9} fill="#a8a8a8" fillOpacity={0.4}>
                    {z.label}
                  </text>
                </g>
              ) : null,
            );
          })()}

        {/* Data points */}
        <AnimatePresence>
          {visibleModels.map((model, i) => {
            const cx = xScale(model.price);
            const cy = yScale(model.perf);
            const r = mapRange(model.perf, 20, 100, 3.5, 7);
            const isHovered = hoveredId === model.id;
            const color = LINEUP_COLORS[model.lineup] ?? "#a8a8a8";
            const filterName = `glow-${model.lineup.replace(/\s/g, "")}`;

            return (
              <motion.circle
                key={model.id}
                data-model-id={model.id}
                cx={cx}
                cy={cy}
                r={isHovered ? r * 1.3 : r}
                fill={color}
                opacity={dotOpacity(model)}
                filter={isHovered ? `url(#${filterName})` : undefined}
                cursor="pointer"
                initial={{ opacity: 0, r: 0 }}
                animate={{ opacity: dotOpacity(model), r: isHovered ? r * 1.3 : r }}
                exit={{ opacity: 0, r: 0 }}
                transition={{ duration: 0.3, delay: i * 0.03 }}
                onMouseEnter={(e) => handleMouseEnter(model, e as unknown as React.MouseEvent<SVGCircleElement>)}
                onMouseLeave={handleMouseLeave}
                onClick={() => handleClick(model)}
              />
            );
          })}
        </AnimatePresence>

        {/* Drag selection rectangle */}
        {drag && (
          <rect
            x={Math.min(drag.startX, drag.currentX)}
            y={Math.min(drag.startY, drag.currentY)}
            width={Math.abs(drag.currentX - drag.startX)}
            height={Math.abs(drag.currentY - drag.startY)}
            fill="rgba(15, 98, 254, 0.08)"
            stroke="#0f62fe"
            strokeWidth={1}
            strokeDasharray="4 2"
            pointerEvents="none"
          />
        )}
      </svg>

      {/* Tooltip */}
      {tooltip && (
        <div
          className="pointer-events-none absolute z-10 rounded border px-3 py-2 text-xs"
          style={{
            ...tooltipStyle,
            background: "#262626",
            borderColor: "#525252",
            minWidth: 200,
          }}
        >
          <p className="mb-1 font-medium text-carbon-100">{tooltip.model.name}</p>
          <span
            className="mb-1 inline-block rounded-full px-1.5 py-0.5 text-[9px] font-medium"
            style={{
              background: `${LINEUP_COLORS[tooltip.model.lineup] ?? "#525252"}30`,
              color: LINEUP_COLORS[tooltip.model.lineup] ?? "#a8a8a8",
            }}
          >
            {tooltip.model.lineup}
          </span>
          {(tooltip.model.cpu || tooltip.model.ram || tooltip.model.display) && (
            <p className="mt-1 text-[10px] text-carbon-400">
              {[tooltip.model.cpu, tooltip.model.ram, tooltip.model.display].filter(Boolean).join(" · ")}
            </p>
          )}
          <p className="mt-0.5 text-carbon-400">
            CHF {tooltip.model.price.toLocaleString("de-CH")}
            {tooltip.model.msrp && tooltip.model.msrp !== tooltip.model.price && (
              <span className="ml-1 text-carbon-500 line-through">{tooltip.model.msrp.toLocaleString("de-CH")}</span>
            )}
            {" · "}Score {tooltip.model.perf} ({scoreLabel(tooltip.model.perf)})
          </p>
          {tooltip.model.dimensions && (
            <div className="mt-1.5 space-y-0.5">
              {DIMENSION_ENTRIES.map((d) => {
                const val = tooltip.model.dimensions![d.key as keyof typeof tooltip.model.dimensions];
                return (
                  <div key={d.key} className="flex items-center gap-1.5">
                    <span className="w-7 text-[9px] text-carbon-500">{d.label}</span>
                    <div className="h-1 flex-1 overflow-hidden rounded-full bg-carbon-700">
                      <div className="h-full rounded-full" style={{ width: `${val}%`, background: d.color }} />
                    </div>
                    <span className="w-5 text-right font-mono text-[9px]" style={{ color: scoreColor(val) }}>
                      {val}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Legend */}
      <div className="mt-2 flex items-center justify-center gap-4">
        {Object.entries(LINEUP_COLORS).map(([lineup, color]) => (
          <div key={lineup} className="flex items-center gap-1.5">
            <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: color }} />
            <span className="text-[10px] text-carbon-400">{lineup}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
