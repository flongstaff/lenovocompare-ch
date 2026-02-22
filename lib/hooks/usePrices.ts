"use client";
/**
 * Price management hook — merges hardcoded seed prices with user-contributed
 * localStorage prices. Provides add/remove/import/export and baseline lookups.
 */
import { useMemo, useCallback } from "react";
import type { SwissPrice, PriceBaseline } from "@/lib/types";
import { seedPrices } from "@/data/seed-prices";
import { priceBaselines } from "@/data/price-baselines";
import { useLocalStorage } from "./useLocalStorage";
import { STORAGE_KEYS } from "@/lib/constants";

interface ImportResult {
  imported: number;
  skipped: number;
  error?: string;
}

const isValidPrice = (item: unknown): item is SwissPrice => {
  if (typeof item !== "object" || item === null) return false;
  const obj = item as Record<string, unknown>;
  return (
    typeof obj.laptopId === "string" &&
    typeof obj.retailer === "string" &&
    typeof obj.price === "number" &&
    obj.price > 0 &&
    typeof obj.dateAdded === "string" &&
    (!obj.url || (typeof obj.url === "string" && /^https?:\/\//.test(obj.url)))
  );
};

export const usePrices = () => {
  const isSwissPriceArray = (v: unknown): v is SwissPrice[] => Array.isArray(v) && v.every(isValidPrice);

  const [userPrices, setUserPrices] = useLocalStorage<SwissPrice[]>(STORAGE_KEYS.prices, [], isSwissPriceArray);

  const allPrices = useMemo<SwissPrice[]>(() => [...seedPrices, ...userPrices], [userPrices]);

  const getBaseline = useCallback((laptopId: string): PriceBaseline | null => priceBaselines[laptopId] ?? null, []);

  const getPriceHistory = useCallback(
    (laptopId: string): SwissPrice[] =>
      allPrices.filter((p) => p.laptopId === laptopId).sort((a, b) => b.dateAdded.localeCompare(a.dateAdded)),
    [allPrices],
  );

  const addPrice = useCallback(
    (price: Omit<SwissPrice, "id" | "dateAdded" | "isUserAdded">) => {
      const newPrice: SwissPrice = {
        ...price,
        id: `user-${Date.now()}`,
        dateAdded: new Date().toISOString().split("T")[0],
        isUserAdded: true,
      };
      setUserPrices((prev) => [...prev, newPrice]);
    },
    [setUserPrices],
  );

  const removePrice = useCallback(
    (id: string) => {
      setUserPrices((prev) => prev.filter((p) => p.id !== id));
    },
    [setUserPrices],
  );

  const exportPrices = useCallback((): string => JSON.stringify(userPrices, null, 2), [userPrices]);

  const importPrices = useCallback(
    (json: string): ImportResult => {
      let parsed: unknown;
      try {
        parsed = JSON.parse(json);
      } catch {
        return { imported: 0, skipped: 0, error: "Invalid JSON format" };
      }

      if (!Array.isArray(parsed)) {
        return { imported: 0, skipped: 0, error: "Expected a JSON array" };
      }

      let imported = 0;
      let skipped = 0;
      const valid: SwissPrice[] = [];

      for (const item of parsed) {
        if (isValidPrice(item)) {
          valid.push({
            ...item,
            id: item.id ?? `import-${Date.now()}-${imported}`,
            isUserAdded: true,
          });
          imported++;
        } else {
          skipped++;
        }
      }

      if (imported === 0 && skipped > 0) {
        return {
          imported: 0,
          skipped,
          error: `All ${skipped} entries had missing/invalid fields (need: laptopId, retailer, price, dateAdded)`,
        };
      }

      if (valid.length > 0) {
        setUserPrices((prev) => [...prev, ...valid]);
      }

      return { imported, skipped };
    },
    [setUserPrices],
  );

  return { allPrices, userPrices, addPrice, removePrice, exportPrices, importPrices, getBaseline, getPriceHistory };
};
