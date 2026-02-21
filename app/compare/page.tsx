import type { Metadata } from "next";
import CompareClient from "./CompareClient";

export const metadata: Metadata = {
  title: "Compare Laptops — LenovoCompare CH",
  description:
    "Compare Lenovo laptop specs side by side. Select up to 4 ThinkPad, IdeaPad Pro, or Legion models to see how they stack up in performance, display, weight, and Swiss pricing.",
  alternates: { canonical: "/compare" },
  openGraph: {
    title: "Compare Laptops — LenovoCompare CH",
    description: "Compare Lenovo laptop specs side by side. Select up to 4 models.",
  },
};

const ComparePage = () => <CompareClient />;

export default ComparePage;
