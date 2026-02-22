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

const model = laptops.find((m) => m.id === "x1-carbon-gen12")!;

describe("getRetailerSearchLinks", () => {
  it("returns array of retailer links", () => {
    const links = getRetailerSearchLinks(model);
    expect(links.length).toBeGreaterThan(0);
  });

  it("includes Digitec, Brack, and Lenovo CH", () => {
    const links = getRetailerSearchLinks(model);
    const names = links.map((l) => l.name);
    expect(names).toContain("Digitec");
    expect(names).toContain("Brack");
    expect(names).toContain("Lenovo CH");
  });

  it("each link has name, url, and category properties", () => {
    const links = getRetailerSearchLinks(model);
    for (const link of links) {
      expect(link).toHaveProperty("name");
      expect(link).toHaveProperty("url");
      expect(link).toHaveProperty("category");
      expect(typeof link.name).toBe("string");
      expect(typeof link.url).toBe("string");
      expect(link.url).toMatch(/^https?:\/\//);
    }
  });

  it("all links have category 'new'", () => {
    const links = getRetailerSearchLinks(model);
    expect(links.every((l) => l.category === "new")).toBe(true);
  });
});

describe("getPriceCompareLinks", () => {
  it("returns Toppreise link", () => {
    const links = getPriceCompareLinks(model);
    expect(links.length).toBeGreaterThan(0);
    expect(links[0].name).toBe("Toppreise");
    expect(links[0].category).toBe("priceCompare");
  });
});

describe("getRefurbishedLinks", () => {
  it("returns refurbished retailer links", () => {
    const links = getRefurbishedLinks(model);
    expect(links.length).toBeGreaterThan(0);
    expect(links.every((l) => l.category === "refurbished")).toBe(true);
  });
});

describe("getMarketplaceLinks", () => {
  it("returns Ricardo and Tutti links", () => {
    const links = getMarketplaceLinks(model);
    const names = links.map((l) => l.name);
    expect(names).toContain("Ricardo");
    expect(names).toContain("Tutti");
    expect(links.every((l) => l.category === "marketplace")).toBe(true);
  });
});

describe("getNotebookCheckUrl", () => {
  it("returns URL containing model name", () => {
    const url = getNotebookCheckUrl(model);
    expect(url).toContain("notebookcheck.net");
    expect(url).toContain(encodeURIComponent(model.name));
  });
});

describe("getLaptopMediaUrl", () => {
  it("returns URL containing encoded model name", () => {
    const url = getLaptopMediaUrl(model);
    expect(url).toContain("laptopmedia.com");
    expect(url).toContain(encodeURIComponent(model.name));
  });
});

describe("getPsrefSearchUrl", () => {
  it("returns psref.lenovo.com URL", () => {
    const url = getPsrefSearchUrl(model);
    expect(url).toContain("psref.lenovo.com");
  });

  it("extracts MT param from psrefUrl when available", () => {
    // x1-carbon-gen12 has ?MT=21KC in its psrefUrl
    const url = getPsrefSearchUrl(model);
    expect(url).toContain("21KC");
  });

  it("handles model without MT param in psrefUrl", () => {
    const legionModel = laptops.find((m) => m.lineup === "Legion")!;
    const url = getPsrefSearchUrl(legionModel);
    expect(url).toContain("psref.lenovo.com");
    expect(url.length).toBeGreaterThan("https://psref.lenovo.com/Search?keyword=".length);
  });
});
