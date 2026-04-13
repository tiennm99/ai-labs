# Story 2.2: Game State Persistence

Status: done

## Story

As a player,
I want my in-progress game to survive a page refresh,
so that I never lose my progress unexpectedly.

## Acceptance Criteria

1. After a valid move, the full game state is saved to localStorage under the `gameState` key as JSON: `{ grid, score, won, keepPlaying }`
2. The best score is saved separately under the `bestScore` key as a single number
3. On app load with a saved `gameState` in localStorage, the game restores the saved grid, score, won, and keepPlaying values, and the best score is restored from the `bestScore` key (silent restore, no loading indicator)
4. On app load with no saved game or corrupted localStorage data, a fresh game starts with 2 random tiles and score 0 (silent recovery, no error shown)
5. The `storage.js` module catches `JSON.parse` errors silently and returns null (triggering fresh game start)
6. When the player clicks New Game, the `gameState` key in localStorage is cleared and the `bestScore` key is preserved

## Tasks / Subtasks

- [x] Task 1: Create storage.js module (AC: #1, #2, #3, #4, #5)
  - [x] Create `src/lib/storage.js` with functions: `saveGameState(state)`, `loadGameState()`, `saveBestScore(score)`, `loadBestScore()`
  - [x] `saveGameState` serializes `{ grid, score, won, keepPlaying }` to localStorage key `gameState`
  - [x] `loadGameState` parses localStorage `gameState` — returns parsed object or null on failure/missing
  - [x] `saveBestScore` saves a number to localStorage key `bestScore`
  - [x] `loadBestScore` parses localStorage `bestScore` — returns number or 0 on failure/missing
  - [x] Wrap all `JSON.parse` calls in try/catch, return null/0 on error

- [x] Task 2: Integrate storage into App.svelte initialization (AC: #3, #4)
  - [x] Import storage functions into App.svelte
  - [x] On init: attempt `loadGameState()` — if non-null, use as initial gameState; otherwise `initGame()`
  - [x] On init: attempt `loadBestScore()` — use as initial bestScore value
  - [x] Ensure bestScore from storage is at least as high as restored game score

- [x] Task 3: Save state after every move and score change (AC: #1, #2)
  - [x] Add `$effect` to save gameState to localStorage whenever gameState changes
  - [x] Update existing bestScore `$effect` to also call `saveBestScore(bestScore)` when bestScore updates

- [x] Task 4: Handle New Game clearing gameState (AC: #6)
  - [x] In `handleNewGame()`, call storage function to clear gameState from localStorage
  - [x] Verify bestScore key is NOT cleared on New Game

- [x] Task 5: Write tests for storage.js (AC: #5)
  - [x] Test saveGameState/loadGameState round-trip
  - [x] Test saveBestScore/loadBestScore round-trip
  - [x] Test loadGameState returns null for corrupted data
  - [x] Test loadBestScore returns 0 for missing/corrupted data
  - [x] Test loadGameState returns null when key is missing

- [x] Task 6: Run full test suite
  - [x] All 48 tests pass (38 existing + 10 new storage tests)

## Dev Notes

### Architecture Compliance

- **File location:** `src/lib/storage.js` — pure JS module, ZERO Svelte imports, ZERO DOM access beyond localStorage
- **Exports:** `saveGameState`, `loadGameState`, `saveBestScore`, `loadBestScore`, `clearGameState`
- **Error handling:** Wrap `JSON.parse` in try/catch — on failure, return null (gameState) or 0 (bestScore). No user-facing errors.
- **localStorage keys:** `gameState` (JSON object), `bestScore` (JSON number)
- **No new dependencies** — uses built-in localStorage API only

### Critical Anti-Patterns (DO NOT)

- DO NOT store bestScore inside the gameState localStorage key — they are separate keys
- DO NOT show error messages to the user on corrupted localStorage — silent recovery
- DO NOT import Svelte in storage.js — it's a pure JS module
- DO NOT use sessionStorage — use localStorage for cross-session persistence
- DO NOT save the entire App component state — only save the canonical game state shape

### localStorage Schema

```javascript
// Key: "gameState"
{ grid: number[][], score: number, won: boolean, keepPlaying: boolean }

// Key: "bestScore"
number
```

### Save/Load Pattern in App.svelte

```javascript
import { saveGameState, loadGameState, saveBestScore, loadBestScore, clearGameState } from './lib/storage.js';

// Initialize from localStorage or fresh
const savedState = loadGameState();
let gameState = $state(savedState || initGame());
let bestScore = $state(Math.max(loadBestScore(), savedState?.score || 0));

// Save on every state change
$effect(() => { saveGameState(gameState); });
$effect(() => {
  if (gameState.score > bestScore) bestScore = gameState.score;
  saveBestScore(bestScore);
});

// New Game: clear saved state, keep bestScore
function handleNewGame() {
  clearGameState();
  gameState = initGame();
}
```

### Previous Story Intelligence

From Story 2.1:
- `bestScore` is a separate `$state(0)` in App.svelte — NOT part of gameState
- `$effect` watches `gameState.score` and updates `bestScore` when exceeded
- `handleNewGame()` only resets `gameState = initGame()` — bestScore survives
- ScoreBoard receives `score` and `bestScore` props — no changes needed
- 38 tests passing in `src/lib/game-logic.test.js`

### Testing Strategy

- Mock localStorage using Vitest's built-in support or a simple mock object
- Test storage.js in isolation — no Svelte needed
- Test file: `src/lib/storage.test.js` (co-located with module)

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Story 2.2]
- [Source: _bmad-output/planning-artifacts/architecture.md#Data Architecture - localStorage Schema]
- [Source: _bmad-output/planning-artifacts/architecture.md#Implementation Patterns - Process Patterns]

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6 (1M context)

### Debug Log References

### Completion Notes List

- Created `src/lib/storage.js` with 5 exports: saveGameState, loadGameState, clearGameState, saveBestScore, loadBestScore
- All JSON.parse wrapped in try/catch — corrupted data returns null/0 silently
- saveGameState destructures only canonical fields (grid, score, won, keepPlaying) — no extra data leaks
- App.svelte initializes from localStorage on load, falls back to initGame() if missing/corrupted
- bestScore initialized as max of stored bestScore and restored game score
- Two $effects: one saves gameState on every change, one tracks+saves bestScore
- handleNewGame calls clearGameState() — removes gameState key but preserves bestScore
- 10 new tests in storage.test.js with localStorage mock, 48 total tests passing

### File List

- src/lib/storage.js (new — localStorage persistence module)
- src/lib/storage.test.js (new — 10 tests for storage module)
- src/App.svelte (modified — integrated storage save/load/clear)
