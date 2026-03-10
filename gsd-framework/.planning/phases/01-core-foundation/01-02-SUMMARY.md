---
phase: 01-core-foundation
plan: 02
subsystem: core
tags: [game-loop, event-emitter, tile-model, tdd, requestAnimationFrame]

# Dependency graph
requires:
  - phase: 01-01
    provides: Project scaffolding, TypeScript config, Vitest setup, types/index.ts, config.ts
provides:
  - GameLoop class with requestAnimationFrame-based 60fps loop
  - TypedEventEmitter class wrapping Node's EventEmitter
  - Tile model class with position, type, emoji getter, and adjacency check
affects: [game-logic, renderer, input-handling]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - TDD (test-driven development) with Vitest
    - requestAnimationFrame game loop with fixed timestep
    - Typed event emitter pattern
    - Immutable data models with readonly properties

key-files:
  created:
    - src/game/GameLoop.ts
    - src/game/EventEmitter.ts
    - src/models/Tile.ts
    - src/__tests__/GameLoop.test.ts
    - src/__tests__/EventEmitter.test.ts
    - src/__tests__/Tile.test.ts
  modified: []

key-decisions:
  - "Used `object` constraint for TypedEventEmitter generic to support interface types without index signatures"
  - "Added getTickLength() and getRafId() helper methods for testability"
  - "Added once() and removeAllListeners() methods to TypedEventEmitter for flexibility"

patterns-established:
  - "TDD pattern: commit failing test first, then implementation"
  - "Game loop: fixed timestep (1000/60ms) with delta time accumulation"
  - "Event emitter: type-safe wrapper around Node's EventEmitter"

requirements-completed: [CORE-01]

# Metrics
duration: 7min
completed: 2026-03-10
---

# Phase 1 Plan 2: Core Infrastructure Summary

**GameLoop, TypedEventEmitter, and Tile model implemented with TDD - 47 new unit tests all passing**

## Performance

- **Duration:** 7 min
- **Started:** 2026-03-10T16:44:32Z
- **Completed:** 2026-03-10T16:51:31Z
- **Tasks:** 3
- **Files modified:** 6

## Accomplishments

- GameLoop class with requestAnimationFrame-based 60fps loop, delta time tracking, and start/stop lifecycle
- TypedEventEmitter class providing type-safe event handling with on/emit/off/once/removeAllListeners
- Tile model class implementing Tile interface with emoji getter and isAdjacent() method
- All 47 new unit tests pass (12 GameLoop + 18 EventEmitter + 17 Tile)

## Task Commits

Each task was committed atomically:

1. **Task 1: GameLoop class** - `ca2f540` (test), `99a0b56` (refactor - type fixes)
2. **Task 2: TypedEventEmitter class** - `2c2d422` (test), `86e0d2e` (feat), `99a0b56` (refactor - type fixes)
3. **Task 3: Tile model class** - `21fe45c` (test), `f74eb98` (feat)

**Plan metadata:** pending (docs: complete plan)

_Note: TDD tasks have multiple commits (test -> feat -> refactor)_

## Files Created/Modified

- `src/game/GameLoop.ts` - requestAnimationFrame-based game loop with start/stop, delta time tracking
- `src/game/EventEmitter.ts` - Type-safe event emitter wrapping Node's EventEmitter
- `src/models/Tile.ts` - Tile model with id, type, position, cleared, emoji getter, isAdjacent()
- `src/__tests__/GameLoop.test.ts` - 12 unit tests for GameLoop
- `src/__tests__/EventEmitter.test.ts` - 18 unit tests for TypedEventEmitter
- `src/__tests__/Tile.test.ts` - 17 unit tests for Tile

## Decisions Made

- **EventEmitter generic constraint:** Changed from `Record<string, unknown>` to `object` to support TypeScript interfaces without index signatures (like GameEvents)
- **Test infrastructure:** Used global mocks for requestAnimationFrame/cancelAnimationFrame since tests run in node environment
- **Added helper methods:** Added `getTickLength()`, `getRafId()`, `isRunning()` to GameLoop for testability

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Fixed TypeScript type inference in tests**
- **Found during:** Task 1 verification (tsc --noEmit)
- **Issue:** `vi.fn()` without generic type argument returns incompatible type for GameLoop callback; closure variable narrowing issue
- **Fix:** Added explicit generic types `vi.fn<(deltaTime: number) => void>()` and used array instead of nullable variable for captured callbacks
- **Files modified:** src/__tests__/GameLoop.test.ts
- **Verification:** `npx tsc --noEmit` passes
- **Committed in:** `99a0b56` (refactor commit)

**2. [Rule 1 - Bug] Fixed EventEmitter generic constraint**
- **Found during:** Task 2 verification (tsc --noEmit)
- **Issue:** `Record<string, unknown>` constraint requires index signature, but interfaces don't have them
- **Fix:** Changed constraint from `Record<string, unknown>` to `object`
- **Files modified:** src/game/EventEmitter.ts
- **Verification:** `npx tsc --noEmit` passes
- **Committed in:** `99a0b56` (refactor commit)

---

**Total deviations:** 2 auto-fixed (both Rule 1 - Bug)
**Impact on plan:** Type safety fixes essential for correct TypeScript compilation. No scope creep.

## Issues Encountered

None - all tasks completed as planned with minor type fixes.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Core game infrastructure complete: GameLoop, TypedEventEmitter, Tile model
- Ready for Grid implementation (plan 01-03) which will use Tile class and event system
- All 79 tests passing (including 32 from plan 01-01)

## Self-Check: PASSED

- All 6 created files verified present
- All 6 commits verified in git history

---
*Phase: 01-core-foundation*
*Completed: 2026-03-10*
