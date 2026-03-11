# Phase 6: Polish and UX - Research

**Researched:** 2026-03-11
**Domain:** Canvas animations, responsive design, mobile touch optimization
**Confidence:** HIGH (based on established patterns in codebase and well-documented web standards)

## Summary

Phase 6 focuses on polish animations and responsive UX enhancements to make the game feel smooth and satisfying across all devices. The research covers four main areas: tile match animations (scale+fade), responsive canvas scaling, mobile touch optimization (ripple effect + zoom prevention), and enhanced path visualization (glow effect).

The existing codebase provides strong foundations: `ShakeAnimation` class demonstrates time-based animation patterns with decay, `renderSelection()` shows fade-in animation using `performance.now()`, and the path drawing system is already in place. The key is extending these patterns rather than introducing new architectures.

**Primary recommendation:** Extend existing animation classes and patterns in Renderer.ts rather than introducing new animation libraries. Use CSS `touch-action: none` for mobile zoom prevention (simplest, most reliable). Implement glow effect using canvas `shadowBlur` API. Scale canvas using CSS transforms for responsive layout.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

**Tile Match Animations:**
- Effect: Scale + Fade - tiles grow slightly then shrink to nothing while fading (satisfying "pop" feel)
- Duration: 200-300ms (matches existing animation timing patterns)
- Timing: Animate during path display - concurrent with green line, not sequential
- Multi-match handling: Single match only - no chaining or cascade animations

**Responsive Layout:**
- Scaling approach: Scale entire canvas to fit viewport while maintaining aspect ratio
- Scaling direction: Scale down only on small screens - never scale up on large screens (stay at native 832x528)
- Orientation support: Works in both portrait and landscape - no orientation lock
- UI overlays: Keep current HTML overlay pattern (score, game-over, shuffle) - positioned relative to viewport

**Mobile Touch Polish:**
- Touch feedback: Visual ripple effect at touch point when tile is selected (reinforces interaction, matches colorful aesthetic)
- Browser behavior: Prevent zoom (double-tap, pinch) and scroll on canvas - prevents accidental interaction during play
- Touch accuracy: Keep current implementation - coordinate mapping with DPR handling works well

