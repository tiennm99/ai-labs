# Phase 2: Grid and Input - Context

**Gathered:** 2026-03-11
**Status:** Ready for planning

<domain>
## Phase Boundary

Display a grid of emoji tiles and enable player interaction via mouse and touch. Players can select tiles (with visual feedback) to attempt matches. Path-finding and actual tile clearing are handled in Phase 3.

</domain>

<decisions>
## Implementation Decisions

### Selection State Rules
- **Toggle deselect**: Clicking a selected tile deselects it — player can back out of a choice
- **Same tile twice**: Treated as deselect (consistent with toggle behavior)
- **Two tiles selected**: Emit `tilesSelected` event via EventEmitter, then block input until match processing completes (Phase 3 handles matching/animations)
- **Empty tile click**: Ignore completely — no selection change, no feedback

### Input Handling Approach
- **Event listeners**: Attached via Game orchestrator (`Game.ts`) for centralized control
- **Hit detection**: Tile bounds checking — check if click coordinates fall within each tile's bounds
- **Double-tap handling**: Treat each tap independently — no debouncing (second tap would deselect based on toggle rule)
- **Event types**: `click` and `touchstart` only — simple, covers most use cases

### Responsive Grid Layout
- **Canvas sizing**: Dynamic tile size — calculate tile size to fit viewport, grid fills available space appropriately
- **Grid positioning**: Centered horizontally and vertically within canvas
- **Mobile constraint**: If grid doesn't fit on small screens, shrink tile size until all tiles visible (no scrolling)
- **Resize behavior**: Debounce window resize events, then recalculate and redraw — balances performance with responsiveness

### Visual Selection Feedback
- **Highlight style**: Border + background tint — colored border around selected tile plus subtle background color change
- **Selection color**: Use `CONFIG.colors.selection` (#e94560) from Phase 1 config — consistent with planned palette
- **Two tiles selected**: Both tiles show identical highlight styling — simple, clear communication of "attempting match" state
- **Selection animation**: Fade in highlight over ~100ms — smoother feel than instant appearance

### Claude's Discretion
- Exact animation timing and easing function for fade-in
- Border width for selection highlight
- Background tint intensity (opacity)
- Debounce delay duration for resize events

</decisions>

<specifics>
## Specific Ideas

- Input blocking after 2 tiles selected is critical — prevents confusion while match animation plays
- Fade-in animations make the UI feel more polished and less jarring
- Centering the grid provides a focused, balanced game experience

</specifics>

<code_context>
## Existing Code Insights

### Reusable Assets
- **Game.ts**: Orchestrator with canvas reference and game loop — should handle input event delegation
- **GameLoop.ts**: 60fps loop with delta time — can drive fade-in animations
- **EventEmitter.ts**: Typed event system — use for `tilesSelected` event communication
- **Tile.ts**: Model with position, type, emoji getter — has coordinate data for bounds checking
- **config.ts**: All configurable constants including selection color (#e94560), tile size (48px), gap (4px)

### Established Patterns
- Event-driven architecture — components communicate via typed events
- Canvas rendering at 60fps using requestAnimationFrame
- Typed TypeScript throughout with strict config (`as const`)
- Device pixel ratio handling for sharp rendering on high-DPI displays

### Integration Points
- **Game.ts**: Add input event listeners, delegate to new GridManager (to be created)
- **GridManager**: New component to handle tile array, coordinate-to-tile mapping, selection state
- **Renderer**: New component to draw tiles and grid on canvas (uses Tile model data)
- Events: Emit `tilesSelected` with selected tile coordinates for Phase 3 to consume

</code_context>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 02-grid-and-input*
*Context gathered: 2026-03-11*
