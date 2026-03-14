"use client";

import React from "react";
import Link from "next/link";
import { AlertCircle, RotateCcw, Home } from "lucide-react";

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  errorMessage: string | null;
}

class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, errorMessage: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, errorMessage: error.message || "Unknown error" };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error("ErrorBoundary caught:", error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center py-20">
          <div className="carbon-card max-w-md p-8 text-center">
            <AlertCircle size={48} className="mx-auto mb-4" style={{ color: "var(--trackpoint)" }} />
            <h2 className="mb-2 text-lg font-semibold" style={{ color: "var(--foreground)" }}>
              Something went wrong
            </h2>
            <p className="mb-4 text-sm" style={{ color: "var(--muted)" }}>
              An unexpected error occurred. Try refreshing the page.
            </p>
            {this.state.errorMessage && (
              <p
                className="mb-6 px-3 py-2 font-mono text-xs"
                style={{ background: "var(--surface-alt)", color: "var(--muted)" }}
              >
                {this.state.errorMessage}
              </p>
            )}
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => this.setState({ hasError: false, errorMessage: null })}
                className="carbon-btn inline-flex items-center gap-2"
              >
                <RotateCcw size={14} /> Try Again
              </button>
              <Link href="/" className="carbon-btn-ghost inline-flex items-center gap-2 !px-3 !py-1.5 text-sm">
                <Home size={14} /> Go Home
              </Link>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
