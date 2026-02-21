import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Page Not Found — LenovoCompare CH",
  description: "The page you're looking for doesn't exist or the model ID is invalid.",
};

const NotFound = () => (
  <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
    <p className="text-trackpoint mb-2 text-6xl font-bold">404</p>
    <h1 className="text-carbon-100 mb-2 text-xl font-semibold">Page not found</h1>
    <p className="text-carbon-400 mb-6 max-w-md text-sm">
      The page you&apos;re looking for doesn&apos;t exist or the model ID is invalid.
    </p>
    <Link href="/" className="carbon-btn text-sm">
      Browse all laptops
    </Link>
  </div>
);

export default NotFound;
