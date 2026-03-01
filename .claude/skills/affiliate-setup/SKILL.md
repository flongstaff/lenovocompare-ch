---
name: affiliate-setup
description: One-time setup guide for free retailer affiliate and publisher programs
disable-model-invocation: true
---

# Affiliate & Publisher Program Setup

Free programs that provide price data access and/or revenue — no cost, no scraping needed.

## Programs

### 1. Geizhals/Toppreise Publisher Program

**What**: Free publisher partnership with Geizhals (owns Toppreise.ch). CPC model — they pay you per click-through.

**Benefits**:

- Revenue from outbound price comparison links (CPC)
- Potential API access for Swiss price data (ask during onboarding)
- Covers Toppreise.ch + Geizhals.de/at product data

**How to apply**:

- Email: `bd@geizhals.at`
- Subject: "Publisher Program Application — ThinkCompare.ch"

**Email template**:

```
Subject: Publisher Program Application — ThinkCompare.ch

Hi,

I run ThinkCompare.ch, a Swiss laptop comparison site focused on Lenovo
ThinkPad, IdeaPad Pro, and Legion models. We currently link to Toppreise.ch
for price comparisons and would like to join your Publisher Program.

Our site:
- ~100 laptop models with Swiss retail pricing
- Outbound links to Toppreise for price comparison
- Swiss audience (CH domain, CHF prices)

We'd be interested in:
1. Joining the CPC publisher program for Toppreise/Geizhals links
2. API access to Swiss price data (if available for publishers)

Could you share the application process and requirements?

Best regards,
[Your name]
ThinkCompare.ch
```

**After approval**:

- Replace plain Toppreise links with affiliate-tracked links
- Ask about their data feed/API — some publishers get product data exports
- Update `lib/retailers.ts` to use affiliate link format

---

### 2. Digitec/Galaxus Affiliate Program

**What**: Free affiliate program for Switzerland's largest electronics retailer. Commission-based — earn on referred purchases.

**Benefits**:

- Commission on purchases via your links
- Potential product feed access (ask during onboarding)
- Covers both Digitec.ch and Galaxus.ch

**How to apply**:

- URL: Check current application at `https://www.digitec.ch/de/wiki/affiliate` or `https://www.galaxus.ch/de/wiki/affiliate`
- Alternative: Email `affiliate@galaxus.de`
- Subject: "Affiliate Program Application — ThinkCompare.ch"

**Email template**:

```
Subject: Affiliate Program Application — ThinkCompare.ch

Hi,

I run ThinkCompare.ch, a Swiss laptop comparison site covering ~100 Lenovo
models with pricing from Swiss retailers including Digitec and Galaxus.

I'd like to join your affiliate program. Our site links directly to Digitec
and Galaxus product searches for each laptop model.

Questions:
1. What is the application process for the affiliate program?
2. Do affiliate partners get access to a product data feed or API?
3. Is there a specific link format for tracked referrals?

Best regards,
[Your name]
ThinkCompare.ch
```

**After approval**:

- Update `lib/retailers.ts` to use affiliate link format for Digitec/Galaxus
- If they provide a product feed, create an import script to update prices automatically

---

## Implementation checklist

After getting approved for either program:

1. [ ] Store affiliate IDs in `.env.local` (never commit to git)
2. [ ] Update `lib/retailers.ts` to append affiliate tracking params to URLs
3. [ ] Add disclosure text to the site footer (Swiss transparency requirement)
4. [ ] If API/feed access is granted, create an import script in `scripts/`
5. [ ] Update `CONTRIBUTING.md` to document the affiliate relationship

## Legal notes

- Both programs are **free to join** — they pay you, not the other way around
- Swiss law requires disclosure of affiliate relationships on the site
- Price data obtained through official partnerships is fully legal to display
- No scraping is involved — data comes through authorized channels
