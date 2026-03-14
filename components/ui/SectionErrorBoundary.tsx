"use client";

import React from "react";
import { AlertCircle, RotateCcw } from "lucide-react";

interface Props {
  children: React.ReactNode;
  section?: string;
}

interface State {
  hasError: boolean;
}

class SectionErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error(`[${this.props.section ?? "Section"}] Error:`, error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          className="flex items-center justify-between rounded px-4 py-3"
          style={{ background: "var(--surface-alt)", border: "1px solid var(--border-subtle)" }}
        >
          <div className="flex items-center gap-2 text-sm" style={{ color: "var(--muted)" }}>
            <AlertCircle size={14} style={{ color: "var(--trackpoint)" }} />
            <span>Failed to load {this.props.section ?? "this section"}</span>
          </div>
          <button
            onClick={() => this.setState({ hasError: false })}
            className="flex items-center gap-1 text-xs"
            style={{ color: "var(--accent-light)" }}
          >
            <RotateCcw size={12} /> Retry
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default SectionErrorBoundary;
