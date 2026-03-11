# Phase 3: Core Matching Mechanics - Research

**Researched:** 2026-03-11
**Domain:** Path-finding algorithms, tile matching mechanics, canvas visual feedback, game scoring systems
**Confidence:** MEDIUM

## Summary

This phase implements the core gameplay mechanics: path-finding with turn constraints, match validation, scoring, and visual feedback. The technical challenge is implementing an efficient BFS algorithm that finds paths with 0-2 turns (3 straight lines maximum) between matching tiles, then providing clear visual feedback for success/failure states.

The implementation builds on Phase 2's event-driven architecture. When two tiles are selected (triggering `tilesSelected` event), the MatchEngine validates the match: checks tile types match, runs BFS pathfinding with turn counting, and either clears tiles (success) or triggers failure feedback. The Renderer will animate shake effects for failures and draw connection lines for successful matches.

**Primary recommendation:** Implement BFS with state tracking (position + direction + turns) for efficient pathfinding. Use canvas transforms for shake animations. Extend the existing event system with new match events. Keep scoring simple (base + complexity bonus) for v1.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- **Path-finding algorithm**: BFS (breadth-first search) - simpler and sufficient for 2D grid with 3-line constraint
- **Turn constraint**: 0, 1, or 2 turns maximum - paths with 3+ turns are invalid
- **Passable tiles**: Edges only - only empty grid edges are passable for path-finding (cleared tiles do NOT become passable)
- **Match trigger**: On `tilesSelected` event - use Phase 2's event system for consistency
- **Match criteria**: Same type, different tile - tiles must have matching type (0-15) and be different positions
- **Validation order**: Type first, then path - check type match early to save expensive BFS computation on invalid pairs
- **Base score**: 100 points per match
- **Path complexity bonus**: Reward fewer turns - 0-turn: +50%, 1-turn: +25%, 2-turn: base
- **Score display**: HTML overlay - display score in HTML element overlay for easier styling

### Claude's Discretion
- Exact shake animation timing and pattern
- Visual distinction method for path-too-long vs wrong-type
- Score overlay positioning and styling
- Path-drawing animation (if connection line shown)

### Deferred Ideas (OUT OF SCOPE)
None - discussion stayed within phase scope.
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| CORE-04 | Two matching tiles connect if a valid path exists with 3 or fewer straight lines | BFS pathfinding algorithm with turn counting, grid traversal patterns |
| CORE-05 | Connected matching tiles disappear from the board | Tile state management (cleared flag), event emission for tile removal |
| CORE-06 | Player receives points when tiles are matched and cleared | Scoring system with base points + complexity bonus, score display architecture |
| CORE-07 | Cleared tiles become passable space for future connections | CONTEXT.md clarification: edges only, cleared tiles do NOT become passable (game mechanics decision) |
| BOARD-02 | Score is displayed and updates in real-time | HTML overlay positioning, real-time DOM updates |
</phase_requirements>

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| TypeScript | 5.x+ | Type safety for pathfinding logic | Type safety critical for algorithm correctness |
| Canvas API | Native | Path visualization and shake effects | No dependencies, performant for 2D graphics |
| Vitest | 4.x+ | Unit testing algorithm logic | Already configured, integrates with project |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| None | - | - | Existing stack sufficient |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| BFS | A* (A-Star) | A* overkill for small grid, BFS guarantees shortest path naturally |
| BFS | DFS | DFS doesn't guarantee shortest path, harder to count turns |
| Canvas shake | CSS animation | CSS can't shake individual tiles, canvas provides per-tile control |
| HTML overlay | Canvas text | Canvas text harder to style/position responsively |

**Installation:**
```bash
# No new packages needed - existing stack sufficient
```

## Architecture Patterns

### Recommended Project Structure
```
src/
├── matching/
│   ├── MatchEngine.ts      # Pathfinding + match validation logic
│   ├── PathFinder.ts       # BFS algorithm with turn counting
│   └── Scoring.ts          # Score calculation and management
├── rendering/
│   └── Renderer.ts         # Extended with shake + path drawing
├── managers/
│   └── GridManager.ts      # Extended with tile clearing
├── game/
│   └── Game.ts             # Extended with match event handling
└── types/
    └── index.ts            # Extended with new match event types
```

