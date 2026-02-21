import type { Metadata } from "next";
import ValidateClient from "./ValidateClient";

export const metadata: Metadata = {
  title: "Data Validation — LenovoCompare CH",
  description: "Data integrity checks across all laptop models, benchmarks, and pricing data",
};

const ValidatePage = () => <ValidateClient />;
export default ValidatePage;
