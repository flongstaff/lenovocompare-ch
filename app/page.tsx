import type { Metadata } from "next";
import HomeClient from "./HomeClient";

export const metadata: Metadata = {
  title: "Compare 100+ Lenovo Laptops — Swiss Pricing",
  description:
    "Side-by-side comparison of ThinkPad, IdeaPad Pro, Legion, and Yoga laptops with Swiss CHF pricing, CPU/GPU benchmarks, and scores.",
};

const HomePage = () => <HomeClient />;

export default HomePage;
