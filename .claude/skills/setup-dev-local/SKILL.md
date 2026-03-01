---
name: setup-dev-local
description: Bootstrap a local dev environment (Node + Python + Playwright) without Docker
disable-model-invocation: true
---

# Local Developer Environment Setup

When the user runs `/setup-dev-local`, bootstrap the development environment using local tooling (no Docker).

## Workflow

### Step 1: Check Current State

```bash
node -v
npm -v
[ -d .venv ] && echo "venv exists" || echo "venv missing"
.venv/bin/python -c "import openpyxl, pdfplumber, pandas; print('Python deps OK')" 2>/dev/null || echo "Python deps missing"
npx playwright --version 2>/dev/null || echo "Playwright missing"
[ -f .env.local ] && echo ".env.local exists" || echo ".env.local missing"
```

### Step 2: Install Missing Components

Only install what's missing:

#### Node Dependencies

```bash
npm install
```

#### Python Virtual Environment

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install openpyxl pdfplumber pandas
```

#### Playwright Browsers

```bash
npx playwright install chromium
```

#### Environment File

```bash
cp .env.example .env.local
```

Then tell the user to fill in any required API keys.

### Step 3: Verify

```bash
echo "=== Node ===" && node -v
echo "=== TypeScript ===" && npx tsc --version
echo "=== Python ===" && .venv/bin/python -c "import openpyxl, pdfplumber, pandas; print('All packages OK')"
echo "=== Playwright ===" && npx playwright --version
echo "=== Env ===" && [ -f .env.local ] && echo ".env.local exists" || echo "Create .env.local from .env.example"
echo "=== Build ===" && npm run build 2>&1 | tail -3
```

### Step 4: Report Status

```
Dev Environment Status:
  Node: v22.x
  Python venv: openpyxl, pdfplumber, pandas
  Playwright: chromium installed
  .env.local: configured
  Build: passing

Ready to develop! Run: npm run dev
```

## Prerequisites

- Node.js 18+ (via nvm recommended)
- Python 3.9+
- macOS or Linux (Windows needs WSL)
