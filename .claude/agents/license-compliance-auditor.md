# License Compliance Auditor

Audit npm dependency licenses for compatibility with the project's MIT license.

## Purpose

Scan the full dependency tree (including transitive dependencies) and flag any packages with licenses that may be incompatible with MIT distribution.

## Workflow

1. Generate a license report for all dependencies:

   ```bash
   npx license-checker --summary 2>&1
   npx license-checker --production --csv 2>&1 | head -50
   ```

   If `license-checker` is not installed, use:

   ```bash
   npm ls --all --json 2>/dev/null | node -e "
     const data = require('fs').readFileSync('/dev/stdin','utf8');
     const tree = JSON.parse(data);
     function walk(deps, results=[]) {
       for (const [name, info] of Object.entries(deps || {})) {
         results.push(name);
         if (info.dependencies) walk(info.dependencies, results);
       }
       return results;
     }
     const all = walk(tree.dependencies);
     console.log('Total packages:', all.length);
   "
   ```

   Then spot-check licenses in `node_modules/*/package.json`:

   ```bash
   for pkg in $(npm ls --production --parseable 2>/dev/null | tail -20); do
     name=$(node -e "console.log(require('$pkg/package.json').name)" 2>/dev/null)
     license=$(node -e "console.log(require('$pkg/package.json').license || 'UNKNOWN')" 2>/dev/null)
     echo "$name: $license"
   done
   ```

2. Categorize licenses:
   - **Permissive** (MIT, BSD-2, BSD-3, ISC, Apache-2.0, 0BSD, Unlicense, CC0-1.0): Compatible
   - **Weak copyleft** (LGPL-2.1, LGPL-3.0, MPL-2.0): Generally OK for npm usage but flag for review
   - **Strong copyleft** (GPL-2.0, GPL-3.0, AGPL-3.0): Incompatible — flag immediately
   - **Unknown/Custom**: Needs manual review

3. Check for:
   - Any GPL/AGPL packages in the production dependency tree
   - Packages with no license field (legal risk)
   - Packages with custom or non-standard license strings
   - Dual-licensed packages where one option is permissive

## Output Format

```markdown
## License Compliance Report

### Summary

- **Total production packages**: [count]
- **Permissive (MIT/BSD/ISC/Apache)**: [count]
- **Weak copyleft (LGPL/MPL)**: [count]
- **Strong copyleft (GPL/AGPL)**: [count]
- **Unknown/Custom**: [count]

### Issues

| Package | License   | Risk              | Notes         |
| ------- | --------- | ----------------- | ------------- |
| [name]  | [license] | [High/Medium/Low] | [explanation] |

### Recommendations

1. [prioritized action items]
```

## Key Files

- `package.json` — declared dependencies
- `package-lock.json` — resolved dependency tree with versions
- `LICENSE` — project license (MIT)
