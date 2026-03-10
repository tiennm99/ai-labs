# Domain Pitfalls

**Domain:** Tile-Matching Puzzle Game (Pikachu Match)
**Researched:** 2026-03-10
**Confidence:** MEDIUM (based on domain knowledge; web research was limited)

## Critical Pitfalls

Mistakes that cause rewrites or major issues.

### Pitfall 1: Incorrect Path-Finding Algorithm Implementation

**What goes wrong:** The 3-line (2-turn) path-finding logic incorrectly validates or rejects connections. Either valid matches are rejected (frustrating players) or invalid matches are accepted (breaking game logic).

**Why it happens:** Developers underestimate the complexity of checking all possible paths. The algorithm must check horizontal-first paths AND vertical-first paths, and handle edge cases like paths hugging the board boundary or passing through cleared tiles.

**Consequences:** Players lose trust in the game when obvious matches fail or invalid matches succeed. Core loop feels broken.

**Prevention:**
1. Implement the path check as: straight line (0 turns), one-turn path (L-shape), two-turn path (U-shape or Z-shape)
2. Test exhaustively with unit tests covering: adjacent tiles, straight-line connections, single-turn connections, double-turn connections, boundary-hugging paths, paths through cleared areas
3. Visualize valid paths during development to debug visually

**Detection:** Unit tests fail; players report "I clicked matching tiles and nothing happened" or "tiles that shouldn't match did"

**Phase to address:** Phase 1 (Core Matching Logic)

---

### Pitfall 2: Unsolvable Board Generation

**What goes wrong:** The game generates a board where no valid moves exist from the start, or becomes unsolvable partway through, but the dead-end detection doesn't trigger.

**Why it happens:** Random tile placement doesn't guarantee solvability. Developers assume "if pairs exist, matches must exist" — but pairs can be blocked by the 3-line constraint.

**Consequences:** Players get stuck through no fault of their own. Game feels unfair. Frustration leads to abandonment.

**Prevention:**
1. Generate boards by placing pairs in reverse: start with empty board, add matched pairs in positions that are guaranteed connectable
2. Alternatively, after random generation, validate solvability and regenerate if unsolvable
3. Implement a "shuffle" feature that preserves remaining tiles but repositions them when no moves exist

**Detection:** Manual testing reveals boards with no valid moves; automated solvability checker fails

**Phase to address:** Phase 2 (Board Generation)

---

### Pitfall 3: Dead-End Detection Failure

**What goes wrong:** The game fails to detect when no valid moves remain, leaving players stuck with no feedback or resolution.

**Why it happens:** Dead-end detection requires checking ALL remaining tile pairs against ALL possible paths — O(n^2) complexity. Developers skip this optimization or implement it incorrectly.

**Consequences:** Players stare at a board with no solution, unsure if they're missing something or the game is broken.

**Prevention:**
1. Implement efficient dead-end check: for each tile, check if ANY matching tile has a valid path
2. Cache results and re-check only when tiles are cleared
3. When dead-end detected, offer: shuffle remaining tiles, auto-solve hint, or graceful game-over

**Detection:** Player inactivity timeout; manual testing; analytics showing players abandoning mid-game

**Phase to address:** Phase 2 (Board Generation) or Phase 3 (Polish & UX)

---

### Pitfall 4: Grid Coordinate System Confusion

**What goes wrong:** Off-by-one errors, inverted row/column indexing, or mismatched coordinate systems between rendering, logic, and input handling.

**Why it happens:** Grids seem simple but have multiple valid coordinate conventions (0-indexed vs 1-indexed, row-major vs column-major, screen vs grid coordinates).

**Consequences:** Clicks register on wrong tiles, path visualization is offset, tiles clear in wrong positions. Debugging nightmare.

**Prevention:**
1. Choose ONE coordinate system and document it clearly
2. Create helper functions for coordinate conversion (screen-to-grid, grid-to-screen)
3. Use consistent naming: (row, col) or (x, y) — never mix
4. Add visual debugging to show grid coordinates on hover during development

