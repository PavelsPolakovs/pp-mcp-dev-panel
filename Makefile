# MCP Dev Panel — Makefile
#
# Two run modes, single origin (http://localhost:3333):
#
#   make dev      Development. Initial client build + two concurrent watchers
#                 (vite rebuilds the client on save, node --watch restarts
#                 the server). Refresh the browser tab to see changes.
#
#   make start    Production. Builds the client one-shot and runs the server
#                 with NODE_ENV=production and no watcher. Use for local
#                 production parity or as the entry point on a deployment
#                 host.
#
#   make build    Just builds the client into client/dist (no server run).
#                 Useful in CI pipelines where build and run are separate
#                 stages.
#
# All other targets are quality gates (`lint`, `typecheck`, `format`,
# `format-check`, `ci`) and housekeeping (`install`, `clean`, `clean-all`).
# The MCP stdio transport is exposed by `node server/index.ts` and is
# typically launched by an MCP host (e.g. Claude Code) — not via make.

NPM ?= npm

.DEFAULT_GOAL := help

.PHONY: help install dev build start lint format format-check typecheck ci test clean clean-all

## ——— General ————————————————————————————————————————————————————————————————

help: ## Show this help message
	@grep -E '^[a-zA-Z_-]+:.*##' $(MAKEFILE_LIST) | \
	  awk 'BEGIN {FS = ":.*##"}; {printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2}' | sort

install: ## Install all project dependencies
	$(NPM) install

## ——— Run ————————————————————————————————————————————————————————————————————

dev: ## Development. Build client + start server with watchers on http://localhost:3333
	$(NPM) run dev

## ——— Production —————————————————————————————————————————————————————————————

build: ## Build the client into client/dist (one-shot, no server run)
	$(NPM) run build

start: ## Production. Build client + run server (NODE_ENV=production, no watch)
	$(NPM) run start

## ——— Quality ————————————————————————————————————————————————————————————————

lint: ## Run ESLint across all TypeScript and JavaScript source files
	$(NPM) run lint

format: ## Auto-format all source files with Prettier (writes changes in place)
	$(NPM) run format

format-check: ## Verify formatting with Prettier without writing changes
	$(NPM) run format:check

typecheck: ## Type-check both the client and server TypeScript projects (no emit)
	$(NPM) run typecheck

ci: ## Run all quality checks — lint, typecheck, format:check
	$(NPM) run ci

test: ## Run the test suite (no runner configured yet — exits non-zero)
	$(NPM) run test

## ——— Maintenance ————————————————————————————————————————————————————————————

clean: ## Remove build output (client/dist, server/dist)
	$(NPM) run clean

clean-all: ## Remove build output AND node_modules
	$(NPM) run clean:all
