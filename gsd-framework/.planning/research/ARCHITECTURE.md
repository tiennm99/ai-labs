# Architecture Research

**Domain:** Tile-matching puzzle game (Pikachu Kawai / Onet Connect style)
**Researched:** 2026-03-10
**Confidence:** HIGH

## Standard Architecture

### System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         Presentation Layer                       │
├─────────────────────────────────────────────────────────────────┤
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐        │
│  │ Renderer │  │  Audio   │  │   UI     │  │Animator  │        │
│  │          │  │ Manager  │  │ Overlay  │  │          │        │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘        │
│       │             │             │             │               │
├───────┴─────────────┴─────────────┴─────────────┴───────────────┤
│                         Game Logic Layer                         │
├─────────────────────────────────────────────────────────────────┤
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                    Game Loop (Core)                       │  │
│  │   requestAnimationFrame → update() → render()             │  │
│  └──────────────────────────────────────────────────────────┘  │
│       │              │              │             │              │
│  ┌────┴────┐   ┌─────┴─────┐  ┌─────┴─────┐  ┌───┴────┐        │
│  │  Input  │   │ PathFinder│  │   Grid    │  │ Score  │        │
│  │ Handler │   │  Engine   │  │  Manager  │  │System  │        │
│  └─────────┘   └───────────┘  └───────────┘  └────────┘        │
├─────────────────────────────────────────────────────────────────┤
│                         State Layer                              │
├─────────────────────────────────────────────────────────────────┤
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐        │
│  │  Idle    │  │ Selected │  │ Matching │  │ GameOver │        │
│  │  State   │  │  State   │  │  State   │  │  State   │        │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘        │
├─────────────────────────────────────────────────────────────────┤
│                         Data Layer                               │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐                      │
│  │  Tile    │  │  Game    │  │ Config   │                      │
│  │  Model   │  │  State   │  │Constants │                      │
│  └──────────┘  └──────────┘  └──────────┘                      │
└─────────────────────────────────────────────────────────────────┘
```

### Component Responsibilities

| Component | Responsibility | Typical Implementation |
|-----------|----------------|------------------------|
| **Game Loop** | Orchestrates update/render cycle, timing | requestAnimationFrame with delta time |
| **Grid Manager** | Owns tile grid, handles tile state, generates layouts | 2D array of tile objects |
| **Input Handler** | Captures clicks/touches, translates to grid coordinates | Event listeners on canvas/container |
| **PathFinder** | Validates connections using ≤3 line algorithm | BFS/DFS with turn counting |
| **Renderer** | Draws grid, tiles, connection lines, animations | Canvas 2D API or DOM elements |
| **State Machine** | Manages game states (idle, selected, matching, over) | Finite state machine pattern |
| **Score System** | Tracks points, combos, game progress | Simple counter with multipliers |
| **Animator** | Handles tile disappear, connection line, UI effects | Tween/interpolation functions |
| **UI Overlay** | Score display, hints, restart button | DOM elements layered over game |

## Recommended Project Structure

```
src/
├── core/                    # Core game engine
│   ├── GameLoop.ts          # Main loop, timing, frame management
│   ├── EventEmitter.ts      # Pub/sub for component communication
│   └── StateMachine.ts      # Finite state machine base
│
├── game/                    # Game-specific logic
│   ├── Grid.ts              # Tile grid, layout generation
│   ├── Tile.ts              # Tile model, types, state
│   ├── PathFinder.ts        # Connection validation algorithm
│   ├── MatchEngine.ts       # Match detection and execution
│   └── MoveDetector.ts      # Detects when no moves remain
│
├── input/                   # Input handling
│   ├── InputHandler.ts      # Mouse/touch event processing
│   └── GridCoordinate.ts    # Screen-to-grid coordinate conversion
│
├── renderer/                # Visual output
│   ├── Renderer.ts          # Main canvas renderer
│   ├── TileRenderer.ts      # Tile drawing logic
│   ├── ConnectionRenderer.ts # Path line drawing
│   └── AnimationManager.ts  # Animation queue and execution
│
├── state/                   # Game states
│   ├── GameState.ts         # State interface
│   ├── IdleState.ts         # Waiting for first selection
│   ├── SelectedState.ts     # First tile selected, awaiting second
│   ├── MatchingState.ts     # Processing match attempt
│   ├── AnimatingState.ts    # Playing match/shuffle animation
│   └── GameOverState.ts     # No moves or all cleared
│
├── systems/                 # Supporting systems
│   ├── ScoreSystem.ts       # Points, combos, high score
│   ├── HintSystem.ts        # Optional hint generation
│   └── SoundSystem.ts       # Audio feedback (future)
│
├── config/                  # Configuration
│   ├── GameConfig.ts        # Grid size, tile types, timing
│   └── Constants.ts         # Magic numbers, colors, sizes
│
├── utils/                   # Utilities
│   ├── Shuffle.ts           # Fisher-Yates for tile distribution
│   └── MathUtils.ts         # Interpolation, easing functions
│
├── assets/                  # Static resources
│   ├── sprites/             # Pokemon tile images
│   └── sounds/              # Audio files (future)
│
└── main.ts                  # Entry point, initialization
```

### Structure Rationale

- **core/:** Reusable engine pieces, game-agnostic
- **game/:** All tile-matching specific logic, isolated for easy modification
- **renderer/:** Drawing logic separated from game logic for testability
- **state/:** Each state is its own file following State pattern
- **systems/:** Cross-cutting concerns that don't fit single components

## Architectural Patterns

### Pattern 1: Game Loop

**What:** Central orchestration that runs every frame, calling update (logic) then render (visual).

**When to use:** Always for real-time games. The heartbeat of any browser game.

**Trade-offs:**
- Pro: Consistent frame-based updates, smooth animation
- Con: Must handle variable frame rates (delta time)

**Example:**
```typescript
class GameLoop {
  private lastTime = 0;
  private running = false;

