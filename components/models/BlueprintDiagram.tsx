"use client";

interface BlueprintDiagramProps {
  readonly displaySize: number;
  readonly weight: number;
  readonly lineup: string;
  readonly series: string;
}

const getDimensions = (displaySize: number, weight: number) => {
  const widthMm = Math.round(displaySize * 22.5);
  const depthMm = Math.round(displaySize * 15.8);
  const heightMm = weight < 1.3 ? 15 : weight < 1.8 ? 18 : weight < 2.5 ? 21 : 25;
  return { widthMm, depthMm, heightMm };
};

const LINE_COLOR = "#525252";
const SUBTLE_COLOR = "#393939";
const SCREEN_FILL = "#1a1a1a";
const TRACKPOINT_RED = "#da1e28";
const ACCENT = "var(--accent)";
const FONT = "'IBM Plex Mono', 'Courier New', monospace";

export const BlueprintDiagram = ({ displaySize, weight, lineup }: BlueprintDiagramProps) => {
  const { widthMm, depthMm, heightMm } = getDimensions(displaySize, weight);

  // Volume estimate in liters
  const volumeL = ((widthMm * depthMm * heightMm) / 1000000).toFixed(1);

  // Compact SVG coordinate system — tightly cropped
  const viewW = 280;
  const viewH = 220;

  // Chassis proportions mapped to SVG space — smaller footprint
  const ratio = widthMm / depthMm;
  const chassisW = 170;
  const chassisH = Math.round(chassisW / ratio);

  // Center chassis with room for labels
  const chassisX = 30;
  const chassisY = 16;

  // Screen area (80% width, 85% depth, offset toward top)
  const screenMarginX = chassisW * 0.1;
  const screenMarginTop = chassisH * 0.05;
  const screenW = chassisW * 0.8;
  const screenH = chassisH * 0.85;
  const screenX = chassisX + screenMarginX;
  const screenY = chassisY + screenMarginTop;

  // Measurement line positions
  const widthLineY = chassisY + chassisH + 20;
  const depthLineX = chassisX + chassisW + 20;
  const endCapSize = 4;

  // Width dimension label gap
  const widthLabelGap = 28;

  // Depth dimension label gap
  const depthLabelGap = 14;

  // Side profile view — below width measurement
  const sideProfileY = widthLineY + 32;
  const sideProfileMaxH = 10;
  const sideProfileH = Math.round((heightMm / 25) * sideProfileMaxH);

  return (
    <div className="flex flex-col items-center gap-2">
      {/* Blueprint SVG — compact */}
      <svg
        viewBox={`0 0 ${viewW} ${viewH}`}
        xmlns="http://www.w3.org/2000/svg"
        className="h-auto w-full max-w-xs"
        role="img"
        aria-label={`Blueprint: ${widthMm} × ${depthMm} × ${heightMm} mm, ${weight} kg`}
      >
        {/* Subtle grid dots */}
        <defs>
          <pattern id="blueprint-grid" width="16" height="16" patternUnits="userSpaceOnUse">
            <circle cx="8" cy="8" r="0.3" fill="#2a2a2a" />
          </pattern>
        </defs>
        <rect width={viewW} height={viewH} fill="url(#blueprint-grid)" />

        {/* Chassis outline */}
        <rect
          x={chassisX}
          y={chassisY}
          width={chassisW}
          height={chassisH}
          rx={4}
          fill="none"
          stroke={LINE_COLOR}
          strokeWidth={1.5}
        />

        {/* Screen area */}
        <rect
          x={screenX}
          y={screenY}
          width={screenW}
          height={screenH}
          rx={2}
          fill={SCREEN_FILL}
          stroke={SUBTLE_COLOR}
          strokeWidth={0.8}
        />

        {/* Display size label centered in screen */}
        <text
          x={screenX + screenW / 2}
          y={screenY + screenH / 2}
          textAnchor="middle"
          dominantBaseline="central"
          fontSize={11}
          fontFamily={FONT}
          fill={LINE_COLOR}
        >
          {displaySize.toFixed(1)}&quot;
        </text>

        {/* Lineup-specific accents */}
        {lineup === "ThinkPad" && (
          <circle
            cx={chassisX + chassisW / 2}
            cy={screenY + screenH + (chassisY + chassisH - (screenY + screenH)) / 2}
            r={3.5}
            fill={TRACKPOINT_RED}
          />
        )}

        {lineup === "Legion" && (
          <g>
            {[0, 5, 10].map((offset) => (
              <line
                key={`vent-l-${offset}`}
                x1={chassisX + 20 + offset}
                y1={chassisY}
                x2={chassisX + 20 + offset}
                y2={chassisY - 4}
                stroke={SUBTLE_COLOR}
                strokeWidth={0.8}
              />
            ))}
            {[0, 5, 10].map((offset) => (
              <line
                key={`vent-r-${offset}`}
                x1={chassisX + chassisW - 30 + offset}
                y1={chassisY}
                x2={chassisX + chassisW - 30 + offset}
                y2={chassisY - 4}
                stroke={SUBTLE_COLOR}
                strokeWidth={0.8}
              />
            ))}
          </g>
        )}

        {lineup === "IdeaPad Pro" && (
          <line
            x1={chassisX + 10}
            y1={chassisY + chassisH}
            x2={chassisX + chassisW - 10}
            y2={chassisY + chassisH}
            stroke={ACCENT}
            strokeWidth={0.8}
          />
        )}

        {/* Width measurement line (below chassis) */}
        <g>
          <line
            x1={chassisX}
            y1={widthLineY - endCapSize}
            x2={chassisX}
            y2={widthLineY + endCapSize}
            stroke={ACCENT}
            strokeWidth={0.8}
          />
          <line
            x1={chassisX + chassisW}
            y1={widthLineY - endCapSize}
            x2={chassisX + chassisW}
            y2={widthLineY + endCapSize}
            stroke={ACCENT}
            strokeWidth={0.8}
          />
          <line
            x1={chassisX}
            y1={widthLineY}
            x2={chassisX + chassisW / 2 - widthLabelGap}
            y2={widthLineY}
            stroke={ACCENT}
            strokeWidth={0.8}
          />
          <line
            x1={chassisX + chassisW / 2 + widthLabelGap}
            y1={widthLineY}
            x2={chassisX + chassisW}
            y2={widthLineY}
            stroke={ACCENT}
            strokeWidth={0.8}
          />
          <text
            x={chassisX + chassisW / 2}
            y={widthLineY + 1}
            textAnchor="middle"
            dominantBaseline="central"
            fontSize={10}
            fontFamily={FONT}
            fill={ACCENT}
          >
            {widthMm} mm
          </text>
        </g>

        {/* Depth measurement line (right of chassis) */}
        <g>
          <line
            x1={depthLineX - endCapSize}
            y1={chassisY}
            x2={depthLineX + endCapSize}
            y2={chassisY}
            stroke={ACCENT}
            strokeWidth={0.8}
          />
          <line
            x1={depthLineX - endCapSize}
            y1={chassisY + chassisH}
            x2={depthLineX + endCapSize}
            y2={chassisY + chassisH}
            stroke={ACCENT}
            strokeWidth={0.8}
          />
          <line
            x1={depthLineX}
            y1={chassisY}
            x2={depthLineX}
            y2={chassisY + chassisH / 2 - depthLabelGap}
            stroke={ACCENT}
            strokeWidth={0.8}
          />
          <line
            x1={depthLineX}
            y1={chassisY + chassisH / 2 + depthLabelGap}
            x2={depthLineX}
            y2={chassisY + chassisH}
            stroke={ACCENT}
            strokeWidth={0.8}
          />
          <text
            x={depthLineX + 8}
            y={chassisY + chassisH / 2}
            dominantBaseline="central"
            fontSize={10}
            fontFamily={FONT}
            fill={ACCENT}
          >
            {depthMm} mm
          </text>
        </g>

        {/* Side Profile View */}
        <g>
          <text x={chassisX} y={sideProfileY - 6} fontSize={9} fontFamily={FONT} fill={SUBTLE_COLOR}>
            Side Profile
          </text>
          <rect
            x={chassisX}
            y={sideProfileY}
            width={chassisW}
            height={sideProfileH}
            rx={2}
            fill="none"
            stroke={LINE_COLOR}
            strokeWidth={1.2}
          />
          <text
            x={chassisX + chassisW + 8}
            y={sideProfileY + sideProfileH / 2}
            dominantBaseline="central"
            fontSize={10}
            fontFamily={FONT}
            fill={ACCENT}
          >
            {heightMm} mm
          </text>
        </g>
      </svg>

      {/* Summary row — weight + dimensions + volume */}
      <div
        className="flex flex-wrap items-center justify-center gap-x-2 gap-y-0.5 font-mono text-xs"
        style={{ color: "var(--muted)" }}
      >
        <span className="font-medium" style={{ color: "var(--foreground)" }}>
          {weight} kg
        </span>
        <span style={{ color: "#393939" }}>|</span>
        <span>
          {widthMm} × {depthMm} × {heightMm} mm
        </span>
        <span style={{ color: "#393939" }}>|</span>
        <span>{volumeL} L</span>
      </div>
    </div>
  );
};