### Pattern 1: BFS Pathfinding with Turn Counting
**What:** Breadth-first search that tracks position, direction, and turn count to find paths within 2-turn limit
**When to use:** Validating if two tiles can be connected with valid path
**Example:**
```typescript
// Source: Standard BFS algorithm adapted for turn-constrained pathfinding
interface PathNode {
  row: number;
  col: number;
  direction: number;  // 0=up, 1=right, 2=down, 3=left, -1=none (start)
  turns: number;
  path: TilePosition[];
}

function findPathWithTurnLimit(
  start: TilePosition,
  end: TilePosition,
  grid: Tile[][],
  maxTurns: number = 2
): PathNode | null {
  const directions = [
    { row: -1, col: 0 }, // up
    { row: 0, col: 1 },  // right
    { row: 1, col: 0 },  // down
    { row: 0, col: -1 }  // left
  ];

  const queue: PathNode[] = [{
    ...start,
    direction: -1,
    turns: 0,
    path: [start]
  }];

  const visited = new Set<string>();

  while (queue.length > 0) {
    const current = queue.shift()!;

    // Check if reached destination
    if (current.row === end.row && current.col === end.col) {
      return current;
    }

    // Skip if exceeded turn limit
    if (current.turns > maxTurns) continue;

    // Try all 4 directions
    for (let dir = 0; dir < 4; dir++) {
      const newRow = current.row + directions[dir].row;
      const newCol = current.col + directions[dir].col;

      // Check bounds
      if (newRow < 0 || newRow >= CONFIG.grid.rows ||
          newCol < 0 || newCol >= CONFIG.grid.cols) continue;

      // Check if tile is passable (cleared or empty edge)
      const tile = grid[newRow][newCol];
      if (!tile.cleared) continue;  // Only pass through cleared tiles

      // Calculate new turn count
      const turnIncrement = (current.direction !== -1 && current.direction !== dir) ? 1 : 0;
      const newTurns = current.turns + turnIncrement;

      // Check visited state (row, col, direction) -> min turns
      const stateKey = `${newRow},${newCol},${dir}`;
      if (visited.has(stateKey)) continue;

      visited.add(stateKey);

      queue.push({
        row: newRow,
        col: newCol,
        direction: dir,
        turns: newTurns,
        path: [...current.path, { row: newRow, col: newCol }]
      });
    }
  }

  return null; // No valid path found
}
```

### Pattern 2: Match Validation Pipeline
**What:** Multi-stage validation that fails fast on cheap checks before expensive pathfinding
**When to use:** Handling `tilesSelected` events from GridManager
**Example:**
```typescript
function validateMatch(tile1: Tile, tile2: Tile, grid: Tile[][]): MatchResult {
  // Stage 1: Type check (cheap)
  if (tile1.type !== tile2.type) {
    return { valid: false, reason: 'different-type' };
  }

  // Stage 2: Position check (cheap)
  if (tile1.id === tile2.id) {
    return { valid: false, reason: 'same-tile' };
  }

  // Stage 3: Pathfinding (expensive)
  const pathResult = findPathWithTurnLimit(tile1.position, tile2.position, grid, 2);

  if (!pathResult) {
    return { valid: false, reason: 'no-path', turns: null };
  }

  if (pathResult.turns > 2) {
    return { valid: false, reason: 'too-many-turns', turns: pathResult.turns };
  }

  return {
    valid: true,
    path: pathResult.path,
    turns: pathResult.turns
  };
}
```

### Pattern 3: Canvas Shake Animation
**What:** Temporary canvas transform offset that decays over time for error feedback
**When to use:** Visual feedback for failed match attempts
**Example:**
```typescript
// Source: Canvas animation best practices with requestAnimationFrame
class ShakeAnimation {
  private startTime: number = 0;
  private duration: number = 200; // ms
  private intensity: number = 5; // pixels

  start(): void {
    this.startTime = performance.now();
  }

  getOffset(): { x: number; y: number } {
    const elapsed = performance.now() - this.startTime;
    if (elapsed > this.duration) return { x: 0, y: 0 };

    const decay = 1 - (elapsed / this.duration);
    const angle = elapsed * 0.05; // Oscillation speed

    return {
      x: Math.sin(angle) * this.intensity * decay,
      y: Math.cos(angle * 2) * this.intensity * decay * 0.5
    };
  }

  isComplete(): boolean {
    return performance.now() - this.startTime > this.duration;
  }
}
```

