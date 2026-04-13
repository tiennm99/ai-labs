# Story 2.1: Best Score Tracking

Status: done

## Story

As a player,
I want to see my best score alongside my current score,
so that I have a motivational anchor and can track my all-time progress.

## Acceptance Criteria

1. When the current score exceeds the best score after a merge, the best score display updates immediately to match the current score
2. When the player starts a new game, the best score remains unchanged (it persists across games within the session)

## Tasks / Subtasks

- [x] Task 1: Add bestScore state to App.svelte (AC: #1, #2)
  - [x] Add `let bestScore = $state(0);` as a new reactive state variable
  - [x] Add `$effect` that watches `gameState.score` — when it exceeds `bestScore`, update `bestScore`
  - [x] Replace hardcoded `bestScore={0}` with `bestScore={bestScore}` in the ScoreBoard prop

- [x] Task 2: Preserve bestScore across New Game (AC: #2)
  - [x] Verify that `handleNewGame()` resets `gameState` via `initGame()` but does NOT reset `bestScore`
  - [x] `bestScore` is a separate `$state` variable, not part of `gameState` — it survives `initGame()` by design

- [x] Task 3: Verify existing tests still pass
  - [x] Run `npx vitest run` — all 38 existing tests must pass (no game-logic.js changes)

## Dev Notes

### Architecture Compliance

- **State ownership:** `bestScore` lives in `App.svelte` as a `$state` rune — NOT inside the game state object
- **Props-down pattern:** `App.svelte` passes `bestScore` to `ScoreBoard` via prop (already wired, just hardcoded to 0)
- **No game-logic.js changes:** Best score is a UI/session concern, not game logic. The game-logic module stays pure.
- **No storage.js yet:** localStorage persistence is Story 2.2. This story is in-memory only — best score resets on page refresh.

### Critical Anti-Patterns (DO NOT)

- DO NOT add `bestScore` to the `gameState` object — it is NOT part of the canonical game state shape `{ grid, score, won, keepPlaying }`
- DO NOT create a `storage.js` module yet — that is Story 2.2
- DO NOT use `$derived` for bestScore — it needs to be a `$state` that persists across game resets (derived would reset when gameState resets)
- DO NOT use Svelte stores (`writable`, `readable`) — this project uses Svelte 5 runes only

### Implementation Pattern

The correct pattern uses `$effect` to watch score changes:

```javascript
let bestScore = $state(0);

$effect(() => {
  if (gameState.score > bestScore) {
    bestScore = gameState.score;
  }
});
```

This works because:
- `$effect` runs whenever `gameState.score` changes (reactive dependency)
- `bestScore` is a separate `$state`, so `handleNewGame()` resetting `gameState = initGame()` (score=0) does NOT reset bestScore
- When a new game starts, `gameState.score` becomes 0, which is NOT > bestScore, so bestScore stays

### ScoreBoard Component

`ScoreBoard.svelte` already accepts `score` and `bestScore` props — no changes needed to the component:

```svelte
let { score = 0, bestScore = 0 } = $props();
```

The only change is in `App.svelte` line 58: replace `bestScore={0}` with `bestScore={bestScore}`.

### Previous Story Intelligence

From Epic 1 implementation:
- `App.svelte` owns all state via `$state` rune — `gameState` is the single game state object
- `ScoreBoard` component at `src/components/ScoreBoard.svelte` — presentational, receives `score` and `bestScore` props
- `handleNewGame()` calls `gameState = initGame()` which returns `{ grid, score: 0, won: false, keepPlaying: false }`
- `getDirectionFromKey` is the export name from `input-handler.js` (not `mapKeyToDirection`)
- `overlayType` is used instead of separate `gameOver`/`won` checks in the template
- Existing test suite: 38 tests in `src/lib/game-logic.test.js` — all game logic, no UI tests

### Scope Boundary

This story is intentionally minimal:
- **In scope:** In-memory best score tracking that survives New Game within a session
- **Out of scope:** localStorage persistence (Story 2.2), game state persistence (Story 2.2), keep-playing mode changes (Story 2.3)

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Story 2.1]
- [Source: _bmad-output/planning-artifacts/architecture.md#Frontend Architecture - State Management]
- [Source: _bmad-output/planning-artifacts/architecture.md#Implementation Patterns - Communication Patterns]

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6 (1M context)

### Debug Log References

### Completion Notes List

- Added `bestScore` as separate `$state(0)` in App.svelte — independent from gameState
- Added `$effect` watching `gameState.score` to update bestScore when exceeded
- Replaced hardcoded `bestScore={0}` prop with reactive `{bestScore}`
- bestScore survives New Game by design — `handleNewGame()` only resets `gameState`
- All 38 existing tests pass — no game-logic.js changes needed

### File List

- src/App.svelte (modified — added bestScore state, effect, and prop binding)
