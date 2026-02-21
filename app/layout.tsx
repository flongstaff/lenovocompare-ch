import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import ErrorBoundary from "@/components/ui/ErrorBoundary";

export const metadata: Metadata = {
  metadataBase: new URL("https://lenovocompare.ch"),
  title: {
    default: "LenovoCompare CH — Swiss Laptop Comparison",
    template: "%s — LenovoCompare CH",
  },
  description:
    "Compare 98+ Lenovo laptops across ThinkPad, IdeaPad Pro, and Legion lineups with Swiss pricing, scoring, and hardware analysis.",
  openGraph: {
    type: "website",
    locale: "de_CH",
    siteName: "LenovoCompare CH",
  },
};

const RootLayout = ({ children }: Readonly<{ children: React.ReactNode }>) => (
  <html lang="en">
    <body className="bg-carbon-900 text-carbon-50 flex min-h-screen flex-col font-sans antialiased">
      <Header />
      <ErrorBoundary>
        <main className="flex-1">{children}</main>
      </ErrorBoundary>
      <Footer />
    </body>
  </html>
);

export default RootLayout;
