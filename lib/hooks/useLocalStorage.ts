"use client";
/**
 * Generic localStorage hook with JSON serialization, optional type validation,
 * and one-time migration from legacy "thinkcompare-*" keys to "lenovocompare-*".
 */
import { useState, useCallback, useEffect, useRef } from "react";

/** One-time migration from thinkcompare-* to lenovocompare-* localStorage keys */
const MIGRATION_KEY = "lenovocompare-migrated";
const LEGACY_MAP: Record<string, string> = {
  "thinkcompare-prices": "lenovocompare-prices",
  "thinkcompare-compare": "lenovocompare-compare",
};

const migrateLocalStorage = () => {
  try {
    if (localStorage.getItem(MIGRATION_KEY)) return;
    for (const [oldKey, newKey] of Object.entries(LEGACY_MAP)) {
      const data = localStorage.getItem(oldKey);
      if (data && !localStorage.getItem(newKey)) {
        localStorage.setItem(newKey, data);
        localStorage.removeItem(oldKey);
      }
    }
    localStorage.setItem(MIGRATION_KEY, "1");
  } catch (error) {
    console.warn("[useLocalStorage] Migration from legacy keys failed:", error);
  }
};

let migrated = false;

export const useLocalStorage = <T>(key: string, initialValue: T, validator?: (value: unknown) => value is T) => {
  const [storedValue, setStoredValue] = useState<T>(initialValue);
  const validatorRef = useRef(validator);
  validatorRef.current = validator;

  useEffect(() => {
    if (!migrated) {
      migrateLocalStorage();
      migrated = true;
    }
    try {
      const item = localStorage.getItem(key);
      if (item) {
        const parsed: unknown = JSON.parse(item);
        if (validatorRef.current) {
          if (validatorRef.current(parsed)) {
            setStoredValue(parsed);
          } else {
            console.warn(`[useLocalStorage] Stored data for "${key}" failed validation — using default`);
          }
        } else {
          setStoredValue(parsed as T);
        }
      }
    } catch (error) {
      console.warn(`[useLocalStorage] Failed to read "${key}":`, error);
    }
  }, [key]);

  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      setStoredValue((prev) => {
        const next = value instanceof Function ? value(prev) : value;
        try {
          localStorage.setItem(key, JSON.stringify(next));
        } catch (error) {
          console.warn(`[useLocalStorage] Failed to write "${key}":`, error);
        }
        return next;
      });
    },
    [key],
  );

  return [storedValue, setValue] as const;
};