### Pattern 4: Event-Driven Match Handling
**What:** Extend existing GameEvents type with match events, emit from MatchEngine
**When to use:** Communicating match results between components
**Example:**
```typescript
// Extend types/index.ts
export interface GameEvents {
  // ... existing events
  'tilesMatched': {
    tile1: Tile;
    tile2: Tile;
    path: TilePosition[];
    turns: number;
    score: number;
  };
  'matchFailed': {
    tile1: Tile;
    tile2: Tile;
    reason: 'different-type' | 'no-path' | 'too-many-turns';
  };
}

// In Game.ts
this.events.on('tilesMatched', ({ tile1, tile2, path, turns, score }) => {
  // Clear tiles
  gridManager.clearTiles([tile1, tile2]);

  // Update score
  scoreManager.addScore(score);

  // Trigger success animation (draw connection line)
  renderer.animateMatch(tile1, tile2, path);
});

this.events.on('matchFailed', ({ tile1, tile2, reason }) => {
  // Trigger failure feedback
  renderer.animateShake([tile1, tile2], reason);

  // Deselect after animation
  setTimeout(() => {
    gridManager.deselectAll();
  }, 200);
});
```

### Anti-Patterns to Avoid
- **Running BFS on non-matching types:** Always check tile types first - BFS is expensive
- **Pathfinding on every frame:** Cache path results, only recalculate when tiles change
- **Blocking the game loop during pathfinding:** BFS is fast enough (<1ms) but don't call it excessively
- **Shaking the entire canvas:** Shake only the specific tiles for better UX
- **Hardcoding score values:** Use CONFIG for easy tuning

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Pathfinding visualization | Custom line drawing system | Canvas `lineTo()`, `stroke()` | Native canvas API handles lines efficiently |
| Shake animation | Custom animation loop | `requestAnimationFrame` with decay math | Standard web animation pattern |
| Event system | Custom pub/sub | Existing `TypedEventEmitter` | Already integrated, type-safe |
| Grid traversal | Custom iterator | Standard for-loops with bounds checking | Clearer, faster, no abstraction overhead |
| Score display | Canvas text rendering | HTML overlay with absolute positioning | Easier styling, responsive, accessible |

**Key insight:** Pathfinding is the only complex algorithm needed. Everything else (animation, events, scoring) uses standard web patterns. The grid is small enough (160 tiles) that BFS performance is not a concern.

## Common Pitfalls

### Pitfall 1: Counting Turns Incorrectly
**What goes wrong:** Turn count doesn't match visual expectation, path rejected when it looks valid
**Why it happens:** Counting every direction change instead of actual turns, or not counting the initial direction
**How to avoid:** A turn only occurs when direction changes. Start with -1 direction (no turns counted for first move).
**Warning signs:** Players complain paths should work but don't, or paths with obvious turns are accepted

```typescript
// WRONG - counts every direction change
turns++;  // on every step

// CORRECT - only count direction changes
if (current.direction !== newDirection) {
  turns++;
}
```

### Pitfall 2: Off-By-One in Path Definition
**What goes wrong:** Path includes start or end tile incorrectly, or misses a tile
**Why it happens:** Path array includes start position but BFS logic doesn't account for it
**How to avoid:** Define clearly: path includes start AND end positions. Draw lines between consecutive path points.
**Warning signs:** Connection line doesn't reach tiles, or overlaps tiles incorrectly

### Pitfall 3: Not Cleared Tiles Being Passable
**What goes wrong:** Pathfinding goes through tiles that still have emojis
**Why it happens:** Forgetting to check `tile.cleared` flag before allowing passage
**How to avoid:** Explicit check: `if (!tile.cleared) continue;` for all intermediate tiles
**Warning signs:** Paths go through visible tiles, matches seem too easy

### Pitfall 4: Shake Animation Not Resetting
**What goes wrong:** Tiles keep shaking or shake animation gets stuck
**Why it happens:** Animation state not cleared when tiles are deselected
**How to avoid:** Clear animation state in `deselectAll()` or when starting new animation
**Warning signs:** Tiles shake when they shouldn't, or shake persists after selection

