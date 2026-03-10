# Stack Research: Web-Based Tile-Matching Puzzle Game

**Domain:** Web-based 2D puzzle game (tile-matching)
**Researched:** 2026-03-10
**Confidence:** HIGH

## Recommended Stack

### Core Technologies

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| **Vite** | 7.3.x | Build tool & dev server | Fastest HMR, native TypeScript support, minimal config. For a simple puzzle game, Vite's instant feedback loop accelerates development significantly. |
| **TypeScript** | 5.x | Type safety | Prevents runtime errors in game logic (path-finding algorithm, tile state). The path-finding algorithm with 3-turn constraint benefits from strong typing. |
| **HTML5 Canvas** | Native | 2D rendering | Sufficient for tile-matching game complexity. No framework overhead. Direct pixel control for smooth animations. Browser-native, zero dependencies. |
| **Vanilla JS/TS** | ES2022+ | Game logic | No framework needed for this scope. Tile-matching games have simple state (grid array, selected tiles, score). Keeping it framework-free reduces bundle size and debugging surface. |

### Supporting Libraries

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| **none required** | - | - | For v1 minimal scope, vanilla Canvas is sufficient |

**Optional (add only if needed):**

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| **howler.js** | 2.2.x | Audio | If adding sound effects later (currently out of scope) |
| **zustand** | 5.x | State management | If game state becomes complex (multiple screens, settings) |

### Development Tools

| Tool | Purpose | Notes |
|------|---------|-------|
| **Vite** | Dev server, build, HMR | Single tool handles all dev needs |
| **tsc** | TypeScript compiler | Configured via tsconfig.json |
| **ESLint** | Code quality | Optional but recommended for consistency |

## Installation

```bash
# Create project with Vite + TypeScript
npm create vite@latest pikachu-match -- --template vanilla-ts

# Navigate to project
cd pikachu-match

# Install dependencies (minimal for v1)
npm install

# Optional: Add ESLint
npm install -D eslint @typescript-eslint/eslint-plugin @typescript-eslint/parser

# Optional: Add sound library later
# npm install howler
```

## Alternatives Considered

| Recommended | Alternative | When to Use Alternative |
|-------------|-------------|-------------------------|
| **Vanilla Canvas** | **Phaser 3.90.x** | Use Phaser if: adding physics, particle effects, complex animations, multiple game scenes, or planning to expand significantly beyond v1 scope |
| **Vanilla Canvas** | **PixiJS 8.x** | Use PixiJS if: needing WebGL/WebGPU for 1000+ sprites, complex visual effects, or planning graphics-intensive features |
| **Vite** | **Parcel** | Use Parcel if: want zero-config (Vite requires minimal config but Parcel is truly zero-config) |
| **TypeScript** | **JavaScript** | Use vanilla JS if: rapid prototyping only, team unfamiliar with TypeScript |

## What NOT to Use

| Avoid | Why | Use Instead |
|-------|-----|-------------|
| **React/Vue/Svelte** | DOM-based frameworks add unnecessary overhead for canvas games. Virtual DOM diffing is wasted when rendering to Canvas. Game loop pattern doesn't fit component model well. | Vanilla JS/TS with direct Canvas API |
| **Game engines (Unity, Godot)** | Massive overkill for a 2D tile puzzle. Large bundle sizes, complex build pipeline. Web export adds 10MB+ overhead. | HTML5 Canvas (native browser API) |
| **Webpack** | Slower dev server, complex config. Vite provides better DX in 2026. | Vite 7.x |
| **Create React App** | Deprecated. React team recommends Vite-based alternatives. | Vite directly |
| **jQuery** | Outdated for modern projects. No value for Canvas-based games. | Vanilla DOM API (minimal DOM interaction anyway) |
| **Three.js** | 3D library — unnecessary for 2D tile game. Adds 500KB+ to bundle. | HTML5 Canvas (2D context) |
| **Full game frameworks for simple games** | Phaser/PixiJS add learning curve and bundle size for features you won't use in v1. | Start with Canvas, add framework later if complexity grows |

## Stack Patterns by Variant

**If v1 scope expands to include animations/particles:**
- Add Phaser 3.90.x
- Because: Phaser's animation system, particle emitter, and scene management become valuable
- Migration path: Keep game logic separate, swap rendering layer

**If targeting mobile-first with touch gestures:**
- Add pointer event handling (native Canvas supports touch)
- Consider adding hammer.js for complex gestures (not needed for simple tap-to-select)

**If adding save/load functionality:**
- Use localStorage for v1 (no backend)
- Add zustand for state management if state becomes complex

**If adding multiplayer:**
- This requires significant architecture change (out of scope for v1)
- Would need: WebSocket server, state synchronization, conflict resolution

## Version Compatibility

| Package | Compatible With | Notes |
|---------|-----------------|-------|
| Vite 7.x | Node.js 20.x+ | Requires ESM modules |
| TypeScript 5.x | Vite 7.x | Vite has native TS support |
| Canvas API | All modern browsers | IE11 not supported (irrelevant in 2026) |

## Bundle Size Expectations

| Approach | Minified | Gzipped | Notes |
|----------|----------|---------|-------|
| Vanilla Canvas + Vite | ~5KB | ~2KB | Your code only |
| With Phaser | ~250KB | ~80KB | Framework overhead |
| With PixiJS | ~200KB | ~65KB | Renderer overhead |
| With React + Canvas | ~150KB | ~50KB | React runtime + your code |

**For Pikachu Match v1:** Target <10KB gzipped (vanilla approach).

## Architecture Notes

### Game Loop Pattern
```typescript
// Standard game loop - no framework needed
function gameLoop(timestamp: number) {
  update(timestamp - lastTime);
  render(ctx);
  lastTime = timestamp;
  requestAnimationFrame(gameLoop);
}
```

### State Structure (Minimal)
```typescript
interface GameState {
  grid: Tile[][];           // 2D array of tiles
  selectedTile: Position | null;
  score: number;
  isAnimating: boolean;
}

interface Tile {
  id: number;
  pokemonType: number;      // Which Pokemon (for matching)
  cleared: boolean;
}
```

### Path-Finding Algorithm
- BFS or A* variant for finding paths with max 3 segments
- Well-documented algorithm, no library needed
- Core complexity: O(n*m) where n,m are grid dimensions

## Confidence Assessment

| Recommendation | Confidence | Reason |
|----------------|------------|--------|
| Vite 7.x | HIGH | Industry standard in 2026, verified via npm |
| Vanilla Canvas | HIGH | Sufficient for v1 scope, minimal dependencies |
| TypeScript 5.x | HIGH | Standard for maintainable codebases |
| Avoid React | HIGH | Clear architectural mismatch for Canvas games |
| Phaser as alternative | MEDIUM | Good option if scope expands, but adds complexity |
| PixiJS as alternative | MEDIUM | Good for graphics-heavy games, overkill for v1 |

## Sources

- **npm/package/phaser** — Version 3.90.0, features, bundle size (HIGH confidence)
- **npm/package/vite** — Version 7.3.1, features (HIGH confidence)
- **pixijs.com** — Version 8.x, installation, features (HIGH confidence)
- **MDN Web Docs (Canvas API)** — Standard reference for Canvas rendering (HIGH confidence)
- **Phaser documentation** — Framework capabilities, when to use (MEDIUM confidence - official docs)
- **Vite documentation** — Build tool features, TypeScript support (HIGH confidence)

---
*Stack research for: Web-based tile-matching puzzle game*
*Researched: 2026-03-10*
