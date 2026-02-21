---
name: add-editorial
description: Add curated editorial notes for a laptop model
disable-model-invocation: true
---

# Add Editorial Notes

Add or update curated editorial content in `data/model-editorial.ts` for a laptop model (ThinkPad, IdeaPad Pro, or Legion).

## Arguments

`/add-editorial {model-id}` — e.g., `/add-editorial t14-gen6-amd`

## Workflow

1. **Validate model**: Read `data/laptops.ts` and confirm the model ID exists. If not, list similar IDs and ask the user to clarify.

2. **Check existing editorial**: Read `data/model-editorial.ts`. If the model already has an entry, show it and ask whether to update or replace specific fields.

3. **Gather editorial content** from the user or research. The `EditorialOverlay` interface (in `lib/types.ts`) has four optional fields:

   | Field              | Guidance                                                                                                                                                                             |
   | ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
   | `editorialNotes`   | 2-3 sentence overview of what makes this model notable. Reference generation changes, chassis, key specs. Must be original text derived from public PSREF specs — no copied reviews. |
   | `knownIssues`      | Documented issues from Lenovo forums, BIOS advisories, or community reports. Include fix status (e.g., "resolved in BIOS 1.10+"). Omit if none known.                                |
   | `swissMarketNotes` | Swiss availability, retailer notes, pricing context, educational discounts, keyboard layout (QWERTZ). Omit if nothing Switzerland-specific to say.                                   |
   | `linuxNotes`       | Kernel requirements, driver status, certified distros, fingerprint/wifi quirks. Only include if the model has `linuxStatus` set.                                                     |

4. **Research** (if user doesn't provide content): Use web search to gather factual information:
   - PSREF page for spec verification
   - Lenovo support forums for known issues
   - Ubuntu certification page for Linux status
   - Swiss retailer sites (Digitec, Brack) for market availability

5. **Add the entry** to the `modelEditorial` record in `data/model-editorial.ts`:

   ```ts
   "model-id": {
     editorialNotes: "...",
     knownIssues: "...",       // omit key entirely if none
     swissMarketNotes: "...",  // omit key entirely if not relevant
     linuxNotes: "...",        // omit key entirely if no linuxStatus
   },
   ```

6. **Verify**: Run `npm run build` to confirm no type errors.

## Content Guidelines

- All text must be original — derived from public specifications, forum posts, and retailer listings
- Keep each field to 1-3 sentences; concise and factual
- Do not copy text from reviews or benchmark sites
- Reference specific BIOS versions, kernel versions, or driver versions where applicable
- Swiss market notes should reference actual Swiss retailers and CHF pricing context
- If a model's `linuxStatus` is `"unknown"`, do not add `linuxNotes`