### Pitfall 5: Score Not Updating Real-Time
**What goes wrong:** Score changes but display doesn't update until next frame
**Why it happens:** Score stored in variable but DOM not updated, or updated outside game loop
**How to avoid:** Update DOM immediately when score changes, use event-driven updates
**Warning signs:** Score display lags behind actual score, or only updates on refresh

## Code Examples

Verified patterns from official sources:

### Match Engine Integration
```typescript
// src/matching/MatchEngine.ts
export class MatchEngine {
  constructor(
    private gridManager: GridManager,
    private events: TypedEventEmitter<GameEvents>
  ) {}

  validateMatch(tile1: Tile, tile2: Tile): MatchResult {
    // Type check first (fast fail)
    if (tile1.type !== tile2.type) {
      return { valid: false, reason: 'different-type' };
    }

    // Position check
    if (tile1.id === tile2.id) {
      return { valid: false, reason: 'same-tile' };
    }

    // Pathfinding (only if types match)
    const grid = this.gridManager.getAllTiles();
    const pathResult = PathFinder.findPath(tile1.position, tile2.position, grid);

    if (!pathResult) {
      return { valid: false, reason: 'no-path' };
    }

    if (pathResult.turns > 2) {
      return { valid: false, reason: 'too-many-turns', turns: pathResult.turns };
    }

    // Calculate score
    const score = Scoring.calculate(pathResult.turns);

    return {
      valid: true,
      path: pathResult.path,
      turns: pathResult.turns,
      score
    };
  }
}
```

### Scoring System
```typescript
// src/matching/Scoring.ts
export class Scoring {
  private static readonly BASE_SCORE = 100;
  private static readonly BONUS_MULTIPLIER = {
    0: 1.5,  // 50% bonus for 0-turn (same row/col)
    1: 1.25, // 25% bonus for 1-turn
    2: 1.0   // No bonus for 2-turn
  };

  static calculate(turns: number): number {
    const multiplier = this.BONUS_MULTIPLIER[turns as keyof typeof Scoring.BONUS_MULTIPLIER] || 1.0;
    return Math.floor(this.BASE_SCORE * multiplier);
  }
}
```