**Path Visualization:**
- Visual style: Add glow effect behind the green line - soft bloom/halo for more visibility
- Display duration: Keep current 300ms - matches existing animation patterns, snappy
- Color: Keep current green (#00ff00) - visible, matches success feel

### Claude's Discretion

- Exact easing curve for scale+fade animation
- Glow intensity and blur radius for path
- Ripple effect size and duration
- CSS vs canvas for ripple effect

### Deferred Ideas (OUT OF SCOPE)

None - discussion stayed within phase scope.
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| UX-01 | Matched tiles animate before disappearing | MatchAnimation class extending ShakeAnimation pattern; scale+fade with easing |
| UX-02 | Game responds to touch input on mobile devices | CSS `touch-action: none` + touch event handlers; ripple effect for visual feedback |
| UX-03 | Grid layout is responsive (works on phone and desktop) | CSS transform scaling with aspect ratio preservation; scale-down-only logic |
</phase_requirements>

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Canvas 2D API | Native | Rendering | Already in use, no dependencies needed |
| CSS transforms | Native | Responsive scaling | Browser-native, performant, no layout recalculation |
| `performance.now()` | Native | Animation timing | Already used in ShakeAnimation, consistent with codebase |

### Supporting
| Property/Method | Purpose | When to Use |
|----------------|---------|-------------|
| `ctx.shadowBlur` / `ctx.shadowColor` | Glow effects | Path visualization enhancement |
| `touch-action: none` | Prevent touch gestures | Mobile canvas element |
| `canvas.style.transform` | Responsive scaling | Viewport fitting |
| `globalCompositeOperation` | Additive blending | Optional: stronger glow effect |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| CSS transform scaling | CSS width/height | Transform preserves internal coordinates, better for DPR handling |
| Canvas ripple effect | CSS pseudo-element | Canvas more flexible for positioning, matches game aesthetic |
| Custom easing | CSS easing functions | Canvas requires JS easing; ease-out-back recommended for "pop" |

## Architecture Patterns

### Recommended Project Structure
```
src/
├── rendering/
│   └── Renderer.ts          # Add MatchAnimation class, glow effect, ripple rendering
├── game/
│   └── Game.ts              # Add responsive scaling logic, touch prevention
├── config.ts                # Add animation constants (MATCH_ANIMATION_DURATION, etc.)
└── index.html               # Add touch-action CSS, viewport meta tweaks
```

### Pattern 1: Time-Based Animation with Decay
**What:** Animation using `performance.now()` with elapsed time calculation and decay factor
**When to use:** All canvas animations (shake, fade, scale, ripple)
**Example:**
```typescript
// Existing pattern from ShakeAnimation class (Renderer.ts:15-74)
class MatchAnimation {
  private startTime: number;
  private readonly duration: number;

  constructor(duration: number = 250) {
    this.startTime = 0;
    this.duration = duration;
  }

  start(): void {
    this.startTime = performance.now();
  }

  getScaleAndAlpha(): { scale: number; alpha: number } {
    const elapsed = performance.now() - this.startTime;
    if (elapsed > this.duration) {
      return { scale: 0, alpha: 0 }; // Animation complete
    }

    const progress = elapsed / this.duration;
    // Scale: 1.0 -> 1.2 -> 0 (pop effect with overshoot)
    // Alpha: 1.0 -> 0 (fade out)
    const scale = progress < 0.5
      ? 1 + 0.2 * this.easeOutBack(progress * 2)  // Grow phase
      : 1.2 * (1 - (progress - 0.5) * 2);          // Shrink phase
    const alpha = 1 - this.easeInQuad(progress);

    return { scale, alpha };
  }

  private easeOutBack(t: number): number {
    const c1 = 1.70158;
    const c3 = c1 + 1;
    return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
  }

  private easeInQuad(t: number): number {
    return t * t;
  }
}
```

### Pattern 2: Canvas Glow Effect
**What:** Use `shadowBlur` and `shadowColor` for glow behind lines
**When to use:** Path visualization enhancement
**Example:**
```typescript
// Extend drawPathLine() in Renderer.ts (line 357-394)
private drawPathLine(path: TilePosition[]): void {
  if (path.length < 2) return;

  // ... coordinate calculations ...

  // Glow effect (draw first, then line on top)
  this.ctx.save();
  this.ctx.shadowColor = '#00ff00';
  this.ctx.shadowBlur = 15;  // Glow intensity
  this.ctx.strokeStyle = '#00ff00';
  this.ctx.lineWidth = 3;
  this.ctx.lineCap = 'round';
  this.ctx.lineJoin = 'round';

  this.ctx.beginPath();
  // ... path drawing ...
  this.ctx.stroke();
  this.ctx.restore();

  // Optional: Draw solid line on top for crispness
  this.ctx.strokeStyle = '#00ff00';
  this.ctx.lineWidth = 2;
  this.ctx.beginPath();
  // ... path drawing again ...
  this.ctx.stroke();
}
```

### Pattern 3: Responsive Canvas Scaling
**What:** Scale canvas to fit viewport while maintaining aspect ratio, scale-down only
**When to use:** Mobile and responsive layouts
**Example:**
```typescript
// Extend setupCanvas() in Game.ts (line 153-172)
private setupCanvas(): void {
  const { cols, rows } = CONFIG.grid;
  const { size, gap } = CONFIG.tile;
  const dpr = window.devicePixelRatio || 1;

  // Native canvas size
  const nativeWidth = cols * (size + gap) + gap;  // 832px
  const nativeHeight = rows * (size + gap) + gap; // 528px
  const aspectRatio = nativeWidth / nativeHeight;

  // Get viewport dimensions
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  // Calculate scaled size (scale down only)
  let displayWidth = nativeWidth;
  let displayHeight = nativeHeight;

  if (viewportWidth < nativeWidth || viewportHeight < nativeHeight) {
    // Scale to fit viewport
    const scaleByWidth = viewportWidth / nativeWidth;
    const scaleByHeight = viewportHeight / nativeHeight;
    const scale = Math.min(scaleByWidth, scaleByHeight, 1); // Never scale up

    displayWidth = nativeWidth * scale;
    displayHeight = nativeHeight * scale;
  }

  // Set canvas internal size (with DPR)
  this.canvas.width = nativeWidth * dpr;
  this.canvas.height = nativeHeight * dpr;

  // Set display size via CSS transform (preserves coordinate system)
  this.canvas.style.width = `${nativeWidth}px`;
  this.canvas.style.height = `${nativeHeight}px`;
  this.canvas.style.transform = `scale(${displayWidth / nativeWidth})`;
  this.canvas.style.transformOrigin = 'center center';

  // Scale context for DPR
  this.ctx.scale(dpr, dpr);
}
```

### Pattern 4: Mobile Touch Prevention
**What:** Prevent zoom and scroll on canvas using CSS and event handlers
**When to use:** Mobile devices to prevent accidental gestures
**Example:**
```typescript
// Add to Game.ts setupInputListeners()
public setupInputListeners(): void {
  // CSS approach (most reliable)
  this.canvas.style.touchAction = 'none';

  // Event-based backup for older browsers
  ['touchstart', 'touchmove', 'touchend'].forEach(event => {
    this.canvas.addEventListener(event, (e) => {
      // Allow input handling but prevent zoom/scroll
      if (e.touches && e.touches.length > 1) {
        e.preventDefault(); // Multi-touch (pinch zoom)
      }
    }, { passive: false });
  });

  // Existing handlers...
  this.canvas.addEventListener('click', this.handleClick);
  this.canvas.addEventListener('touchstart', this.handleTouch, { passive: true });
}
```

### Pattern 5: Touch Ripple Effect
**What:** Visual feedback at touch point with expanding circle animation
**When to use:** Touch input on mobile devices
**Example:**
```typescript
// Add to Renderer.ts
class RippleAnimation {
  private startTime: number;
  private readonly x: number;
  private readonly y: number;
  private readonly duration: number = 300;
  private readonly maxRadius: number = 40;

  constructor(x: number, y: number) {
    this.startTime = performance.now();
    this.x = x;
    this.y = y;
  }

  render(ctx: CanvasRenderingContext2D): boolean {
    const elapsed = performance.now() - this.startTime;
    if (elapsed > this.duration) return false; // Complete

    const progress = elapsed / this.duration;
    const radius = this.maxRadius * progress;
    const alpha = 0.3 * (1 - progress); // Fade out

    ctx.save();
    ctx.beginPath();
    ctx.arc(this.x, this.y, radius, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(233, 69, 96, ${alpha})`; // Selection color
    ctx.fill();
    ctx.restore();

    return true; // Still animating
  }
}

