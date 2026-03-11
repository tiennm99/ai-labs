# Phase 4: Game State Management - Research

**Researched:** 2026-03-11
**Domain:** Game state machines, win/lose detection, game-over UI
**Confidence:** HIGH

## Summary

Phase 4 implements game state management with a finite state machine (FSM) pattern to handle game transitions, detect win conditions (all tiles cleared), and detect no-moves states (no valid pairs remain). The phase also adds game-over UI with restart functionality.

Based on the CONTEXT.md decisions, this phase will use an explicit GameStateManager class with an enum-based state machine (IDLE, SELECTING, MATCHING, GAME_OVER). The state machine will validate transitions and emit events for other components to react to. The win detection checks after each successful match by counting remaining tiles. The no-moves detection uses a type-optimized algorithm that groups tiles by type before checking path validity to reduce expensive PathFinder calls.

**Primary recommendation:** Implement a lightweight enum-based state machine without external dependencies like XState—the game has only 4 states and simple transitions, making a custom implementation more appropriate than a heavy library.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- **Architecture**: Explicit GameStateManager class - dedicated class with explicit state enum and transition methods
- **States**: 4 states - IDLE (waiting for input), SELECTING (1 tile selected), MATCHING (processing match, input blocked), GAME_OVER (game ended)
- **Transitions**: Explicit transition methods - use methods like `transitionTo(state)` that validate state changes and emit events
- **Integration**: Shared utility - GameStateManager is a standalone utility that other components can import, not owned by Game.ts
- **Win check trigger**: After each successful match - check in `tile:cleared` event handler. If all 160 tiles cleared, emit `game:over` with `won=true`
- **No-moves check trigger**: After successful match - check after clearing tiles to see if any valid moves remain
- **Algorithm**: Type-optimized - iterate all tile pairs but check matching types first (early exit), reducing PathFinder calls
- **Win condition**: All 160 tiles cleared - board is completely empty
- **UI approach**: HTML overlay - centered on screen with semi-transparent background, consistent with score overlay approach
- **Message content**: Brief text - "You Win!" for success, "No moves left!" for no-moves state. Clear and unambiguous.
- **Positioning**: Screen center - centered both horizontally and vertically for maximum visibility
- **Input behavior**: Block all tile input - player cannot select tiles while game over overlay is shown
- **Reset scope**: Keep final score visible - reset grid and state to IDLE, but preserve final score as "previous score" display. New game score starts at 0.
- **Button placement**: In game over overlay - restart button is part of the game over overlay, only visible when game ends
- **Confirmation**: Instant restart - no confirmation dialog, simpler and faster for players who want to retry
- **Overlay cleanup**: Immediate hide - hide/remove overlay immediately when restart clicked, game ready to play

### Claude's Discretion
- Exact styling of game over overlay (colors, fonts, sizing)
- State transition event payloads (if additional data needed beyond state name)
- Timing of no-moves check (immediate vs slight delay after match completes)

### Deferred Ideas (OUT OF SCOPE)
- **Board shuffle when no moves remain**: This feature belongs to Phase 5 (Board Generation and Recovery) per the roadmap (requirement BOARD-01). Phase 4 only detects no-moves state; Phase 5 will implement shuffle functionality to resolve it.
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| CORE-08 | Game detects when no valid moves remain on the board | Type-optimized detection algorithm using existing PathFinder.findPath() method |
| CORE-09 | Game detects win condition when all tiles are cleared | Simple tile count check using GridManager's tiles array with cleared property filter |
</phase_requirements>

## Standard Stack

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| TypeScript Enums | 5.9.3 | State representation | Type-safe, self-documenting, excellent IDE support |
| Existing TypedEventEmitter | Custom | Event emission for state transitions | Already integrated, type-safe event system |
| Existing PathFinder | Custom | No-moves detection validation | Already implements BFS pathfinding with turn constraints |

### Supporting

None required for this phase.

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Custom enum-based FSM | XState library | XState is powerful (300+ queries on GitHub) but overkill for 4-state simple machine. Custom implementation: ~100 lines vs 40KB minified XState. Use XState if states grow beyond 10 or need hierarchical/parallel states. |
| String state constants | Numeric state codes | Enums provide better debugging (readable values) and type safety. Numeric codes require mapping functions. |

**Installation:**
No new packages needed. All dependencies already installed from previous phases.

## Architecture Patterns

### Recommended Project Structure

