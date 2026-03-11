# Phase 5: Board Generation and Recovery - Research

**Researched:** 2026-03-11
**Domain:** Board generation algorithms, shuffle mechanics, animation patterns
**Confidence:** HIGH

## Summary

This phase implements solvable board generation and automatic shuffle recovery for the Pikachu Match game. The research confirms that the existing codebase provides excellent foundations: `NoMovesDetector.hasValidMoves()` can be reused for both solvability verification during board generation AND shuffle trigger detection. The shuffle animation will follow the established time-based animation pattern using `performance.now()` already present in `Renderer.ts`.

**Primary recommendation:** Enhance `GridManager.initializeGrid()` to generate random boards with solvability verification (max 100 attempts), then modify `Game.handleGameOver()` to trigger automatic shuffle instead of game over when no moves remain.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

#### Board Generation Strategy
- Random tile placement with solvability verification using NoMovesDetector
- Maximum 100 generation attempts before accepting board
- Fallback: accept potentially unsolvable board, rely on auto-shuffle to recover
- New board generated on every restart (not just after winning)

#### Shuffle Trigger
- Automatic shuffle when NoMovesDetector.hasValidMoves() returns false
- No manual shuffle button - fully automatic recovery
- Triggers after tile clear animation completes (same timing as current no-moves check)

#### Shuffle Penalties
- No score deduction for shuffle - keep game accessible and fun
- Shuffle count is hidden from player - clean UI, no pressure

#### Visual Feedback
- Brief "Shuffling..." message overlay during shuffle
- 300-500ms animation duration - quick but visible
- Crossfade animation style: tiles fade out from old positions, fade in at new positions
- Seamless transition back to gameplay after animation

### Claude's Discretion
- Exact shuffle animation easing function
- Overlay styling (matching existing game over overlay style)
- Animation timing precision (within 300-500ms range)

### Deferred Ideas (OUT OF SCOPE)
None - discussion stayed within phase scope.
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| BOARD-01 | Player can shuffle remaining tiles when no moves available | `NoMovesDetector.hasValidMoves()` for detection; Fisher-Yates shuffle for redistribution; HTML overlay pattern for "Shuffling..." message |
</phase_requirements>

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| NoMovesDetector | existing | Solvability verification | Already implemented, type-optimized (94% reduction in PathFinder calls) |
| PathFinder | existing | Path validation | Used by NoMovesDetector, no changes needed |
| TypedEventEmitter | existing | Event-driven architecture | Established pattern for extensibility |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| performance.now() | native | Time-based animations | Already used in Renderer for selection fade (100ms), shake (200ms), path (300ms) |
| HTML/CSS overlays | existing | UI messages | Score overlay, game over overlay patterns exist |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Random placement + verify | Reverse-generation from solved state | Reverse-generation guarantees solvability but is more complex; verify-after-shuffle is simpler and sufficient given fallback |
| Canvas overlay | HTML overlay | Canvas requires re-rendering; HTML follows existing pattern and is more accessible |

**No new dependencies required** - all functionality uses existing patterns.

## Architecture Patterns

### Recommended Project Structure
```
src/
├── managers/
│   └── GridManager.ts      # Add: generateRandomGrid(), shuffleTiles()
├── game/
│   └── Game.ts             # Modify: handleGameOver() for shuffle trigger
├── rendering/
│   └── Renderer.ts         # Add: crossfade animation support
├── detection/
│   └── NoMovesDetector.ts  # No changes - already has hasValidMoves()
└── index.html              # Add: shuffle-overlay element
```

### Pattern 1: Board Generation with Solvability Verification
**What:** Generate random tile placements, verify solvability, retry up to 100 times
**When to use:** Every restart() call to create new game boards
**Example:**
```typescript
// In GridManager.ts
initializeGrid(): void {
  const maxAttempts = 100;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    // Create random tile placement
    this.generateRandomGrid();

    // Verify solvability using existing NoMovesDetector
    if (NoMovesDetector.hasValidMoves(this.tiles)) {
      return; // Solvable board found
    }
  }

  // Fallback: accept last generated board (rely on auto-shuffle)
  // Log warning for debugging
  console.warn('Board generation: max attempts reached, accepting board');
}

private generateRandomGrid(): void {
  // 1. Create flat array of tile types (16 types x 10 pairs = 160 tiles)
  const types: number[] = [];
  for (let type = 0; type < 16; type++) {
    for (let pair = 0; pair < 10; pair++) {
      types.push(type);
    }
  }

  // 2. Shuffle using Fisher-Yates
  for (let i = types.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [types[i], types[j]] = [types[j], types[i]];
  }

  // 3. Place shuffled types in grid
  this.tiles = [];
  let typeIndex = 0;
  for (let row = 0; row < CONFIG.grid.rows; row++) {
    const rowTiles: Tile[] = [];
    for (let col = 0; col < CONFIG.grid.cols; col++) {
      const id = `tile-${row}-${col}`;
      const type = types[typeIndex++];
      const position: TilePosition = { row, col };
      rowTiles.push(new Tile(id, type, position));
    }
    this.tiles.push(rowTiles);
  }
}
```

