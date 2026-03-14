import type { Metadata } from "next";
import CompareClient from "./CompareClient";

export const metadata: Metadata = {
  title: "Compare Lenovo Laptops Side by Side | Specs, Scores & Prices",
  description:
    "Compare Lenovo laptop specs side by side. Select up to 4 ThinkPad, IdeaPad Pro, Legion, or Yoga models to see how they stack up in performance, display, weight, and Swiss CHF pricing.",
  alternates: { canonical: "/compare" },
  openGraph: {
    title: "Compare Lenovo Laptops Side by Side | Specs, Scores & Prices",
    description: "Compare Lenovo laptop specs side by side. Select up to 4 models.",
  },
};

const ComparePage = () => <CompareClient />;

export default ComparePage;
