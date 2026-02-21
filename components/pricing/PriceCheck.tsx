"use client";

import { ExternalLink, ShoppingCart, RotateCcw, Search, Scale } from "lucide-react";
import type { Laptop } from "@/lib/types";
import {
  getRetailerSearchLinks,
  getPriceCompareLinks,
  getRefurbishedLinks,
  getMarketplaceLinks,
  getPsrefSearchUrl,
} from "@/lib/retailers";

interface PriceCheckProps {
  readonly model: Laptop;
}

const LinkPill = ({ name, url, icon }: { name: string; url: string; icon?: React.ReactNode }) => (
  <a
    href={url}
    target="_blank"
    rel="noopener noreferrer"
    className="carbon-btn-ghost inline-flex items-center gap-1 !px-3 !py-1.5 !text-xs"
  >
    {icon} {name} <ExternalLink size={10} />
  </a>
);

const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <p className="mb-1 mt-2 text-[9px] font-bold uppercase tracking-widest" style={{ color: "var(--muted)" }}>
    {children}
  </p>
);

export const PriceCheck = ({ model }: PriceCheckProps) => {
  const retailers = getRetailerSearchLinks(model);
  const priceCompare = getPriceCompareLinks(model);
  const refurbished = getRefurbishedLinks(model);
  const marketplaces = getMarketplaceLinks(model);

  return (
    <div className="space-y-1">
      <p className="text-carbon-200 text-[10px] font-bold uppercase tracking-widest">
        <ShoppingCart size={10} className="mr-1 inline" />
        Check Prices
      </p>

      <SectionLabel>New</SectionLabel>
      <div className="flex flex-wrap gap-1.5">
        {retailers.map((r) => (
          <LinkPill key={r.name} name={r.name} url={r.url} />
        ))}
        {priceCompare.map((r) => (
          <LinkPill key={r.name} name={r.name} url={r.url} icon={<Scale size={9} />} />
        ))}
      </div>

      <SectionLabel>Refurbished</SectionLabel>
      <div className="flex flex-wrap gap-1.5">
        {refurbished.map((r) => (
          <LinkPill key={r.name} name={r.name} url={r.url} icon={<RotateCcw size={9} />} />
        ))}
      </div>

      <SectionLabel>Marketplaces</SectionLabel>
      <div className="flex flex-wrap gap-1.5">
        {marketplaces.map((r) => (
          <LinkPill key={r.name} name={r.name} url={r.url} icon={<Search size={9} />} />
        ))}
      </div>

      {model.psrefUrl && (
        <>
          <SectionLabel>Specs</SectionLabel>
          <div className="flex flex-wrap gap-1.5">
            <LinkPill name="PSREF" url={model.psrefUrl} />
            <LinkPill name="Search PSREF" url={getPsrefSearchUrl(model)} />
          </div>
        </>
      )}
    </div>
  );
};
