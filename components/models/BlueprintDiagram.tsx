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
  const heightMm =
    weight < 1.3 ? 15 : weight < 1.8 ? 18 : weight < 2.5 ? 21 : 25;
  return { widthMm, depthMm, heightMm };
};

const LINE_COLOR = "#525252";
const SUBTLE_COLOR = "#393939";
const SCREEN_FILL = "#1a1a1a";
const TRACKPOINT_RED = "#da1e28";
const ACCENT = "var(--accent)";
const FONT = "'IBM Plex Mono', 'Courier New', monospace";

export const BlueprintDiagram = ({
  displaySize,
  weight,
  lineup,
}: BlueprintDiagramProps) => {
  const { widthMm, depthMm, heightMm } = getDimensions(displaySize, weight);

  // SVG coordinate system
  const viewW = 300;
  const viewH = 240;

  // Chassis proportions mapped to SVG space
  const ratio = widthMm / depthMm;
  const chassisW = 190;
  const chassisH = Math.round(chassisW / ratio);

  // Center chassis with room for labels
  const chassisX = 40;
  const chassisY = 20;

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
  const endCapSize = 3;

  // Height indicator position
  const heightBarX = depthLineX - 5;
  const heightBarY = chassisY + chassisH + 12;
  const maxHeightBarW = 40;
  const heightBarW = Math.round((heightMm / 25) * maxHeightBarW);

  return (
    <svg
      viewBox={`0 0 ${viewW} ${viewH}`}
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-auto"
      role="img"
      aria-label={`Blueprint diagram: ${widthMm}mm x ${depthMm}mm x ${heightMm}mm, ${weight}kg`}
    >
      {/* Grid dots for engineering feel */}
      <defs>
        <pattern
          id="blueprint-grid"
          width="20"
          height="20"
          patternUnits="userSpaceOnUse"
        >
          <circle cx="10" cy="10" r="0.3" fill="#333333" />
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
        strokeWidth={1}
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
        strokeWidth={0.5}
      />

      {/* Display size label centered in screen */}
      <text
        x={screenX + screenW / 2}
        y={screenY + screenH / 2}
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={10}
        fontFamily={FONT}
        fill={LINE_COLOR}
      >
        {displaySize.toFixed(1)}&quot;
      </text>

      {/* Lineup-specific accents */}
      {lineup === "ThinkPad" && (
        <circle
          cx={chassisX + chassisW / 2}
          cy={
            screenY +
            screenH +
            (chassisY + chassisH - (screenY + screenH)) / 2
          }
          r={2.5}
          fill={TRACKPOINT_RED}
        />
      )}

      {lineup === "Legion" && (
        <g>
          {/* Left vent lines */}
          {[0, 4, 8].map((offset) => (
            <line
              key={`vent-l-${offset}`}
              x1={chassisX + 20 + offset}
              y1={chassisY}
              x2={chassisX + 20 + offset}
              y2={chassisY - 4}
              stroke={SUBTLE_COLOR}
              strokeWidth={0.75}
            />
          ))}
          {/* Right vent lines */}
          {[0, 4, 8].map((offset) => (
            <line
              key={`vent-r-${offset}`}
              x1={chassisX + chassisW - 28 + offset}
              y1={chassisY}
              x2={chassisX + chassisW - 28 + offset}
              y2={chassisY - 4}
              stroke={SUBTLE_COLOR}
              strokeWidth={0.75}
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
          strokeWidth={0.5}
        />
      )}

      {/* Width measurement line (below chassis) */}
      <g>
        {/* Left end-cap */}
        <line
          x1={chassisX}
          y1={widthLineY - endCapSize}
          x2={chassisX}
          y2={widthLineY + endCapSize}
          stroke={ACCENT}
          strokeWidth={0.75}
        />
        {/* Right end-cap */}
        <line
          x1={chassisX + chassisW}
          y1={widthLineY - endCapSize}
          x2={chassisX + chassisW}
          y2={widthLineY + endCapSize}
          stroke={ACCENT}
          strokeWidth={0.75}
        />
        {/* Left segment */}
        <line
          x1={chassisX}
          y1={widthLineY}
          x2={chassisX + chassisW / 2 - 24}
          y2={widthLineY}
          stroke={ACCENT}
          strokeWidth={0.5}
        />
        {/* Right segment */}
        <line
          x1={chassisX + chassisW / 2 + 24}
          y1={widthLineY}
          x2={chassisX + chassisW}
          y2={widthLineY}
          stroke={ACCENT}
          strokeWidth={0.5}
        />
        {/* Width label */}
        <text
          x={chassisX + chassisW / 2}
          y={widthLineY + 1}
          textAnchor="middle"
          dominantBaseline="central"
          fontSize={9}
          fontFamily={FONT}
          fill={ACCENT}
        >
          {widthMm} mm
        </text>
      </g>

      {/* Depth measurement line (right of chassis) */}
      <g>
        {/* Top end-cap */}
        <line
          x1={depthLineX - endCapSize}
          y1={chassisY}
          x2={depthLineX + endCapSize}
          y2={chassisY}
          stroke={ACCENT}
          strokeWidth={0.75}
        />
        {/* Bottom end-cap */}
        <line
          x1={depthLineX - endCapSize}
          y1={chassisY + chassisH}
          x2={depthLineX + endCapSize}
          y2={chassisY + chassisH}
          stroke={ACCENT}
          strokeWidth={0.75}
        />
        {/* Top segment */}
        <line
          x1={depthLineX}
          y1={chassisY}
          x2={depthLineX}
          y2={chassisY + chassisH / 2 - 16}
          stroke={ACCENT}
          strokeWidth={0.5}
        />
        {/* Bottom segment */}
        <line
          x1={depthLineX}
          y1={chassisY + chassisH / 2 + 16}
          x2={depthLineX}
          y2={chassisY + chassisH}
          stroke={ACCENT}
          strokeWidth={0.5}
        />
        {/* Depth label (rotated) */}
        <text
          x={depthLineX}
          y={chassisY + chassisH / 2}
          textAnchor="middle"
          dominantBaseline="central"
          fontSize={9}
          fontFamily={FONT}
          fill={ACCENT}
          transform={`rotate(-90, ${depthLineX}, ${chassisY + chassisH / 2})`}
        >
          {depthMm} mm
        </text>
      </g>

      {/* Height indicator (below depth label) */}
      <g>
        <line
          x1={heightBarX}
          y1={heightBarY}
          x2={heightBarX + heightBarW}
          y2={heightBarY}
          stroke={ACCENT}
          strokeWidth={1.5}
          strokeLinecap="round"
        />
        <text
          x={heightBarX + heightBarW + 5}
          y={heightBarY + 1}
          dominantBaseline="central"
          fontSize={8}
          fontFamily={FONT}
          fill={ACCENT}
        >
          {heightMm} mm
        </text>
      </g>

      {/* Weight label (bottom-left) */}
      <text
        x={chassisX}
        y={viewH - 10}
        fontSize={9}
        fontFamily={FONT}
        fill={LINE_COLOR}
      >
        {weight} kg
      </text>
    </svg>
  );
};