**Detection:** Clicks feel "off"; tiles highlight incorrectly; path drawing is misaligned

**Phase to address:** Phase 1 (Core Matching Logic)

---

## Moderate Pitfalls

### Pitfall 5: Poor Visual Feedback for Connections

**What goes wrong:** Players click matching tiles but see no indication of WHY a match failed or succeeded. No path visualization, no highlight, no animation.

**Why it happens:** Developers focus on logic first, plan to "add polish later," but core feedback is essential for the game to feel playable.

**Prevention:**
1. From the start, draw the connecting path (even as a simple line) when a match succeeds
2. Show a visual indicator (shake, red flash) when a match fails
3. Highlight selected tiles clearly

**Detection:** Playtesters ask "did that work?" or "why didn't those match?"

**Phase to address:** Phase 1 (Core Matching Logic)

---

### Pitfall 6: Responsive Grid Scaling Issues

**What goes wrong:** Grid looks fine on desktop but tiles become too small to click on mobile, or the grid overflows the viewport.

**Why it happens:** Fixed pixel sizes, aspect ratio assumptions, or not testing on actual mobile devices.

**Prevention:**
1. Calculate tile size based on viewport dimensions and grid size
2. Maintain minimum touch target size (44px recommended)
3. Test on multiple screen sizes early
4. Consider landscape vs portrait orientations

**Detection:** Manual testing on mobile; tiles hard to click on phone

**Phase to address:** Phase 3 (Polish & UX)

---

### Pitfall 7: Touch vs Mouse Input Handling

**What goes wrong:** Game works with mouse clicks but not touch taps, or vice versa. Double-tap zooms the page instead of selecting a tile.

**Why it happens:** Touch and mouse events are different; mobile browsers have default touch behaviors that interfere.

**Prevention:**
1. Use pointer events (unified) or handle both touch and mouse explicitly
2. Call `preventDefault()` on touch events to avoid double-tap zoom
3. Handle touch latency and accidental multi-touch

**Detection:** Game unplayable on mobile devices

**Phase to address:** Phase 3 (Polish & UX)

---

### Pitfall 8: Performance Degradation with Large Boards

**What goes wrong:** Path-finding becomes slow on larger grids (10x10+), causing lag when checking for valid moves.

**Why it happens:** Naive path-finding is O(n*m) per pair check, and dead-end detection checks all pairs.

**Prevention:**
1. Optimize path-finding with early termination
2. Use spatial partitioning for large boards
3. Cache path-finding results until board state changes
4. For v1, limit board size to reasonable dimensions (8x8 or smaller)

**Detection:** Noticeable delay after clicking tiles; browser dev tools show high CPU usage

**Phase to address:** Phase 1 (Core Matching Logic)

---

## Minor Pitfalls

### Pitfall 9: Tile Asset Loading Issues

**What goes wrong:** Game displays before tile images load, shows broken images, or layout shifts as images load.

**Prevention:** Preload all tile assets before showing game; use placeholder dimensions; lazy-load only if necessary

**Phase to address:** Phase 3 (Polish & UX)

---

### Pitfall 10: No Win Condition Handling

**What goes wrong:** Player clears all tiles but game doesn't recognize victory — no celebration, no "you win" message.

**Prevention:** Check if tile count === 0; trigger win state; display victory message

**Phase to address:** Phase 2 (Board Generation)

---

## Technical Debt Patterns

| Shortcut | Immediate Benefit | Long-term Cost | When Acceptable |
|----------|-------------------|----------------|-----------------|
| Skip path visualization | Ship faster | Players confused why matches fail | Never — essential for core loop |
| No dead-end detection | Simpler code | Players get stuck unfairly | Never for v1 — include basic detection |
| Hardcode board layout | Quick prototype | Can't generate varied levels | Acceptable for proof-of-concept only |
| Fixed grid size | Simpler rendering | Can't adjust difficulty | Acceptable for v1 (one level) |
| No animations | Less code | Game feels lifeless | Acceptable for MVP, add before release |

