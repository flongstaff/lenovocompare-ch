"use client";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { GitCompareArrows, X } from "lucide-react";
import { MAX_COMPARE } from "@/lib/constants";

interface CompareFloatingBarProps {
  readonly count: number;
  readonly onClear: () => void;
}

export const CompareFloatingBar = ({ count, onClear }: CompareFloatingBarProps) => (
  <AnimatePresence>
    <motion.div
      initial={{ y: 80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 80, opacity: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className="glass-bar fixed bottom-5 left-1/2 z-40 flex -translate-x-1/2 items-center gap-3 rounded-lg px-5 py-3"
    >
      <GitCompareArrows size={18} className="text-accent-light" />
      <span className="text-sm font-medium text-carbon-100">
        <span className="font-mono text-accent-light">{count}</span>
        <span className="mx-1 text-carbon-400">/</span>
        <span className="font-mono text-carbon-400">{MAX_COMPARE}</span>
        <span className="ml-1.5 text-carbon-400">selected</span>
      </span>
      <Link href="/compare" className="carbon-btn !px-4 !py-1.5 text-sm" aria-label="Go to comparison page">
        Compare
      </Link>
      <button
        onClick={onClear}
        className="p-1.5 text-carbon-400 transition-colors hover:text-trackpoint"
        aria-label="Clear all selected models"
      >
        <X size={15} />
      </button>
    </motion.div>
  </AnimatePresence>
);
