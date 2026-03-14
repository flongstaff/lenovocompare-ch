import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import Header from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import ErrorBoundary from "@/components/ui/ErrorBoundary";
import ServiceWorkerRegistrar from "@/components/ui/ServiceWorkerRegistrar";

export const metadata: Metadata = {
  metadataBase: new URL("https://lenovocompare.ch"),
  title: {
    default: "LenovoCompare CH — Swiss Laptop Comparison",
    template: "%s — LenovoCompare CH",
  },
  description:
    "Compare 124+ Lenovo laptops across ThinkPad, IdeaPad Pro, Legion, and Yoga lineups with Swiss pricing, scoring, and hardware analysis.",
  openGraph: {
    type: "website",
    locale: "de_CH",
    siteName: "LenovoCompare CH",
  },
  other: {
    "geo.region": "CH",
    "geo.placename": "Switzerland",
  },
};

const RootLayout = ({ children }: Readonly<{ children: React.ReactNode }>) => (
  <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`} suppressHydrationWarning>
    <head>
      <meta
        httpEquiv="Content-Security-Policy"
        content="default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self' https://lenovocompare-prices.franco-longstaff.workers.dev; frame-ancestors 'none'"
      />
      <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
      <meta httpEquiv="Referrer-Policy" content="strict-origin-when-cross-origin" />
      <script
        dangerouslySetInnerHTML={{
          __html: `(function(){try{var t=localStorage.getItem("lenovocompare-theme");if(t==="light"||t==="dark"){document.documentElement.setAttribute("data-theme",t)}else if(window.matchMedia("(prefers-color-scheme:light)").matches){document.documentElement.setAttribute("data-theme","light")}else{document.documentElement.setAttribute("data-theme","dark")}}catch(e){document.documentElement.setAttribute("data-theme","dark")}})()`,
        }}
      />
    </head>
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
      <ServiceWorkerRegistrar />
    </body>
  </html>
);

export default RootLayout;
