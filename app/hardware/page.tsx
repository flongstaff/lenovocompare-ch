import type { Metadata } from "next";
import HardwareClient from "./HardwareClient";

export const metadata: Metadata = {
  title: "Hardware Guide — LenovoCompare CH",
  description:
    "In-depth CPU and GPU analysis for every Lenovo laptop chip. Strengths, weaknesses, thermal notes, and alternatives to help you choose the right hardware.",
  alternates: { canonical: "/hardware" },
  openGraph: {
    title: "Hardware Guide — LenovoCompare CH",
    description:
      "In-depth CPU and GPU analysis for every Lenovo laptop chip. Strengths, weaknesses, thermal notes, and alternatives.",
    url: "https://lenovocompare.ch/hardware",
  },
};

const HardwarePage = () => <HardwareClient />;

export default HardwarePage;