### Pattern 2: Shuffle with Crossfade Animation
**What:** Redistribute remaining tiles with visual crossfade feedback
**When to use:** When NoMovesDetector.hasValidMoves() returns false
**Example:**
```typescript
// In GridManager.ts
shuffleTiles(): void {
  // 1. Collect uncleared tiles
  const unclearedTiles: Tile[] = [];
  const positions: TilePosition[] = [];

  for (let row = 0; row < CONFIG.grid.rows; row++) {
    for (let col = 0; col < CONFIG.grid.cols; col++) {
      const tile = this.tiles[row][col];
      if (!tile.cleared) {
        unclearedTiles.push(tile);
        positions.push({ row, col });
      }
    }
  }

  // 2. Shuffle types using Fisher-Yates
  const types = unclearedTiles.map(t => t.type);
  for (let i = types.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [types[i], types[j]] = [types[j], types[i]];
  }

  // 3. Reassign shuffled types to positions
  for (let i = 0; i < unclearedTiles.length; i++) {
    unclearedTiles[i].type = types[i];
  }

  // 4. Clear selection
  this.deselectAll();
}

// In Game.ts
private async handleNoMoves(): Promise<void> {
  // Show shuffle overlay
  this.showShuffleOverlay();

  // Wait for crossfade animation (300-500ms)
  await this.animateShuffle();

  // Perform shuffle
  this.gridManager.shuffleTiles();

  // Hide overlay
  this.hideShuffleOverlay();

  // Emit event for extensibility
  this.events.emit('board:shuffled', { tilesRemaining: this.countUnclearedTiles() });
}
```

### Pattern 3: HTML Overlay for Shuffle Message
**What:** Brief overlay message following existing game-over-overlay pattern
**When to use:** During shuffle animation
**Example:**
```html
<!-- In index.html, following game-over-overlay pattern -->
<div id="shuffle-overlay" style="display: none;">
  <div id="shuffle-message">Shuffling...</div>
</div>

<style>
#shuffle-overlay {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: rgba(26, 26, 70, 0.95);
  padding: 24px 48px;
  border-radius: 12px;
  z-index: 500; /* Below game-over (1000), above canvas */
}
#shuffle-message {
  font-size: 32px;
  color: #eaeaea;
}
</style>
```

### Anti-Patterns to Avoid
- **Blocking the main thread during shuffle:** Use async/await pattern with requestAnimationFrame for smooth animation
- **Modifying NoMovesDetector:** It's already optimized - reuse as-is for both board generation AND shuffle trigger
- **Creating new animation system:** Extend existing Renderer animation patterns (ShakeAnimation, pathAnimation)
- **Forgetting to clear selection:** Always call deselectAll() during shuffle to prevent stale references

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Solvability checking | Custom pair-checking logic | NoMovesDetector.hasValidMoves() | Already optimized with type grouping (94% reduction in PathFinder calls) |
| Shuffle algorithm | Custom random swapping | Fisher-Yates (Knuth) shuffle | Unbiased distribution, O(n) time, well-tested |
| Animation timing | setTimeout-based animation | performance.now() + requestAnimationFrame | Smooth 60fps, matches existing Renderer patterns |
| UI overlay | Canvas-drawn text | HTML/CSS overlay | Matches score/game-over pattern, better accessibility |

**Key insight:** The existing codebase already has all the building blocks. This phase is primarily about orchestration - connecting NoMovesDetector to board generation and modifying the no-moves handling to trigger shuffle instead of game over.

## Common Pitfalls

### Pitfall 1: Infinite Shuffle Loop
**What goes wrong:** Board shuffles but still has no valid moves, triggers shuffle again indefinitely
**Why it happens:** Random shuffle doesn't guarantee solvability
**How to avoid:** After shuffle, check hasValidMoves() again. If still no moves, shuffle again (max 3 attempts) before accepting game over
**Warning signs:** Player sees multiple "Shuffling..." messages in quick succession

### Pitfall 2: Score/State Desync During Shuffle
**What goes wrong:** Score changes or game state becomes inconsistent during shuffle animation
**Why it happens:** Animation is async but game logic continues
**How to avoid:** Block input during shuffle (state machine already has this via canSelectTile()), ensure score is read-only during shuffle
**Warning signs:** Score display flickers or becomes incorrect after shuffle

### Pitfall 3: Tile Reference Corruption
**What goes wrong:** Selected tiles reference old positions after shuffle
**Why it happens:** Shuffle modifies tile types in-place without updating selection
**How to avoid:** Always call deselectAll() before shuffling, verify selection is empty after shuffle
**Warning signs:** Clicking after shuffle selects wrong tile or causes error

