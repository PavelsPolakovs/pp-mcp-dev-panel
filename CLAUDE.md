# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

Single origin in every mode: `http://localhost:3333`.

```bash
# Development — watches client and server, rebuilds/restarts on save
make dev

# Production — builds client and runs server with NODE_ENV=production
make start

# CI build only — produces client/dist without running the server
make build

# Quality
make lint            # ESLint
make typecheck       # tsc --noEmit for both client and server
make format          # Prettier (writes)
make ci              # lint + typecheck + format:check (full pre-push check)

# Maintenance
make install         # npm install
make clean           # remove client/dist and server/dist
make clean-all       # clean + remove node_modules
```

**`make dev`**: initial `vite build client`, then concurrently runs
`vite build client --watch` and `node --watch server/index.ts` via
`concurrently`. Refresh the browser tab to see changes — no HMR.

**`make start`**: one-shot `vite build client`, then
`NODE_ENV=production node server/index.ts`. No watcher. Use for local
production parity or as the entry point on a deployment host.

**`make build`**: just `vite build client`. CI/CD pipelines that
separate build and run stages should use this.

There is no Vite dev server, no preview server, and no proxy in this
project — Express on :3333 serves the built client, REST API, and
WebSocket from a single origin in all modes.

No test runner is configured (`make test` exits non-zero).

### Rule: use `make` for everything project-related

When running any project task (build, run, lint, typecheck, format, install, clean, etc.) Claude Code MUST use the corresponding `make` target instead of invoking the underlying tool directly (`npm`, `npx`, `tsc`, `eslint`, `vite`, `prettier`, `node …`). The Makefile is the single source of truth — bypassing it risks running the wrong command, missing flags, or skipping steps that the target wraps.

If the task you need to run does not have a matching `make` target:

1. Do **not** silently fall back to `npm`/`npx`/raw tool invocations.
2. Stop and tell the user: `"There is no 'make <target>' for this. How would you like to proceed?"`
3. Offer concrete options, for example:
   - Add a new target to the `Makefile` (preferred when the command is reusable).
   - Run the underlying command once, ad-hoc, with the user's explicit approval.
   - Adjust the request so an existing target covers it.
4. Only proceed once the user picks an option.

## Architecture

The project is a developer panel for the Model Context Protocol (MCP). It is a monorepo with a single root `package.json` and two separate TypeScript projects sharing `tsconfig.base.json`.

### Server (`server/`)

Entry point is `server/index.ts`. It creates a single HTTP server that does three things simultaneously:

1. Serves the Express app (`app.ts`) — REST API + static `client/dist`
2. Attaches a WebSocket server (`ws.ts`) — broadcasts `WsMessage` events to all connected browser clients
3. Connects an MCP stdio transport (`mcp.ts`) — exposes tools to MCP hosts over stdin/stdout

The server runs via Node.js native TypeScript support (`node --watch server/index.ts`) — not ts-node or esbuild. Port defaults to `3333` (`UI_PORT` env var). `PROJECT_DIR` env var controls which directory the lint tool targets.

MCP tools defined in `mcp.ts`: `open-dashboard`, `lint-project`. Adding a new tool means registering it in `mcp.ts` and optionally wiring it to a REST endpoint in `routes.ts`.

Tool execution results are streamed to the UI via `broadcast()` from `ws.ts`.

### Client (`client/`)

React 18 + Vite (build only) + TypeScript + Tailwind CSS + react-router-dom v7 + i18next + Zustand.

The client bundle is built by `vite build` into `client/dist`; the Express server then serves those static assets alongside the API and WebSocket on the same origin (`:3333`). There is no Vite dev server in this project — `vite build --watch` rebuilds on file changes and the browser is refreshed manually.

**Component structure** follows Atomic Design — place components in the matching layer:

- `atoms/` — smallest reusable elements
- `molecules/` — atoms composed together
- `organisms/` — complex sections (Sidebar, Header, Terminal)
- `pages/` — top-level route components

Each layer has an `index.ts` barrel export. Import via path aliases only:

```ts
import { Header, Sidebar } from '@organisms'
import { CommandButton } from '@molecules'
import { ThemeToggle } from '@atoms'
import { useStore } from '@store/useStore'
```

Always add both the folder and wildcard alias when adding a new alias to `vite.config.ts` and `client/tsconfig.json`.

**Global state** is a single Zustand store at `client/src/store/useStore.ts`. It holds: `logs`, `activeTask`, `wsConnected`, `theme`, `user`, `projectDir`. The WebSocket connection is established in `App.tsx` on mount and feeds incoming messages directly into the store.

**i18n**: all UI strings go through `react-i18next`. Add keys to `client/src/i18n/locales/en.ts` — do not hardcode English strings in JSX.

**Navigation** items are driven by config in `client/src/config/navigation.ts`.

## Git workflow

See `.claude/skills/git/SKILL.md` for the full GitHub/GitLab operation reference.
Use `Closes #N` in commit messages to auto-close issues when the PR merges to main.

## .claude/ folder

The `.claude/` folder stores metadata for claude.ai Projects — it is NOT instructions for Claude Code.

- `.claude/project-instructions.md` — context snapshot for pasting into claude.ai Project Instructions. Claude Code ignores this file and always works directly with the real source files.
