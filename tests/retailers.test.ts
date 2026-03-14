import { describe, it, expect } from "vitest";
import {
  getRetailerSearchLinks,
  getPriceCompareLinks,
  getRefurbishedLinks,
  getMarketplaceLinks,
  getNotebookCheckUrl,
  getLaptopMediaUrl,
  getPsrefSearchUrl,
} from "@/lib/retailers";
import { laptops } from "@/data/laptops";
import type { Laptop } from "@/lib/types";

// ── Fixtures ──────────────────────────────────────────────────────────────────

const x1Carbon = laptops.find((m) => m.id === "x1-carbon-gen12")!;
const legionModel = laptops.find((m) => m.lineup === "Legion")!;

/** Minimal stub — only fields retailers.ts accesses (name, psrefUrl) */
const makeModel = (overrides: Partial<Laptop> = {}): Laptop =>
  ({
    id: "test-model",
    name: "ThinkPad T14 Gen 5",
    lineup: "ThinkPad",
    series: "T",
    year: 2024,
    processor: { name: "Intel Core Ultra 7 155U", cores: 12, threads: 14, baseClock: 1.7, boostClock: 4.8, tdp: 15 },
    ram: { size: 16, type: "LPDDR5x", speed: 7500, maxSize: 64, slots: 0, soldered: true },
    display: {
      size: 14,
      resolution: "1920x1200",
      resolutionLabel: "FHD+",
      panel: "IPS",
      refreshRate: 60,
      nits: 400,
      touchscreen: false,
    },
    gpu: { name: "Intel Graphics", integrated: true },
    storage: { type: "NVMe", size: 512, slots: 1 },
    battery: { whr: 57, removable: false },
    weight: 1.38,
    ports: [],
    wireless: ["Wi-Fi 6E", "Bluetooth 5.3"],
    os: "Windows 11 Pro",
    psrefUrl: "https://psref.lenovo.com/Product/ThinkPad/Lenovo_ThinkPad_T14_Gen_5_Intel",
    ...overrides,
  }) as Laptop;

// ── getRetailerSearchLinks ────────────────────────────────────────────────────

