# Story 4.3: Responsive Layout

Status: done

## Story

As a mobile player,
I want the game to fit my phone screen,
so that the board is fully visible and playable on smaller devices.

## Acceptance Criteria

1. Given the viewport width is greater than 520px, when the page renders, then the game container is 500px wide, grid cells are ~106px, grid gap is 15px, grid padding is 15px
2. Given the viewport width is 520px or less, when the page renders, then the game container scales to 280px wide, grid cells scale to ~57px, grid gap reduces to 10px, grid padding reduces to 10px (UX-DR10)
3. Given the mobile breakpoint is active, when text elements render, then title scales to 45px, tile fonts scale proportionally (1-digit: 30px, 2-digit: 25px, 3-digit: 20px, 4-digit: 14px), score value to 16px, overlay message to 35px (UX-DR11)
4. Given buttons on mobile, when they render, then all interactive buttons maintain minimum 44x44px touch target (UX-DR18)
5. Given any viewport size, when the game container renders, then it is horizontally centered with max-width: 500px and margin: auto

## Tasks / Subtasks

- [x] Task 1: Add CSS custom properties and media query to app.css (AC: #1, #2)
  - [x] Define desktop CSS variables on `:root`: --grid-gap, --cell-size, --container-size, --grid-padding, --title-size, --score-value-size, --overlay-msg-size, --tile-font-1 through --tile-font-5
  - [x] Add `@media (max-width: 520px)` block overriding all variables for mobile dimensions
  - [x] Desktop container-size = 500px; Mobile container-size = 280px
- [x] Task 2: Update Grid.svelte to use CSS variables (AC: #1, #2)
  - [x] Removed hardcoded GAP, CELL_SIZE, CONTAINER_SIZE constants
  - [x] Uses var(--container-size), var(--grid-gap), var(--grid-padding), var(--cell-size)
  - [x] Empty cell placeholders use calc() with CSS variables for absolute positioning
- [x] Task 3: Update Tile.svelte to use CSS variables and responsive font sizes (AC: #1, #2, #3)
  - [x] Removed hardcoded GAP, CELL_SIZE constants
  - [x] Uses var(--cell-size) for width/height
  - [x] Tile position via calc() with var(--cell-size) and var(--grid-gap)
  - [x] Dynamic font sizing: digitCount derived from String(value).length, maps to var(--tile-font-N)
  - [x] Desktop: 55/45/35/25/15px; Mobile: 30/25/20/14/10px via CSS variables
- [x] Task 4: Update App.svelte for responsive title and layout (AC: #3, #5)
  - [x] Title uses var(--title-size): desktop 80px, mobile 45px
  - [x] Container is max-w-[500px] mx-auto (verified, already present)
- [x] Task 5: Update ScoreBoard.svelte for responsive font sizes (AC: #3)
  - [x] Score and best score values use var(--score-value-size): desktop 25px, mobile 16px
  - [x] Score label stays 13px on both (unchanged)
- [x] Task 6: Update GameMessage.svelte for responsive overlay text (AC: #3)
  - [x] Overlay message uses var(--overlay-msg-size): desktop 60px, mobile 35px
  - [x] Buttons already have min-h-[44px] for touch targets (AC: #4)
- [x] Task 7: Verify all tests pass and no regressions (AC: #1-#5)
  - [x] All 90 tests pass across 4 test files, zero regressions
  - [x] Production build succeeds: 22KB gzipped (well under 50KB limit)
  - [x] Note: Visual verification requires browser testing at different viewport widths

## Dev Notes

### Implementation Strategy: CSS Custom Properties

Using CSS custom properties (CSS variables) defined on `:root` with a `@media (max-width: 520px)` override. This is the cleanest approach because:
1. Grid and Tile components use the same variables — no prop drilling needed
2. CSS handles the breakpoint — no JS resize listeners
3. Works with Tailwind — just add to app.css alongside existing `@keyframes`
4. Svelte components reference variables in inline styles

### Current Component Dimensions (Desktop — MUST NOT CHANGE)

- Grid: `GAP=15`, `CELL_SIZE=106.25`, container = `500px`
- Tile: `GAP=15`, `CELL_SIZE=106.25`, `font-size: 55px`
- ScoreBoard: label 13px, value 25px
- GameMessage: message 60px
- App title: 80px

### Mobile Dimensions (≤520px)

Per UX-DR10 and UX-DR11:
- Grid: `GAP=10`, `CELL_SIZE=57.5`, container = `280px`
- Tile fonts: 1-digit 30px, 2-digit 25px, 3-digit 20px, 4-digit 14px
- Score value: 16px
- Overlay message: 35px
- Title: 45px

### CSS Variables to Define in app.css

```css
:root {
  --grid-gap: 15px;
  --grid-padding: 15px;
  --cell-size: 106.25px;
  --container-size: 500px;
  --title-size: 80px;
  --score-value-size: 25px;
  --overlay-msg-size: 60px;
  --tile-font-1: 55px;
  --tile-font-2: 45px;
  --tile-font-3: 35px;
  --tile-font-4: 25px;
  --tile-font-5: 15px;
}

@media (max-width: 520px) {
  :root {
    --grid-gap: 10px;
    --grid-padding: 10px;
    --cell-size: 57.5px;
    --container-size: 280px;
    --title-size: 45px;
    --score-value-size: 16px;
    --overlay-msg-size: 35px;
    --tile-font-1: 30px;
    --tile-font-2: 25px;
    --tile-font-3: 20px;
    --tile-font-4: 14px;
    --tile-font-5: 10px;
  }
}
```

### Tile Font Size Logic

In Tile.svelte, derive font size from digit count:
```javascript
let digitCount = $derived(String(value).length);
let fontSize = $derived(
  digitCount <= 1 ? 'var(--tile-font-1)' :
  digitCount === 2 ? 'var(--tile-font-2)' :
  digitCount === 3 ? 'var(--tile-font-3)' :
  digitCount === 4 ? 'var(--tile-font-4)' :
  'var(--tile-font-5)'
);
```

### Tile Position with CSS calc()

Replace hardcoded pixel calculations with:
```javascript
// In Tile.svelte — use template strings referencing CSS vars
let transformStyle = $derived(
  `translate(calc(${col} * (var(--cell-size) + var(--grid-gap))), calc(${row} * (var(--cell-size) + var(--grid-gap))))`
);
```

### Grid Empty Cells

Same pattern — use `calc()` with CSS variables for positioning empty cell placeholders.

### Previous Story Learnings

- Story 4.1/4.2: input-handler changes were clean, no component layout impact
- 90 tests passing across 4 test files
- Grid.svelte and Tile.svelte both duplicate GAP/CELL_SIZE constants — this story consolidates them into CSS variables

### Architecture Compliance

- CSS variables in app.css — consistent with existing @keyframes location
- No new JS libraries or resize listeners needed
- Props-down pattern preserved — components still receive data via props
- Tailwind utilities still used for flex/layout — CSS variables only for dimension values

### FRs Covered

- FR28: Responsive layout (520px breakpoint)

### References

- [Source: _bmad-output/planning-artifacts/epics.md — Epic 4, Story 4.3]
- [Source: _bmad-output/planning-artifacts/architecture.md — Frontend Architecture, responsive at 520px]
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md — UX-DR10, UX-DR11, UX-DR18]
- [Source: src/components/Grid.svelte — current hardcoded dimensions]
- [Source: src/components/Tile.svelte — current hardcoded dimensions and font]
- [Source: src/app.css — existing @keyframes and media query location]

## Dev Agent Record

### Agent Model Used
Claude Opus 4.6 (1M context)

### Debug Log References

### Completion Notes List
- Defined 13 CSS custom properties on :root with @media (max-width: 520px) override in app.css
- Replaced all hardcoded pixel dimensions in Grid.svelte and Tile.svelte with CSS var() + calc()
- Added dynamic tile font sizing in Tile.svelte based on digit count (1-5+ digits)
- Updated App.svelte title, ScoreBoard.svelte score values, GameMessage.svelte message text to use CSS variables
- All responsive values match UX-DR10 (dimensions) and UX-DR11 (font scaling) exactly
- All 90 tests pass, production build 22KB gzipped
- Note: Cannot run browser visual verification in this environment — requires manual testing at ≤520px

### File List
- src/app.css (modified — added :root CSS variables and @media responsive override)
- src/components/Grid.svelte (modified — replaced hardcoded dims with CSS variables)
- src/components/Tile.svelte (modified — CSS variables for dims, dynamic font sizing)
- src/App.svelte (modified — responsive title size via CSS variable)
- src/components/ScoreBoard.svelte (modified — responsive score value font size)
- src/components/GameMessage.svelte (modified — responsive overlay message font size)
