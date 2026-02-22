---
name: generate-data-schema
description: Auto-generate data schema documentation from lib/types.ts Laptop interface
---

## Steps

1. Read `lib/types.ts` — parse the `Laptop` interface and all referenced types
2. For each field, extract: name, type, whether optional (?), description from comments
3. Also parse: `Lineup`, `Series`, `LinuxStatus`, `Keyboard`, `GamingTier`, `SwissPrice`, `LinuxCompatEntry`, `ModelBenchmarks`, `BenchmarkSource`
4. Generate a markdown table for each type with columns: Field | Type | Required | Description
5. Write output to `docs/data-schema.md`
6. Include a header noting this was auto-generated and the source file
