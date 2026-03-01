import type { Metadata } from "next";
import Link from "next/link";
import { Search, Laptop, Gamepad2, Briefcase, FlipVertical2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Page Not Found",
  description: "The page you're looking for doesn't exist or the model ID is invalid.",
};

const NotFound = () => (
  <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
    <p className="mb-2 text-6xl font-bold text-trackpoint">404</p>
    <h1 className="mb-2 text-xl font-semibold text-carbon-100">Page not found</h1>
    <p className="mb-6 max-w-md text-sm text-carbon-400">
      The model ID may be invalid or this page has moved. Browse all 124+ models or try a different lineup below.
    </p>

    <div className="mb-6 flex flex-wrap justify-center gap-2">
      <Link href="/" className="carbon-btn text-sm">
        <Search size={14} />
        Browse all models
      </Link>
    </div>

    <div className="flex flex-wrap justify-center gap-2">
      {[
        { icon: Briefcase, label: "ThinkPad", color: "border-carbon-600 text-carbon-300 hover:bg-carbon-700/40" },
        {
          icon: Laptop,
          label: "IdeaPad Pro",
          color: "border-lineup-ideapad/40 text-lineup-ideapad hover:bg-lineup-ideapad/10",
        },
        {
          icon: Gamepad2,
          label: "Legion",
          color: "border-lineup-legion/40 text-lineup-legion hover:bg-lineup-legion/10",
        },
        {
          icon: FlipVertical2,
          label: "Yoga",
          color: "border-lineup-yoga/40 text-lineup-yoga hover:bg-lineup-yoga/10",
        },
      ].map((lineup) => (
        <Link
          key={lineup.label}
          href={`/?lineup=${encodeURIComponent(lineup.label)}`}
          className={`flex items-center gap-1.5 border px-3 py-1.5 text-xs font-medium transition-colors ${lineup.color}`}
        >
          <lineup.icon size={13} />
          {lineup.label}
        </Link>
      ))}
    </div>
  </div>
);

export default NotFound;
