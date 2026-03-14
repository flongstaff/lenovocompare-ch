import type { Metadata } from "next";
import DealsClient from "./DealsClient";

export const metadata: Metadata = {
  title: "Deals & Market",
  description:
    "Current Lenovo laptop deals in Switzerland, buy/wait signals, Swiss sale calendar, and RAM/storage market tracker. Find the best time to buy ThinkPad, IdeaPad Pro, Legion, and Yoga models.",
  alternates: { canonical: "/deals" },
  openGraph: {
    title: "Deals & Market",
    description: "Swiss Lenovo laptop deals, buying signals, and component market tracker.",
  },
};

const DealsPage = () => <DealsClient />;

export default DealsPage;