### Pitfall 4: Animation Jank
**What goes wrong:** Shuffle animation stutters or is too slow
**Why it happens:** Blocking operations during animation frame
**How to avoid:** Pre-compute shuffled positions before animation, use requestAnimationFrame, keep animation under 500ms
**Warning signs:** Frame drops, animation feels sluggish

## Code Examples

Verified patterns from existing codebase:

### Fisher-Yates Shuffle (TypeScript)
```typescript
// Standard implementation - O(n) time, O(1) space
function shuffleArray<T>(array: T[]): void {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}
```

### Time-Based Animation (from Renderer.ts)
```typescript
// Existing pattern - selection fade animation
private renderSelection(ctx: CanvasRenderingContext2D, tile: Tile, offsetX: number, offsetY: number): void {
  let startTime = this.fadeAnimationStartTimes.get(tile.id);
  if (!startTime) {
    startTime = performance.now();
    this.fadeAnimationStartTimes.set(tile.id, startTime);
  }

  const elapsed = performance.now() - startTime;
  const progress = Math.min(elapsed / this.FADE_DURATION, 1);
  const alpha = 0.3 * progress;

  // Draw with calculated alpha...
}
```

### Event Emission Pattern (from Game.ts)
```typescript
// Emit event for extensibility
this.events.emit('game:restart', undefined as never);

// Event interface extension (in types/index.ts)
export interface GameEvents {
  // ... existing events
  'board:shuffling': { tilesRemaining: number };
  'board:shuffled': { tilesRemaining: number };
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Deterministic board | Random board with verification | This phase | Increases replayability |
| Game over on no-moves | Auto-shuffle recovery | This phase | Prevents player frustration |
| Manual shuffle button | Automatic shuffle | User decision | Cleaner UI, seamless UX |

**Deprecated/outdated:**
- Pure random shuffle without solvability check: Can create unsolvable states that frustrate players
- Score penalty for shuffle: Makes game feel punitive rather than fun

## Open Questions

1. **Should we limit shuffle attempts to prevent infinite loops?**
   - What we know: Random shuffle doesn't guarantee solvability
   - What's unclear: Maximum attempts before accepting game over
   - Recommendation: Max 3 shuffle attempts per no-moves event, then game over

2. **Should shuffle preserve tile positions or redistribute freely?**
   - What we know: User specified "redistributes remaining tiles while preserving pairs"
   - What's unclear: Whether positions should change or just types
   - Recommendation: Shuffle types only, keep positions fixed (simpler, clearer to player)

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Vitest (node environment) |
| Config file | vitest.config.ts |
| Quick run command | `npm test -- --run` |
| Full suite command | `npm test` |

### Phase Requirements -> Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| BOARD-01 | Board generation creates solvable boards | unit | `npm test -- --run GridManager.test.ts` | Wave 0 (enhance existing) |
| BOARD-01 | Shuffle redistributes remaining tiles | unit | `npm test -- --run GridManager.test.ts` | Wave 0 (new tests) |
| BOARD-01 | Auto-shuffle triggers on no-moves | integration | `npm test -- --run Game.test.ts` | Wave 0 (new tests) |
| BOARD-01 | Shuffle overlay displays during shuffle | unit | `npm test -- --run Game.test.ts` | Wave 0 (new tests) |

### Sampling Rate
- **Per task commit:** `npm test -- --run`
- **Per wave merge:** `npm test`
- **Phase gate:** Full suite green before `/gsd:verify-work`

### Wave 0 Gaps
- [ ] `src/__tests__/GridManager.test.ts` - Add tests for `generateRandomGrid()` and `shuffleTiles()`
- [ ] `src/__tests__/Game.test.ts` - Add tests for auto-shuffle trigger and overlay display
- [ ] `src/types/index.ts` - Add `board:shuffling` and `board:shuffled` events to GameEvents interface

*(If no gaps: "None - existing test infrastructure covers all phase requirements")*

## Sources

### Primary (HIGH confidence)
- Existing codebase analysis - NoMovesDetector, GridManager, Renderer, Game.ts patterns
- CONTEXT.md user decisions - locked implementation choices

### Secondary (MEDIUM confidence)
- Fisher-Yates shuffle algorithm - well-documented standard algorithm
- Time-based animation patterns - verified in existing Renderer.ts

### Tertiary (LOW confidence)
- Web search results were unavailable due to service issues; all research based on codebase analysis and established algorithms

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - all components exist in codebase, no new dependencies
- Architecture: HIGH - patterns established in existing code (event-driven, HTML overlays, time-based animations)
- Pitfalls: HIGH - based on common async/state management issues in similar games

**Research date:** 2026-03-11
**Valid until:** 30 days (stable patterns, no external API dependencies)
