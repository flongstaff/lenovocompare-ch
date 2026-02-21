import type { MetadataRoute } from "next";
import { laptops } from "@/data/laptops";

const LAST_UPDATED = new Date("2026-02-19");

const sitemap = (): MetadataRoute.Sitemap => {
  const baseUrl = "https://lenovocompare.ch";

  const modelPages = laptops.map((model) => ({
    url: `${baseUrl}/model/${model.id}`,
    lastModified: LAST_UPDATED,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [
    { url: baseUrl, lastModified: LAST_UPDATED, changeFrequency: "weekly", priority: 1.0 },
    { url: `${baseUrl}/compare`, lastModified: LAST_UPDATED, changeFrequency: "weekly", priority: 0.7 },
    { url: `${baseUrl}/hardware`, lastModified: LAST_UPDATED, changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/pricing`, lastModified: LAST_UPDATED, changeFrequency: "daily", priority: 0.9 },
    ...modelPages,
  ];
};

export default sitemap;
