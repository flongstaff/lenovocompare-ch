/**
 * Locale-safe formatters for Swiss market display (CHF, weight, dates, storage).
 *
 * All formatting is manual (no Intl) to avoid server/client locale mismatch
 * that causes Next.js hydration errors. Dates use dd.MM.yyyy (de-CH convention).
 */

/** Format a price in CHF with apostrophe thousands separator (Swiss convention) */
export const formatCHF = (price: number): string => {
  const rounded = Math.round(price);
  const formatted = rounded.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "\u2019");
  return `CHF ${formatted}`;
};

export const formatWeight = (kg: number): string => (kg < 1 ? `${Math.round(kg * 1000)} g` : `${kg.toFixed(2)} kg`);

/** Manual formatting avoids server/client locale mismatch (hydration errors) */
export const formatDate = (iso: string): string => {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "–";
  const day = String(d.getUTCDate()).padStart(2, "0");
  const month = String(d.getUTCMonth() + 1).padStart(2, "0");
  const year = d.getUTCFullYear();
  return `${day}.${month}.${year}`;
};

export const formatStorage = (gb: number): string => (gb >= 1024 ? `${(gb / 1024).toFixed(0)} TB` : `${gb} GB`);

/** Strip lineup prefix for compact chart labels (works for all three lineups) */
export const shortName = (name: string) => name.replace(/^(ThinkPad|IdeaPad Pro|Legion) /, "");

/** Calculate percentage discount off MSRP (rounded integer) */
export const getPriceDiscount = (price: number, msrp: number): number =>
  msrp === 0 ? 0 : Math.round(((msrp - price) / msrp) * 100);

/** Color for a price discount percentage: green (>=25%), yellow (>=10%), red (<10%) */
export const getPriceDiscountColor = (discountPct: number): string => {
  if (discountPct >= 25) return "#42be65";
  if (discountPct >= 10) return "#f1c21b";
  return "#da1e28";
};

/** Tailwind class set for a price discount badge: green/yellow/red */
export const getPriceDiscountClasses = (discountPct: number): string => {
  if (discountPct >= 25) return "carbon-verdict-excellent";
  if (discountPct >= 10) return "carbon-verdict-fair";
  return "carbon-verdict-low";
};
