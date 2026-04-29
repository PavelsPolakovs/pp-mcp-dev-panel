# Project Makefile for mcp-dev-panel
NPM ?= npm
CLIENT_DIR := client
SERVER_DIR := server

.PHONY: help install server-install client-install dev server-dev client-dev \
        build client-build server-start start lint server-test client-test clean prettier format

help:
	@echo "Usage: make <target>"
	@echo ""
	@echo "Common targets:"
	@echo "  install         Install dependencies for server and client"
	@echo "  server-install  Install server dependencies"
	@echo "  client-install  Install client dependencies"
	@echo "  dev             How to run both dev servers (see details)"
	@echo "  server-dev      Run server dev (npm run server:dev)"
	@echo "  client-dev      Run client dev (vite)"
	@echo "  build           Build the client"
	@echo "  client-build    Build client (vite build)"
	@echo "  start           Start server and preview client"
	@echo "  lint            Run eslint (requires npx eslint available)"
	@echo "  server-test     Run tests in server (if defined)"
	@echo "  client-test     Run tests in client (if defined)"
	@echo "  clean           Remove build outputs and node_modules"



### Dependency installation
# Install dependencies for both server and client
install:
	@echo "Installing dependencies..."
	npm i
	@echo "Dependencies installed."



# Development helpers
# Note: recommended to run server-dev and client-dev in separate terminals (or use tmux).
dev:
	@echo "Run 'make server-dev' in one terminal and 'make client-dev' in another."
	@echo "If you want to attempt to run both from one shell, use 'make dev-run'."

# Run server dev (node --watch index.js). The client should be built before running this, as the server serves the built client from /dist.
server-dev:
	npm run server:dev

# Run client dev (vite)
client-dev:
	npm run client:dev



# Build / start
build: client-build

client-build:
	npm run client:build

server-start:
	npm run server:start

start:
	@echo "Starting server and previewing client."
	# Start server in background and preview client (preview runs in foreground)
	npm run server:start & npm run client:preview



# Lint & tests
prettier:
	@echo "Running prettier check (requires prettier available via npx or installed deps)..."
	npx prettier --check . || true

format:
	@echo "Formatting code with prettier (requires prettier available via npx or installed deps)..."
	npx prettier --write .

lint:
	@echo "Running eslint (requires eslint available via npx or installed deps)..."
	npx eslint . --ext .js,.jsx,.ts,.tsx || true

server-test:
	@echo "Running server tests (if 'test' script exists)..."
	cd $(SERVER_DIR) && $(NPM) test || true

client-test:
	@echo "Running client tests (if 'test' script exists)..."
	cd $(CLIENT_DIR) && $(NPM) test || true


# Perform a clean by removing build outputs and node_modules. Use with caution!
clean:
	@echo "Cleaning build outputs and node_modules..."
	rm -rf $(CLIENT_DIR)/dist
	rm -rf /node_modules

