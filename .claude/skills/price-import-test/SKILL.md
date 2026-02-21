---
name: price-import-test
description: Generate test payloads and verify the pricing import/export flow
disable-model-invocation: true
---

# Price Import Test

Validate the pricing page's import/export functionality with structured test payloads.

## Prerequisites

- Dev server running on localhost:3000
- Playwright MCP available

## Workflow

### 1. Generate test payloads

Create these JSON payloads for testing:

#### a. Valid payload (should import successfully)

```json
[
  {
    "laptopId": "x1-carbon-gen12",
    "retailer": "Digitec",
    "price": 1599,
    "dateAdded": "2025-01-15",
    "priceType": "retail",
    "note": "Import test — valid"
  },
  {
    "laptopId": "t14-gen5-intel",
    "retailer": "Brack",
    "price": 1299,
    "dateAdded": "2025-01-20",
    "priceType": "sale",
    "note": "Import test — sale price"
  }
]
```

#### b. Mixed valid/invalid payload (should import valid, skip invalid)

```json
[
  {
    "laptopId": "x1-carbon-gen12",
    "retailer": "Galaxus",
    "price": 1499,
    "dateAdded": "2025-02-01",
    "priceType": "retail"
  },
  {
    "retailer": "Missing ID",
    "price": 999,
    "dateAdded": "2025-02-01"
  },
  {
    "laptopId": "t14-gen5-intel",
    "price": -100,
    "dateAdded": "bad-date"
  }
]
```

#### c. Malformed JSON (should show error toast)

```
{ not valid json [
```

#### d. Empty array (edge case)

```json
[]
```

#### e. Refurbished price type (verify styling)

```json
[
  {
    "laptopId": "t14s-gen5-amd",
    "retailer": "Revendo",
    "price": 899,
    "dateAdded": "2025-01-10",
    "priceType": "refurbished",
    "note": "Import test — refurbished"
  }
]
```

### 2. Test each payload via Playwright

For each payload:

1. Navigate to `/pricing`
2. Click the "Import" button to open the textarea
3. Paste the payload into the textarea
4. Click "Import Prices"
5. Screenshot the result
6. Verify the toast message and price list

### 3. Test export round-trip

1. After importing valid data, click "Export"
2. Verify a file download is triggered (or check the blob URL)
3. The exported JSON should contain only user-added prices (not seed data)

### 4. Verify refurbished badge styling

After importing payload (e), find the refurbished price entry and verify:

- Badge shows "REFURBISHED" text
- Uses teal styling (not falling back to retail gray)
- Both on `/pricing` page (PriceDisplay) and on `/model/t14s-gen5-amd` (PriceHistoryCard timeline)

### 5. Cleanup

After testing, remove test prices via the UI (click trash icons on user-added entries) or clear localStorage key `lenovocompare-prices`.

### 6. Report

```
Price Import Test Report
========================
Valid payload:          ✅/❌ — Imported N prices, toast: "Imported 2 prices"
Mixed payload:          ✅/❌ — Imported 1, skipped 2, correct toast
Malformed JSON:         ✅/❌ — Error toast shown
Empty array:            ✅/❌ — Handled gracefully (no crash)
Refurbished styling:    ✅/❌ — Teal badge on PriceDisplay + PriceHistoryCard
Export round-trip:      ✅/❌ — Download triggered, JSON valid
Cleanup:                ✅/❌ — Test prices removed
```
