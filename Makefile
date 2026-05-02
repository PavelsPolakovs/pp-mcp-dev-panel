# MCP Dev Panel — Makefile
#
# One canonical approach: `make dev` does an initial production-quality
# build of the client, then concurrently watches the client (rebuilds on
# any file change) and the server (auto-restarts via `node --watch`).
# Both serve from a single origin — http://localhost:3333. No HMR, no
# Vite dev server, no preview server, no port juggling. After saving a
# file, refresh the browser tab to see the change.
#
# All other targets are quality gates (`lint`, `typecheck`, `format`,
# `format-check`, `ci`) and housekeeping (`install`, `clean`, `clean-all`).
# The MCP stdio transport is exposed by `node server/index.ts` and is
# typically launched by an MCP host (e.g. Claude Code) — not via make.

NPM ?= npm

.DEFAULT_GOAL := help

.PHONY: help install dev lint format format-check typecheck ci test clean clean-all

## ——— General ————————————————————————————————————————————————————————————————

help: ## Show this help message
	@grep -E '^[a-zA-Z_-]+:.*##' $(MAKEFILE_LIST) | \
	  awk 'BEGIN {FS = ":.*##"}; {printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2}' | sort

install: ## Install all project dependencies
	$(NPM) install

## ——— Run ————————————————————————————————————————————————————————————————————

dev: ## Build the client and start the server on http://localhost:3333 (watches both)
	$(NPM) run dev

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
