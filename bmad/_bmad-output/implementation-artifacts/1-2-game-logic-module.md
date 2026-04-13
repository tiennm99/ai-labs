# Story 1.2: Game Logic Module

Status: done

## Story

As a developer,
I want a pure JavaScript game logic module with complete unit tests,
so that all game mechanics are correct and independently testable before connecting to the UI.

## Acceptance Criteria

1. `initGame()` returns a game state with a 4x4 grid (2D array of zeros) with exactly 2 random tiles placed (90% chance value 2, 10% chance value 4), score 0, won false, keepPlaying false
2. `move(state, direction)` returns a new state object (never mutates input) with tiles slid to the leading edge, identical adjacent tiles merged using leading-edge order, once-per-move merge rule enforced, score delta equals sum of merged tile values, and one new random tile (90/10) added to empty cell
3. When no tiles can move in the requested direction, `move()` returns the original state unchanged (no new tile spawned)
4. `isGameOver(state)` returns true only when the board is full AND no adjacent tiles share the same value
5. When a merge creates a tile with value 2048, the won flag is set to true in the returned state
6. All functions have passing Vitest unit tests covering edge cases (full board, corner merges, chain prevention)

## Tasks / Subtasks

- [x] Task 1: Create game state structure and initGame() (AC: #1)
  - [x] Create `src/lib/game-logic.js` with the canonical game state shape
  - [x] Implement `createEmptyGrid()`, `getEmptyCells(grid)`, `addRandomTile(grid)`
  - [x] Implement `initGame()` — creates empty grid, adds 2 random tiles
  - [x] Write tests for initGame: grid is 4x4, exactly 2 non-zero cells, values are 2 or 4

- [x] Task 2: Implement slide and merge logic (AC: #2, #3)
  - [x] Implement `slideRow`, `mergeRow`, `processRow` functions
  - [x] Implement `move(state, direction)` with direction normalization
  - [x] Return original state unchanged if no tiles moved (AC: #3)
  - [x] Write tests: single merge, chain prevention [2,2,2,2]→[4,4,0,0], leading-edge order, no-op, score delta

- [x] Task 3: Implement game over detection (AC: #4)
  - [x] Implement `canMove(grid)` and `isGameOver(state)`
  - [x] Write tests: empty cells, full board with/without matches

- [x] Task 4: Implement win detection (AC: #5)
  - [x] Win detection in move() — checks for WIN_VALUE after merging
  - [x] Write tests: 1024+1024 sets won=true, no re-trigger, keepPlaying prevents trigger

- [x] Task 5: Run full test suite and verify all edge cases (AC: #6)
  - [x] All 38 tests pass via `npx vitest run`
  - [x] Immutability verified: original state never modified
  - [x] All four directions tested for slide and merge

## Dev Notes

### Architecture Compliance

- **File location:** `src/lib/game-logic.js` — pure JS module, ZERO Svelte imports, ZERO DOM access
- **Immutability:** ALL functions return NEW objects/arrays, NEVER mutate input
- **Constants:** Import GRID_SIZE, WIN_VALUE, SPAWN_PROBABILITY, DIRECTIONS from `./constants.js`
- **State shape:** `{ grid: number[][], score: number, won: boolean, keepPlaying: boolean }` — canonical, do not add fields
- **Exports:** `initGame`, `move`, `canMove`, `isGameOver`, `addRandomTile`, `getEmptyCells`, `createEmptyGrid`

### Critical Anti-Patterns (DO NOT)

- DO NOT import Svelte, DOM APIs, or any browser APIs
- DO NOT mutate input state — always return new objects (use `grid.map(row => [...row])` for cloning)
- DO NOT use `Math.random()` directly in merge/slide logic — only in `addRandomTile` and `initGame`
- DO NOT merge more than once per tile per move (e.g., `[2,2,2,2]` must produce `[4,4,0,0]`, NOT `[8,0,0,0]`)
- DO NOT add animation or UI concerns to this module

### Merge Algorithm Reference

The merge algorithm must match the original 2048:
1. **Slide** all non-zero values toward the leading edge (remove gaps)
2. **Merge** adjacent equal values, starting from the leading edge
3. **Slide** again to fill gaps created by merges
4. Leading edge = direction of movement (left=index 0, right=index 3, up=row 0, down=row 3)
5. Once-per-move: a tile created by merging cannot merge again in the same move

### Direction Normalization Strategy

Normalize all directions to "process left" by rotating the grid:
- LEFT: process rows as-is
- RIGHT: reverse each row → process → reverse back
- UP: transpose grid → process → transpose back
- DOWN: transpose + reverse → process → reverse + transpose back

### Previous Story Intelligence

From Story 1.1:
- Constants module at `src/lib/constants.js` with GRID_SIZE=4, WIN_VALUE=2048, SPAWN_PROBABILITY=0.9
- Vitest configured, test files use `src/lib/*.test.js` pattern
- Existing test file `src/lib/game-logic.test.js` has constants validation tests — extend this file

### Project Structure Notes

- Tests co-located: `src/lib/game-logic.test.js` next to `src/lib/game-logic.js`
- Extend existing test file (don't create a new one)

### References

- [Source: _bmad-output/planning-artifacts/architecture.md#Frontend Architecture - Game Logic Module]
- [Source: _bmad-output/planning-artifacts/architecture.md#Implementation Patterns - Communication Patterns]
- [Source: _bmad-output/planning-artifacts/architecture.md#Data Flow]
- [Source: _bmad-output/planning-artifacts/epics.md#Story 1.2]

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6 (1M context)

### Debug Log References

### Completion Notes List

- Pure JS game logic module with 7 exported functions: createEmptyGrid, getEmptyCells, addRandomTile, initGame, move, canMove, isGameOver
- Direction normalization strategy: rotate grid to normalize all moves to "process left"
- Once-per-move merge rule enforced: [2,2,2,2] → [4,4,0,0]
- Immutability enforced: all functions return new objects
- Win detection: checks for 2048 after merging, respects won and keepPlaying flags
- 38 tests passing covering all edge cases

### File List

- src/lib/game-logic.js (new — pure game logic module)
- src/lib/game-logic.test.js (updated — 38 tests covering all game mechanics)
