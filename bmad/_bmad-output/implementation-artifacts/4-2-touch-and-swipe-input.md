# Story 4.2: Touch & Swipe Input

Status: done

## Story

As a mobile player,
I want to swipe on the game board to slide tiles,
so that I can play the game naturally on a touchscreen.

## Acceptance Criteria

1. Given the player touches the game grid and swipes, when the swipe distance exceeds 10px minimum threshold, then the dominant axis (larger delta between horizontal and vertical) determines the direction and the corresponding move is executed
2. Given the player touches and lifts with less than 10px movement, when the touch event completes, then no move is triggered (prevents accidental swipes)
3. Given a diagonal swipe, when the touch event completes, then the axis with the larger delta wins (e.g., deltaX=30, deltaY=15 → horizontal → Left or Right based on sign)
4. Given an animation is in progress on mobile, when the player swipes again, then the input is queued and executes after the current animation completes (same queuing as keyboard)

## Tasks / Subtasks

- [x] Task 1: Add swipe detection functions to input-handler.js (AC: #1, #2, #3)
  - [x] Export `getDirectionFromSwipe(startX, startY, endX, endY)` — returns direction string or null
  - [x] Implement 10px minimum threshold: if both |deltaX| and |deltaY| < 10, return null
  - [x] Implement dominant-axis detection: compare |deltaX| vs |deltaY|, use larger axis
  - [x] For horizontal: deltaX < 0 → LEFT, deltaX > 0 → RIGHT
  - [x] For vertical: deltaY < 0 → UP, deltaY > 0 → DOWN
- [x] Task 2: Add unit tests for swipe detection (AC: #1, #2, #3)
  - [x] Test swipe right (deltaX=50, deltaY=5) → 'right'
  - [x] Test swipe left (deltaX=-50, deltaY=5) → 'left'
  - [x] Test swipe up (deltaX=5, deltaY=-50) → 'up'
  - [x] Test swipe down (deltaX=5, deltaY=50) → 'down'
  - [x] Test below threshold (deltaX=3, deltaY=5) → null
  - [x] Test diagonal dominant axis (deltaX=30, deltaY=15) → 'right'
  - [x] Test exact threshold (deltaX=10, deltaY=0) → 'right'
  - [x] Test zero movement (0, 0) → null
- [x] Task 3: Wire touch events in App.svelte (AC: #1, #4)
  - [x] Import `getDirectionFromSwipe` from input-handler.js
  - [x] Add `handleTouchStart` — store start coordinates from event.touches[0]
  - [x] Add `handleTouchEnd` — compute direction via changedTouches[0], feed into executeMove with same animation queuing
  - [x] Attach ontouchstart and ontouchend on the game container div
  - [x] Call `event.preventDefault()` in touchend when a direction is detected to prevent scroll
- [x] Task 4: Verify no regressions (AC: #4)
  - [x] All 90 tests pass (was 80, +10 new swipe tests)
  - [x] Keyboard input unchanged — same handleKeydown path
  - [x] Animation queuing works for both keyboard and touch (same isAnimating/queuedDirection path in handleTouchEnd)

## Dev Notes

### Architecture Pattern

Per architecture doc, `input-handler.js` translates DOM events to direction strings — no game logic. Touch detection follows the same pattern as keyboard: pure functions that convert raw event data to a direction string.

The touch wiring in App.svelte follows the same pattern as keyboard:
1. `handleTouchStart` captures touch coordinates (like `handleKeydown` captures key)
2. `handleTouchEnd` computes direction via `getDirectionFromSwipe()` (like `getDirectionFromKey()`)
3. Same `isAnimating` check → queue or `executeMove(direction)` — identical pipeline

### Current input-handler.js exports

```javascript
export function getDirectionFromKey(key)  // existing — returns direction string or null
```

New exports to add:
```javascript
export function getDirectionFromSwipe(startX, startY, endX, endY)  // returns direction string or null
```

### App.svelte Touch Wiring

Touch handlers go on the game container div (the `<div class="relative">` at line 110):
```svelte
<div class="relative"
  ontouchstart={handleTouchStart}
  ontouchend={handleTouchEnd}
>
```

`handleTouchStart` and `handleTouchEnd` are defined in App.svelte's `<script>` block (not in input-handler.js) because they need access to component state (`isAnimating`, `queuedDirection`, `executeMove`). Only the pure direction calculation is in input-handler.js.

### Touch Event Details

- `TouchEvent.touches[0].clientX/clientY` for start position
- `TouchEvent.changedTouches[0].clientX/clientY` for end position (touches array is empty on touchend)
- Must use `changedTouches` in touchend, NOT `touches`
- `event.preventDefault()` in touchend to prevent page scroll on successful swipe

### Previous Story Learnings (4.1)

- input-handler.js pattern works well: pure functions, easy to test with Vitest
- Test file already exists at `src/lib/input-handler.test.js` — add new describe blocks for swipe tests
- 80 tests currently passing across 4 test files

### FRs Covered

- FR17: Touch/swipe input for mobile with 10px minimum threshold and dominant-axis detection

### References

- [Source: _bmad-output/planning-artifacts/epics.md — Epic 4, Story 4.2]
- [Source: _bmad-output/planning-artifacts/architecture.md — Input Processing pattern]
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md — UX-DR17 non-blocking animation, UX-DR18 touch targets]
- [Source: src/lib/input-handler.js — current implementation with keyboard mappings]
- [Source: src/App.svelte:42-88 — executeMove + handleKeydown + animation queuing]

## Dev Agent Record

### Agent Model Used
Claude Opus 4.6 (1M context)

### Debug Log References

### Completion Notes List
- Added `getDirectionFromSwipe()` to input-handler.js: 10px threshold, dominant-axis detection, returns direction or null
- Added 10 unit tests for swipe detection: 4 cardinal, 3 threshold, 3 dominant axis
- Wired handleTouchStart/handleTouchEnd in App.svelte on game container div
- Uses changedTouches[0] in touchend (not touches), preventDefault on valid swipe
- Touch input feeds into same executeMove + animation queuing pipeline as keyboard
- All 90 tests pass, zero regressions

### File List
- src/lib/input-handler.js (modified — added getDirectionFromSwipe export)
- src/lib/input-handler.test.js (modified — added 10 swipe detection tests)
- src/App.svelte (modified — added touch handlers, imported getDirectionFromSwipe)
