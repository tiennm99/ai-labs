# Story 5.1: Tile Glow Effects

Status: done

## Story

As a player,
I want high-value tiles (128+) to glow,
so that I get visual feedback of my progress and milestone tiles feel special.

## Acceptance Criteria

1. Given a tile has a value of 128 or higher, when it renders on the grid, then it displays a glow effect: `box-shadow: 0 0 30px 10px rgba(243, 215, 116, 0.4)` (UX-DR6)
2. Given a tile has a value below 128, when it renders on the grid, then no glow effect is applied
3. Given a tile merges from 64+64 to 128, when the merge completes, then the glow effect appears on the resulting tile

## Tasks / Subtasks

- [x] Task 1: Add conditional glow box-shadow to Tile.svelte (AC: #1, #2, #3)
  - [x] Added `$derived` glow: `value >= 128 ? '0 0 30px 10px rgba(243, 215, 116, 0.4)' : 'none'`
  - [x] Applied `box-shadow: {glow}` in tile's inline style
  - [x] Glow automatically appears on merged tiles via Svelte reactivity (no extra code needed)
- [x] Task 2: Verify no regressions (AC: #1, #2, #3)
  - [x] All 90 tests pass, zero regressions
  - [x] Production build succeeds

## Dev Notes

### Implementation Details

This is a single-line change in Tile.svelte. Add a derived value for the box-shadow and include it in the inline style.

### Current Tile.svelte (relevant section)

```svelte
<div
  class="absolute flex items-center justify-center font-bold rounded-[3px]"
  style="
    width: var(--cell-size);
    height: var(--cell-size);
    transform: translate(calc({col} * (var(--cell-size) + var(--grid-gap))), calc({row} * (var(--cell-size) + var(--grid-gap))));
    transition: transform 100ms ease-in-out;
    animation: {animation};
    background: {colors.bg};
    color: {colors.text};
    font-size: {fontSize};
  "
>
```

### Required Change

Add in `<script>`:
```javascript
let glow = $derived(value >= 128 ? '0 0 30px 10px rgba(243, 215, 116, 0.4)' : 'none');
```

Add in style:
```
box-shadow: {glow};
```

### AC #3 (merge glow) — No Extra Code Needed

When 64+64 merges, game-logic returns a new state with the merged tile having value 128. Tile.svelte re-renders with `value=128`, which triggers the glow derived. The merge bounce animation plays simultaneously. No special merge handling needed.

### FRs Covered

- FR29: Tile glow on 128+

### References

- [Source: _bmad-output/planning-artifacts/epics.md — Epic 5, Story 5.1]
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md — UX-DR6]
- [Source: src/components/Tile.svelte — current implementation]

## Dev Agent Record

### Agent Model Used
Claude Opus 4.6 (1M context)

### Debug Log References

### Completion Notes List
- Added `$derived` glow variable and box-shadow to Tile.svelte — 2 lines of code
- Glow triggers automatically for value >= 128 via Svelte reactivity
- All 90 tests pass

### File List
- src/components/Tile.svelte (modified — added glow box-shadow)
