# Story 3.3: Tile Merge Bounce Animation

Status: done

## Story

As a player,
I want merged tiles to bounce briefly,
so that I get satisfying visual feedback when tiles combine.

## Acceptance Criteria

1. When two tiles merge, the resulting tile plays a bounce animation scaling from 1.0 to 1.2 back to 1.0 over 200ms using CSS @keyframes
2. The bounce animation can run concurrently with the score float animation
3. When prefers-reduced-motion is enabled, the merged tile appears at normal scale with no animation

## Tasks / Subtasks

- [x] Task 1: Add @keyframes tile-merge animation (AC: #1)
  - [x] Added `@keyframes tile-merge { 0% { scale(1) } 50% { scale(1.2) } 100% { scale(1) } }` to app.css
  - [x] Tile.svelte applies `animation: tile-merge 200ms` when `isMerged` prop is true

- [x] Task 2: Concurrent with score float (AC: #2)
  - [x] Tile bounce and score float are independent CSS animations on different elements — naturally concurrent

- [x] Task 3: Reduced motion support (AC: #3)
  - [x] Already handled by `@media (prefers-reduced-motion)` rule from Story 3.1

- [x] Task 4: Verify all tests pass
  - [x] 59 tests passing, no regressions

## Dev Agent Record

### Agent Model Used
Claude Opus 4.6 (1M context)

### Completion Notes List
- Added @keyframes tile-merge to app.css
- Tile.svelte conditionally applies merge bounce via $derived animation property
- isMerged flag already tracked by tile-tracker.js from Story 3.1

### File List
- src/app.css (modified — @keyframes tile-merge)
- src/components/Tile.svelte (modified — conditional animation, shared with Story 3.2)
