import type { Metadata } from "next";
import PricingClient from "./PricingClient";

export const metadata: Metadata = {
  title: "Swiss Pricing",
  description:
    "User-contributed Swiss Lenovo laptop prices in CHF. Add, export, and import pricing data for ThinkPad, IdeaPad Pro, Legion, and Yoga models available in Switzerland.",
  alternates: { canonical: "/pricing" },
  openGraph: {
    title: "Swiss Pricing",
    description: "User-contributed Swiss Lenovo laptop prices in CHF.",
  },
};

const PricingPage = () => <PricingClient />;

export default PricingPage;
