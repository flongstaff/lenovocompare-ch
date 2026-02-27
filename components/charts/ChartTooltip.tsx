"use client";

/**
 * Shared tooltip container for recharts charts.
 * Provides the standard Carbon dark tooltip styling used across all chart components.
 */
const ChartTooltip = ({ children }: { readonly children: React.ReactNode }) => (
  <div
    style={{
      background: "#262626",
      border: "1px solid #525252",
      borderRadius: 0,
      padding: "8px 12px",
      boxShadow: "0 4px 16px rgba(0,0,0,0.5)",
    }}
  >
    {children}
  </div>
);

export { ChartTooltip };
