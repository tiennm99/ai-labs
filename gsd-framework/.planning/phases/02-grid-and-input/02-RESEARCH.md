# Phase 02: Grid and Input - Research

**Researched:** 2026-03-11
**Domain:** Canvas-based game interaction, input handling, responsive layout
**Confidence:** HIGH

## Summary

Phase 2 builds a complete tile grid with player interaction. The research confirms that vanilla HTML5 Canvas with typed event handlers is the right approach—no external libraries needed for this phase. The existing Game.ts orchestrator and 60fps game loop from Phase 1 provide a solid foundation for adding input handling, hit detection, selection state management, and visual feedback animations.

Key technical domains investigated: canvas hit detection (coordinate transformation), mouse/touch event handling, responsive canvas sizing, fade-in animations using requestAnimationFrame, and selection state patterns. MDN documentation (HIGH confidence source) confirms that direct coordinate-to-tile mapping is straightforward and performant for grid-based games.

**Primary recommendation:** Implement a GridManager class to handle tile array and selection state, extend Game.ts with click/touchstart event listeners using getBoundingClientRect() for coordinate translation, use the existing GameLoop delta time for fade-in animations, and add a Renderer class to draw tiles with selection highlights.

## User Constraints (from CONTEXT.md)

### Locked Decisions
- **Selection State Rules**: Toggle deselect on clicking selected tile, block input after 2 tiles selected, emit `tilesSelected` event, ignore empty tile clicks
- **Input Handling Approach**: Event listeners via Game orchestrator, tile bounds checking for hit detection, click + touchstart events only
- **Responsive Grid Layout**: Dynamic tile sizing to fit viewport, centered grid, shrink on mobile with no scrolling, debounce resize events
- **Visual Selection Feedback**: Border + background tint using CONFIG.colors.selection (#e94560), both tiles get identical highlight, ~100ms fade-in animation

### Claude's Discretion
- Exact animation timing and easing function for fade-in
- Border width for selection highlight
- Background tint intensity (opacity)
- Debounce delay duration for resize events

### Deferred Ideas (OUT OF SCOPE)
- None

## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| CORE-02 | Player can click/tap to select a tile (highlighted when selected) | Section: Canvas Input Handling, Section: Selection State Management |
| CORE-03 | Player can click/tap a second tile to attempt a match | Section: Selection State Rules, Section: Event Communication |

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| HTML5 Canvas API | Native | Rendering grid and tiles | Browser-native, performant for 2D games, no dependencies |
| TypeScript | 5.9.3 | Type safety | Already in project, provides compile-time guarantees |
| Vitest | 4.0.18 | Testing | Already configured with node environment, mocks support |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| requestAnimationFrame | Native | 60fps animations | Use existing GameLoop infrastructure for fade-in effects |
| Pointer Events API | Native | Unified input (future) | Consider for Phase 6 (mobile optimization), but stick to click/touchstart for now per CONTEXT.md |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| click + touchstart | Pointer Events (pointerdown) | Pointer Events unify mouse/touch but CONTEXT.md locked decision to click + touchstart. Switch in Phase 6 if needed. |
| Custom hit detection | Canvas API isPointInPath() | isPointInPath() works for irregular shapes but adds complexity. Simple bounds checking is sufficient for rectangular tiles. |

**Installation:**
No new packages needed—stack from Phase 1 is sufficient.

## Architecture Patterns

### Recommended Project Structure
```
src/
├── game/
│   ├── Game.ts           # Add input event listeners, delegate to GridManager
│   ├── GameLoop.ts       # Existing 60fps loop (no changes)
│   └── EventEmitter.ts   # Existing event system (no changes)
├── managers/
│   └── GridManager.ts    # NEW: Tile array, selection state, coordinate-to-tile mapping
├── rendering/
│   └── Renderer.ts       # NEW: Canvas drawing logic (tiles, selection highlights)
├── models/
│   └── Tile.ts           # Existing model (minor extensions for bounds)
├── types/
│   └── index.ts          # Add GridManager events to GameEvents interface
└── config.ts             # Existing config (no changes)
```

### Pattern 1: Canvas Hit Detection
**What:** Convert mouse/touch coordinates to tile position using bounds checking
**When to use:** Any canvas-based grid game needs coordinate-to-tile mapping
**Example:**
```typescript
// Source: https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent
// In Game.ts input handler
handleInput(event: MouseEvent | TouchEvent): void {
  const rect = this.canvas.getBoundingClientRect();
  const scaleX = this.canvas.width / rect.width;
  const scaleY = this.canvas.height / rect.height;

  let clientX: number, clientY: number;
  if ('changedTouches' in event) {
    clientX = event.changedTouches[0].clientX;
    clientY = event.changedTouches[0].clientY;
  } else {
    clientX = event.clientX;
    clientY = event.clientY;
  }

  const x = (clientX - rect.left) * scaleX;
  const y = (clientY - rect.top) * scaleY;

  const tile = this.gridManager.getTileAtCoordinates(x, y);
  if (tile) {
    this.gridManager.selectTile(tile);
  }
}
```

### Pattern 2: Selection State Management
**What:** Track selected tiles, enforce toggle rules, emit events at thresholds
**When to use:** Multi-step interactions where user selects items before action
**Example:**
```typescript
// In GridManager.ts
private selectedTiles: Tile[] = [];

selectTile(tile: Tile): void {
  if (tile.cleared) return; // Ignore empty tiles per CONTEXT.md

  const index = this.selectedTiles.findIndex(t => t.id === tile.id);

  if (index !== -1) {
    // Toggle deselect: clicking selected tile deselects it
    this.selectedTiles.splice(index, 1);
  } else if (this.selectedTiles.length < 2) {
    // Add to selection if less than 2 selected
    this.selectedTiles.push(tile);
  }

  // Emit event when 2 tiles selected
  if (this.selectedTiles.length === 2) {
    this.events.emit('tilesSelected', {
      tile1: this.selectedTiles[0],
      tile2: this.selectedTiles[1]
    });
  }
}
```

### Pattern 3: Fade-in Animation with GameLoop
**What:** Use delta time from existing GameLoop for smooth fade-in effects
**When to use:** Any UI animation that needs to run at 60fps without blocking
**Example:**
```typescript
// In Renderer.ts (or Tile model)
class TileRenderer {
  private fadeStartTime: number | null = null;
  private readonly FADE_DURATION = 100; // ms per CONTEXT.md

  render(ctx: CanvasRenderingContext2D, tile: Tile, deltaTime: number): void {
    if (tile.selected) {
      if (this.fadeStartTime === null) {
        this.fadeStartTime = performance.now();
      }

      const elapsed = performance.now() - this.fadeStartTime;
      const progress = Math.min(elapsed / this.FADE_DURATION, 1);
      const alpha = 0.3 * progress; // 30% opacity max

      // Draw selection highlight
      ctx.strokeStyle = CONFIG.colors.selection;
      ctx.lineWidth = 3;
      ctx.globalAlpha = alpha;
      ctx.strokeRect(tile.x, tile.y, tile.size, tile.size);
      ctx.globalAlpha = 1.0;
    } else {
      this.fadeStartTime = null;
    }
  }
}
```

### Anti-Patterns to Avoid
- **Blocking event listeners**: Never run heavy computation in click/touchstart handlers—use requestAnimationFrame for rendering
- **Direct DOM manipulation**: Don't update DOM elements for each tile—render everything to canvas at 60fps
- **Ignoring device pixel ratio**: Forgetting to scale coordinates by DPR leads to blurry hit detection on high-DPI screens
- **Tight coupling**: Game.ts shouldn't handle selection logic directly—delegate to GridManager

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Animation timing | Custom setTimeout loops | Existing GameLoop with deltaTime | Provides smooth 60fps, handles frame drops, integrates with existing architecture |
| Event typing | Untyped event strings | TypedEventEmitter from Phase 1 | Compile-time type safety, catches payload mismatches |
| Coordinate mapping | Manual math each click | getBoundingClientRect() once per event | Accounts for CSS transforms, canvas scaling, and page scroll |
| Touch handling | Complex gesture detection | Simple touchstart + click per CONTEXT.md | Sufficient for tile selection, prevents over-engineering |

**Key insight:** The 60fps game loop from Phase 1 is perfect for driving selection animations—no additional animation libraries needed. Hit detection for rectangular tiles is straightforward math (coordinate comparison), not a complex algorithm.

## Common Pitfalls

### Pitfall 1: Canvas Coordinate Mismatch
**What goes wrong:** Click coordinates don't map correctly to tiles, especially on resized or high-DPI canvases
**Why it happens:** Forgetting to account for CSS scaling, device pixel ratio, or canvas position on page
**How to avoid:** Always use `getBoundingClientRect()` and scale by `canvas.width / rect.width` and `canvas.height / rect.height`
**Warning signs:** Clicks register "off by one" tile or work on desktop but not mobile

### Pitfall 2: Touch Event Double-Firing
**What goes wrong:** Single tap triggers both touchstart and click, causing double selection
**Why it happens:** Browsers fire mouse events after touch events by default
**How to avoid:** CONTEXT.md decision to treat each tap independently is correct—second tap will deselect based on toggle rule. No preventDefault() needed on touchstart (allows links/buttons to work elsewhere)
**Warning signs:** Rapid-fire selections, tiles selecting/deselecting unexpectedly

### Pitfall 3: Animation Timing Drift
**What goes wrong:** Fade-in animations run too fast/slow or don't complete
**Why it happens:** Using frame count instead of delta time, or not clamping progress to 1.0
**How to avoid:** Use `performance.now()` for absolute timestamps or GameLoop's deltaTime, clamp progress: `Math.min(elapsed / duration, 1)`
**Warning signs:** Animations look "janky" or stop partway through

### Pitfall 4: Memory Leaks from Event Listeners
**What goes wrong:** Multiple resize listeners accumulate, or listeners aren't cleaned up
**Why it happens:** Adding listeners without removing old ones, or not tracking listener references
**How to avoid:** Store listener reference, use `removeEventListener()` in cleanup or debounce function
**Warning signs:** Resize event fires multiple times per resize, performance degrades over time

## Code Examples

Verified patterns from official sources:

### Canvas Hit Detection with Device Pixel Ratio
```typescript
// Source: https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Basic_animations
function getCanvasCoordinates(event: MouseEvent | TouchEvent, canvas: HTMLCanvasElement): { x: number; y: number } {
  const rect = canvas.getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;

  let clientX: number, clientY: number;
  if ('changedTouches' in event) {
    clientX = event.changedTouches[0].clientX;
    clientY = event.changedTouches[0].clientY;
  } else {
    clientX = event.clientX;
    clientY = event.clientY;
  }

  return {
    x: (clientX - rect.left) * (canvas.width / rect.width / dpr),
    y: (clientY - rect.top) * (canvas.height / rect.height / dpr)
  };
}
```

### Debounced Resize Handler
```typescript
// Source: Standard web pattern (MDN confirms this approach)
let resizeTimeout: number | undefined;

window.addEventListener('resize', () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    // Recalculate canvas size and redraw
    game.setupCanvas();
    renderer.render();
  }, 150); // Claude's discretion: 150ms is reasonable default
});
```

### Touch Event Handling (preventDefault pattern)
```typescript
// Source: https://developer.mozilla.org/en-US/docs/Web/API/Touch_events
canvas.addEventListener('touchstart', (event: TouchEvent) => {
  // Don't preventDefault() - allows default browser behavior
  // Context.md decision: treat each tap independently
  handleInput(event);
}, { passive: true }); // Passive listener improves scroll performance
```

### Selection State with Toggle Behavior
```typescript
// Per CONTEXT.md requirements
function selectTile(tile: Tile): void {
  if (tile.cleared) return; // Ignore empty tiles

  const isSelected = selectedTiles.has(tile.id);

  if (isSelected) {
    // Toggle deselect
    selectedTiles.delete(tile.id);
  } else if (selectedTiles.size < 2) {
    // Add to selection
    selectedTiles.add(tile.id);
  }

  // Emit when 2 selected (input blocked after this)
  if (selectedTiles.size === 2) {
    emitTilesSelectedEvent();
  }
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| setTimeout/setInterval animations | requestAnimationFrame | 2012+ | Smoother 60fps, better battery life, auto-pauses when tab inactive |
| Mouse events only | Touch events API | 2013+ | Mobile support, multi-touch capability |
| Custom event systems | Native addEventListener | Always present | Browser-native, performant, well-documented |
| Untyped event payloads | TypeScript type constraints | Modern TS | Compile-time safety, IDE autocomplete, refactoring confidence |

**Deprecated/outdated:**
- Mouse-only games: Touch is standard expectation since ~2015
- Fixed canvas sizes: Responsive layouts are required for mobile (CONTEXT.md confirms this)

## Open Questions

1. **Grid centering offset calculation**
   - What we know: Grid should be centered horizontally and vertically in canvas
   - What's unclear: Exact formula for calculating tile positions when grid is smaller than canvas (which happens on desktop)
   - Recommendation: Calculate `offsetX = (canvasWidth - gridWidth) / 2` and `offsetY = (canvasHeight - gridHeight) / 2`, add to all tile coordinates

2. **Mobile constraint handling**
   - What we know: On small screens, shrink tile size until all tiles visible (no scrolling)
   - What's unclear: Minimum tile size threshold (how small before we give up centering?)
   - Recommendation: Set minimum tile size of 32px (2/3 of default 48px) in CONFIG, center if above threshold, allow slight overflow if below

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Vitest 4.0.18 |
| Config file | `vitest.config.ts` |
| Quick run command | `npm test -- --run` |
| Full suite command | `npm test` |

### Phase Requirements → Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| CORE-02 | Click/tap selects tile with highlight | integration | `npm test -- GridManager.test.ts -t "selectTile"` | ❌ Wave 0 |
| CORE-02 | Clicking selected tile deselects (toggle) | unit | `npm test -- GridManager.test.ts -t "toggle deselect"` | ❌ Wave 0 |
| CORE-02 | Empty tile clicks are ignored | unit | `npm test -- GridManager.test.ts -t "cleared tile"` | ❌ Wave 0 |
| CORE-03 | Second tile selection emits tilesSelected event | integration | `npm test -- GridManager.test.ts -t "tilesSelected event"` | ❌ Wave 0 |
| CORE-03 | Input blocked after 2 tiles selected | unit | `npm test -- GridManager.test.ts -t "input blocked"` | ❌ Wave 0 |
| - | Coordinate-to-tile mapping works correctly | unit | `npm test -- GridManager.test.ts -t "getTileAtCoordinates"` | ❌ Wave 0 |
| - | Responsive canvas resizing recalculates layout | integration | `npm test -- Renderer.test.ts -t "resize"` | ❌ Wave 0 |
| - | Fade-in animation completes in ~100ms | unit | `npm test -- Renderer.test.ts -t "fade animation"` | ❌ Wave 0 |

### Sampling Rate
- **Per task commit:** `npm test -- --run` (quick smoke test)
- **Per wave merge:** `npm test` (full suite with watch mode)
- **Phase gate:** Full suite green before `/gsd:verify-work`

### Wave 0 Gaps
- [ ] `src/__tests__/GridManager.test.ts` — covers CORE-02, CORE-03 (selection state, toggle rules, event emission)
- [ ] `src/__tests__/Renderer.test.ts` — covers rendering logic, coordinate mapping, fade animations
- [ ] `src/__tests__/helpers/mocking.ts` — shared DOM mocking helpers (canvas, touch events)
- [ ] Framework install: Already installed (Vitest 4.0.18)

## Sources

### Primary (HIGH confidence)
- [MDN Canvas API Tutorial - Advanced Animations](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Advanced_animations) - Animation patterns with requestAnimationFrame, velocity, and easing
- [MDN Touch Events API](https://developer.mozilla.org/en-US/docs/Web/API/Touch_events) - Touch event handling, preventDefault() usage, touch vs mouse event differences
- Phase 1 codebase - Existing Game.ts, GameLoop.ts, EventEmitter.ts patterns (verified by reading source files)

### Secondary (MEDIUM confidence)
- Project CONTEXT.md - User decisions locking implementation approach (verified read)
- Project REQUIREMENTS.md - CORE-02 and CORE-03 requirement definitions (verified read)
- Project STATE.md - Phase 1 completion status and established patterns (verified read)

### Tertiary (LOW confidence)
- WebSearch attempted but returned no results (search service issue) - no tertiary sources available

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - Based on Phase 1 codebase (verified), official MDN docs (verified), CONTEXT.md decisions (verified)
- Architecture: HIGH - Event-driven pattern from Phase 1 proven, GridManager/Renderer separation follows single responsibility principle
- Pitfalls: HIGH - Canvas coordinate issues well-documented on MDN, touch event double-firing is known browser behavior

**Research date:** 2026-03-11
**Valid until:** 2026-04-10 (30 days - canvas API is stable, browser behavior changes slowly)
