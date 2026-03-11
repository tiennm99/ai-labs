# Phase 5: Board Generation and Recovery - Context

**Gathered:** 2026-03-11
**Status:** Ready for planning

<domain>
## Phase Boundary

Generate solvable game boards and provide automatic shuffle when no valid moves remain. This ensures players never get stuck in an unwinnable state without intervention. Board generation creates variety for replayability while shuffle recovery maintains game flow.

</domain>

<decisions>
## Implementation Decisions

### Board Generation Strategy
- Random tile placement with solvability verification using NoMovesDetector
- Maximum 100 generation attempts before accepting board
- Fallback: accept potentially unsolvable board, rely on auto-shuffle to recover
- New board generated on every restart (not just after winning)

### Shuffle Trigger
- Automatic shuffle when NoMovesDetector.hasValidMoves() returns false
- No manual shuffle button - fully automatic recovery
- Triggers after tile clear animation completes (same timing as current no-moves check)

### Shuffle Penalties
- No score deduction for shuffle - keep game accessible and fun
- Shuffle count is hidden from player - clean UI, no pressure

### Visual Feedback
- Brief "Shuffling..." message overlay during shuffle
- 300-500ms animation duration - quick but visible
- Crossfade animation style: tiles fade out from old positions, fade in at new positions
- Seamless transition back to gameplay after animation

### Claude's Discretion
- Exact shuffle animation easing function
- Overlay styling (matching existing game over overlay style)
- Animation timing precision (within 300-500ms range)

</decisions>

<specifics>
## Specific Ideas

- "Keep it seamless" - player should barely notice shuffle happened
- No penalty keeps the game fun rather than punitive
- Crossfade is smoother than slide/scale for tile rearrangement

</specifics>

<code_context>
## Existing Code Insights

### Reusable Assets
- **NoMovesDetector.hasValidMoves()**: Already exists, efficiently checks if any valid moves remain. Can be reused for both solvability verification during generation AND shuffle trigger detection.
- **PathFinder.findPath()**: Used by NoMovesDetector, no changes needed.
- **GridManager.initializeGrid()**: Current implementation creates deterministic pattern. Will be enhanced to generate random + verify.
- **Game.restart()**: Already calls gridManager.initializeGrid(). New board generation integrates here.
- **Game.handleGameOver()**: Currently shows game over on no-moves. Will be modified to trigger shuffle instead when !hasValidMoves.
- **game-over-overlay**: HTML/CSS overlay pattern exists. Shuffle overlay can follow same pattern.

### Established Patterns
- **Event-driven architecture**: Shuffle should emit events (e.g., 'board:shuffling', 'board:shuffled') for extensibility
- **HTML overlays**: Score and game over use HTML overlays - shuffle message follows same pattern
- **Time-based animations**: Selection highlight uses performance.now() - shuffle animation can use similar approach

### Integration Points
- **Game.ts**: Main orchestrator - add shuffle logic, modify no-moves handling
- **GridManager.ts**: Add shuffleTiles() method for redistributing tiles
- **index.html**: Add shuffle overlay element (similar to game-over-overlay)
- **NoMovesDetector.ts**: Already used for detection, no changes needed

</code_context>

<deferred>
## Deferred Ideas

None - discussion stayed within phase scope.

</deferred>

---

*Phase: 05-board-generation-and-recovery*
*Context gathered: 2026-03-11*
