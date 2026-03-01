import { ImageResponse } from "next/og";

export const runtime = "nodejs";
export const alt = "LenovoCompare CH — Swiss Lenovo Laptop Comparison";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const OgImage = () =>
  new ImageResponse(
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: "100%",
        background: "#161616",
        color: "#f4f4f4",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "16px",
          marginBottom: "24px",
        }}
      >
        <svg width="64" height="64" viewBox="0 0 32 32">
          <rect width="32" height="32" rx="4" fill="#161616" />
          <circle cx="16" cy="16" r="5" fill="#da1e28" />
          <circle cx="16" cy="16" r="2" fill="#161616" />
        </svg>
        <span style={{ fontSize: "56px", fontWeight: 700 }}>
          Lenovo<span style={{ color: "#da1e28" }}>Compare</span>
        </span>
      </div>
      <div
        style={{
          fontSize: "24px",
          color: "#a8a8a8",
          marginBottom: "48px",
        }}
      >
        Swiss Lenovo Laptop Comparison Tool
      </div>
      <div
        style={{
          display: "flex",
          gap: "32px",
          fontSize: "18px",
          color: "#6f6f6f",
        }}
      >
        <span>124+ Models</span>
        <span style={{ color: "#393939" }}>|</span>
        <span>ThinkPad · IdeaPad Pro · Legion · Yoga</span>
        <span style={{ color: "#393939" }}>|</span>
        <span>Swiss Pricing in CHF</span>
      </div>
    </div>,
    { ...size },
  );

export default OgImage;
