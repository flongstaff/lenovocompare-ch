"use client";

import React from "react";
import { AlertCircle, RotateCcw } from "lucide-react";

interface Props {
  children: React.ReactNode;
  chartName: string;
}

interface State {
  hasError: boolean;
}

/**
 * Lightweight error boundary for individual chart sections.
 * Shows a compact dark-themed fallback with the chart name and a retry button.
 */
class ChartErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error(`[ChartError] ${this.props.chartName}:`, error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-between rounded bg-carbon-600 px-4 py-3">
          <div className="flex items-center gap-2 text-sm text-carbon-400">
            <AlertCircle size={14} className="shrink-0" />
            <span>Unable to load {this.props.chartName}</span>
          </div>
          <button
            onClick={() => this.setState({ hasError: false })}
            className="flex items-center gap-1 text-xs text-carbon-400 transition-colors hover:text-carbon-200"
          >
            <RotateCcw size={12} /> Retry
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ChartErrorBoundary;
