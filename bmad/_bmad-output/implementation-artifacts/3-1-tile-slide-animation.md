# Story 3.1: Tile Slide Animation

Status: done

## Story

As a player,
I want tiles to slide smoothly to their new positions,
so that the game feels responsive and I can visually track tile movement.

## Acceptance Criteria

1. After a valid move, each tile animates from its old position to its new position using CSS `transform: translate` with a 100ms ease-in-out transition
2. All movable tiles animate simultaneously
3. The animation runs at 60fps (GPU-accelerated CSS transition)
4. During an animation, input is queued and executes after the current animation completes (isAnimating flag)
5. When `prefers-reduced-motion` is enabled, tiles appear instantly at new positions with no transition

## Tasks / Subtasks

- [x] Task 1: Create tile-tracker.js module (AC: #1)
  - [x] Create `src/lib/tile-tracker.js` with tile identity management
  - [x] `createTilesFromGrid(grid)` — assigns unique IDs to each non-zero cell
  - [x] `computeTilesAfterMove(prevTiles, prevGrid, newGrid, direction)` — tracks tile movements through a move, preserving IDs for tiles that slide/merge, assigning new IDs for spawned tiles
  - [x] Track merged tiles with `isMerged` flag and spawned tiles with `isNew` flag (for Stories 3.2, 3.3)
  - [x] `resetTracker()` — resets ID counter (for New Game)

- [x] Task 2: Integrate tile tracker into App.svelte (AC: #1)
  - [x] Replace raw grid extraction with tile tracker
  - [x] Call `createTilesFromGrid` on init and New Game
  - [x] Call `computeTilesAfterMove` after each move
  - [x] Pass tile objects (with id, value, row, col) to Grid

- [x] Task 3: Add CSS transition to Tile.svelte (AC: #1, #2, #3)
  - [x] Add `transition: transform 100ms ease-in-out` to tile style
  - [x] Tiles already use `transform: translate()` for positioning — transition animates position changes automatically

- [x] Task 4: Add animation state and input queuing (AC: #4)
  - [x] Add `isAnimating` flag in App.svelte
  - [x] Add `queuedDirection` to store pending input during animation
  - [x] On move: set isAnimating=true, after 100ms timeout clear flag and process queued input
  - [x] Block moves in handleKeydown when isAnimating is true (queue instead)

- [x] Task 5: Support prefers-reduced-motion (AC: #5)
  - [x] Add CSS media query `@media (prefers-reduced-motion: reduce)` that sets `transition: none`
  - [x] When reduced motion: skip isAnimating delay (set flag immediately)

- [x] Task 6: Update Grid.svelte keying (AC: #1)
  - [x] Change tile key from `tile.row-tile.col` to `tile.id` for stable DOM identity

- [x] Task 7: Write tests and verify (AC: all)
  - [x] Write tests for tile-tracker.js: ID assignment, ID persistence across moves, new tile detection, merge detection
  - [x] Run full test suite — all 59 tests pass (38 game-logic + 11 storage + 10 tile-tracker)

## Dev Notes

### Architecture Compliance

- **tile-tracker.js** — pure JS module in `src/lib/`, zero Svelte imports
- **Game logic unchanged** — `game-logic.js` stays pure, tile tracking is a presentation concern
- **Props-down pattern** — App.svelte passes tile objects to Grid/Tile via props
- **CSS-only animation** — no JS animation library, no requestAnimationFrame for tile movement

### Tile Tracking Algorithm

The tracker must simulate the move to map old tile IDs to new positions:

1. Build a position map from `prevTiles`: `{row}-{col}` → tile object
2. For the given direction, process each row/column:
   - Extract non-zero tiles in order (matching game-logic's slideRow)
   - Simulate mergeRow to determine which pairs merge
   - Assign new positions: slid tiles keep their ID, merged pairs → leading tile's ID survives with `isMerged: true`
3. Compare moved grid with `newGrid` to find the spawned tile (the one cell in newGrid that differs from the moved-but-not-spawned grid)
4. Spawned tile gets a new ID with `isNew: true`

Direction normalization must match game-logic.js exactly:
- LEFT: process rows left-to-right as-is
- RIGHT: reverse rows → process → reverse back
- UP: transpose → process → transpose back
- DOWN: transpose + reverse → process → reverse + transpose back

### Input Queuing Pattern

```javascript
let isAnimating = $state(false);
let queuedDirection = $state(null);

function handleMove(direction) {
  if (isAnimating) { queuedDirection = direction; return; }
  // ... execute move
  isAnimating = true;
  setTimeout(() => {
    isAnimating = false;
    if (queuedDirection) {
      const next = queuedDirection;
      queuedDirection = null;
      handleMove(next);
    }
  }, 100);
}
```

Note: Using setTimeout instead of transitionend for reliability — transitionend can miss if no tile actually moved. 100ms matches the transition duration.

### Prefers-Reduced-Motion

Add to `src/app.css`:
```css
@media (prefers-reduced-motion: reduce) {
  * { transition-duration: 0s !important; }
}
```

When reduced motion is active, set animation timeout to 0ms.

### Previous Story Intelligence

From Epic 1-2:
- Tile.svelte uses `transform: translate(x, y)` for positioning — already GPU-accelerated
- Grid.svelte keys tiles by `tile.id || ${tile.row}-${tile.col}` — needs to use `tile.id` only
- App.svelte uses `$derived.by()` for tile extraction — will change to tile tracker
- GAP=15, CELL_SIZE=106.25 constants in Tile.svelte and Grid.svelte
- 49 tests passing (38 game-logic + 11 storage)

### Critical Anti-Patterns (DO NOT)

- DO NOT modify game-logic.js — tile tracking is a presentation concern
- DO NOT use JavaScript animation (requestAnimationFrame) for tile sliding — CSS transitions only
- DO NOT use transitionend events for animation completion — use setTimeout (more reliable)
- DO NOT add animation-related fields to the canonical game state shape
- DO NOT block the main thread during animation — use async scheduling

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Story 3.1]
- [Source: _bmad-output/planning-artifacts/architecture.md#Frontend Architecture - Animation Approach]
- [Source: _bmad-output/planning-artifacts/architecture.md#Implementation Patterns - Process Patterns]

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6 (1M context)

### Debug Log References

### Completion Notes List

- Created tile-tracker.js: manages tile identity across moves via simulateLine algorithm
- Tile IDs persist through slides and merges; leading-edge tile's ID survives merges
- Spawned tiles detected by diffing moved grid vs final grid, assigned new IDs with isNew=true
- App.svelte refactored: tiles now managed as $state (not $derived), updated via tracker after each move
- Tile.svelte: added `transition: transform 100ms ease-in-out` for GPU-accelerated sliding
- Input queuing: isAnimating flag + queuedDirection, 100ms setTimeout for animation window
- prefers-reduced-motion: CSS override + JS detection skips animation delay
- Grid.svelte: keying changed from position-based to tile.id for stable DOM identity
- 10 new tile-tracker tests, 59 total tests passing

### File List

- src/lib/tile-tracker.js (new — tile identity and movement tracking)
- src/lib/tile-tracker.test.js (new — 10 tests)
- src/App.svelte (modified — tile tracker integration, animation state, input queuing)
- src/components/Tile.svelte (modified — CSS transition, isNew/isMerged props)
- src/components/Grid.svelte (modified — tile.id keying, pass isNew/isMerged)
- src/app.css (modified — prefers-reduced-motion media query)