  start() {
    this.running = true;
    this.lastTime = performance.now();
    requestAnimationFrame((time) => this.loop(time));
  }

  private loop(currentTime: number) {
    if (!this.running) return;

    const deltaTime = (currentTime - this.lastTime) / 1000;
    this.lastTime = currentTime;

    this.update(deltaTime);  // Logic first
    this.render();           // Then draw

    requestAnimationFrame((t) => this.loop(t));
  }

  private update(dt: number) {
    this.stateMachine.update(dt);
    this.animationManager.update(dt);
  }

  private render() {
    this.renderer.clear();
    this.renderer.drawGrid(this.grid);
    this.animationManager.render(this.renderer);
  }
}
```

### Pattern 2: Component

**What:** Break game entities into composable behaviors instead of deep inheritance.

**When to use:** When entities have orthogonal behaviors (visual, clickable, animated).

**Trade-offs:**
- Pro: Flexible, composable, easy to add/remove features
- Con: More indirection, can be overkill for simple games

**Example:**
```typescript
// Tile as composition of behaviors
interface TileComponent {
  update(dt: number): void;
}

class Tile {
  private components: TileComponent[] = [];

  addComponent(component: TileComponent) {
    this.components.push(component);
  }

  update(dt: number) {
    for (const comp of this.components) {
      comp.update(dt);
    }
  }
}

// Specific behaviors
class VisualComponent implements TileComponent {
  constructor(private sprite: Sprite) {}

  update(dt: number) {
    // Update visual state
  }

  render(ctx: CanvasRenderingContext2D) {
    this.sprite.draw(ctx);
  }
}

class SelectableComponent implements TileComponent {
  isSelected = false;

  update(dt: number) {
    // Handle selection highlight
  }
}
```

### Pattern 3: State Machine

**What:** Define discrete game states with explicit transitions. Each state handles its own input and logic.

**When to use:** When game has distinct modes (idle, selected, animating, game over).

**Trade-offs:**
- Pro: Clear state boundaries, easy to reason about, prevents invalid states
- Con: More boilerplate than simple boolean flags

**Example:**
```typescript
interface GameState {
  enter(): void;
  exit(): void;
  handleInput(x: number, y: number): void;
  update(dt: number): void;
}

class StateMachine {
  private current: GameState;

  transition(to: GameState) {
    if (this.current) this.current.exit();
    this.current = to;
    this.current.enter();
  }

  handleInput(x: number, y: number) {
    this.current.handleInput(x, y);
  }

  update(dt: number) {
    this.current.update(dt);
  }
}

// Concrete states
class IdleState implements GameState {
  constructor(private game: Game) {}

  handleInput(x: number, y: number) {
    const tile = this.game.grid.getTileAt(x, y);
    if (tile && !tile.cleared) {
      this.game.selectTile(tile);
      this.game.stateMachine.transition(new SelectedState(this.game, tile));
    }
  }
}

class SelectedState implements GameState {
  constructor(private game: Game, private firstTile: Tile) {}

