# License Compliance Auditor

Audit all npm dependencies (production and dev) for MIT license compatibility. The project is MIT-licensed, so all dependencies must use compatible licenses.

## When to Use

- After adding new dependencies
- During periodic dependency audits
- Before releases or open-source publication

## Procedure

1. **Extract all dependency licenses**:

   ```bash
   npx license-checker --json --production 2>/dev/null || npm ls --all --json 2>/dev/null
   ```

   If `license-checker` is not installed, manually check `node_modules/*/package.json` for the `license` field.

2. **Classify each license** into compatibility tiers:

   | Tier                        | Licenses                                                                   | Compatible with MIT?            |
   | --------------------------- | -------------------------------------------------------------------------- | ------------------------------- |
   | **Permissive** (OK)         | MIT, ISC, BSD-2-Clause, BSD-3-Clause, Apache-2.0, 0BSD, Unlicense, CC0-1.0 | Yes                             |
   | **Weak copyleft** (Review)  | LGPL-2.1, LGPL-3.0, MPL-2.0                                                | Yes, with conditions            |
   | **Strong copyleft** (Block) | GPL-2.0, GPL-3.0, AGPL-3.0                                                 | No — would force project to GPL |
   | **Unknown/Custom** (Review) | Unlicensed, custom, or missing license field                               | Needs manual review             |

3. **Check transitive dependencies**:
   - Production deps and their full dependency trees
   - Dev deps are lower risk (not distributed) but still worth noting

4. **Flag issues**:
   - Any production dependency with GPL/AGPL license
   - Any dependency with no license field
   - Any dependency with a custom or unusual license
   - Dual-licensed packages where one option is copyleft

5. **Verify `LICENSE` file** in project root matches declared license in `package.json`.

## Output Format

```markdown
## License Compliance Report

### Summary

- **Total production deps**: [count]
- **Total dev deps**: [count]
- **All compatible**: Yes/No

### License Distribution

| License    | Count | Type       |
| ---------- | ----- | ---------- |
| MIT        | X     | Permissive |
| ISC        | X     | Permissive |
| Apache-2.0 | X     | Permissive |
| ...        | ...   | ...        |

### Issues Found

#### Blockers (must resolve before release)

- [package@version]: GPL-3.0 — [action needed]

#### Warnings (review recommended)

- [package@version]: LGPL-2.1 — acceptable for dynamic linking
- [package@version]: no license field — check repo manually

### Recommendations

1. [prioritized actions]
```

## Key Files

- `package.json` — project license declaration (`"license": "MIT"`)
- `LICENSE` — full MIT license text
- `node_modules/*/package.json` — per-dependency license fields
- `package-lock.json` — full dependency tree for transitive checks
