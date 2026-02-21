import type { Metadata } from "next";
import { laptops } from "@/data/laptops";
import { priceBaselines } from "@/data/price-baselines";
import ModelDetailClient from "./ModelDetailClient";

const BASE_URL = "https://lenovocompare.ch";

interface Props {
  params: Promise<{ id: string }>;
}

export const generateMetadata = async ({ params }: Props): Promise<Metadata> => {
  const { id } = await params;
  const model = laptops.find((m) => m.id === id);
  if (!model) {
    return { title: "Model Not Found — LenovoCompare CH" };
  }
  return {
    title: `${model.name} — LenovoCompare CH`,
    description: `${model.name} (${model.year}) specs, Swiss pricing, and scores. ${model.processor.name}, ${model.ram.size}GB ${model.ram.type}, ${model.display.size}" ${model.display.resolutionLabel}.`,
    alternates: { canonical: `/model/${id}` },
    openGraph: {
      title: `${model.name} — LenovoCompare CH`,
      description: `${model.name} (${model.year}) — ${model.processor.name}, ${model.ram.size}GB ${model.ram.type}, ${model.display.size}" ${model.display.resolutionLabel}.`,
    },
  };
};

const ModelDetailPage = async ({ params }: Props) => {
  const { id } = await params;
  const model = laptops.find((m) => m.id === id);

  const jsonLd = model
    ? {
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "Product",
            name: model.name,
            description: `${model.name} (${model.year}) — ${model.processor.name}, ${model.ram.size}GB ${model.ram.type}, ${model.display.size}" ${model.display.resolutionLabel}`,
            brand: { "@type": "Brand", name: "Lenovo" },
            category: "Laptops",
            url: `${BASE_URL}/model/${id}`,
            ...(priceBaselines[id] && {
              offers: {
                "@type": "AggregateOffer",
                priceCurrency: "CHF",
                lowPrice: priceBaselines[id].historicalLow,
                highPrice: priceBaselines[id].msrp,
                offerCount: 3,
              },
            }),
          },
          {
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: BASE_URL },
              {
                "@type": "ListItem",
                position: 2,
                name: model.series + " Series",
                item: `${BASE_URL}/?series=${model.series}`,
              },
              { "@type": "ListItem", position: 3, name: model.name, item: `${BASE_URL}/model/${id}` },
            ],
          },
        ],
      }
    : null;

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
        />
      )}
      <ModelDetailClient />
    </>
  );
};

export default ModelDetailPage;
