# Phase 1: Core Foundation - Research

**Researched:** 2026-03-10
**Domain:** Vite + TypeScript + HTML5 Canvas game development, game loop architecture, event systems
**Confidence:** HIGH

## Summary

This phase establishes the foundational architecture for a tile-matching puzzle game using vanilla TypeScript with HTML5 Canvas rendering. The stack consists of Vite 6.x for build tooling, TypeScript 5.x for type safety, and native Canvas API for rendering - no game framework required for this scope.

The core deliverables are: project scaffolding, game loop with `requestAnimationFrame`, typed event emitter for game communication, basic Tile model, and centralized configuration. This foundation will support all subsequent phases for matching mechanics, pathfinding, and UI.

**Primary recommendation:** Use Vite's vanilla-ts template as the starting point, implement a fixed-timestep game loop with `requestAnimationFrame`, and extend Node's EventEmitter pattern for type-safe game events.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- Grid size: **16 columns x 10 rows** (160 tiles, 80 pairs)
- 16 unique tile types, each appearing 10 times
- **Emoji tiles** using 16 nature element emojis:
  - 🌟 ⭐ 💫 ✨ 🌙 ☀️ 🔥 💧 🌿 ⚡ 🧊 🪨 🌸 🍃 🌊 🍄
- **Card style** tiles: big emoji in center, rounded corners, subtle shadow
- **Highlight ring** to show tile selection
- All game constants in **src/config.ts** as typed TypeScript
- Configurable items:
  - Grid dimensions (rows, columns)
  - Tile size and gap/spacing
  - Emoji set (array of 16 emojis)
  - Color palette (background, selection, etc.)

### Claude's Discretion
- Exact project folder structure
- Event emitter implementation details
- Game loop implementation specifics
- Tile model exact properties

### Deferred Ideas (OUT OF SCOPE)
None - discussion stayed within phase scope.
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| CORE-01 | Game displays a grid of Pokemon tiles arranged in rows and columns | Canvas rendering patterns, Tile model, Grid layout algorithms, Configuration system |
</phase_requirements>

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Vite | 6.x+ | Build tool and dev server | Fast HMR, native ESM, TypeScript support out of box |
| TypeScript | 5.x+ | Type safety | Industry standard, excellent IDE support |
| Canvas API | Native | 2D rendering | No dependencies, full control, perfect for tile games |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| Vitest | 3.x | Unit testing | For all test files, integrates with Vite config |
| @types/node | 22.x | Node.js type definitions | Required for EventEmitter typing |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Native Canvas | Phaser.js | Phaser adds complexity and bundle size for simple tile rendering |
| Native Canvas | PixiJS | PixiJS is WebGL-first, overkill for 2D tile game |
| Custom EventEmitter | eventemitter3 | eventemitter3 is smaller but Node's EventEmitter has better TypeScript support |
| Vite | webpack | webpack is slower and more complex to configure |

**Installation:**
```bash
npm create vite@latest pikachu-match -- --template vanilla-ts
cd pikachu-match
npm install
npm install -D vitest @types/node
```

## Architecture Patterns

### Recommended Project Structure
```
src/
├── config.ts           # Game constants (grid, tiles, colors)
├── main.ts             # Entry point, initializes game
├── game/
│   ├── Game.ts         # Main game class, owns game loop
│   ├── GameLoop.ts     # requestAnimationFrame wrapper
│   └── EventEmitter.ts # Typed event emitter
├── models/
│   └── Tile.ts         # Tile data model
├── renderer/
│   └── CanvasRenderer.ts # Canvas drawing operations
└── types/
    └── index.ts        # Shared type definitions
```