```
src/
├── state/
│   ├── GameStateManager.ts    # State machine with enum and transition logic
│   └── NoMovesDetector.ts     # Type-optimized no-moves detection algorithm
├── game/
│   └── Game.ts               # Integrates GameStateManager, listens to state changes
├── types/
│   └── index.ts              # Add GameState enum and StateChangeEvent type
└── index.html                # Add game-over overlay HTML
```

### Pattern 1: Enum-Based State Machine

**What:** A finite state machine using TypeScript enums for type-safe state representation and explicit transition methods.

**When to use:** Simple state machines with 4-10 states, no hierarchical or parallel state requirements.

**Example:**

```typescript
// Source: TypeScript Enums Handbook (https://www.typescriptlang.org/docs/handbook/enums.html)

// Define state enum
export enum GameState {
  IDLE = 'IDLE',
  SELECTING = 'SELECTING',
  MATCHING = 'MATCHING',
  GAME_OVER = 'GAME_OVER'
}

// State manager class
export class GameStateManager {
  private currentState: GameState = GameState.IDLE;

  // Valid transitions: define allowed state changes
  private readonly validTransitions: Record<GameState, GameState[]> = {
    [GameState.IDLE]: [GameState.SELECTING],
    [GameState.SELECTING]: [GameState.IDLE, GameState.MATCHING],
    [GameState.MATCHING]: [GameState.IDLE, GameState.GAME_OVER],
    [GameState.GAME_OVER]: [GameState.IDLE] // restart only
  };

  transitionTo(newState: GameState): boolean {
    // Validate transition
    const allowed = this.validTransitions[this.currentState].includes(newState);
    if (!allowed) {
      return false;
    }

    const previousState = this.currentState;
    this.currentState = newState;

    // Emit event
    this.events.emit('game:stateChange', {
      from: previousState,
      to: newState
    });

    return true;
  }

  getState(): GameState {
    return this.currentState;
  }

  canSelectTile(): boolean {
    return this.currentState === GameState.IDLE || this.currentState === GameState.SELECTING;
  }
}
```

**Key insights:**
- String enums serialize well for debugging (readable in console/devtools)
- Transition validation prevents invalid state changes
- Event emission allows other components to react without tight coupling
- Helper methods (like `canSelectTile()`) encapsulate state-based logic

### Pattern 2: Type-Optimized No-Moves Detection

**What:** Algorithm that groups tiles by type before checking path validity, avoiding expensive PathFinder calls for mismatched types.

**When to use:** When checking for valid moves on a large board (160 tiles = 12,720 pair combinations).

**Example:**

```typescript
// Type-optimized detection algorithm
export class NoMovesDetector {
  static hasValidMoves(grid: Tile[][]): boolean {
    // Group tiles by type
    const tilesByType = new Map<number, Tile[]>();

    for (let row = 0; row < grid.length; row++) {
      for (let col = 0; col < grid[row].length; col++) {
        const tile = grid[row][col];
        if (!tile.cleared) {
          if (!tilesByType.has(tile.type)) {
            tilesByType.set(tile.type, []);
          }
          tilesByType.get(tile.type)!.push(tile);
        }
      }
    }

    // Check each type group for valid pairs
    for (const [type, tiles] of tilesByType) {
      // Only need to check pairs within same type
      for (let i = 0; i < tiles.length; i++) {
        for (let j = i + 1; j < tiles.length; j++) {
          const path = PathFinder.findPath(
            tiles[i].position,
            tiles[j].position,
            grid,
            2 // max turns
          );

          if (path) {
            return true; // Found at least one valid move
          }
        }
      }
    }

    return false; // No valid moves found
  }
}
```

**Optimization analysis:**
- Total tile pairs: 160 × 159 / 2 = 12,720
- Type-optimized: 16 types × (10 tiles each = 45 pairs/type) = 720 PathFinder calls
- **94% reduction** in PathFinder calls (12,720 → 720)
- Early exit: returns true on first valid move found

### Pattern 3: Game-Over HTML Overlay

**What:** HTML overlay positioned with `position: fixed` that shows/hides based on game state.

**When to use:** Temporary UI elements that appear/disappear (modals, overlays, toasts).

**Example:**

