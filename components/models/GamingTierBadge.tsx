"use client";

import type { GamingTier } from "@/lib/types";

interface GamingTierBadgeProps {
  readonly tier: GamingTier;
}

const TIER_STYLE: Record<GamingTier, { label: string; className: string } | null> = {
  None: null,
  Light: { label: "Light Gaming", className: "carbon-verdict-fair" },
  Medium: { label: "Medium Gaming", className: "carbon-verdict-good" },
  Heavy: { label: "Heavy Gaming", className: "carbon-verdict-excellent" },
};

export const GamingTierBadge = ({ tier }: GamingTierBadgeProps) => {
  const style = TIER_STYLE[tier];
  if (!style) return null;
  return <span className={`px-1.5 py-0.5 text-[10px] font-medium ${style.className}`}>{style.label}</span>;
};