### Pattern 1: Fixed-Timestep Game Loop
**What:** Game loop that updates at a fixed rate (e.g., 60Hz) independent of render rate
**When to use:** All games that need consistent physics/timing regardless of frame rate
**Example:**
```typescript
// Source: MDN Game Anatomy + industry best practices
// https://developer.mozilla.org/en-US/docs/Games/Anatomy

class GameLoop {
  private readonly tickLength: number = 1000 / 60; // 60 FPS
  private lastTick: number = performance.now();
  private stopMain: number = 0;

  start() {
    this.lastTick = performance.now();
    this.main(performance.now());
  }

  private main = (tFrame: number) => {
    this.stopMain = requestAnimationFrame(this.main);
    const nextTick = this.lastTick + this.tickLength;
    let numTicks = 0;

    if (tFrame > nextTick) {
      const timeSinceTick = tFrame - this.lastTick;
      numTicks = Math.floor(timeSinceTick / this.tickLength);
    }

    this.queueUpdates(numTicks);
    this.render(tFrame);
  }

  private queueUpdates(numTicks: number) {
    for (let i = 0; i < numTicks; i++) {
      this.lastTick += this.tickLength;
      this.update(this.lastTick);
    }
  }

  stop() {
    cancelAnimationFrame(this.stopMain);
  }
}
```

### Pattern 2: Typed Event Emitter
**What:** Event emitter with full TypeScript type inference for event names and payloads
**When to use:** Decoupling game components (input, rendering, game state)
**Example:**
```typescript
// Source: Node.js EventEmitter with TypeScript enhancements
// https://nodejs.org/api/events.html

import { EventEmitter } from 'events';

type EventMap = {
  'tile:selected': { tile: Tile; row: number; col: number };
  'tile:cleared': { tile: Tile };
  'game:score': { points: number };
  'game:over': { won: boolean };
};

export class TypedEventEmitter<T extends Record<string, unknown>> {
  private emitter = new EventEmitter();

  on<K extends keyof T>(event: K, listener: (data: T[K]) => void): this {
    this.emitter.on(event as string, listener);
    return this;
  }

  emit<K extends keyof T>(event: K, data: T[K]): boolean {
    return this.emitter.emit(event as string, data);
  }

  off<K extends keyof T>(event: K, listener: (data: T[K]) => void): this {
    this.emitter.off(event as string, listener);
    return this;
  }
}
```

### Pattern 3: Tile Model with Position
**What:** Immutable tile data with grid position and type information
**When to use:** Representing game state in a grid-based game
**Example:**
```typescript
// Tile model for grid-based matching game
export interface TilePosition {
  row: number;
  col: number;
}

export class Tile {
  constructor(
    public readonly id: string,
    public readonly type: number,        // 0-15 for emoji index
    public readonly position: TilePosition
  ) {}

  get emoji(): string {
    return EMOJI_SET[this.type];
  }

  isAdjacent(other: Tile): boolean {
    const rowDiff = Math.abs(this.position.row - other.position.row);
    const colDiff = Math.abs(this.position.col - other.position.col);
    return (rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && colDiff === 1);
  }
}
```

### Anti-Patterns to Avoid
- **Polluting global scope:** Don't attach game to `window` object - use proper module exports
- **Mixed timing strategies:** Don't mix `setTimeout` with `requestAnimationFrame` - pick one pattern
- **Mutable tile state:** Don't mutate tile objects directly - create new instances for state changes
- **Canvas context per frame:** Don't call `getContext('2d')` repeatedly - cache the context

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Event system | Custom pub/sub | Node EventEmitter | Battle-tested, typed, handles edge cases |
| Build system | Custom scripts | Vite | HMR, tree-shaking, TypeScript support |
| Test runner | Custom assertion library | Vitest | Jest-compatible API, Vite integration |
| Grid data structure | 2D array class | Nested arrays | Native, performant, easy to debug |

**Key insight:** The game is simple enough that custom abstractions add complexity without value. Use native features and established patterns.

## Common Pitfalls

### Pitfall 1: Canvas Resolution vs CSS Size
**What goes wrong:** Blurry canvas rendering because canvas pixel dimensions don't match display size
**Why it happens:** Canvas width/height attributes define internal resolution, CSS defines display size
**How to avoid:** Set canvas width/height to actual pixel dimensions, use CSS for responsive sizing
**Warning signs:** Text looks blurry, edges are fuzzy, lines aren't crisp

