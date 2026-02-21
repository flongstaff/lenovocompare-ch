import type { Metadata } from "next";
import PricingClient from "./PricingClient";

export const metadata: Metadata = {
  title: "Swiss Pricing — LenovoCompare CH",
  description:
    "User-contributed Swiss Lenovo laptop prices in CHF. Add, export, and import pricing data for ThinkPad, IdeaPad Pro, and Legion models available in Switzerland.",
  alternates: { canonical: "/pricing" },
  openGraph: {
    title: "Swiss Pricing — LenovoCompare CH",
    description: "User-contributed Swiss Lenovo laptop prices in CHF.",
  },
};

const PricingPage = () => <PricingClient />;

export default PricingPage;
