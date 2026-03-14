import { ImageResponse } from "next/og";
import { laptops } from "@/data/laptops";
import { getModelScores } from "@/lib/scoring";
import { LINEUP_COLORS } from "@/lib/constants";

export const dynamic = "force-static";
export const alt = "LenovoCompare CH — Model Details";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export const generateStaticParams = () => laptops.map((m) => ({ id: m.id }));

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
          fontFamily: "system-ui, sans-serif",
          fontSize: "36px",
        }}
      >
        Model not found
      </div>,
      { ...size },
    );
  }

  const s = getModelScores(model);
  const accent = LINEUP_COLORS[model.lineup].accent;
  const overallScore = Math.round((s.perf + s.gpu + s.display + s.memory + s.connectivity + s.portability) / 6);

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
      {/* Header: Logo + Lineup badge */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "32px",
        }}
      >
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
            padding: "6px 20px",
            borderRadius: "4px",
            background: `${accent}22`,
            border: `2px solid ${accent}`,
            color: accent,
            fontSize: "18px",
            fontWeight: 600,
            letterSpacing: "0.5px",
          }}
        >
          {model.lineup}
        </div>
      </div>

      {/* Model name */}
      <div
        style={{
          display: "flex",
          fontSize: "48px",
          fontWeight: 700,
          marginBottom: "8px",
          lineHeight: 1.1,
        }}
      >
        {model.name}
      </div>
      <div
        style={{
          display: "flex",
          fontSize: "20px",
          color: "#6f6f6f",
          marginBottom: "36px",
        }}
      >
        {model.year} Model
      </div>

      {/* Key specs */}
      <div
        style={{
          display: "flex",
          gap: "48px",
          marginBottom: "auto",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          <div
            style={{
              display: "flex",
              fontSize: "13px",
              color: "#6f6f6f",
              textTransform: "uppercase",
              letterSpacing: "1px",
            }}
          >
            Processor
          </div>
          <div style={{ display: "flex", fontSize: "20px", color: "#c6c6c6" }}>{model.processor.name}</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          <div
            style={{
              display: "flex",
              fontSize: "13px",
              color: "#6f6f6f",
              textTransform: "uppercase",
              letterSpacing: "1px",
            }}
          >
            Memory
          </div>
          <div style={{ display: "flex", fontSize: "20px", color: "#c6c6c6" }}>
            {model.ram.size}GB {model.ram.type}
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          <div
            style={{
              display: "flex",
              fontSize: "13px",
              color: "#6f6f6f",
              textTransform: "uppercase",
              letterSpacing: "1px",
            }}
          >
            Display
          </div>
          <div style={{ display: "flex", fontSize: "20px", color: "#c6c6c6" }}>
            {model.display.size}&quot; {model.display.resolutionLabel}
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          <div
            style={{
              display: "flex",
              fontSize: "13px",
              color: "#6f6f6f",
              textTransform: "uppercase",
              letterSpacing: "1px",
            }}
          >
            Weight
          </div>
          <div style={{ display: "flex", fontSize: "20px", color: "#c6c6c6" }}>{model.weight} kg</div>
        </div>
      </div>

      {/* Bottom: Overall score + branding */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        {/* Overall score circle */}
        {overallScore > 0 && (
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "72px",
                height: "72px",
                borderRadius: "50%",
                border: `3px solid ${accent}`,
                fontSize: "28px",
                fontWeight: 700,
                color: accent,
              }}
            >
              {overallScore}
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div style={{ display: "flex", fontSize: "16px", color: "#6f6f6f" }}>Overall Score</div>
              <div style={{ display: "flex", fontSize: "14px", color: "#525252" }}>out of 100</div>
            </div>
          </div>
        )}

        {/* Branding */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <svg width="28" height="28" viewBox="0 0 32 32">
            <rect width="32" height="32" rx="4" fill="#161616" />
            <circle cx="16" cy="16" r="5" fill="#da1e28" />
            <circle cx="16" cy="16" r="2" fill="#161616" />
          </svg>
          <span style={{ fontSize: "22px", fontWeight: 600, color: "#6f6f6f" }}>
            Lenovo<span style={{ color: "#da1e28" }}>Compare</span>
            <span style={{ color: "#525252", fontWeight: 400 }}> CH</span>
          </span>
        </div>
      </div>
    </div>,
    { ...size },
  );
};

export default OgImage;
