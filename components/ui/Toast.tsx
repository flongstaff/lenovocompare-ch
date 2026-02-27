"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, AlertCircle, X } from "lucide-react";

export interface ToastMessage {
  readonly id: string;
  readonly text: string;
  readonly type?: "success" | "error" | "info";
}

interface ToastProps {
  readonly toasts: readonly ToastMessage[];
  readonly onDismiss: (id: string) => void;
}

const ICON = {
  success: CheckCircle2,
  error: AlertCircle,
  info: CheckCircle2,
} as const;

const COLOR = {
  success: "var(--success)",
  error: "var(--trackpoint)",
  info: "var(--accent-light)",
} as const;

const ToastItem = ({ toast, onDismiss }: { toast: ToastMessage; onDismiss: (id: string) => void }) => {
  const type = toast.type ?? "info";
  const Icon = ICON[type];

  useEffect(() => {
    const timer = setTimeout(() => onDismiss(toast.id), 3000);
    return () => clearTimeout(timer);
  }, [toast.id, onDismiss]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className="flex items-center gap-3 px-4 py-3 shadow-2xl"
      style={{ background: "var(--surface)", border: `1px solid ${COLOR[type]}` }}
    >
      <Icon size={16} style={{ color: COLOR[type] }} className="shrink-0" />
      <span className="text-sm" style={{ color: "var(--foreground)" }}>
        {toast.text}
      </span>
      <button
        onClick={() => onDismiss(toast.id)}
        className="shrink-0 p-0.5 hover:opacity-80"
        style={{ color: "var(--muted)" }}
        aria-label="Dismiss notification"
      >
        <X size={14} />
      </button>
    </motion.div>
  );
};

export const Toast = ({ toasts, onDismiss }: ToastProps) => (
  <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
    <AnimatePresence>
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} onDismiss={onDismiss} />
      ))}
    </AnimatePresence>
  </div>
);
