# Phase 4: Game State Management - Context

**Gathered:** 2026-03-11
**Status:** Ready for planning

<domain>
## Phase Boundary

Detect game-ending conditions (win when all tiles cleared, no-moves state), implement state machine for game states (idle, selected, matching, game over), and provide restart functionality. This phase delivers the game state layer that wraps all gameplay logic.

</domain>

<decisions>
## Implementation Decisions

### State Machine Design
- **Architecture**: Explicit GameStateManager class - dedicated class with explicit state enum and transition methods
- **States**: 4 states - IDLE (waiting for input), SELECTING (1 tile selected), MATCHING (processing match, input blocked), GAME_OVER (game ended)
- **Transitions**: Explicit transition methods - use methods like `transitionTo(state)` that validate state changes and emit events
- **Integration**: Shared utility - GameStateManager is a standalone utility that other components can import, not owned by Game.ts

### Win/Lose Detection Timing
- **Win check trigger**: After each successful match - check in `tile:cleared` event handler. If all 160 tiles cleared, emit `game:over` with `won=true`
- **No-moves check trigger**: After successful match - check after clearing tiles to see if any valid moves remain
- **Algorithm**: Type-optimized - iterate all tile pairs but check matching types first (early exit), reducing PathFinder calls
- **Win condition**: All 160 tiles cleared - board is completely empty

### Game Over UI Presentation
- **UI approach**: HTML overlay - centered on screen with semi-transparent background, consistent with score overlay approach
- **Message content**: Brief text - "You Win!" for success, "No moves left!" for no-moves state. Clear and unambiguous.
- **Positioning**: Screen center - centered both horizontally and vertically for maximum visibility
- **Input behavior**: Block all tile input - player cannot select tiles while game over overlay is shown

### Restart Functionality Scope
- **Reset scope**: Keep final score visible - reset grid and state to IDLE, but preserve final score as "previous score" display. New game score starts at 0.
- **Button placement**: In game over overlay - restart button is part of the game over overlay, only visible when game ends
- **Confirmation**: Instant restart - no confirmation dialog, simpler and faster for players who want to retry
- **Overlay cleanup**: Immediate hide - hide/remove overlay immediately when restart clicked, game ready to play

### Claude's Discretion
- Exact styling of game over overlay (colors, fonts, sizing)
- State transition event payloads (if additional data needed beyond state name)
- Timing of no-moves check (immediate vs slight delay after match completes)

</decisions>

<specifics>
## Specific Ideas

- State machine should enforce input blocking during MATCHING state - prevents race conditions with animations
- Type-optimized no-moves check: group tiles by type, only check pairs within same type groups
- HTML overlay should use `position: fixed` with `z-index` above game canvas
- Restart button should be prominent and clearly labeled (e.g., "Play Again")

</specifics>

<code_context>
## Existing Code Insights

### Reusable Assets
- **Game.ts**: Main orchestrator already tracks score and has event handlers - can own GameStateManager instance and listen for state transitions
- **GameEvents interface**: Already has `game:over` event defined with `{ won: boolean }` payload - leverage existing event system
- **GridManager**: Has `tiles` 2D array with `cleared` property - can check remaining tiles for win condition
- **PathFinder**: `findPath()` method exists - can be used by no-moves detector to check if any valid pairs exist
- **Score overlay (index.html)**: HTML overlay pattern already established - game over overlay can follow same approach

### Established Patterns
- Event-driven architecture - all state changes should emit events for other components to react to
- Type-safe events via GameEvents interface - add new events like `game:stateChange` if needed
- Input blocking during animations - state machine should formalize this pattern

### Integration Points
- **GameStateManager**: New class in `src/state/` or `src/managers/`
- **Game.ts**: Integrates GameStateManager, calls transition methods, listens for state changes
- **No-moves detector**: New utility in `src/detection/` or method in GameStateManager
- **Game over overlay**: Add to `index.html` similar to score overlay, toggle visibility via CSS
- **Events**: Emit `game:stateChange`, `game:over` (already defined), potentially `game:restart`

</code_context>

<deferred>
## Deferred Ideas

- **Board shuffle when no moves remain**: This feature belongs to Phase 5 (Board Generation and Recovery) per the roadmap (requirement BOARD-01). Phase 4 only detects no-moves state; Phase 5 will implement shuffle functionality to resolve it.

</deferred>

---

*Phase: 04-game-state-management*
*Context gathered: 2026-03-11*
