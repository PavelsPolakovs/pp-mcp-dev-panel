# MCP Dev Panel — Makefile
# All commands delegate to npm scripts defined in package.json.
# Run `make help` to see available targets.

NPM ?= npm

.PHONY: help install dev server-dev client-dev build client-build server-start start \
        lint format format-check typecheck ci test clean clean-all

## ——— General ————————————————————————————————————————————————————————————————

help: ## Show this help message
	@grep -E '^[a-zA-Z_-]+:.*##' $(MAKEFILE_LIST) | \
	  awk 'BEGIN {FS = ":.*##"}; {printf "  \033[36m%-18s\033[0m %s\n", $$1, $$2}' | sort

install: ## Install all project dependencies (npm install)
	$(NPM) install

## ——— Development ————————————————————————————————————————————————————————————

dev: ## Print instructions for running client and server dev servers concurrently
	@echo "Run 'make server-dev' in one terminal and 'make client-dev' in another."
	@echo "Tip: use tmux or a split terminal for convenience."

server-dev: ## Start the server in watch mode — auto-restarts on any file change
	$(NPM) run server:dev

client-dev: ## Start the Vite dev server for the client on port 5173 with HMR
	$(NPM) run client:dev

## ——— Build & Start ——————————————————————————————————————————————————————————

build: client-build ## Build all artefacts (alias for client-build)

client-build: ## Compile and bundle the React client for production into client/dist
	$(NPM) run client:build

server-start: ## Start the server in production mode — serves the built client from client/dist
	$(NPM) run server:start

start: ## Start server in the background and preview the built client concurrently
	$(NPM) run start

## ——— Quality ————————————————————————————————————————————————————————————————

lint: ## Run ESLint across all TypeScript and JavaScript source files
	$(NPM) run lint

format: ## Auto-format all source files with Prettier (writes changes in place)
	$(NPM) run format

format-check: ## Check formatting with Prettier without writing changes — use in CI
	$(NPM) run format:check

typecheck: ## Type-check both the client and server TypeScript projects (no emit)
	$(NPM) run typecheck

ci: ## Run all quality checks in sequence — lint, typecheck, format:check (for CI pipelines)
	$(NPM) run ci

test: ## Run the test suite (no runner configured yet — exits non-zero)
	$(NPM) run test

## ——— Maintenance ————————————————————————————————————————————————————————————

clean: ## Remove build output directories (client/dist, server/dist)
	$(NPM) run clean

clean-all: ## Remove build outputs AND node_modules — requires npm install afterwards
	$(NPM) run clean:all
