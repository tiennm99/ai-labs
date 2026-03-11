# Phase 6: Polish and UX - Context

**Gathered:** 2026-03-11
**Status:** Ready for planning

<domain>
## Phase Boundary

Add polish animations and responsive UX enhancements to make the game feel smooth and satisfying across all devices. Covers tile match animations, responsive canvas scaling, mobile touch optimization, and enhanced path visualization. Does NOT include new gameplay features — those belong in future phases.

</domain>

<decisions>
## Implementation Decisions

### Tile Match Animations
- **Effect:** Scale + Fade — tiles grow slightly then shrink to nothing while fading (satisfying "pop" feel)
- **Duration:** 200-300ms (matches existing animation timing patterns)
- **Timing:** Animate during path display — concurrent with green line, not sequential
- **Multi-match handling:** Single match only — no chaining or cascade animations

### Responsive Layout
- **Scaling approach:** Scale entire canvas to fit viewport while maintaining aspect ratio
- **Scaling direction:** Scale down only on small screens — never scale up on large screens (stay at native 832x528)
- **Orientation support:** Works in both portrait and landscape — no orientation lock
- **UI overlays:** Keep current HTML overlay pattern (score, game-over, shuffle) — positioned relative to viewport

### Mobile Touch Polish
- **Touch feedback:** Visual ripple effect at touch point when tile is selected (reinforces interaction, matches colorful aesthetic)
- **Browser behavior:** Prevent zoom (double-tap, pinch) and scroll on canvas — prevents accidental interaction during play
- **Touch accuracy:** Keep current implementation — coordinate mapping with DPR handling works well

### Path Visualization
- **Visual style:** Add glow effect behind the green line — soft bloom/halo for more visibility
- **Display duration:** Keep current 300ms — matches existing animation patterns, snappy
- **Color:** Keep current green (#00ff00) — visible, matches success feel

### Claude's Discretion
- Exact easing curve for scale+fade animation
- Glow intensity and blur radius for path
- Ripple effect size and duration
- CSS vs canvas for ripple effect

</decisions>

<specifics>
## Specific Ideas

- Animation should feel "satisfying" — the "aha!" moment when spotting a match
- Keep game feeling snappy and responsive, not slow or draggy
- Match colorful, playful aesthetic established in earlier phases

</specifics>

<code_context>
## Existing Code Insights

### Reusable Assets
- **ShakeAnimation class** (Renderer.ts:15-74): Time-based animation pattern with decay — can adapt for scale+fade
- **Fade-in selection animation** (Renderer.ts:193-226): Uses `performance.now()` and progress calculation — same pattern for fade-out
- **Path drawing** (Renderer.ts:326-394): Already draws connection line with configurable duration and color
- **Touch handling** (Game.ts:230-232): `handleTouch` with `passive: true` — add prevention logic here

### Established Patterns
- **Animation timing:** `performance.now()` for all time-based animations
- **Configurable durations:** `FADE_DURATION = 100`, `PATH_DISPLAY_DURATION = 300` — add `MATCH_ANIMATION_DURATION`
- **Canvas coordinate system:** DPR-aware with offset centering — scale logic goes in `setupCanvas()`
- **HTML overlays:** Score display, game-over, shuffle overlays positioned with CSS — keep pattern

### Integration Points
- **Renderer.render()** — add match animation rendering here
- **Game.handleInput()** — add ripple effect and touch prevention here
- **Game.setupCanvas()** — add viewport scaling logic here
- **Renderer.drawPathLine()** — add glow effect here

</code_context>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 06-polish-and-ux*
*Context gathered: 2026-03-11*
