# Config, MCP & Testing Gotchas

- When adding MCP servers, edit `.mcp.json` directly — `claude mcp add` cannot run inside a session. All servers use Docker (`docker run`), not npx
- GitHub tools are provided via Docker MCP (MCP_DOCKER), not a standalone server — use `mcp__MCP_DOCKER__` prefixed tools for PRs, issues, and code search
- `.mcp.json` is gitignored (machine-specific) — MCP server config won't transfer via git clone
- Bulk renames across codebase: use `Grep` to find all occurrences first, then `Edit` with `replace_all: true` per file — confirm the target name with user before starting
- Playwright MCP runs in Docker — cannot reach `localhost:3000` on the host. Use `npx playwright screenshot` (native CLI) instead of MCP for local screenshots
- Permission rules live in `.claude/settings.local.json` (machine-specific, 104 allow rules) — check there before adding to `settings.json`
- Hook tests using `sessionStorage` or `localStorage` need `beforeEach(() => { sessionStorage.clear(); localStorage.clear(); })` — state leaks between test cases via storage initializers
