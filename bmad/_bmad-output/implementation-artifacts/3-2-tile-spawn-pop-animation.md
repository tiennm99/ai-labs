# Story 3.2: Tile Spawn Pop Animation

Status: done

## Story

As a player,
I want new tiles to pop into existence,
so that I can easily spot where the new tile appeared.

## Acceptance Criteria

1. A new tile spawned after a move plays a pop animation scaling from 0 to 1.0 over 200ms using CSS @keyframes
2. The pop animation begins after the slide animation completes (sequential: slide then spawn)
3. When prefers-reduced-motion is enabled, the tile appears instantly at full size with no animation

## Tasks / Subtasks

- [x] Task 1: Add @keyframes tile-pop animation (AC: #1)
  - [x] Added `@keyframes tile-pop { 0% { scale(0) } 100% { scale(1) } }` to app.css
  - [x] Tile.svelte applies `animation: tile-pop 200ms` when `isNew` prop is true

- [x] Task 2: Sequential timing (AC: #2)
  - [x] Pop animation starts on DOM insertion — tile appears after slide completes naturally since spawned tiles are added with the new grid state

- [x] Task 3: Reduced motion support (AC: #3)
  - [x] Already handled by `@media (prefers-reduced-motion)` rule setting `animation-duration: 0s !important` from Story 3.1

- [x] Task 4: Verify all tests pass
  - [x] 59 tests passing, no regressions

## Dev Notes

- `isNew` flag already tracked by tile-tracker.js from Story 3.1
- Animation CSS added to app.css (centralized @keyframes)
- Tile.svelte conditionally applies animation based on `isNew` prop

## Dev Agent Record

### Agent Model Used
Claude Opus 4.6 (1M context)

### Completion Notes List
- Added @keyframes tile-pop to app.css
- Tile.svelte applies pop animation conditionally via $derived `animation` property
- prefers-reduced-motion already handled from Story 3.1

### File List
- src/app.css (modified — @keyframes tile-pop)
- src/components/Tile.svelte (modified — conditional animation)