  handleInput(x: number, y: number) {
    const tile = this.game.grid.getTileAt(x, y);
    if (tile === this.firstTile) {
      // Deselect
      this.game.deselectTile(tile);
      this.game.stateMachine.transition(new IdleState(this.game));
    } else if (tile && !tile.cleared && tile.type === this.firstTile.type) {
      // Attempt match
      this.game.stateMachine.transition(new MatchingState(this.game, this.firstTile, tile));
    }
  }
}
```

### Pattern 4: Observer/Event Emitter

**What:** Components communicate through events rather than direct references.

**When to use:** When multiple systems need to react to the same event (tile matched, game over).

**Trade-offs:**
- Pro: Loose coupling, easy to add new listeners
- Con: Harder to trace event flow, potential for memory leaks

**Example:**
```typescript
class EventEmitter {
  private listeners: Map<string, Function[]> = new Map();

  on(event: string, callback: Function) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(callback);
  }

  emit(event: string, data?: any) {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      callbacks.forEach(cb => cb(data));
    }
  }
}

// Usage
game.events.on('tileMatched', (tiles: Tile[]) => {
  scoreSystem.addPoints(tiles);
  soundSystem.play('match');
});

game.events.on('noMovesRemaining', () => {
  stateMachine.transition(new GameOverState());
});
```

## Data Flow

### Input Flow

```
[Click/Touch Event]
    ↓
[InputHandler] → Converts screen coords to grid coords
    ↓
[StateMachine.handleInput(x, y)]
    ↓
[Current State] → Determines action based on game state
    ↓
[Grid.getTileAt(x, y)] → Retrieves tile at position
    ↓
[PathFinder.findPath(tileA, tileB)] → Validates connection
    ↓
[MatchEngine.executeMatch()] → Clears tiles, emits event
    ↓
[ScoreSystem] ← Events: 'tileMatched'
    ↓
[Renderer] ← Updated grid state
```

### State Flow

```
┌─────────┐    click tile    ┌──────────┐    click matching    ┌───────────┐
│  Idle   │ ──────────────→  │ Selected │ ─────────────────→  │ Matching  │
│  State  │                  │  State   │                     │  State    │
└─────────┘                  └──────────┘                     └───────────┘
     ↑                              │                               │
     │                              │ click same tile               │
     │                              │ (deselect)                    │ match
     └──────────────────────────────┘                               │ valid
                                                                     ↓
                                                               ┌───────────┐
                                                               │Animating  │
                                                               │  State    │
                                                               └───────────┘
                                                                     │
                                          ┌──────────────────────────┼──────────────────────────┐
                                          │ animation complete       │ animation complete       │
                                          ↓                          ↓                          ↓
                                    ┌─────────┐               ┌───────────┐              ┌──────────┐
                                    │  Idle   │               │ GameOver  │              │  Win     │
                                    │  State  │               │  State    │              │  State   │
                                    └─────────┘               └───────────┘              └──────────┘
                                         ↑                          │                          │
                                         │                          │ restart                  │ restart
                                         └──────────────────────────┴──────────────────────────┘
