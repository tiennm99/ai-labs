# Phase 3: Core Matching Mechanics - Context

**Gathered:** 2026-03-11
**Status:** Ready for planning

<domain>
## Phase Boundary

Implement path-finding algorithm and tile matching mechanics. Players can match tiles by connecting them with valid paths (0, 1, or 2 turns). Match validation triggers on tilesSelected event, with scoring and visual feedback for success/failure.

</domain>

<decisions>
## Implementation Decisions

### Path-Finding Algorithm
- **Algorithm**: BFS (breadth-first search) — simpler and sufficient for 2D grid with 3-line constraint
- **Turn constraint**: 0, 1, or 2 turns maximum — paths with 3+ turns are invalid
- **Passable tiles**: Edges only — only empty grid edges are passable for path-finding (cleared tiles do NOT become passable)
- **Return data**: Path + turn count — return actual path coordinates and turn count for drawing connection lines and scoring

### Match Validation Logic
- **Trigger**: On `tilesSelected` event — use Phase 2's event system for consistency
- **Match criteria**: Same type, different tile — tiles must have matching type (0-15) and be different positions
- **Validation order**: Type first, then path — check type match early to save expensive BFS computation on invalid pairs
- **State after match**: Remove from grid — clear tiles, remove from grid array, deselect all, emit match event

### Scoring System
- **Base score**: 100 points per match
- **Path complexity bonus**: Bonus for fewer turns — reward harder-to-find paths (0-turn: +50%, 1-turn: +25%, 2-turn: base)
- **Score display**: HTML overlay — display score in HTML element overlay for easier styling

### Failure Feedback
- **Wrong type (different tile types)**: Shake + deselect — shake animation on both tiles for ~200ms, then deselect
- **Path too long (3+ turns)**: Visual distinction — different visual feedback than wrong type to help player learn (e.g., different shake pattern or color)
- **Goal**: Clear distinction between "wrong type" vs "path exists but too long"

### Claude's Discretion
- Exact shake animation timing and pattern
- Visual distinction method for path-too-long vs wrong-type
- Score overlay positioning and styling
- Path-drawing animation (if connection line shown)

</decisions>

<specifics>
## Specific Ideas

- Path-finding must be efficient — BFS with early exit on 3+ turns
- Visual feedback helps players learn: wrong type vs path too long should feel different
- Scoring rewards skill: finding 0-turn paths (same row/col) should feel more rewarding than complex paths

</specifics>

<code_context>
## Existing Code Insights

### Reusable Assets
- **Game.ts**: Orchestrator with `tilesSelected` event listener (line 54-56) — already wired up, ready to trigger match validation
- **GridManager.ts**: Has `selectedTiles` getter and `tiles[row][col]` 2D array — can access selected tiles and grid state
- **Tile.ts**: Model with `type` property, `cleared` property, `position` — has all data needed for matching
- **EventEmitter.ts**: Typed event system — add new `tilesMatched` or `matchFailed` events
- **Renderer.ts**: Canvas rendering with 60fps loop — can animate score popups and connection lines

### Established Patterns
- Event-driven architecture — components communicate via typed events
- BFS is well-suited for unweighted shortest path on grid
- Canvas animations use time-based approach (performance.now())

### Integration Points
- **Game.ts**: Add match validation logic in `tilesSelected` event handler
- **New MatchEngine.ts** (or inline in Game): Path-finding + match validation
- **New ScoreManager.ts** (or inline in Game): Score tracking and display
- Events: Emit `tilesMatched` with path data, `matchFailed` with reason (wrongType/pathTooLong)

</code_context>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 03-core-matching-mechanics*
*Context gathered: 2026-03-11*