## Integration Gotchas

| Integration | Common Mistake | Correct Approach |
|-------------|----------------|------------------|
| Browser events | Not preventing default touch behavior | Call `preventDefault()` on touchstart/touchend |
| Canvas rendering | Not clearing canvas between frames | Clear before redraw, or track dirty regions |
| Responsive layout | Using fixed pixel values | Use viewport units or calculated percentages |

## Performance Traps

| Trap | Symptoms | Prevention | When It Breaks |
|------|----------|------------|----------------|
| O(n^2) dead-end check every frame | Game freezes on larger boards | Check only on tile clear; cache results | 8x8 grid with naive implementation |
| Re-rendering entire grid on every click | High CPU, battery drain | Track dirty tiles, re-render only changed | Any grid size with poor implementation |
| Large tile images | Slow initial load, memory pressure | Optimize images, use spritesheets | 50+ unique tile images |

## Security Mistakes

| Mistake | Risk | Prevention |
|---------|------|------------|
| N/A | This is a client-side game with no backend or user data | Standard web security practices sufficient |

## UX Pitfalls

| Pitfall | User Impact | Better Approach |
|---------|-------------|-----------------|
| No feedback on failed match | User thinks game is broken | Visual shake/red flash on invalid selection |
| No path visualization | User doesn't understand why match worked | Draw connecting lines (even briefly) |
| Tiny tiles on mobile | Frustrating, inaccurate clicks | Calculate tile size for touch targets |
| No indication of selected tile | User forgets first selection | Clear highlight/pulse on selected tile |
| Instant tile removal | Feels abrupt, unsatisfying | Brief animation before removal |

## "Looks Done But Isn't" Checklist

- [ ] **Path-finding:** Often missing edge cases (paths along board edge, through cleared areas) — verify with unit tests covering all path types
- [ ] **Dead-end detection:** Often missing entirely or incorrectly implemented — verify by manually creating unsolvable board and checking detection triggers
- [ ] **Win condition:** Often forgotten — verify game recognizes when all tiles cleared
- [ ] **Touch input:** Often works on desktop but not mobile — verify on actual mobile device
- [ ] **Responsive grid:** Often breaks on small screens — verify on multiple viewport sizes

## Recovery Strategies

| Pitfall | Recovery Cost | Recovery Steps |
|---------|---------------|----------------|
| Incorrect path-finding | HIGH | Rewrite path algorithm; add comprehensive unit tests; may have shipped broken game |
| Unsolvable board generation | MEDIUM | Add solvability validation; implement shuffle feature; may need to explain to players |
| Dead-end detection failure | MEDIUM | Implement detection; add shuffle/hint features; moderate refactor |
| Grid coordinate confusion | HIGH | Refactor all coordinate handling; find and fix all conversions; high regression risk |
| Poor visual feedback | LOW | Add animations/highlights; doesn't affect core logic |

## Phase-Specific Warnings

| Phase Topic | Likely Pitfall | Mitigation |
|-------------|---------------|------------|
| Core matching logic | Path-finding edge cases | Exhaustive unit tests; visualize paths during development |
| Board generation | Unsolvable boards | Generate from solved state backward; validate solvability |
| Input handling | Touch vs mouse differences | Use pointer events; test on mobile early |
| Polish & UX | Missing visual feedback | Implement path visualization from start (not as "polish") |
| Responsive design | Grid too small on mobile | Calculate tile sizes dynamically; test on actual devices |

## Sources

- Domain knowledge from tile-matching game development patterns
- Common path-finding algorithm edge cases (A*/BFS adaptations for grid-based pathfinding with turn limits)
- Mobile web game development best practices (touch handling, responsive design)
- Classic tile-matching games (Pikachu Kawai, Onet Connect) as reference implementations

**Note:** Web research was attempted but limited due to access restrictions. This document relies primarily on domain knowledge. Consider validating key algorithmic approaches against established implementations.

---
*Pitfalls research for: Pikachu Match (tile-matching puzzle game)*
*Researched: 2026-03-10*