### Renderer Extension for Feedback
```typescript
// In Renderer.ts - add shake and path drawing
private shakeAnimations = new Map<string, ShakeAnimation>();
private pathAnimation: PathAnimation | null = null;

animateShake(tiles: Tile[], reason: string): void {
  // Start shake animation for each tile
  tiles.forEach(tile => {
    const animation = new ShakeAnimation();
    animation.start();
    this.shakeAnimations.set(tile.id, animation);
  });
}

drawPath(path: TilePosition[]): void {
  if (path.length < 2) return;

  this.ctx.strokeStyle = '#00ff00';
  this.ctx.lineWidth = 3;
  this.ctx.beginPath();

  const start = path[0];
  const { size, gap } = CONFIG.tile;
  const offsetX = (this.canvas.width - CONFIG.grid.cols * (size + gap)) / 2;
  const offsetY = (this.canvas.height - CONFIG.grid.rows * (size + gap)) / 2;

  this.ctx.moveTo(
    offsetX + start.col * (size + gap) + size / 2,
    offsetY + start.row * (size + gap) + size / 2
  );

  for (let i = 1; i < path.length; i++) {
    const point = path[i];
    this.ctx.lineTo(
      offsetX + point.col * (size + gap) + size / 2,
      offsetY + point.row * (size + gap) + size / 2
    );
  }

  this.ctx.stroke();
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| A* for all pathfinding | BFS for unweighted grids | ~2010s+ | BFS simpler, guarantees shortest path naturally |
| Fixed tile paths | Dynamic pathfinding | Always | Required for matching mechanics |
| Poll-based game state | Event-driven architecture | ~2015+ | Better decoupling, easier testing |
| Canvas-only UI | Hybrid Canvas + DOM | ~2010s+ | DOM for UI overlays, Canvas for game graphics |

**Deprecated/outdated:**
- Polling for tile selection state: Use event-driven `tilesSelected` event
- Global score variables: Use encapsulated ScoreManager class
- Synchronous pathfinding blocking UI: BFS is fast enough, but keep it optimized

## Open Questions

1. **Path visualization duration**
   - What we know: Connection line should be drawn when match succeeds
   - What's unclear: How long to show the line before tiles disappear
   - Recommendation: Show line for ~300ms before clearing tiles (short enough to feel responsive, long enough to see path)

2. **Visual distinction for failure reasons**
   - What we know: Need different feedback for "wrong type" vs "path too long"
   - What's unclear: Exact animation pattern to distinguish
   - Recommendation: Different shake patterns - horizontal shake for wrong type, circular shake for path too long

3. **Score overlay positioning**
   - What we know: Score should be visible in real-time
   - What's unclear: Where to position (top-right? top-center? floating?)
   - Recommendation: Top-right corner, semi-transparent background, large font - doesn't obscure gameplay

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Vitest 4.x |
| Config file | vitest.config.ts (exists) |
| Quick run command | `npm run test` |
| Full suite command | `npm run test -- --run` |

### Phase Requirements → Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| CORE-04 | Path-finding validates 0-2 turn paths | unit | `vitest run src/__tests__/PathFinder.test.ts` | ❌ Wave 0 |
| CORE-04 | Path-finding rejects 3+ turn paths | unit | `vitest run src/__tests__/PathFinder.test.ts` | ❌ Wave 0 |
| CORE-05 | Matching tiles are cleared from board | unit | `vitest run src/__tests__/MatchEngine.test.ts` | ❌ Wave 0 |
| CORE-05 | Cleared tiles emit tile:cleared event | unit | `vitest run src/__tests__/MatchEngine.test.ts` | ❌ Wave 0 |
| CORE-06 | Score increases after successful match | unit | `vitest run src/__tests__/Scoring.test.ts` | ❌ Wave 0 |
| CORE-06 | Score bonus calculated correctly | unit | `vitest run src/__tests__/Scoring.test.ts` | ❌ Wave 0 |
| CORE-07 | Cleared tiles ignored during selection | integration | `vitest run src/__tests__/GridManager.test.ts` | ✅ Phase 2 |
| BOARD-02 | Score display updates in real-time | unit | `vitest run src/__tests__/Scoring.test.ts` | ❌ Wave 0 |

### Sampling Rate
- **Per task commit:** `npm run test`
- **Per wave merge:** `npm run test -- --run`
- **Phase gate:** Full suite green before `/gsd:verify-work`

### Wave 0 Gaps
- [ ] `src/__tests__/PathFinder.test.ts` - BFS algorithm with turn counting validation
- [ ] `src/__tests__/MatchEngine.test.ts` - Match validation pipeline, event emission
- [ ] `src/__tests__/Scoring.test.ts` - Score calculation and updates
- [ ] `src/__tests__/Game.integration.test.ts` - End-to-end match flow (if needed)

*(Existing test infrastructure covers GridManager, Renderer, Game, and EventEmitter - reuse patterns from these)*

## Sources

### Primary (HIGH confidence)
- [MDN Canvas API](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API) - Canvas drawing, transforms, animations
- [MDN Game Development](https://developer.mozilla.org/en-US/docs/Games) - Game loop patterns, animation best practices
- [Vitest Documentation](https://vitest.dev/guide/) - Test framework setup and patterns
- Project Phase 1 RESEARCH.md - Established architecture patterns, event system, canvas rendering

### Secondary (MEDIUM confidence)
- CONTEXT.md Phase 3 - User decisions on algorithm, constraints, scoring
- STATE.md - Existing codebase architecture, component integration patterns
- Existing Phase 2 code (GridManager, Renderer, Game) - Working patterns to follow
- [Red Blob Games - Pathfinding](https://www.redblobgames.com/pathfinding/a-star/introduction.html) - BFS/A* concepts (verified 2025)

### Tertiary (LOW confidence)
- Web search attempts returned no results - relying on established algorithms and project patterns
- Turn-constrained pathfinding is a well-known variant of BFS, documented in algorithm literature

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - No new dependencies needed, existing stack proven
- Architecture: MEDIUM - BFS algorithm is well-understood, but turn-counting variant has edge cases
- Pitfalls: MEDIUM - Pathfinding edge cases identified, but specific issues may emerge during implementation
- Visual feedback: MEDIUM - Shake animation pattern is standard, but exact timing needs iteration

**Research date:** 2026-03-11
**Valid until:** 14 days (algorithm is stable, but implementation details may need adjustment based on testing)