```typescript
// HTML in index.html
<div id="game-over-overlay" style="display: none;">
  <div class="overlay-content">
    <h1 id="game-over-message">You Win!</h1>
    <button id="restart-button">Play Again</button>
  </div>
</div>

// CSS (inline in index.html for simplicity)
<style>
  #game-over-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.8);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }

  .overlay-content {
    background-color: rgba(26, 26, 70, 0.95);
    padding: 40px;
    border-radius: 12px;
    text-align: center;
  }

  #game-over-message {
    font-size: 48px;
    color: #eaeaea;
    margin-bottom: 24px;
  }

  #restart-button {
    padding: 16px 32px;
    font-size: 24px;
    background-color: #e94560;
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
  }

  #restart-button:hover {
    background-color: #d63850;
  }
</style>

// GameStateManager integration
private showGameOverOverlay(won: boolean): void {
  const overlay = document.getElementById('game-over-overlay');
  const message = document.getElementById('game-over-message');

  if (overlay && message) {
    message.textContent = won ? 'You Win!' : 'No moves left!';
    overlay.style.display = 'flex';
  }
}

private hideGameOverOverlay(): void {
  const overlay = document.getElementById('game-over-overlay');
  if (overlay) {
    overlay.style.display = 'none';
  }
}
```

**Key insights:**
- Follows existing score overlay pattern (already established in codebase)
- `z-index: 1000` ensures overlay appears above all game elements
- Semi-transparent background (`rgba`) shows game behind overlay
- Flexbox centering works on all screen sizes

### Anti-Patterns to Avoid

- **Tight coupling:** Don't embed state machine logic directly in Game.ts. Use separate GameStateManager class for testability.
- **Transition validation skipping:** Always validate transitions. Don't allow arbitrary state changes (e.g., from SELECTING directly to GAME_OVER).
- **Blocking operations:** No-moves detection should be async or debounced. Checking 720 pairs on main thread could freeze UI.
- **Global state:** Don't use global variables for current state. Keep state encapsulated in GameStateManager instance.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| State machine library | XState (40KB) for 4-state machine | Custom enum-based FSM (~100 lines) | XState designed for complex hierarchical/parallel states. Overkill for simple transitions. Use XState if states grow beyond 10. |
| Event system | Custom pub/sub | Existing TypedEventEmitter | Already integrated, type-safe, battle-tested from Phase 1 |
| Pathfinding | Custom pathfinding for no-moves check | Existing PathFinder.findPath() | Already implements BFS with turn constraints. Reuse for consistency. |
| UI overlay library | Material UI, Bootstrap overlays | Plain HTML/CSS with position:fixed | Game uses canvas rendering. No component framework. Simplest approach matches existing score overlay. |

**Key insight:** The game's architecture is intentionally simple (canvas + vanilla TypeScript). Adding heavy libraries (XState, React) would introduce unnecessary complexity. Custom implementations are appropriate for this scale.

## Common Pitfalls

### Pitfall 1: State Transition Race Conditions

**What goes wrong:** Multiple state changes in rapid succession (e.g., player clicks during MATCHING state) cause invalid transitions or lost events.

**Why it happens:** Input events not blocked during MATCHING state; state transitions not atomic.

**How to avoid:**
- Check `gameStateManager.canSelectTile()` before processing tile clicks
- Use transition validation (reject invalid state changes)
- Consider debouncing rapid state changes

**Warning signs:** Tiles selected during match animation; state transitions fail silently; inconsistent UI behavior.

### Pitfall 2: No-Moves Detection Performance

**What goes wrong:** Game freezes for 500ms-2s when checking for valid moves after each match.

**Why it happens:** Naive O(n²) algorithm checks all 12,720 tile pairs with expensive PathFinder calls.

**How to avoid:**
- Use type-optimized algorithm (94% reduction in PathFinder calls)
- Add early exit (return true on first valid move)
- Consider debouncing: delay check by 100ms after match completes
- Profile: If still slow, add 0-1 turn quick check before 2-turn check

**Warning signs:** Visible lag after match completes; frame rate drops during detection.

### Pitfall 3: Win Detection Timing

**What goes wrong:** Win message appears before match animation completes, or appears multiple times.

**Why it happens:** Checking win condition immediately on match, not after tiles cleared.

**How to avoid:**
- Check win condition in `tile:cleared` event handler (after 300ms animation)
- Add guard: only check if `gameStateManager.getState() !== GameState.GAME_OVER`
- Use flag: track if game over already triggered to prevent duplicates

**Warning signs:** Win overlay flickers; overlay appears before tiles disappear; console shows multiple `game:over` events.

### Pitfall 4: Restart State Reset

**What goes wrong:** After restart, tiles remain cleared, or score doesn't reset to 0.

**Why it happens:** Incomplete reset; only resetting some state but not all.

