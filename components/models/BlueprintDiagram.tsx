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

  // SVG coordinate system — wider to fit labels without clipping
  const viewW = 320;
  const viewH = 220;

  // Chassis proportions mapped to SVG space
  const ratio = widthMm / depthMm;
  const chassisW = 180;
  const chassisH = Math.round(chassisW / ratio);

  // Center chassis with room for labels on right and bottom
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
  const widthLineY = chassisY + chassisH + 18;
  const depthLineX = chassisX + chassisW + 18;
  const endCapSize = 3;

  // Height indicator — positioned below width line, aligned left
  const heightBarY = widthLineY + 18;
  const maxHeightBarW = 40;
  const heightBarW = Math.round((heightMm / 25) * maxHeightBarW);

  return (
    <div className="flex flex-col items-center gap-3">
      <svg
        viewBox={`0 0 ${viewW} ${viewH}`}
        xmlns="http://www.w3.org/2000/svg"
        className="h-auto w-full max-w-sm"
        role="img"
        aria-label={`Blueprint: ${widthMm} × ${depthMm} × ${heightMm} mm, ${weight} kg`}
      >
        {/* Subtle grid dots */}
        <defs>
          <pattern id="blueprint-grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <circle cx="10" cy="10" r="0.25" fill="#2a2a2a" />
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
            cy={screenY + screenH + (chassisY + chassisH - (screenY + screenH)) / 2}
            r={3}
            fill={TRACKPOINT_RED}
          />
        )}

        {lineup === "Legion" && (
          <g>
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
          <line
            x1={chassisX}
            y1={widthLineY - endCapSize}
            x2={chassisX}
            y2={widthLineY + endCapSize}
            stroke={ACCENT}
            strokeWidth={0.75}
          />
          <line
            x1={chassisX + chassisW}
            y1={widthLineY - endCapSize}
            x2={chassisX + chassisW}
            y2={widthLineY + endCapSize}
            stroke={ACCENT}
            strokeWidth={0.75}
          />
          <line
            x1={chassisX}
            y1={widthLineY}
            x2={chassisX + chassisW / 2 - 22}
            y2={widthLineY}
            stroke={ACCENT}
            strokeWidth={0.5}
          />
          <line
            x1={chassisX + chassisW / 2 + 22}
            y1={widthLineY}
            x2={chassisX + chassisW}
            y2={widthLineY}
            stroke={ACCENT}
            strokeWidth={0.5}
          />
          <text
            x={chassisX + chassisW / 2}
            y={widthLineY + 1}
            textAnchor="middle"
            dominantBaseline="central"
            fontSize={8}
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
            strokeWidth={0.75}
          />
          <line
            x1={depthLineX - endCapSize}
            y1={chassisY + chassisH}
            x2={depthLineX + endCapSize}
            y2={chassisY + chassisH}
            stroke={ACCENT}
            strokeWidth={0.75}
          />
          <line
            x1={depthLineX}
            y1={chassisY}
            x2={depthLineX}
            y2={chassisY + chassisH / 2 - 12}
            stroke={ACCENT}
            strokeWidth={0.5}
          />
          <line
            x1={depthLineX}
            y1={chassisY + chassisH / 2 + 12}
            x2={depthLineX}
            y2={chassisY + chassisH}
            stroke={ACCENT}
            strokeWidth={0.5}
          />
          <text
            x={depthLineX + 4}
            y={chassisY + chassisH / 2}
            dominantBaseline="central"
            fontSize={8}
            fontFamily={FONT}
            fill={ACCENT}
          >
            {depthMm}
          </text>
          <text
            x={depthLineX + 4}
            y={chassisY + chassisH / 2 + 10}
            dominantBaseline="central"
            fontSize={7}
            fontFamily={FONT}
            fill={ACCENT}
            opacity={0.6}
          >
            mm
          </text>
        </g>

        {/* Height indicator bar (below width line, left-aligned) */}
        <g>
          <line
            x1={chassisX}
            y1={heightBarY}
            x2={chassisX + heightBarW}
            y2={heightBarY}
            stroke={ACCENT}
            strokeWidth={1.5}
            strokeLinecap="round"
          />
          <text
            x={chassisX + heightBarW + 5}
            y={heightBarY + 1}
            dominantBaseline="central"
            fontSize={8}
            fontFamily={FONT}
            fill={ACCENT}
          >
            {heightMm} mm thick
          </text>
        </g>
      </svg>

      {/* Weight + summary row below the SVG */}
      <div className="flex items-center gap-4 font-mono text-xs text-carbon-400">
        <span>{weight} kg</span>
        <span className="text-carbon-600">|</span>
        <span>
          {widthMm} × {depthMm} × {heightMm} mm
        </span>
      </div>
    </div>
  );
};
