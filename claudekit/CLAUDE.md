# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start Vite dev server (http://localhost:5173)
npm run build        # Production build to dist/
npm test             # Run all tests once
npm run test:watch   # Run tests in watch mode
npx vitest run src/fruits.test.js   # Run a single test file
```

`vite.config.js` sets `base` for GitHub Pages deployment. No vitest.config — uses defaults.

## Architecture

This is a Suika Game (watermelon merge puzzle) built with **vanilla JavaScript + Matter.js + Canvas2D**, bundled by Vite.

### Module Orchestration

`game.js` is the central orchestrator. The Game class owns the physics engine and game state, delegating to specialized modules:

- **physics.js** — Thin wrapper around Matter.js. Creates engine, walls, fruit bodies. Bodies are annotated with custom properties: `fruitTier` (0-10), `removing` (merge flag), `dropTime` (grace period timestamp).
- **merger.js** — Listens to Matter.js `collisionStart` events. Queues merges into a pending array; `flushMerges()` is called by the game loop *after* `Engine.update()` to avoid mid-step world mutation. Receives `addScore()` callback to stay decoupled from game state.
- **renderer.js** — Pure rendering: `render(ctx, bodies, state)` draws everything to Canvas2D with no side effects.
- **input.js** — Mouse/touch event binding + `clampX()` utility that accounts for fruit radius to keep drops within container walls.
- **fruits.js** — Static array of 11 fruit tiers. Only tiers 0-4 are randomly selected for dropping.
- **constants.js** — Single source of truth for all dimensions, physics tuning, and timing values.

### Key Patterns

- **Deferred merge processing**: Collisions are queued during physics events, then flushed after the engine step completes. This prevents Matter.js internal state corruption.
- **Grace period**: Newly dropped fruits have 1000ms immunity from game-over detection to prevent instant-loss on drops near the danger line.
- **State via callbacks**: `setupMergeHandler()` receives `getState()` and `addScore()` callbacks rather than importing game state directly.

## Testing

Tests are colocated (`src/*.test.js`) using Vitest with `describe/it/expect`. No mocking — tests use real Matter.js engine instances and pure function assertions. Physics integration tests step the engine 10-60 times and assert state changes.