// In Renderer class:
private rippleAnimations: RippleAnimation[] = [];

addRipple(x: number, y: number): void {
  this.rippleAnimations.push(new RippleAnimation(x, y));
}
```

### Anti-Patterns to Avoid
- **Don't use `requestAnimationFrame` inside animations:** Already handled by GameLoop - use `performance.now()` for timing
- **Don't change canvas.width/height for scaling:** Breaks coordinate system - use CSS transforms instead
- **Don't use `passive: false` for all touch events:** Only needed for events where `preventDefault()` is called
- **Don't implement complex easing libraries:** Simple easing functions are sufficient for 200-300ms animations

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Animation timing | Custom requestAnimationFrame loop | Existing GameLoop + `performance.now()` | GameLoop already runs at 60fps, timing is consistent |
| Easing functions | Complex easing library | 2-3 simple easing functions | Animations are short (200-300ms), simple easing sufficient |
| Touch detection | Custom touch handling library | Native TouchEvent API | Already working, just needs prevention logic |
| Responsive scaling | ResizeObserver + layout recalculation | CSS transforms | Preserves coordinate system, simpler implementation |

**Key insight:** The existing codebase has well-established patterns (ShakeAnimation, fade-in selection, path drawing). Extending these is more reliable than introducing new animation systems.

## Common Pitfalls

### Pitfall 1: Canvas Scaling Breaking Coordinate System
**What goes wrong:** Changing `canvas.width` or `canvas.height` for responsive scaling breaks mouse/touch coordinate mapping
**Why it happens:** Coordinate mapping uses canvas dimensions; changing them invalidates all hit detection
**How to avoid:** Use CSS transforms (`transform: scale()`) for display scaling; keep canvas internal dimensions constant
**Warning signs:** Clicks register on wrong tiles after resize

### Pitfall 2: Touch Event Passive Handler Conflict
**What goes wrong:** `preventDefault()` doesn't work on touch events
**Why it happens:** Modern browsers default touch events to `passive: true` for scroll performance
**How to avoid:** Use `{ passive: false }` only when calling `preventDefault()`, or use CSS `touch-action: none` (preferred)
**Warning signs:** Pinch zoom still works despite `preventDefault()` call

### Pitfall 3: Animation Jank During Path Display
**What goes wrong:** Match animation and path animation compete for rendering time
**Why it happens:** Both animations running sequentially instead of concurrently
**How to avoid:** Trigger both animations simultaneously; use same render loop; both check `performance.now()` independently
**Warning signs:** Stuttering or delayed animations when matching tiles

### Pitfall 4: Glow Effect Performance
**What goes wrong:** Canvas rendering becomes slow with shadowBlur
**Why it happens:** `shadowBlur` is computationally expensive, especially at high values
**How to avoid:** Keep `shadowBlur` under 20px; draw glow once per frame; avoid multiple shadowed elements
**Warning signs:** Frame rate drops when path is displayed

### Pitfall 5: DPR Mismatch After Scaling
**What goes wrong:** Canvas appears blurry on high-DPI displays after responsive scaling
**Why it happens:** CSS transform doesn't update device pixel ratio handling
**How to avoid:** Keep DPR handling in context scaling separate from display scaling; test on Retina displays
**Warning signs:** Text and tiles look fuzzy on mobile devices

## Code Examples

### Match Animation Integration
```typescript
// In Renderer.ts - extend existing animation system
private matchAnimations: Map<string, MatchAnimation> = new Map();
private readonly MATCH_ANIMATION_DURATION = 250;

