# Story 3.4: Score Float Animation

Status: done

## Story

As a player,
I want to see "+N" float up from the score when I earn points,
so that I feel the immediate reward of each merge.

## Acceptance Criteria

1. When a merge occurs and the score increases, a "+N" text appears near the score box and animates upward, fading out over 600ms with ease-out timing
2. Multiple merges in a single move show a single "+N" float with the total score delta
3. When prefers-reduced-motion is enabled, no float animation appears (score value still updates)

## Tasks / Subtasks

- [x] Task 1: Add @keyframes score-float (AC: #1)
  - [x] Added `@keyframes score-float` (translateY + opacity) to app.css
  - [x] ScoreBoard.svelte renders float elements with 600ms animation, auto-removed after completion

- [x] Task 2: Track score delta in App.svelte (AC: #2)
  - [x] Added `scoreDelta` state, computed as `newState.score - gameState.score` before state update
  - [x] Passed `scoreDelta` prop to ScoreBoard

- [x] Task 3: Reduced motion support (AC: #3)
  - [x] Already handled by `@media (prefers-reduced-motion)` rule from Story 3.1

- [x] Task 4: Verify all tests pass
  - [x] 59 tests passing, no regressions

## Dev Agent Record

### Agent Model Used
Claude Opus 4.6 (1M context)

### Completion Notes List
- Added @keyframes score-float to app.css
- ScoreBoard.svelte: added scoreDelta prop, float element array with auto-cleanup via setTimeout
- App.svelte: computes scoreDelta before updating gameState, passes to ScoreBoard
- Each float gets unique ID for Svelte keyed rendering, removed after 600ms

### File List
- src/app.css (modified — @keyframes score-float)
- src/components/ScoreBoard.svelte (modified — scoreDelta prop, float rendering)
- src/App.svelte (modified — scoreDelta tracking and prop)
