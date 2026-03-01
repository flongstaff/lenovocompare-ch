"use client";

import { useEffect, useState, useCallback } from "react";
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
  const [leaving, setLeaving] = useState(false);

  const dismiss = useCallback(
    (id: string) => {
      setLeaving(true);
      setTimeout(() => onDismiss(id), 200);
    },
    [onDismiss],
  );

  useEffect(() => {
    const timer = setTimeout(() => dismiss(toast.id), 3000);
    return () => clearTimeout(timer);
  }, [toast.id, dismiss]);

  return (
    <div
      className={leaving ? "animate-toast-exit" : "animate-toast-enter"}
      style={{ background: "var(--surface)", border: `1px solid ${COLOR[type]}` }}
    >
      <div className="flex items-center gap-3 px-4 py-3 shadow-2xl">
        <Icon size={16} style={{ color: COLOR[type] }} className="shrink-0" />
        <span className="text-sm" style={{ color: "var(--foreground)" }}>
          {toast.text}
        </span>
        <button
          onClick={() => dismiss(toast.id)}
          className="shrink-0 p-0.5 hover:opacity-80"
          style={{ color: "var(--muted)" }}
          aria-label="Dismiss notification"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
};

export const Toast = ({ toasts, onDismiss }: ToastProps) => (
  <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
    {toasts.map((t) => (
      <ToastItem key={t.id} toast={t} onDismiss={onDismiss} />
    ))}
  </div>
);
