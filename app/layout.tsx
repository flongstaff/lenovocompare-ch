import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
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
  <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
    <body className="flex min-h-screen flex-col bg-carbon-900 font-sans text-carbon-50 antialiased">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:bg-accent focus:px-4 focus:py-2 focus:text-white"
      >
        Skip to content
      </a>
      <Header />
      <ErrorBoundary>
        <main id="main-content" className="flex-1">
          {children}
        </main>
      </ErrorBoundary>
      <Footer />
    </body>
  </html>
);

export default RootLayout;
