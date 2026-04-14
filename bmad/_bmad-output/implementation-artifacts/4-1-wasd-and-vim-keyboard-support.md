# Story 4.1: WASD & Vim Keyboard Support

Status: done

## Story

As a desktop player,
I want to use WASD or Vim hjkl keys to control the game,
so that I can play with my preferred keyboard layout.

## Acceptance Criteria

1. Given the game is in playing state, when the player presses W/A/S/D keys, then they map to Up/Left/Down/Right directions respectively and trigger a move
2. Given the game is in playing state, when the player presses h/j/k/l keys, then they map to Left/Down/Up/Right directions respectively and trigger a move
3. Given the input handler, when any mapped key is pressed, then it produces identical behavior to the corresponding arrow key (same game logic path)

## Tasks / Subtasks

- [x] Task 1: Extend KEY_MAP in input-handler.js (AC: #1, #2, #3)
  - [x] Add WASD mappings: `w` → UP, `a` → LEFT, `s` → DOWN, `d` → RIGHT
  - [x] Add Vim mappings: `h` → LEFT, `j` → DOWN, `k` → UP, `l` → RIGHT
  - [x] Support both lowercase and uppercase keys for Caps Lock/Shift edge cases
- [x] Task 2: Add unit tests for new key mappings (AC: #1, #2, #3)
  - [x] Test all 8 new key mappings return correct DIRECTIONS value
  - [x] Test uppercase variants (W, A, S, D, H, J, K, L) also map correctly
  - [x] Test unmapped keys still return null
- [x] Task 3: Verify no regressions (AC: #3)
  - [x] All existing arrow key tests still pass (4 tests)
  - [x] All 80 tests pass across 4 test files (was 59, now 80 with 21 new input-handler tests)
  - [x] All key types produce identical behavior via same getDirectionFromKey → executeMove pipeline

## Dev Notes

### Implementation Details

This is a minimal change — only `src/lib/input-handler.js` needs modification. The entire input pipeline already works:

1. `App.svelte:handleKeydown` captures `svelte:window onkeydown`
2. Calls `getDirectionFromKey(event.key)` from `input-handler.js`
3. If direction returned, calls `executeMove(direction)`
4. Animation queuing (`isAnimating` / `queuedDirection`) already handles rapid input

The ONLY change needed is adding entries to the `KEY_MAP` object in `input-handler.js`. No changes to App.svelte, no changes to game logic, no new files.

### Current input-handler.js (complete file)

```javascript
import { DIRECTIONS } from './constants.js';

const KEY_MAP = {
  ArrowUp: DIRECTIONS.UP,
  ArrowDown: DIRECTIONS.DOWN,
  ArrowLeft: DIRECTIONS.LEFT,
  ArrowRight: DIRECTIONS.RIGHT,
};

export function getDirectionFromKey(key) {
  return KEY_MAP[key] || null;
}
```

### Required Changes

Add to `KEY_MAP`:
```javascript
// WASD
w: DIRECTIONS.UP,
a: DIRECTIONS.LEFT,
s: DIRECTIONS.DOWN,
d: DIRECTIONS.RIGHT,
// Vim
h: DIRECTIONS.LEFT,
j: DIRECTIONS.DOWN,
k: DIRECTIONS.UP,
l: DIRECTIONS.RIGHT,
```

**Key casing note:** `KeyboardEvent.key` returns `"w"` (lowercase) for letter keys when no modifier is held, and `"W"` (uppercase) when Shift is held. Add both lowercase and uppercase mappings to handle Caps Lock or Shift edge cases.

### Architecture Compliance

- File: `src/lib/input-handler.js` — pure JS module in `src/lib/`, zero Svelte imports ✓
- Pattern: extends existing KEY_MAP object, no new exports needed ✓
- No new dependencies ✓
- Immutable game logic path unchanged — same `getDirectionFromKey → executeMove → move()` pipeline ✓

### Testing Requirements

- Test file: `src/lib/input-handler.test.js` (create if it doesn't exist, or add to existing)
- Framework: Vitest (already configured)
- Test pattern: `expect(getDirectionFromKey('w')).toBe('up')` for each mapping
- Run: `npx vitest` — all tests must pass including existing 59+ game-logic tests

### FRs Covered

- FR15: WASD key input
- FR16: Vim hjkl key input

### References

- [Source: _bmad-output/planning-artifacts/epics.md — Epic 4, Story 4.1]
- [Source: _bmad-output/planning-artifacts/architecture.md — Input Processing pattern]
- [Source: src/lib/input-handler.js — current implementation]
- [Source: src/App.svelte:77-88 — handleKeydown wiring]

## Dev Agent Record

### Agent Model Used
Claude Opus 4.6 (1M context)

### Debug Log References

### Completion Notes List
- Extended KEY_MAP in input-handler.js with 16 new entries: WASD (8 keys, upper+lower) + Vim hjkl (8 keys, upper+lower)
- Created input-handler.test.js with 21 tests: 4 arrow key, 8 WASD, 8 Vim hjkl, 1 unmapped keys
- Red-green-refactor cycle: wrote failing tests first, then added mappings, all 80 tests pass
- No changes to App.svelte or game logic — purely additive KEY_MAP extension

### File List
- src/lib/input-handler.js (modified — added WASD and Vim key mappings to KEY_MAP)
- src/lib/input-handler.test.js (created — 21 tests for all key mappings)
