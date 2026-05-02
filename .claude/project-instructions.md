# pp-mcp-dev-panel — Project Instructions

## About

A local developer panel powered by MCP (Model Context Protocol) — lets Claude trigger project commands (e.g. lint) and stream the output to a live React UI in the browser. The server exposes MCP tools over stdio so any MCP-compatible host (e.g. Claude Desktop) can control the panel.

## Tech Stack

- **Language:** TypeScript 6, ESM (`"type": "module"`)
- **Server:** Node.js native TS (`node --watch`), Express 4, WebSocket (`ws`), `@modelcontextprotocol/sdk`
- **Client:** React 18, Vite 8, Tailwind CSS 3, react-router-dom 7, Zustand 5, i18next 26
- **Validation:** Zod
- **No database** — all state is in-memory / Zustand

## Project Structure

```
/server
  index.ts       — entry: creates HTTP server, attaches WS, connects MCP stdio transport
  app.ts         — Express app (CORS, JSON, router, static client/dist)
  routes.ts      — REST API: POST /api/run-tool, GET /api/status
  ws.ts          — WebSocket server; broadcast() pushes WsMessage to all clients
  mcp.ts         — MCP tools: open-dashboard, lint-project
  config.ts      — UI_PORT (default 3333), PROJECT_DIR env vars
  tools/
    lint.ts      — runs `npm run lint` in target dir, streams output via broadcast()

/client/src
  App.tsx              — router layout, WebSocket lifecycle
  store/useStore.ts    — Zustand store: logs, activeTask, wsConnected, theme, user, projectDir
  components/
    atoms/             — ThemeToggle, AppLogo
    molecules/         — CommandButton, SidebarNav
    organisms/         — Header, Sidebar, Terminal
    pages/             — DashboardPage, LogsPage, SettingsPage, UsersPage, PlaceholderPage
  config/navigation.ts — NAV_CONFIG drives sidebar sections and routes
  i18n/locales/en.ts  — all UI strings (no hardcoded English in JSX)
```

## Key Commands

```bash
make server-dev    # node --watch server/index.ts  →  :3333
make client-dev    # vite client --port 5173 (proxies /api and /ws to :3333)
make lint          # ESLint
make typecheck     # tsc --noEmit (client + server)
make format        # Prettier --write
make ci            # lint + typecheck + format:check
make client-build  # vite build → client/dist
make server-start  # production: serves built client + MCP stdio
```

No test runner configured (`make test` exits non-zero).

## Environment Variables

| Variable      | Default   | Description                                 |
| ------------- | --------- | ------------------------------------------- |
| `UI_PORT`     | `3333`    | HTTP + WebSocket port                       |
| `PROJECT_DIR` | repo root | Default target directory for tool execution |

## Architecture & Patterns

**Single HTTP server** does three things simultaneously: serves Express (REST + static), attaches a WebSocket server, and connects an MCP stdio transport. The stdio transport is how Claude (the MCP host) sends tool calls to the server.

**WsMessage** is the real-time protocol between server and browser: `task_start → output* → task_end`. The client feeds these directly into the Zustand log store.

**Atomic Design** governs component placement: atoms → molecules → organisms → pages. Each layer has a barrel `index.ts`. Import only via path aliases (`@atoms`, `@molecules`, `@organisms`, `@pages`, `@store`, `@config`, `@i18n`).

**Adding a new MCP tool:** register it in `server/mcp.ts`, wire a REST endpoint in `routes.ts`, optionally add a `CommandButton` on the Dashboard.

## Module Relationships

```
MCP host (Claude) → stdio → mcp.ts
                              ↓ broadcast()
Browser ← WebSocket ← ws.ts ← tools/lint.ts
Browser → /api/run-tool → routes.ts → tools/lint.ts
```

## Code Conventions

- ESM only — all imports use `.ts` extension on server (`import './ws.ts'`)
- All UI strings via `react-i18next` keys defined in `client/src/i18n/locales/en.ts`
- Navigation driven by `NAV_CONFIG` in `config/navigation.ts` — add routes there first
- Always add both folder and wildcard alias when extending `vite.config.ts` and `client/tsconfig.json`
- Commits: `Closes #N` to auto-close GitHub issues on merge to main

## Active Context / Open Tasks

- Several routes are placeholder pages (analytics, reports, orders, products, content, integrations) — not yet implemented
- No authentication or multi-user support
- No persistent storage — logs reset on page reload

## Important Notes

**`stdout` is reserved for the MCP protocol.** Never use `console.log` on the server — it writes to stdout and corrupts the MCP stdio transport. The codebase uses `process.stderr.write` for all server-side logging.

**Native Node.js TypeScript — not ts-node.** The server runs via `node --watch server/index.ts` using Node's built-in TS execution. `ts-node` appears in devDeps but is not used. There is no compilation step for the server.

**Server imports require explicit `.ts` extension.** Because the project is ESM + native Node TS, all server-side imports must include the `.ts` suffix (e.g. `import { broadcast } from './ws.ts'`). Omitting the extension causes a runtime error.

**Vite proxy is dev-only.** In development, Vite proxies `/api` and `/ws` to `:3333`. In production (`make server-start`), Express serves the built `client/dist` directly and handles all routes itself — no separate client server.