```

### Key Data Flows

1. **Tile Selection Flow:** Input → Grid coordinate → Tile lookup → State transition → Visual feedback (highlight)

2. **Match Validation Flow:** Two tiles selected → PathFinder finds valid path → MatchEngine clears tiles → Events emitted → Score updated, animation triggered

3. **Game Over Detection Flow:** Every match → MoveDetector checks remaining pairs → No valid moves → Event emitted → State transition to GameOver

4. **Render Flow:** Game loop tick → State update → Grid state read → Renderer draws tiles → Animation layer draws effects → UI layer draws score

## Scaling Considerations

| Scale | Architecture Adjustments |
|-------|--------------------------|
| Single session (v1) | All state in memory, Canvas 2D, simple requestAnimationFrame loop |
| Local persistence | Add localStorage for high scores, game state serialization |
| Mobile performance | Use requestIdleCallback for non-critical updates, sprite atlas for tiles |
| Complex animations | Introduce animation queue, easing library, consider WebGL for effects |

### Scaling Priorities

1. **First bottleneck:** Canvas redraw performance on large grids. Fix with dirty rectangle rendering (only redraw changed tiles).

2. **Second bottleneck:** Memory with many tile assets. Fix with sprite atlas and lazy loading.

## Anti-Patterns

### Anti-Pattern 1: God Object Game Class

**What people do:** Put all game logic in one massive `Game` class.

**Why it's wrong:** Unmaintainable, hard to test, impossible to reason about state.

**Do this instead:** Separate concerns into Grid, PathFinder, Renderer, StateMachine. Game class just wires them together.

### Anti-Pattern 2: Direct DOM Manipulation for Game State

**What people do:** Store tile state in DOM elements (data attributes, classes).

**Why it's wrong:** DOM is for presentation, not state. Slow to query, easy to get out of sync.

**Do this instead:** Keep game state in plain objects/arrays. Render to DOM/Canvas as output only.

### Anti-Pattern 3: Blocking Animations

**What people do:** Use setTimeout/setInterval for animations and wait for completion before accepting input.

**Why it's wrong:** Janky, blocks user, timing issues on different frame rates.

**Do this instead:** Use requestAnimationFrame with delta time, animation state machine that allows input during animations.

### Anti-Pattern 4: Tight Coupling Between Logic and Rendering

**What people do:** PathFinder draws the connection line directly.

**Why it's wrong:** Can't test logic without rendering, can't change rendering without touching logic.

**Do this instead:** PathFinder returns path data. Renderer takes path data and draws it. Complete separation.

## Build Order Implications

Based on dependencies between components, recommended build order:

### Phase 1: Core Foundation
1. **GameConfig/Constants** - No dependencies, everything needs this
2. **EventEmitter** - No dependencies, enables loose coupling
3. **GameLoop** - Minimal, just frame management
4. **Tile model** - Simple data structure

**Why first:** These have no dependencies and everything else builds on them.

### Phase 2: Grid and State
5. **Grid Manager** - Depends on Tile, Config
6. **StateMachine base** - No game dependencies
7. **IdleState** - Simplest state, entry point
8. **InputHandler** - Needs Grid for coordinate conversion

**Why second:** Establishes the game board and basic interaction.

### Phase 3: Core Mechanics
9. **PathFinder** - Depends on Grid, standalone algorithm
10. **SelectedState** - Depends on IdleState transition
11. **MatchingState** - Depends on PathFinder
12. **Renderer (basic)** - Needs Grid, Tile

**Why third:** Implements the core matching mechanic. Playable at this point.

### Phase 4: Polish
13. **AnimatingState** - Depends on MatchingState
14. **AnimationManager** - Depends on Renderer
15. **ScoreSystem** - Listens to events
16. **MoveDetector** - Depends on Grid, PathFinder
17. **GameOverState** - Depends on MoveDetector

**Why last:** Enhances the core loop but not required for basic functionality.

### Dependency Graph

```
Config ─────────────────────────────────────────┐
  │                                             │
  ▼                                             │
Tile ◄─────────────────────────────────────┐    │
  │                                        │    │
  ▼                                        │    │
Grid ◄──────────────────────────────────┐  │    │
  │                                     │  │    │
  ├─────────────────────────────────────┼──┼────┤
  ▼                                     │  │    │
PathFinder                              │  │    │
  │                                     │  │    │
  ▼                                     │  │    │
MatchEngine ────────────────────────►   │  │    │
                                        │  │    │
EventEmitter ◄──────────────────────────┼──┼────┘
  │                                     │  │
  ▼                                     │  │
StateMachine ◄──────────────────────────┼──┤
  │                                     │  │
  ├─────────────────────────────────────┤  │
  ▼                                     │  │
[States: Idle → Selected → Matching]    │  │
                                        │  │
InputHandler ───────────────────────────┘  │
  │                                        │
  ▼                                        │
Renderer ◄─────────────────────────────────┘
```

## Integration Points

### External Services

| Service | Integration Pattern | Notes |
|---------|---------------------|-------|
| localStorage | Direct API for persistence | Save/load high scores, game state |
| Pokemon sprite assets | Static file loading | Load at startup, cache in memory |

### Internal Boundaries

| Boundary | Communication | Notes |
|----------|---------------|-------|
| Game Loop ↔ State Machine | Direct method calls | Synchronous, every frame |
| State Machine ↔ Grid | Direct reads | State queries grid, doesn't modify directly |
| MatchEngine → Events | EventEmitter | Decoupled, multiple listeners possible |
| InputHandler → State Machine | Method call | Passes grid coordinates |
| Renderer ← Grid | Pull model | Renderer reads grid state each frame |

## Sources

- MDN Game Development - Anatomy of a video game: https://developer.mozilla.org/en-US/docs/Games/Anatomy
- MDN Game Development - The game loop: https://developer.mozilla.org/en-US/docs/Games/Anatomy_of_a_game_loop
- Game Programming Patterns by Robert Nystrom - Game Loop pattern: https://gameprogrammingpatterns.com/game-loop.html
- Game Programming Patterns - Component pattern: https://gameprogrammingpatterns.com/component.html
- Game Programming Patterns - State pattern: https://gameprogrammingpatterns.com/state.html

---
*Architecture research for: tile-matching puzzle game (Pikachu Match)*
*Researched: 2026-03-10*
