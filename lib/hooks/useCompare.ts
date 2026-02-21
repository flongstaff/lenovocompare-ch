"use client";
import { useCallback } from "react";
import { useLocalStorage } from "./useLocalStorage";
import { STORAGE_KEYS, MAX_COMPARE } from "@/lib/constants";

const isStringArray = (v: unknown): v is string[] => Array.isArray(v) && v.every((x) => typeof x === "string");

export const useCompare = () => {
  const [selectedIds, setSelectedIds] = useLocalStorage<string[]>(STORAGE_KEYS.compare, [], isStringArray);

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