// Called from Game.ts when tilesMatched event fires
animateMatch(tiles: Tile[]): void {
  for (const tile of tiles) {
    const animation = new MatchAnimation(this.MATCH_ANIMATION_DURATION);
    animation.start();
    this.matchAnimations.set(tile.id, animation);
  }
}

// In renderTile() - apply animation transform
private renderTile(ctx: CanvasRenderingContext2D, tile: Tile, offsetX: number, offsetY: number): void {
  const matchAnimation = this.matchAnimations.get(tile.id);

  // Calculate tile center for scale transform
  const x = offsetX + tile.position.col * (CONFIG.tile.size + CONFIG.tile.gap) + CONFIG.tile.gap;
  const y = offsetY + tile.position.row * (CONFIG.tile.size + CONFIG.tile.gap) + CONFIG.tile.gap;
  const centerX = x + CONFIG.tile.size / 2;
  const centerY = y + CONFIG.tile.size / 2;

  ctx.save();

  if (matchAnimation) {
    const { scale, alpha } = matchAnimation.getScaleAndAlpha();
    ctx.globalAlpha = alpha;
    ctx.translate(centerX, centerY);
    ctx.scale(scale, scale);
    ctx.translate(-centerX, -centerY);

    // Clean up completed animations
    if (matchAnimation.isComplete()) {
      this.matchAnimations.delete(tile.id);
    }
  }

  // ... existing tile drawing code ...

  ctx.restore();
}
```

### Responsive Scaling CSS Addition
```css
/* Add to index.html <style> */
#game {
  border-radius: 8px;
  touch-action: none; /* Prevent all touch gestures */
}

