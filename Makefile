# Makefile for philippjauss.gate107.com
# Replaces Gulp as the build orchestrator

NODE  := node
NPM   := npm
WATCH := npx onchange

.PHONY: all build clean watch serve setup

# Default target
all: build

# Full production build
build:
	$(NODE) build.mjs build

# Clean output directory
clean:
	$(NODE) build.mjs clean

# Development server with live reload
watch:
	$(WATCH) --poll --wait 0.5 'src/**/*.{html,scss,js}' 'src/img/**' -- npm run build --silent

# Static file server (for manual testing)
serve:
	npx serve app --listen 3000

# Install deps and do initial build
setup:
	$(NPM) install