```typescript
// Correct approach
const canvas = document.getElementById('game') as HTMLCanvasElement;
const dpr = window.devicePixelRatio || 1;
canvas.width = displayWidth * dpr;
canvas.height = displayHeight * dpr;
canvas.style.width = `${displayWidth}px`;
canvas.style.height = `${displayHeight}px`;
ctx.scale(dpr, dpr);
```

### Pitfall 2: Game Loop Memory Leak
**What goes wrong:** Multiple game loops running simultaneously, consuming CPU and causing visual glitches
**Why it happens:** Forgetting to cancel previous `requestAnimationFrame` before starting new loop
**How to avoid:** Always store the rAF ID and call `cancelAnimationFrame` when stopping
**Warning signs:** Game speeds up over time, CPU usage increases, animations become erratic

### Pitfall 3: EventEmitter 'error' Event Unhandled
**What goes wrong:** Game crashes silently when an error event is emitted
**Why it happens:** Node's EventEmitter throws if 'error' is emitted with no listeners
**How to avoid:** Always register an 'error' listener on event emitters
**Warning signs:** Game exits unexpectedly, no error message in console

### Pitfall 4: TypeScript Strict Mode Issues
**What goes wrong:** Type errors when accessing DOM elements or canvas context
**Why it happens:** Strict null checks catch potential null references
**How to avoid:** Use non-null assertions only when certain, or add proper null checks
**Warning signs:** Red squiggly lines on `document.getElementById()`, `getContext()` calls

## Code Examples

Verified patterns from official sources:

### Vite + TypeScript Project Setup
```bash
# Source: https://vite.dev/guide/
npm create vite@latest pikachu-match -- --template vanilla-ts
cd pikachu-match
npm install
```

### Configuration File Pattern
```typescript
// src/config.ts
// All game constants in one place, easily tunable

export const CONFIG = {
  grid: {
    rows: 10,
    cols: 16,
    totalTiles: 160,
    pairsPerType: 10,
  },
  tile: {
    size: 48,
    gap: 4,
    cornerRadius: 8,
  },
  emojis: [
    '🌟', '⭐', '💫', '✨', '🌙', '☀️', '🔥', '💧',
    '🌿', '⚡', '🧊', '🪨', '🌸', '🍃', '🌊', '🍄'
  ],
  colors: {
    background: '#1a1a2e',
    tile: '#16213e',
    tileHover: '#0f3460',
    selection: '#e94560',
    text: '#eaeaea',
  },
} as const;
```

