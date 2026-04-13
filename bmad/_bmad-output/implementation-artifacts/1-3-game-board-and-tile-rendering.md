# Story 1.3: Game Board & Tile Rendering

Status: review

## Story

As a player,
I want to see a 4x4 game grid with colored numbered tiles,
so that I can visually understand the game state.

## Acceptance Criteria

1. A 4x4 grid with `#bbada0` background and 16 empty cell placeholders (`#cdc1b4`) is displayed
2. Grid has `15px` gap and `15px` padding with `6px` border radius
3. Grid container is `500px` wide and centered on the page
4. Each tile displays its numeric value centered in the cell
5. Tile background color matches the 12-tier color system from constants.js TILE_COLORS
6. Text color is `#776e65` for values 2 and 4, `#f9f6f2` for values 8+
7. Font family is Clear Sans with fallback chain
8. Tiles have `role="gridcell"` and `aria-label` with tile value
9. Grid has `role="grid"` and `aria-label="Game board"`

## Tasks / Subtasks

- [x] Task 1: Create Grid component (AC: #1, #2, #3, #9)
  - [x] Created `src/components/Grid.svelte` with 4x4 layout, #bbada0 background, 15px gap/padding, 6px radius
  - [x] 16 empty cell placeholders with #cdc1b4 background
  - [x] `role="grid"` and `aria-label="Game board"` added

- [x] Task 2: Create Tile component (AC: #4, #5, #6, #7, #8)
  - [x] Created `src/components/Tile.svelte` with dynamic color lookup from TILE_COLORS
  - [x] Absolute positioning via CSS transform based on row/col
  - [x] `role="gridcell"` and `aria-label="Tile: {value}"` added

- [x] Task 3: Integrate Grid into App with game state (AC: all)
  - [x] App.svelte uses `$state(initGame())` and `$derived` for tile extraction
  - [x] Grid receives tiles array, renders 2 initial tiles

- [x] Task 4: Verify rendering and build (AC: all)
  - [x] Dev server runs, 38 tests pass, production build succeeds (36KB JS, 11KB CSS)

## Dev Notes

### Architecture Compliance

- **Grid.svelte** — presentational component, receives `tiles` as prop, no state ownership
- **Tile.svelte** — presentational, receives `value`, `row`, `col` as props
- **App.svelte** — owns game state via `$state` rune, passes data down via props
- **No Svelte stores** — props-down pattern only
- **Tile positioning** — use absolute positioning with CSS transform translate based on row/col within the grid

### Tile Positioning Strategy

Grid cells are background-only (empty placeholders). Tiles are positioned absolutely over the grid using `transform: translate(x, y)` where x/y are calculated from col/row * cell size. This enables future animation (Story 3.1) where tiles slide between positions.

Cell size calculation: `(containerWidth - (GRID_SIZE + 1) * gap) / GRID_SIZE`
- Desktop: (500 - 5*15) / 4 = 106.25px per cell
- Position: `transform: translate(${col * (cellSize + gap)}px, ${row * (cellSize + gap)}px)`

### Color Lookup

```javascript
import { TILE_COLORS } from '../lib/constants.js';
const colors = TILE_COLORS[value] || TILE_COLORS.super;
```

### Svelte 5 Runes

Use `$state` for mutable state, NOT old Svelte 4 `let` reactivity:
```javascript
let gameState = $state(initGame());
```

Use `$derived` for computed values:
```javascript
let tiles = $derived(/* extract non-zero tiles from gameState.grid */);
```

### Previous Story Intelligence

From Story 1.2:
- `initGame()` returns `{ grid: number[][], score: 0, won: false, keepPlaying: false }`
- Grid is a 4x4 2D array where 0 = empty cell
- TILE_COLORS has keys: 2, 4, 8, 16, 32, 64, 128, 256, 512, 1024, 2048, super
- Each color entry: `{ bg: '#hex', text: '#hex' }`

### References

- [Source: _bmad-output/planning-artifacts/architecture.md#Frontend Architecture]
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md#Color System]
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md#Component Strategy - Grid.svelte]
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md#Component Strategy - Tile.svelte]

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6 (1M context)

### Debug Log References

### Completion Notes List

- Grid.svelte: 4x4 layout with absolute positioning for tiles over empty cell placeholders
- Tile.svelte: dynamic color lookup, absolute positioning via transform for future animation support
- App.svelte: Svelte 5 $state rune for game state, $derived for tile extraction
- Cell size: 106.25px with 15px gap, total container ~500px

### File List

- src/components/Grid.svelte (new)
- src/components/Tile.svelte (new)
- src/App.svelte (updated — game state + grid integration)
