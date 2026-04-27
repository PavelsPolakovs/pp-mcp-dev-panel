# Project Makefile for mcp-dev-panel
NPM ?= npm
CLIENT_DIR := client
SERVER_DIR := server

.PHONY: help install server-install client-install dev server-dev client-dev \
        build client-build server-start start lint server-test client-test clean

help:
	@echo "Usage: make <target>"
	@echo ""
	@echo "Common targets:"
	@echo "  install         Install dependencies for server and client"
	@echo "  server-install  Install server dependencies"
	@echo "  client-install  Install client dependencies"
	@echo "  dev             How to run both dev servers (see details)"
	@echo "  server-dev      Run server dev (node --watch index.js)"
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
	$(MAKE) server-install
	$(MAKE) client-install
	@echo "Installed server and client dependencies."

# Install dependencies for server.
server-install:
	@echo "Installing server dependencies..."
	cd $(SERVER_DIR) && $(NPM) install

# Install dependencies for client.
client-install:
	@echo "Installing client dependencies..."
	cd $(CLIENT_DIR) && $(NPM) install

# Development helpers
# Note: recommended to run server-dev and client-dev in separate terminals (or use tmux).
dev:
	@echo "Run 'make server-dev' in one terminal and 'make client-dev' in another."
	@echo "If you want to attempt to run both from one shell, use 'make dev-run'."

# Run server dev (node --watch index.js). The client should be built before running this, as the server serves the built client from /dist.
server-dev:
	cd $(SERVER_DIR) && $(NPM) run dev

# Run client dev (vite)
client-dev:
	cd $(CLIENT_DIR) && $(NPM) run dev

# Optional helper to try to run both in background (may behave differently across shells)
dev-run:
	@echo "Starting server and client in background (useful for quick local dev)."
	# start server in background, then client in foreground
	cd $(SERVER_DIR) && $(NPM) run dev & \
	cd $(CLIENT_DIR) && $(NPM) run dev

# Build / start
build: client-build

client-build:
	cd $(CLIENT_DIR) && $(NPM) run build

server-start:
	cd $(SERVER_DIR) && $(NPM) run start

start:
	@echo "Starting server and previewing client."
	# Start server in background and preview client (preview runs in foreground)
	cd $(SERVER_DIR) && $(NPM) run start & \
	cd $(CLIENT_DIR) && $(NPM) run preview

# Lint & tests
lint:
	@echo "Running eslint (requires eslint available via npx or installed deps)..."
	# run eslint from repo root; adjust path if you prefer per-subproject
	npx eslint . --ext .js,.jsx,.ts,.tsx || true

server-test:
	@echo "Running server tests (if 'test' script exists)..."
	cd $(SERVER_DIR) && $(NPM) test || true

client-test:
	@echo "Running client tests (if 'test' script exists)..."
	cd $(CLIENT_DIR) && $(NPM) test || true

clean:
	@echo "Cleaning build outputs and node_modules (client + server)..."
	rm -rf $(CLIENT_DIR)/dist
	rm -rf $(CLIENT_DIR)/node_modules
	rm -rf $(SERVER_DIR)/dist
	rm -rf $(SERVER_DIR)/node_modules