### Canvas Renderer Class
```typescript
// Source: MDN Canvas tutorials + game development best practices
export class CanvasRenderer {
  private ctx: CanvasRenderingContext2D;
  private canvas: HTMLCanvasElement;

  constructor(canvasId: string) {
    this.canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    this.ctx = this.canvas.getContext('2d')!;
    this.setupCanvas();
  }

  private setupCanvas() {
    const { cols, rows } = CONFIG.grid;
    const { size, gap } = CONFIG.tile;

    const dpr = window.devicePixelRatio || 1;
    const width = cols * (size + gap) + gap;
    const height = rows * (size + gap) + gap;

    this.canvas.width = width * dpr;
    this.canvas.height = height * dpr;
    this.canvas.style.width = `${width}px`;
    this.canvas.style.height = `${height}px`;
    this.ctx.scale(dpr, dpr);
  }

  clear() {
    this.ctx.fillStyle = CONFIG.colors.background;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  drawTile(tile: Tile, isSelected: boolean = false) {
    const { size, gap, cornerRadius } = CONFIG.tile;
    const x = tile.position.col * (size + gap) + gap;
    const y = tile.position.row * (size + gap) + gap;

    // Draw rounded rectangle
    this.ctx.fillStyle = isSelected ? CONFIG.colors.tileHover : CONFIG.colors.tile;
    this.roundRect(x, y, size, size, cornerRadius);

    // Draw emoji
    this.ctx.font = `${size * 0.6}px sans-serif`;
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    this.ctx.fillText(tile.emoji, x + size / 2, y + size / 2);

    // Draw selection ring
    if (isSelected) {
      this.ctx.strokeStyle = CONFIG.colors.selection;
      this.ctx.lineWidth = 3;
      this.roundRect(x, y, size, size, cornerRadius, false);
    }
  }

  private roundRect(
    x: number, y: number, w: number, h: number, r: number, fill: boolean = true
  ) {
    this.ctx.beginPath();
    this.ctx.moveTo(x + r, y);
    this.ctx.lineTo(x + w - r, y);
    this.ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    this.ctx.lineTo(x + w, y + h - r);
    this.ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    this.ctx.lineTo(x + r, y + h);
    this.ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    this.ctx.lineTo(x, y + r);
    this.ctx.quadraticCurveTo(x, y, x + r, y);
    this.ctx.closePath();
    if (fill) {
      this.ctx.fill();
    } else {
      this.ctx.stroke();
    }
  }
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Webpack for builds | Vite | ~2020 | 10-100x faster dev server startup |
| `setInterval` for game loops | `requestAnimationFrame` | ~2014 | Smooth 60fps, VSync-aware |
| JavaScript | TypeScript | ~2020+ | Type safety, better IDE support |
| Separate config files | Unified Vite config | ~2020 | Single source of truth for build |

**Deprecated/outdated:**
- `setInterval`/`setTimeout` for game loops: Use `requestAnimationFrame` instead
- Global namespace pollution: Use ES modules
- String-based event names without types: Use typed event maps

## Open Questions

1. **Responsive canvas sizing**
   - What we know: Canvas should handle different screen sizes
   - What's unclear: Whether to scale tiles or change grid layout on mobile
   - Recommendation: Phase 6 (UX) addresses this - Phase 1 uses fixed dimensions

2. **Tile animation system**
   - What we know: Phase 6 requires tile animations
   - What's unclear: Whether to prepare animation infrastructure in Phase 1
   - Recommendation: Keep Phase 1 minimal - add animation system in Phase 6

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Vitest 3.x |
| Config file | vitest.config.ts (or vite.config.ts with test property) |
| Quick run command | `npm run test` |
| Full suite command | `npm run test -- --run` |

### Phase Requirements -> Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| CORE-01 | Grid displays tiles in rows/cols | unit | `vitest run src/__tests__/Grid.test.ts` | Wave 0 |

### Sampling Rate
- **Per task commit:** `npm run test`
- **Per wave merge:** `npm run test -- --run`
- **Phase gate:** Full suite green before `/gsd:verify-work`

### Wave 0 Gaps
- [ ] `src/__tests__/config.test.ts` - verifies config constants are valid
- [ ] `src/__tests__/Tile.test.ts` - verifies tile model behavior
- [ ] `src/__tests__/GameLoop.test.ts` - verifies loop start/stop/tick
- [ ] `src/__tests__/EventEmitter.test.ts` - verifies typed emit/on
- [ ] `vitest.config.ts` - test framework configuration
- [ ] Framework install: `npm install -D vitest @types/node`

## Sources

### Primary (HIGH confidence)
- [Vite Official Docs](https://vite.dev/guide/) - Vite 6.x setup, TypeScript support, project scaffolding
- [MDN Game Anatomy](https://developer.mozilla.org/en-US/docs/Games/Anatomy) - Game loop patterns, requestAnimationFrame best practices
- [Node.js Events Documentation](https://nodejs.org/api/events.html) - EventEmitter API, TypeScript integration
- [Vitest Official Docs](https://vitest.dev/guide/) - Test framework setup, Vite integration

### Secondary (MEDIUM confidence)
- Context from existing project structure and conventions

### Tertiary (LOW confidence)
- None - all recommendations verified against official sources

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - All tools are current stable releases with active maintenance
- Architecture: HIGH - Patterns derived from MDN official game development guides
- Pitfalls: HIGH - Common issues well-documented in Canvas and game development resources

**Research date:** 2026-03-10
**Valid until:** 30 days (stable tooling, low risk of breaking changes)
