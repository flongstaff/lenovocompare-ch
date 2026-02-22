"use client";
import { useCallback, useEffect, useState } from "react";
import { MAX_COMPARE } from "@/lib/constants";

const SESSION_KEY = "lenovocompare-compare";

export const useCompare = () => {
  const [selectedIds, setSelectedIds] = useState<string[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const stored = sessionStorage.getItem(SESSION_KEY);
      if (stored) {
        const parsed: unknown = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.every((x) => typeof x === "string")) return parsed;
      }
    } catch {
      /* ignore */
    }
    return [];
  });

  useEffect(() => {
    try {
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(selectedIds));
    } catch {
      /* ignore */
    }
  }, [selectedIds]);

  const toggleCompare = useCallback(
    (id: string) => {
      setSelectedIds((prev) => {
        if (prev.includes(id)) return prev.filter((x) => x !== id);
        if (prev.length >= MAX_COMPARE) return prev;
        return [...prev, id];
      });
    },
    [setSelectedIds],
  );

  const removeFromCompare = useCallback(
    (id: string) => setSelectedIds((prev) => prev.filter((x) => x !== id)),
    [setSelectedIds],
  );

  const clearCompare = useCallback(() => setSelectedIds([]), [setSelectedIds]);

  const setIds = useCallback(
    (ids: readonly string[]) => setSelectedIds([...ids].slice(0, MAX_COMPARE)),
    [setSelectedIds],
  );

  const isSelected = useCallback((id: string) => selectedIds.includes(id), [selectedIds]);

  return { selectedIds, toggleCompare, removeFromCompare, clearCompare, setIds, isSelected };
};