describe("getRetailerSearchLinks", () => {
  it("should return array of retailer links", () => {
    const links = getRetailerSearchLinks(x1Carbon);
    expect(links.length).toBeGreaterThan(0);
  });

  it("should include Digitec, Brack, and Lenovo CH", () => {
    const links = getRetailerSearchLinks(x1Carbon);
    const names = links.map((l) => l.name);
    expect(names).toContain("Digitec");
    expect(names).toContain("Brack");
    expect(names).toContain("Lenovo CH");
  });

  it("should include Galaxus, Interdiscount, Fust, and MediaMarkt", () => {
    const links = getRetailerSearchLinks(x1Carbon);
    const names = links.map((l) => l.name);
    expect(names).toContain("Galaxus");
    expect(names).toContain("Interdiscount");
    expect(names).toContain("Fust");
    expect(names).toContain("MediaMarkt");
  });

  it("should return exactly 7 links", () => {
    const links = getRetailerSearchLinks(x1Carbon);
    expect(links).toHaveLength(7);
  });

  it("should give each link a name, url, and category", () => {
    const links = getRetailerSearchLinks(x1Carbon);
    for (const link of links) {
      expect(typeof link.name).toBe("string");
      expect(typeof link.url).toBe("string");
      expect(link.url).toMatch(/^https:\/\//);
    }
  });

  it("should tag all links as category new", () => {
    const links = getRetailerSearchLinks(x1Carbon);
    expect(links.every((l) => l.category === "new")).toBe(true);
  });

  it("should encode the model name in the Digitec URL using plus encoding", () => {
    const links = getRetailerSearchLinks(makeModel({ name: "ThinkPad T14 Gen 5" }));
    const digitec = links.find((l) => l.name === "Digitec")!;
    // spaces replaced with + then percent-encoded to %2B
    expect(digitec.url).toContain("ThinkPad%2BT14%2BGen%2B5");
  });

  it("should encode the model name in the Brack URL using plus encoding", () => {
    const links = getRetailerSearchLinks(makeModel({ name: "ThinkPad T14 Gen 5" }));
    const brack = links.find((l) => l.name === "Brack")!;
    expect(brack.url).toContain("ThinkPad%2BT14%2BGen%2B5");
  });

  it("should encode the model name in the Lenovo CH URL using standard percent encoding", () => {
    const links = getRetailerSearchLinks(makeModel({ name: "ThinkPad T14 Gen 5" }));
    const lenovo = links.find((l) => l.name === "Lenovo CH")!;
    // Lenovo CH uses enc() which converts spaces to %20
    expect(lenovo.url).toContain("ThinkPad%20T14%20Gen%205");
  });

  it("should preserve parentheses in model names (valid URL characters)", () => {
    const links = getRetailerSearchLinks(makeModel({ name: "ThinkPad X1 Carbon (Gen 12)" }));
    const digitec = links.find((l) => l.name === "Digitec")!;
    // encodeURIComponent does not encode parentheses — they are valid in URLs (RFC 3986)
    expect(digitec.url).toMatch(/^https:\/\//);
    expect(digitec.url).not.toContain(" ");
  });

  it("should produce valid URLs for Legion model names", () => {
    const links = getRetailerSearchLinks(legionModel);
    links.forEach((l) => expect(l.url).toMatch(/^https:\/\//));
  });

  it("should produce valid URLs for IdeaPad Pro model names", () => {
    const ideapadModel = laptops.find((m) => m.lineup === "IdeaPad Pro")!;
    const links = getRetailerSearchLinks(ideapadModel);
    links.forEach((l) => expect(l.url).toMatch(/^https:\/\//));
  });
});

// ── getPriceCompareLinks ──────────────────────────────────────────────────────

describe("getPriceCompareLinks", () => {
  it("should return Toppreise as the first link", () => {
    const links = getPriceCompareLinks(x1Carbon);
    expect(links[0].name).toBe("Toppreise");
  });

  it("should return a Toppreise URL starting with https://", () => {
    const links = getPriceCompareLinks(x1Carbon);
    expect(links[0].url).toMatch(/^https:\/\//);
  });

  it("should tag Toppreise as priceCompare category", () => {
    const links = getPriceCompareLinks(x1Carbon);
    expect(links[0].category).toBe("priceCompare");
  });

  it("should encode model name in Toppreise URL using plus encoding", () => {
    const links = getPriceCompareLinks(makeModel({ name: "Legion 5i Gen 9" }));
    const toppreise = links[0];
    expect(toppreise.url).toContain("Legion%2B5i%2BGen%2B9");
  });

  it("should encode special characters in model name for Toppreise", () => {
    const links = getPriceCompareLinks(makeModel({ name: "Yoga 9 (2-in-1)" }));
    const toppreise = links[0];
    expect(toppreise.url).not.toContain(" ");
    expect(toppreise.url).toMatch(/^https:\/\//);
  });
});

// ── getRefurbishedLinks ───────────────────────────────────────────────────────

describe("getRefurbishedLinks", () => {
  it("should return exactly 3 refurbished links", () => {
    const links = getRefurbishedLinks(x1Carbon);
    expect(links).toHaveLength(3);
  });

  it("should include Revendo, Back Market, and Galaxus Used", () => {
    const links = getRefurbishedLinks(x1Carbon);
    const names = links.map((l) => l.name);
    expect(names).toContain("Revendo");
    expect(names).toContain("Back Market");
    expect(names).toContain("Galaxus Used");
  });

  it("should tag all links as refurbished category", () => {
    const links = getRefurbishedLinks(x1Carbon);
    expect(links.every((l) => l.category === "refurbished")).toBe(true);
  });

  it("should return Revendo URL starting with https://", () => {
    const links = getRefurbishedLinks(x1Carbon);
    const revendo = links.find((l) => l.name === "Revendo")!;
    expect(revendo.url).toMatch(/^https:\/\//);
  });

  it("should return Back Market URL pointing to backmarket.de", () => {
    const links = getRefurbishedLinks(x1Carbon);
    const backMarket = links.find((l) => l.name === "Back Market")!;
    expect(backMarket.url).toContain("backmarket.de");
  });

  it("should return Galaxus Used URL pointing to galaxus.ch secondhand", () => {
    const links = getRefurbishedLinks(x1Carbon);
    const galaxusUsed = links.find((l) => l.name === "Galaxus Used")!;
    expect(galaxusUsed.url).toContain("galaxus.ch");
    expect(galaxusUsed.url).toContain("secondhand");
  });

  it("should encode model name in Revendo URL using standard percent encoding", () => {
    const links = getRefurbishedLinks(makeModel({ name: "ThinkPad T14 Gen 5" }));
    const revendo = links.find((l) => l.name === "Revendo")!;
    expect(revendo.url).not.toContain(" ");
  });

  it("should encode model name in Galaxus Used URL using plus encoding", () => {
    const links = getRefurbishedLinks(makeModel({ name: "ThinkPad T14 Gen 5" }));
    const galaxusUsed = links.find((l) => l.name === "Galaxus Used")!;
    expect(galaxusUsed.url).toContain("ThinkPad%2BT14%2BGen%2B5");
  });
});

// ── getMarketplaceLinks ───────────────────────────────────────────────────────

describe("getMarketplaceLinks", () => {
  it("should return exactly 2 marketplace links", () => {
    const links = getMarketplaceLinks(x1Carbon);
    expect(links).toHaveLength(2);
  });

  it("should include Ricardo and Tutti", () => {
    const links = getMarketplaceLinks(x1Carbon);
    const names = links.map((l) => l.name);
    expect(names).toContain("Ricardo");
    expect(names).toContain("Tutti");
  });

  it("should tag all links as marketplace category", () => {
    const links = getMarketplaceLinks(x1Carbon);
    expect(links.every((l) => l.category === "marketplace")).toBe(true);
  });

  it("should return Ricardo URL starting with https://", () => {
    const links = getMarketplaceLinks(x1Carbon);
    const ricardo = links.find((l) => l.name === "Ricardo")!;
    expect(ricardo.url).toMatch(/^https:\/\//);
  });

  it("should return Tutti URL starting with https://", () => {
    const links = getMarketplaceLinks(x1Carbon);
    const tutti = links.find((l) => l.name === "Tutti")!;
    expect(tutti.url).toMatch(/^https:\/\//);
  });

  it("should encode spaces in Ricardo URL using standard percent encoding", () => {
    const links = getMarketplaceLinks(makeModel({ name: "ThinkPad T14 Gen 5" }));
    const ricardo = links.find((l) => l.name === "Ricardo")!;
    // enc() encodes spaces to %20, not +
    expect(ricardo.url).toContain("ThinkPad%20T14%20Gen%205");
    expect(ricardo.url).not.toContain(" ");
  });

  it("should encode spaces in Tutti URL using standard percent encoding", () => {
    const links = getMarketplaceLinks(makeModel({ name: "ThinkPad T14 Gen 5" }));
    const tutti = links.find((l) => l.name === "Tutti")!;
    expect(tutti.url).toContain("ThinkPad%20T14%20Gen%205");
    expect(tutti.url).not.toContain(" ");
  });

  it("should preserve parentheses in model names (valid URL characters)", () => {
    const links = getMarketplaceLinks(makeModel({ name: "ThinkPad X1 Carbon (Gen 12)" }));
    links.forEach((l) => {
      expect(l.url).toMatch(/^https:\/\//);
      expect(l.url).not.toContain(" ");
    });
  });
});

// ── getNotebookCheckUrl ───────────────────────────────────────────────────────

describe("getNotebookCheckUrl", () => {
  it("should return a URL starting with https://", () => {
    expect(getNotebookCheckUrl(x1Carbon)).toMatch(/^https:\/\//);
  });

  it("should point to notebookcheck.net", () => {
    expect(getNotebookCheckUrl(x1Carbon)).toContain("notebookcheck.net");
  });

  it("should include the encoded model name in the URL", () => {
    expect(getNotebookCheckUrl(x1Carbon)).toContain(encodeURIComponent(x1Carbon.name));
  });

  it("should percent-encode spaces as %20", () => {
    const url = getNotebookCheckUrl(makeModel({ name: "ThinkPad T14 Gen 5" }));
    expect(url).toContain("ThinkPad%20T14%20Gen%205");
    expect(url).not.toContain(" ");
  });

  it("should preserve parentheses in model names (valid URL characters)", () => {
    const url = getNotebookCheckUrl(makeModel({ name: "ThinkPad X1 Extreme (Gen 5)" }));
    // encodeURIComponent does not encode parentheses — they are valid in URLs (RFC 3986)
    expect(url).toMatch(/^https:\/\//);
    expect(url).not.toContain(" ");
  });

  it("should produce a valid URL for Yoga lineup models", () => {
    const yogaModel = laptops.find((m) => m.lineup === "Yoga")!;
    const url = getNotebookCheckUrl(yogaModel);
    expect(url).toMatch(/^https:\/\//);
    expect(url).toContain("notebookcheck.net");
  });
});

// ── getLaptopMediaUrl ─────────────────────────────────────────────────────────

describe("getLaptopMediaUrl", () => {
  it("should return a URL starting with https://", () => {
    expect(getLaptopMediaUrl(x1Carbon)).toMatch(/^https:\/\//);
  });

  it("should point to laptopmedia.com", () => {
    expect(getLaptopMediaUrl(x1Carbon)).toContain("laptopmedia.com");
  });

  it("should include the encoded model name in the URL", () => {
    expect(getLaptopMediaUrl(x1Carbon)).toContain(encodeURIComponent(x1Carbon.name));
  });

  it("should percent-encode spaces as %20", () => {
    const url = getLaptopMediaUrl(makeModel({ name: "Legion 5i Gen 9" }));
    expect(url).toContain("Legion%205i%20Gen%209");
    expect(url).not.toContain(" ");
  });

  it("should produce valid URLs for all four lineups", () => {
    const lineups = ["ThinkPad", "IdeaPad Pro", "Legion", "Yoga"] as const;
    for (const lineup of lineups) {
      const model = laptops.find((m) => m.lineup === lineup)!;
      const url = getLaptopMediaUrl(model);
      expect(url).toMatch(/^https:\/\//);
      expect(url).toContain("laptopmedia.com");
    }
  });
});

// ── getPsrefSearchUrl ─────────────────────────────────────────────────────────

describe("getPsrefSearchUrl", () => {
  it("should return a URL starting with https://", () => {
    expect(getPsrefSearchUrl(x1Carbon)).toMatch(/^https:\/\//);
  });

  it("should point to psref.lenovo.com", () => {
    expect(getPsrefSearchUrl(x1Carbon)).toContain("psref.lenovo.com");
  });

  it("should extract MT param from psrefUrl when available", () => {
    // x1-carbon-gen12 psrefUrl contains ?MT=21KC
    const url = getPsrefSearchUrl(x1Carbon);
    expect(url).toContain("21KC");
  });

  it("should prefer MT param over path-based extraction", () => {
    const model = makeModel({
      psrefUrl: "https://psref.lenovo.com/Product/ThinkPad/Lenovo_ThinkPad_T14?MT=21AB",
    });
    const url = getPsrefSearchUrl(model);
    expect(url).toContain("21AB");
    // Should NOT contain "T14" from path when MT param is present
    expect(url).toBe("https://psref.lenovo.com/Search?keyword=21AB");
  });

  it("should extract product name from psrefUrl path when no MT param is present", () => {
    const model = makeModel({
      name: "ThinkPad T14 Gen 5",
      psrefUrl: "https://psref.lenovo.com/Product/ThinkPad/Lenovo_ThinkPad_T14_Gen_5_Intel",
    });
    const url = getPsrefSearchUrl(model);
    expect(url).toContain("ThinkPad");
    expect(url).toContain("T14");
  });

  it("should handle model without MT param (Legion-style psrefUrl)", () => {
    const url = getPsrefSearchUrl(legionModel);
    expect(url).toMatch(/^https:\/\//);
    expect(url.length).toBeGreaterThan("https://psref.lenovo.com/Search?keyword=".length);
  });

  it("should extract machine type suffix from model name when psrefUrl is empty", () => {
    // Suffix pattern: 2 digits + 2-4 uppercase letters + 1-2 digits + optional letter (e.g. "14AHP10")
    const model = makeModel({ name: "IdeaPad Pro 5i 14AHP10", psrefUrl: "" });
    const url = getPsrefSearchUrl(model);
    expect(url).toContain("14AHP10");
  });

  it("should fall back to full model name when psrefUrl is empty and name has no MT suffix", () => {
    const model = makeModel({ name: "ThinkPad T14 Gen 5", psrefUrl: "" });
    const url = getPsrefSearchUrl(model);
    expect(url).toContain("ThinkPad");
    expect(url).toMatch(/^https:\/\//);
  });

  it("should not throw when psrefUrl is undefined", () => {
    const model = makeModel({ psrefUrl: undefined as unknown as string });
    expect(() => getPsrefSearchUrl(model)).not.toThrow();
  });

  it("should return a valid URL when psrefUrl is undefined", () => {
    const model = makeModel({ name: "ThinkPad T14 Gen 5", psrefUrl: undefined as unknown as string });
    const url = getPsrefSearchUrl(model);
    expect(url).toMatch(/^https:\/\//);
    expect(url).toContain("ThinkPad");
  });
});
