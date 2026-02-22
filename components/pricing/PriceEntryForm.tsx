"use client";
import { useState } from "react";
import { Plus } from "lucide-react";
import type { Laptop, PriceType } from "@/lib/types";
import { RETAILERS } from "@/lib/constants";

interface PriceEntryFormProps {
  readonly models: readonly Laptop[];
  readonly onAdd: (data: {
    laptopId: string;
    retailer: string;
    price: number;
    priceType?: PriceType;
    note?: string;
    url?: string;
  }) => void;
  readonly onToast?: (msg: string, type: "success" | "error") => void;
}

const PRICE_TYPES: readonly { value: PriceType; label: string }[] = [
  { value: "retail", label: "Retail" },
  { value: "sale", label: "Sale" },
  { value: "refurbished", label: "Refurbished" },
  { value: "used", label: "Used / Marketplace" },
];

const isValidUrl = (s: string): boolean => {
  try {
    const u = new URL(s);
    return u.protocol === "https:" || u.protocol === "http:";
  } catch {
    return false;
  }
};

export const PriceEntryForm = ({ models, onAdd, onToast }: PriceEntryFormProps) => {
  const [laptopId, setLaptopId] = useState("");
  const [retailer, setRetailer] = useState(RETAILERS[0] as string);
  const [price, setPrice] = useState("");
  const [priceType, setPriceType] = useState<PriceType>("retail");
  const [note, setNote] = useState("");
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!laptopId) {
      setError("Please select a model.");
      return;
    }

    const numPrice = Number(price);
    if (!price || numPrice <= 0) {
      setError("Price must be greater than 0.");
      return;
    }
    if (numPrice > 99999) {
      setError("Price seems too high. Max CHF 99\u2019999.");
      return;
    }

    if (url && !isValidUrl(url)) {
      setError("URL must start with http:// or https://");
      return;
    }

    onAdd({
      laptopId,
      retailer,
      price: numPrice,
      priceType,
      note: note || undefined,
      url: url || undefined,
    });

    setLaptopId("");
    setPrice("");
    setNote("");
    setUrl("");
    onToast?.("Price added successfully", "success");
  };

  return (
    <form onSubmit={handleSubmit} className="carbon-card space-y-4 rounded-lg p-4">
      <h2 className="text-lg font-semibold" style={{ color: "var(--foreground)" }}>
        Add Price
      </h2>

      {error && (
        <div role="alert" className="rounded border border-red-700 bg-red-900/30 px-3 py-2 text-sm text-red-400">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div>
          <label htmlFor="price-model" className="mb-1 block text-xs" style={{ color: "var(--muted)" }}>
            Model
          </label>
          <select
            id="price-model"
            value={laptopId}
            onChange={(e) => setLaptopId(e.target.value)}
            className="carbon-select"
            required
          >
            <option value="">Select model...</option>
            {models.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="price-retailer" className="mb-1 block text-xs" style={{ color: "var(--muted)" }}>
            Retailer
          </label>
          <select
            id="price-retailer"
            value={retailer}
            onChange={(e) => setRetailer(e.target.value)}
            className="carbon-select"
          >
            {RETAILERS.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="price-amount" className="mb-1 block text-xs" style={{ color: "var(--muted)" }}>
            Price (CHF)
          </label>
          <input
            id="price-amount"
            type="number"
            min="1"
            max="99999"
            step="1"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="1499"
            className="carbon-input"
            required
          />
        </div>

        <div>
          <label htmlFor="price-type" className="mb-1 block text-xs" style={{ color: "var(--muted)" }}>
            Price Type
          </label>
          <select
            id="price-type"
            value={priceType}
            onChange={(e) => setPriceType(e.target.value as PriceType)}
            className="carbon-select"
          >
            {PRICE_TYPES.map((pt) => (
              <option key={pt.value} value={pt.value}>
                {pt.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="price-note" className="mb-1 block text-xs" style={{ color: "var(--muted)" }}>
            Note (optional)
          </label>
          <input
            id="price-note"
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="e.g. Black Friday 2024"
            className="carbon-input"
          />
        </div>

        <div>
          <label htmlFor="price-url" className="mb-1 block text-xs" style={{ color: "var(--muted)" }}>
            URL (optional)
          </label>
          <input
            id="price-url"
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://..."
            className="carbon-input"
          />
        </div>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-xs" style={{ color: "var(--muted)" }}>
          Prices include Swiss VAT (8.1%). Stored locally in your browser.
        </p>
        <button type="submit" className="carbon-btn">
          <Plus size={14} /> Add Price
        </button>
      </div>
    </form>
  );
};
