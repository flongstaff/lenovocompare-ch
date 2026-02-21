"use client";

import type { GamingTier } from "@/lib/types";

interface GamingTierBadgeProps {
  readonly tier: GamingTier;
}

const TIER_STYLE: Record<GamingTier, { label: string; className: string } | null> = {
  None: null,
  Light: { label: "Light Gaming", className: "bg-yellow-900/30 text-yellow-400 border border-yellow-700" },
  Medium: { label: "Medium Gaming", className: "bg-green-900/30 text-green-400 border border-green-700" },
  Heavy: { label: "Heavy Gaming", className: "bg-blue-900/30 text-blue-400 border border-blue-700" },
};

export const GamingTierBadge = ({ tier }: GamingTierBadgeProps) => {
  const style = TIER_STYLE[tier];
  if (!style) return null;
  return <span className={`px-1.5 py-0.5 text-[10px] font-medium ${style.className}`}>{style.label}</span>;
};
