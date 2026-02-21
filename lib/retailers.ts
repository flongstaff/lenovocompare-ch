/**
 * Swiss retailer URL builders — generates outbound search links for each laptop model.
 *
 * Categories:
 *   New retail: Digitec, Galaxus, Brack, Lenovo CH, Interdiscount, Fust, MediaMarkt
 *   Price comparison: Toppreise
 *   Refurbished: Revendo, Back Market (DE, ships to CH), Galaxus Secondhand
 *   Marketplaces: Ricardo, Tutti (user listings — not crawlable, search links only)
 *   Reviews: NotebookCheck, LaptopMedia
 *   Specs: PSREF (with search fallback)
 *
 * No scraping — outbound search links only.
 */
import type { Laptop } from "./types";

export interface RetailerLink {
  readonly name: string;
  readonly url: string;
  readonly category: "new" | "priceCompare" | "refurbished" | "marketplace" | "review" | "specs";
}

const enc = (s: string): string => encodeURIComponent(s);
const plusEnc = (model: Laptop): string => enc(model.name.replace(/\s+/g, "+"));

/** New retail — authorized Swiss dealers + Lenovo direct */
export const getRetailerSearchLinks = (model: Laptop): readonly RetailerLink[] => [
  { name: "Digitec", url: `https://www.digitec.ch/de/search?q=${plusEnc(model)}`, category: "new" },
  { name: "Galaxus", url: `https://www.galaxus.ch/de/search?q=${plusEnc(model)}`, category: "new" },
  { name: "Brack", url: `https://www.brack.ch/search?query=${plusEnc(model)}`, category: "new" },
  { name: "Lenovo CH", url: `https://www.lenovo.com/ch/de/search?query=${enc(model.name)}`, category: "new" },
  { name: "Interdiscount", url: `https://www.interdiscount.ch/de/search?q=${enc(model.name)}`, category: "new" },
  { name: "Fust", url: `https://www.fust.ch/de/searchresult.html?queryString=${enc(model.name)}`, category: "new" },
  { name: "MediaMarkt", url: `https://www.mediamarkt.ch/de/search.html?query=${enc(model.name)}`, category: "new" },
];

/** Price comparison engine */
export const getPriceCompareLinks = (model: Laptop): readonly RetailerLink[] => [
  { name: "Toppreise", url: `https://www.toppreise.ch/en/search?q=${plusEnc(model)}`, category: "priceCompare" },
];

/** Refurbished — certified resellers that ship to/within Switzerland */
export const getRefurbishedLinks = (model: Laptop): readonly RetailerLink[] => [
  { name: "Revendo", url: `https://revendo.ch/en/search?q=${enc(model.name)}`, category: "refurbished" },
  { name: "Back Market", url: `https://www.backmarket.de/de-de/search?q=${enc(model.name)}`, category: "refurbished" },
  {
    name: "Galaxus Used",
    url: `https://www.galaxus.ch/de/secondhand/search?q=${plusEnc(model)}`,
    category: "refurbished",
  },
];

/** Marketplaces — user-to-user listings, not crawlable. Search links only. */
export const getMarketplaceLinks = (model: Laptop): readonly RetailerLink[] => [
  { name: "Ricardo", url: `https://www.ricardo.ch/de/s/${enc(model.name)}`, category: "marketplace" },
  { name: "Tutti", url: `https://www.tutti.ch/de/q/${enc(model.name)}`, category: "marketplace" },
];

/** All shopping links combined (for PriceCheck component) */
export const getAllShoppingLinks = (model: Laptop): readonly RetailerLink[] => [
  ...getRetailerSearchLinks(model),
  ...getPriceCompareLinks(model),
  ...getRefurbishedLinks(model),
  ...getMarketplaceLinks(model),
];

export const getNotebookCheckUrl = (model: Laptop): string =>
  `https://www.notebookcheck.net/search.php?s=${enc(model.name)}`;

export const getLaptopMediaUrl = (model: Laptop): string => `https://laptopmedia.com/?s=${enc(model.name)}`;

/**
 * Build a PSREF search URL as fallback when direct links don't resolve.
 * Priority: MT query param → model name suffix → URL path segment → full name.
 */
export const getPsrefSearchUrl = (model: Laptop): string => {
  const base = "https://psref.lenovo.com/Search?keyword=";
  // 1. MT query param (e.g. ?MT=21KC)
  const mtMatch = model.psrefUrl?.match(/[?&]MT=([^&]+)/);
  if (mtMatch) return base + mtMatch[1];
  // 2. Machine type suffix in name (e.g. "14AHP10", "16IRX9", "15ACH6A")
  const suffixMatch = model.name.match(/\d{2}[A-Z]{2,4}\d{1,2}[A-Z]?$/);
  if (suffixMatch) return base + suffixMatch[0];
  // 3. Extract product name from URL path (cleaner than display name — no parentheses)
  const pathMatch = model.psrefUrl?.match(/\/Product\/[^/]+\/(?:Lenovo_)?(.+?)(?:\?|$)/);
  if (pathMatch) return base + enc(pathMatch[1].replace(/_/g, " "));
  // 4. Fall back to full model name
  return base + enc(model.name);
};
