import { ImageResponse } from "next/og";
import { laptops } from "@/data/laptops";
import { getModelScores } from "@/lib/scoring";
import { LINEUP_COLORS } from "@/lib/constants";
import { priceBaselines } from "@/data/price-baselines";

export const runtime = "nodejs";
export const alt = "LenovoCompare CH — Model Details";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export const generateStaticParams = () => laptops.map((m) => ({ id: m.id }));

const ScoreBlock = ({ label, score, color }: { label: string; score: number; color: string }) => (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
    <span style={{ fontSize: "14px", color: "#6f6f6f" }}>{label}</span>
    <span style={{ fontSize: "28px", fontWeight: 700, color }}>{score}</span>
  </div>
);

const OgImage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const model = laptops.find((m) => m.id === id);
  if (!model) {
    return new ImageResponse(
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100%",
          background: "#161616",
          color: "#f4f4f4",
          fontSize: "36px",
        }}
      >
        Model not found
      </div>,
      { ...size },
    );
  }

  const s = getModelScores(model);
  const lineupColor = LINEUP_COLORS[model.lineup].accent;
  const baseline = priceBaselines[model.id];

  return new ImageResponse(
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
        background: "#161616",
        color: "#f4f4f4",
        fontFamily: "system-ui, sans-serif",
        padding: "48px 64px",
      }}
    >
      {/* Header: Logo + Lineup */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "32px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <svg width="36" height="36" viewBox="0 0 32 32">
            <rect width="32" height="32" rx="4" fill="#161616" />
            <circle cx="16" cy="16" r="5" fill="#da1e28" />
            <circle cx="16" cy="16" r="2" fill="#161616" />
          </svg>
          <div style={{ display: "flex", fontSize: "20px", color: "#6f6f6f" }}>
            <span>Lenovo</span>
            <span style={{ color: "#da1e28" }}>Compare</span>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            padding: "6px 16px",
            borderRadius: "4px",
            background: `${lineupColor}20`,
            color: lineupColor,
            fontSize: "16px",
            fontWeight: 600,
          }}
        >
          {model.lineup}
        </div>
      </div>

      {/* Model Name */}
      <div style={{ display: "flex", fontSize: "48px", fontWeight: 700, marginBottom: "8px", lineHeight: 1.1 }}>
        {model.name}
      </div>
      <div style={{ display: "flex", fontSize: "20px", color: "#6f6f6f", marginBottom: "40px" }}>{model.year}</div>

      {/* Specs Row */}
      <div style={{ display: "flex", gap: "32px", fontSize: "18px", color: "#a8a8a8", marginBottom: "40px" }}>
        <span>{model.processor.name}</span>
        <span style={{ color: "#393939" }}>|</span>
        <span>{`${model.ram.size}GB ${model.ram.type}`}</span>
        <span style={{ color: "#393939" }}>|</span>
        <span>{`${model.display.size}" ${model.display.resolutionLabel}`}</span>
        <span style={{ color: "#393939" }}>|</span>
        <span>{model.gpu.name}</span>
      </div>

      {/* Bottom: Scores + Price */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
          marginTop: "auto",
        }}
      >
        <div style={{ display: "flex", gap: "32px" }}>
          <ScoreBlock label="Perf" score={s.perf} color="#0f62fe" />
          <ScoreBlock label="Display" score={s.display} color="#ee5396" />
          <ScoreBlock label="Memory" score={s.memory} color="#be95ff" />
          <ScoreBlock label="Connect" score={s.connectivity} color="#08bdba" />
          <ScoreBlock label="Port" score={s.portability} color="#42be65" />
          <ScoreBlock label="GPU" score={s.gpu} color="#ff832b" />
        </div>
        {baseline && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
            <span style={{ fontSize: "14px", color: "#6f6f6f" }}>from</span>
            <span style={{ fontSize: "36px", fontWeight: 700, color: "#42be65" }}>
              {`CHF ${baseline.typicalRetail.toLocaleString("de-CH")}`}
            </span>
          </div>
        )}
      </div>
    </div>,
    { ...size },
  );
};

export default OgImage;
