"use client";
import { laptops } from "@/data/laptops";
import type { Laptop } from "@/lib/types";

export const useLaptops = (): readonly Laptop[] => laptops;
