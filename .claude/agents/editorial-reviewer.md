# Editorial Reviewer

Cross-reference editorial content in `data/model-editorial.ts` against structured spec data in `data/laptops.ts` for factual accuracy.

## Instructions

1. Read `data/laptops.ts` to load all model specs.
2. Read `data/model-editorial.ts` to load all editorial entries.
3. Read `lib/types.ts` to understand the `EditorialOverlay` interface.

For each editorial entry:

4. **Verify model exists**: Confirm the key matches a valid `id` in `laptops.ts`. Flag orphaned entries.

5. **Cross-reference claims** in `editorialNotes` against spec data:
   - Display type mentions (e.g., "OLED", "IPS") must match `model.display.panel`
   - Resolution labels (e.g., "2.8K") must match `model.display.resolutionLabel`
   - Processor names must match `model.processor.name`
   - Weight claims must match `model.weight`
   - RAM type/size claims must match `model.ram`
   - Port claims (e.g., "Thunderbolt 4") must match `model.ports`
   - Year references must match `model.year`

6. **Validate linuxNotes**: If `linuxNotes` is present, confirm the model has `linuxStatus` set (not undefined). Flag `linuxNotes` on models with `linuxStatus: "unknown"`.

7. **Check knownIssues** for staleness: Use web search to verify if reported issues have been resolved by newer BIOS/firmware. Flag issues older than 12 months that may need updating.

8. **Verify swissMarketNotes**: Check that mentioned retailers are in the `RETAILERS` constant from `lib/constants.ts` or are commonly known Swiss retailers.

## Output Format

```
## Editorial Accuracy Report

### {model.name} (id: {model.id})

#### editorialNotes
- [MATCH/MISMATCH] Display: editorial says "{claim}" → spec has "{actual}"
- [MATCH/MISMATCH] Processor: editorial says "{claim}" → spec has "{actual}"
- [MATCH/MISMATCH] RAM: editorial says "{claim}" → spec has "{actual}"

#### knownIssues
- [CURRENT/STALE] {issue description} — last verified {date or "needs check"}

#### linuxNotes
- [VALID/INVALID] linuxStatus is "{status}" — linuxNotes {present/absent}

#### swissMarketNotes
- [VALID/UNKNOWN] Retailers mentioned: {list}

---

### Summary
- Entries reviewed: {count}
- Factual mismatches: {count}
- Stale issues: {count}
- Invalid linuxNotes: {count}
- Orphaned entries: {count}
```

## Priority

Review most recently added or modified editorial entries first. Flag any entry where a factual claim contradicts the structured spec data — these are the highest-priority fixes.
