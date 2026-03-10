# Phase 1: Core Foundation - Context

**Gathered:** 2026-03-10
**Status:** Ready for planning

<domain>
## Phase Boundary

Establish the project structure and fundamental architecture patterns that all other components build upon. This phase delivers the foundation: Vite + TypeScript + Canvas setup, game loop, event system, basic Tile model, and configuration.

</domain>

<decisions>
## Implementation Decisions

### Grid Configuration
- Grid size: **16 columns × 10 rows** (160 tiles, 80 pairs)
- 16 unique tile types, each appearing 10 times

### Tile Graphics
- **Emoji tiles** using 16 nature element emojis:
  - 🌟 ⭐ 💫 ✨ 🌙 ☀️ 🔥 💧 🌿 ⚡ 🧊 🪨 🌸 🍃 🌊 🍄
- **Card style** tiles: big emoji in center, rounded corners, subtle shadow
- **Highlight ring** to show tile selection

### Configuration
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

</decisions>

<specifics>
## Specific Ideas

- 16×10 widescreen grid layout (not the typical square)
- Nature-themed emoji set for a cohesive visual feel

</specifics>

<code_context>
## Existing Code Insights

### Reusable Assets
- None yet (greenfield project)

### Established Patterns
- Research recommends: Vite 7.x, TypeScript 5.x, HTML5 Canvas
- No game framework needed for this scope

### Integration Points
- This is Phase 1 — everything builds on this foundation

</code_context>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 01-core-foundation*
*Context gathered: 2026-03-10*