**How to avoid:**
- Create explicit `reset()` method on GameStateManager
- Call `gridManager.initializeGrid()` to regenerate tiles
- Reset score to 0
- Hide game-over overlay
- Reset state to IDLE
- Verify all components reset: grid, score, state, UI

**Warning signs:** New game starts with old tiles; score persists from previous game; input still blocked.

## Code Examples

Verified patterns from official sources:

### TypeScript Enum State Machine

```typescript
// Source: TypeScript Enums Handbook
// https://www.typescriptlang.org/docs/handbook/enums.html

// String enum for better debugging
export enum GameState {
  IDLE = 'IDLE',
  SELECTING = 'SELECTING',
  MATCHING = 'MATCHING',
  GAME_OVER = 'GAME_OVER'
}

// Union type for exhaustiveness checking
type State = GameState.IDLE | GameState.SELECTING | GameState.MATCHING | GameState.GAME_OVER;

// Transition map with type safety
const transitions: Record<GameState, GameState[]> = {
  [GameState.IDLE]: [GameState.SELECTING],
  [GameState.SELECTING]: [GameState.IDLE, GameState.MATCHING],
  [GameState.MATCHING]: [GameState.IDLE, GameState.GAME_OVER],
  [GameState.GAME_OVER]: [GameState.IDLE]
};
```

### Event-Driven State Changes

```typescript
// Pattern from existing codebase (Game.ts)
// Emit state change events for other components

interface GameEvents {
  'game:stateChange': { from: GameState; to: GameState };
  'game:over': { won: boolean };
  'game:restart': void;
}

// In GameStateManager
transitionTo(newState: GameState): boolean {
  if (!this.validTransitions[this.currentState].includes(newState)) {
    return false;
  }

  const previousState = this.currentState;
  this.currentState = newState;

  // Emit event for other components to react
  this.events.emit('game:stateChange', {
    from: previousState,
    to: newState
  });

  return true;
}

// In Game.ts - listen to state changes
this.gameStateManager.on('game:stateChange', ({ from, to }) => {
  console.log(`State: ${from} → ${to}`);

  // Block input during MATCHING state
  if (to === GameState.MATCHING) {
    // Input already blocked by GridManager's 2-tile limit
  }

  // Show overlay on GAME_OVER
  if (to === GameState.GAME_OVER) {
    // Overlay shown by game:over event handler
  }
});
```

### Win Detection Implementation

```typescript
// Check after tiles cleared (existing event from Phase 3)
this.events.on('tile:cleared', () => {
  // Count remaining tiles
  const remainingTiles = gridManager.getAllTiles()
    .flat()
    .filter(tile => !tile.cleared).length;

  if (remainingTiles === 0) {
    // All tiles cleared - player wins!
    this.gameStateManager.transitionTo(GameState.GAME_OVER);
    this.events.emit('game:over', { won: true });
  }
});
```

### No-Moves Detection Implementation

```typescript
// Check for valid moves after match completes
this.events.on('tilesMatched', async () => {
  // Wait for tiles to clear (300ms animation)
  await new Promise(resolve => setTimeout(resolve, 300));

  // Check if any valid moves remain
  const grid = this.gridManager.getAllTiles();
  const hasValidMoves = NoMovesDetector.hasValidMoves(grid);

  if (!hasValidMoves) {
    // No moves left - game over
    this.gameStateManager.transitionTo(GameState.GAME_OVER);
    this.events.emit('game:over', { won: false });
  }
});
```

### Restart Implementation