/* Center canvas in viewport */
body {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  overflow: hidden; /* Prevent scroll */
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `canvas.width` resize for scaling | CSS transforms | ~2020 | Preserves coordinate system |
| `preventDefault()` on touch events | CSS `touch-action` | ~2018 | Simpler, more reliable |
| requestAnimationFrame per animation | Central game loop | Project start | Consistent timing, single rAF |
| Multiple rAF calls | Single GameLoop | Phase 01 | Better performance |

**Deprecated/outdated:**
- `touch-events` library: Native API is sufficient with `touch-action: none`
- Complex animation libraries (GSAP, anime.js): Overkill for 200-300ms animations

## Open Questions

1. **Ripple effect implementation (CSS vs Canvas)**
   - What we know: Both approaches viable; canvas ripple matches game aesthetic; CSS is simpler
   - What's unclear: Performance comparison on mobile devices
   - Recommendation: Start with canvas ripple (matches existing Renderer pattern), switch to CSS if performance issues

2. **Glow intensity**
   - What we know: `shadowBlur` under 20px is performant; 15px provides visible glow
   - What's unclear: Optimal value for visibility vs performance on low-end devices
   - Recommendation: Start with `shadowBlur = 15`, make configurable in CONFIG if needed

3. **Easing curve for scale+fade**
   - What we know: `ease-out-back` provides "pop" feel; `ease-in-quad` for fade is standard
   - What's unclear: Exact coefficients for best "satisfying" feel
   - Recommendation: Use standard coefficients (c1 = 1.70158), adjust if playtesting reveals issues

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Vitest (node environment) |
| Config file | vitest.config.ts |
| Quick run command | `npm run test -- --run` |
| Full suite command | `npm run test` |

### Phase Requirements -> Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| UX-01 | Matched tiles animate before disappearing | unit | `npm run test -- --run src/__tests__/Renderer.test.ts` | Wave 0 |
| UX-02 | Game responds to touch input on mobile | unit | `npm run test -- --run src/__tests__/Game.test.ts` | Wave 0 |
| UX-03 | Grid layout is responsive | unit | `npm run test -- --run src/__tests__/Game.test.ts` | Wave 0 |

### Sampling Rate
- **Per task commit:** `npm run test -- --run`
- **Per wave merge:** `npm run test`
- **Phase gate:** Full suite green before `/gsd:verify-work`

### Wave 0 Gaps
- [ ] `src/__tests__/Renderer.test.ts` - Add tests for MatchAnimation class
- [ ] `src/__tests__/Renderer.test.ts` - Add tests for RippleAnimation class
- [ ] `src/__tests__/Renderer.test.ts` - Add tests for glow effect in drawPathLine()
- [ ] `src/__tests__/Game.test.ts` - Add tests for responsive canvas scaling logic
- [ ] `src/__tests__/Game.test.ts` - Add tests for touch prevention behavior

*(Note: Existing test infrastructure supports all phase requirements; Wave 0 adds test cases for new functionality)*

## Sources

### Primary (HIGH confidence)
- MDN Web Docs - Canvas API (shadowBlur, shadowColor, globalAlpha)
- MDN Web Docs - Touch events (touch-action, passive listeners)
- Existing codebase patterns (ShakeAnimation, fade-in selection, path drawing)

### Secondary (MEDIUM confidence)
- Web platform standards (CSS transforms, touch-action property)
- Established animation patterns (easing functions, time-based animations)

### Tertiary (LOW confidence)
- None - all recommendations based on established web standards and existing codebase patterns

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - All APIs are native browser features, well-documented
- Architecture: HIGH - Patterns established in existing codebase (ShakeAnimation, fade-in)
- Pitfalls: HIGH - Common canvas/responsive issues with well-known solutions

**Research date:** 2026-03-11
**Valid until:** 30 days (stable web APIs, unlikely to change significantly)
