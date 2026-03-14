"use client";
import { useState } from "react";
import { Plus, AlertTriangle } from "lucide-react";
import type { Laptop, PriceType } from "@/lib/types";
import { RETAILERS } from "@/lib/constants";
import { validatePrice, MIN_PRICE_CHF, MAX_PRICE_CHF } from "@/lib/validators";

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
  const [priceWarning, setPriceWarning] = useState("");

  const handlePriceChange = (value: string) => {
    setPrice(value);
    if (!value) {
      setPriceWarning("");
      return;
    }
    const num = Number(value);
    if (Number.isFinite(num) && num > 0) {
      const result = validatePrice(num);
      setPriceWarning(result.warning ?? "");
    } else {
      setPriceWarning("");
    }
  };

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

    const validation = validatePrice(numPrice);
    if (!validation.valid) {
      setError(validation.warning ?? "Invalid price.");
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
    setPriceWarning("");
    setNote("");
    setUrl("");
    onToast?.("Price added successfully", "success");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="carbon-card space-y-4 p-4"
      aria-describedby={error ? "price-form-error" : undefined}
    >
      <h2 className="text-lg font-semibold" style={{ color: "var(--foreground)" }}>
        Add Price
      </h2>

      {error && (
        <div
          id="price-form-error"
          role="alert"
          className="border border-carbon-600 bg-carbon-800 px-3 py-2 text-sm text-trackpoint"
        >
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
            aria-required="true"
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
            min={MIN_PRICE_CHF}
            max={MAX_PRICE_CHF}
            step="1"
            value={price}
            onChange={(e) => handlePriceChange(e.target.value)}
            placeholder="1499"
            className="carbon-input"
            required
            aria-required="true"
            aria-describedby={priceWarning ? "price-range-warning" : undefined}
          />
          {priceWarning && (
            <p
              id="price-range-warning"
              className="mt-1 flex items-center gap-1 text-xs"
              style={{ color: "#f1c21b" }}
              role="status"
            >
              <AlertTriangle size={12} />
              {priceWarning}
            </p>
          )}
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