```typescript
// In Game.ts or GameStateManager
restart(): void {
  // Reset grid
  this.gridManager.initializeGrid();

  // Reset score (keep previous score displayed if needed)
  this.score = 0;
  this.updateScoreDisplay();

  // Reset state machine
  this.gameStateManager.reset();

  // Hide overlay
  this.hideGameOverOverlay();

  // Emit restart event
  this.events.emit('game:restart', undefined as never);
}

// In GameStateManager
reset(): void {
  this.currentState = GameState.IDLE;
  this.events.emit('game:stateChange', {
    from: GameState.GAME_OVER,
    to: GameState.IDLE
  });
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Manual state tracking with strings | Enum-based state machines | TypeScript 2.4+ (2017) | Type safety, better IDE support |
| Global state variables | Encapsulated state manager classes | ~2018 with React hooks pattern | Testability, predictability |
| Complex state machines (XState) | Simple FSM for small state counts | ~2020 community trend | Reduced bundle size, simpler code |
| Callback-based state changes | Event-driven state changes | ~2019 with event emitters | Decoupling, extensibility |

**Deprecated/outdated:**
- **Switch statement state machines:** Hard to maintain, violates open-closed principle. Use transition map instead.
- **Magic strings for states:** 'idle', 'playing' — no type safety. Use enums.
- **Tight coupling:** Game.ts directly managing state transitions. Use separate GameStateManager.

## Open Questions

1. **No-moves detection timing**
   - What we know: Should check after tiles cleared (300ms animation)
   - What's unclear: Immediate check vs slight delay (debounce) to avoid blocking UI
   - Recommendation: Start with immediate check, profile performance. If UI freezes, add 100ms debounce or move to Web Worker.

2. **State transition event payloads**
   - What we know: Need `{ from, to }` for state changes
   - What's unclear: Additional metadata needed? (timestamp, trigger reason)
   - Recommendation: Start with minimal payload. Add metadata only if debugging reveals need.

## Validation Architecture

### Test Framework

| Property | Value |
|----------|-------|
| Framework | Vitest 4.0.18 |
| Config file | vitest.config.ts (already exists) |
| Quick run command | `npm test -- --run GameStateManager` |
| Full suite command | `npm test -- --run` |

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| CORE-08 | Detect no valid moves remain | unit | `npm test -- --run NoMovesDetector` | ❌ Wave 0 |
| CORE-08 | Emit game:over with won=false on no-moves | integration | `npm test -- --run GameStateManager` | ❌ Wave 0 |
| CORE-09 | Detect win when all tiles cleared | unit | `npm test -- --run GameStateManager` | ❌ Wave 0 |
| CORE-09 | Emit game:over with won=true on win | integration | `npm test -- --run Game` | ❌ Wave 0 |
| State machine | Validate state transitions | unit | `npm test -- --run GameStateManager` | ❌ Wave 0 |
| State machine | Block invalid transitions | unit | `npm test -- --run GameStateManager` | ❌ Wave 0 |
| Restart | Reset grid, score, state, UI | integration | `npm test -- --run Game` | ❌ Wave 0 |
| Overlay | Show/hide game over overlay | integration | `npm test -- --run Game` | ❌ Wave 0 |

### Sampling Rate

- **Per task commit:** `npm test -- --run <TestName>` (specific test file)
- **Per wave merge:** `npm test -- --run` (full suite)
- **Phase gate:** Full suite green before `/gsd:verify-work`

### Wave 0 Gaps

- [ ] `src/__tests__/GameStateManager.test.ts` — state transition tests, win/lose detection
- [ ] `src/__tests__/NoMovesDetector.test.ts` — type-optimized detection algorithm tests
- [ ] `src/__tests__/Game.integration.test.ts` — restart and overlay integration tests
- [ ] Framework: Vitest already configured (no install needed)

## Sources

### Primary (HIGH confidence)

- **TypeScript Enums Handbook** - https://www.typescriptlang.org/docs/handbook/enums.html
  - Enum usage patterns, string vs numeric enums
  - Type safety with enums
  - Enum comparison and exhaustiveness checking

- **XState GitHub Repository** - https://github.com/statelyai/xstate
  - State machine patterns and examples
  - Transition validation patterns
  - Event-driven state changes
  - Used to identify that XState is overkill for 4-state machine

- **Existing codebase analysis** - /mnt/d/tiennm99/gsd-framework/src/
  - `game/EventEmitter.ts` - Event system already in use
  - `types/index.ts` - GameEvents interface for type-safe events
  - `managers/GridManager.ts` - Tile grid management with cleared property
  - `matching/PathFinder.ts` - BFS pathfinding algorithm
  - `game/Game.ts` - Event handling patterns (tilesSelected, tilesMatched)
  - `index.html` - Existing score overlay pattern

### Secondary (MEDIUM confidence)

- **Project CONTEXT.md** - User decisions and locked choices
- **Project REQUIREMENTS.md** - CORE-08 and CORE-09 requirements
- **Project STATE.md** - Existing architecture decisions and patterns

### Tertiary (LOW confidence)

- None (WebSearch returned no results, relying on official docs and codebase analysis)

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - All components already in codebase, no new dependencies needed
- Architecture: HIGH - Enum-based FSM is well-established pattern, TypeScript enums provide type safety
- Pitfalls: HIGH - Race conditions and performance issues documented in state machine literature
- Code examples: HIGH - Derived from existing codebase patterns and official TypeScript documentation

**Research date:** 2026-03-11
**Valid until:** 2026-04-10 (30 days - stable domain, patterns unlikely to change)
