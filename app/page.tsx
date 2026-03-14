import type { Metadata } from "next";
import HomeClient from "./HomeClient";

export const metadata: Metadata = {
  title: "Compare 124+ Lenovo Laptops | Swiss CHF Pricing & Benchmarks",
  description:
    "Side-by-side comparison of ThinkPad, IdeaPad Pro, Legion, and Yoga laptops with Swiss CHF pricing from Digitec, Brack & more. CPU/GPU benchmarks and scoring for every model.",
  alternates: { canonical: "/" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "LenovoCompare CH",
  url: "https://lenovocompare.ch",
  description:
    "Side-by-side comparison of ThinkPad, IdeaPad Pro, Legion, and Yoga laptops with Swiss CHF pricing and benchmarks.",
  inLanguage: "en",
  potentialAction: {
    "@type": "SearchAction",
    target: "https://lenovocompare.ch/?search={search_term_string}",
    "query-input": "required name=search_term_string",
  },
};

const HomePage = () => (
  <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    <HomeClient />
  </>
);

export default HomePage;
