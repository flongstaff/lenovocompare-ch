import { describe, it, expect, vi, afterEach } from "vitest";
import { formatCHF, formatWeight, formatDate, formatStorage, shortName, getPriceAgeBadge } from "@/lib/formatters";

describe("formatCHF", () => {
  it("formats small prices", () => {
    expect(formatCHF(499)).toBe("CHF 499");
  });

  it("formats thousands with apostrophe separator", () => {
    expect(formatCHF(1299)).toBe("CHF 1\u2019299");
    expect(formatCHF(12500)).toBe("CHF 12\u2019500");
  });

  it("rounds to nearest integer", () => {
    expect(formatCHF(1299.5)).toBe("CHF 1\u2019300");
    expect(formatCHF(1299.4)).toBe("CHF 1\u2019299");
  });
});

describe("formatWeight", () => {
  it("formats grams for <1kg", () => {
    expect(formatWeight(0.5)).toBe("500 g");
    expect(formatWeight(0.98)).toBe("980 g");
  });

  it("formats kg for >=1kg", () => {
    expect(formatWeight(1.35)).toBe("1.35 kg");
    expect(formatWeight(2.0)).toBe("2.00 kg");
  });
});

describe("formatDate", () => {
  it("formats ISO date to dd.MM.yyyy", () => {
    expect(formatDate("2024-01-15")).toBe("15.01.2024");
    expect(formatDate("2025-12-31")).toBe("31.12.2025");
  });

  it("returns dash for invalid dates", () => {
    expect(formatDate("invalid")).toBe("–");
  });
});

describe("formatStorage", () => {
  it("formats GB", () => {
    expect(formatStorage(256)).toBe("256 GB");
    expect(formatStorage(512)).toBe("512 GB");
  });

  it("formats TB for >=1024GB", () => {
    expect(formatStorage(1024)).toBe("1 TB");
    expect(formatStorage(2048)).toBe("2 TB");
  });
});

describe("shortName", () => {
  it("strips ThinkPad prefix", () => {
    expect(shortName("ThinkPad T14s Gen 6")).toBe("T14s Gen 6");
  });

  it("strips IdeaPad Pro prefix", () => {
    expect(shortName("IdeaPad Pro 5i 16 Gen 10")).toBe("5i 16 Gen 10");
  });

  it("strips Legion prefix", () => {
    expect(shortName("Legion 5i 16 Gen 9")).toBe("5i 16 Gen 9");
  });

  it("returns unchanged if no prefix", () => {
    expect(shortName("Custom Name")).toBe("Custom Name");
  });
});

describe("getPriceAgeBadge", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("should return Fresh (green) for prices less than 30 days old", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2025-03-15"));
    const result = getPriceAgeBadge("2025-03-01");
    expect(result.label).toBe("Fresh");
    expect(result.color).toBe("#42be65");
  });

  it("should return month count (amber) for prices 30-90 days old", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2025-04-15"));
    const result = getPriceAgeBadge("2025-03-01");
    expect(result.label).toBe("1mo");
    expect(result.color).toBe("#f1c21b");
  });

  it("should return month count with plus (red) for prices over 90 days old", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2025-07-01"));
    const result = getPriceAgeBadge("2025-03-01");
    expect(result.label).toBe("4mo+");
    expect(result.color).toBe("#da1e28");
  });

  it("should return unknown for invalid dates", () => {
    const result = getPriceAgeBadge("invalid");
    expect(result.label).toBe("?");
    expect(result.color).toBe("#6f6f6f");
  });

  it("should handle boundary at exactly 30 days", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2025-03-31"));
    const result = getPriceAgeBadge("2025-03-01");
    expect(result.label).toBe("1mo");
    expect(result.color).toBe("#f1c21b");
  });

  it("should handle boundary at exactly 90 days", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2025-05-30"));
    const result = getPriceAgeBadge("2025-03-01");
    expect(result.label).toBe("3mo");
    expect(result.color).toBe("#f1c21b");
  });

  it("should return red for 91+ days", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2025-05-31"));
    const result = getPriceAgeBadge("2025-03-01");
    expect(result.label).toBe("3mo+");
    expect(result.color).toBe("#da1e28");
  });
});
