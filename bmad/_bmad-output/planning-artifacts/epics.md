---
stepsCompleted: ['step-01-validate-prerequisites', 'step-02-design-epics', 'step-03-create-stories', 'step-04-final-validation']
inputDocuments:
  - '_bmad-output/planning-artifacts/prd.md'
  - '_bmad-output/planning-artifacts/architecture.md'
  - '_bmad-output/planning-artifacts/ux-design-specification.md'
---

# try-bmad - Epic Breakdown

## Overview

This document provides the complete epic and story breakdown for try-bmad (2048 Clone), decomposing the requirements from the PRD, UX Design, and Architecture into implementable stories.

## Requirements Inventory

### Functional Requirements

FR1: Render a 4x4 grid with empty cell placeholders using Svelte components
FR2: Spawn 2 random tiles on game initialization
FR3: Spawn 1 random tile after each valid move with 90/10 probability split (value 2 vs value 4)
FR4: Slide all movable tiles in the input direction (up, down, left, right)
FR5: Merge identical adjacent tiles in the movement path using leading-edge merge order
FR6: Enforce once-per-move merge rule (a tile can only merge once per move)
FR7: Track and display current score, incrementing by the value of each merged tile
FR8: Track and display best score, updating when current score exceeds it
FR9: Persist best score across sessions using localStorage
FR10: Detect game over condition (no valid moves remaining on a full board)
FR11: Detect win condition (2048 tile created) and display win overlay (trigger once per game)
FR12: Provide "Keep playing" mode after winning, allowing continued play past 2048
FR13: Provide New Game button to restart the game (no confirmation dialog)
FR14: Accept keyboard input: arrow keys for directional movement
FR15: Accept keyboard input: WASD keys for directional movement
FR16: Accept keyboard input: Vim hjkl keys for directional movement
FR17: Accept touch/swipe input for mobile with 10px minimum threshold and dominant-axis detection
FR18: Display tile colors matching original 2048 12-tier color system based on tile value
FR19: Animate tile sliding with 100ms CSS transition (ease-in-out)
FR20: Animate new tile spawn with 200ms pop animation (scale 0 to 1.0)
FR21: Animate tile merge with 200ms bounce animation (scale 1.0 to 1.2 to 1.0)
FR22: Animate score addition with "+N" float animation (600ms, rises and fades)
FR23: Persist full game state to localStorage after every valid move (survive page refresh)
FR24: Restore game state from localStorage on page load
FR25: Display game over overlay with "Try again" button
FR26: Display win overlay with "Keep going" and "New Game" buttons
FR27: Fade in win/game-over overlays with 800ms opacity transition
FR28: Render responsive layout: 500px container on desktop, 280px on mobile at 520px breakpoint
FR29: Display tile glow effect (box-shadow) on tiles with value 128 or higher
FR30: Apply dynamic font sizing on tiles based on digit count (55/45/35/25/15px)
FR31: Deploy as static site to GitHub Pages via GitHub Actions workflow

### NonFunctional Requirements

NFR1: Initial page load under 1 second (small Svelte + Tailwind bundle)
NFR2: All CSS animations at 60fps framerate
NFR3: Input-to-visual-response latency under 16ms
NFR4: Production bundle size under 50KB gzipped
NFR5: Support modern evergreen browsers: Chrome, Firefox, Safari, Edge (latest versions)
NFR6: WCAG AA accessibility compliance for color contrast and keyboard navigation
NFR7: Respect prefers-reduced-motion media query (disable animations when active)
NFR8: No backend, no server communication — fully client-side application
NFR9: Game logic implemented as pure JavaScript functions, testable independently from UI

### Additional Requirements

- Starter template: `npm create vite@latest` with Svelte template + Tailwind CSS v4 via `@tailwindcss/vite` plugin + Vitest for unit testing
- Project structure: `src/lib/` for pure JS game logic (zero Svelte imports), `src/components/` for Svelte UI components
- Game logic module returns immutable new state objects — never mutates input
- Props-down component architecture: App.svelte owns all state, children are presentational
- No Svelte stores — props and callback props only
- localStorage schema: `gameState` key (grid, score, won, keepPlaying) + `bestScore` key
- CSS transitions for all animations — no JS setTimeout for animation sequencing
- Use `transitionend` events for animation coordination
- `isAnimating` flag prevents input processing during slide transition with input queuing
- GitHub Actions workflow for automated build and deploy to gh-pages branch
- Vite `base` config set to repo name for correct GitHub Pages asset paths
- Clear Sans font file (woff2) in `public/fonts/` with fallback chain
- Constants module (`constants.js`) for GRID_SIZE, WIN_VALUE, SPAWN_PROBABILITY, DIRECTIONS, TILE_COLORS

### UX Design Requirements

UX-DR1: Implement 12-tier tile color system with exact hex values (2:#eee4da, 4:#ede0c8, 8:#f2b179, 16:#f59563, 32:#f67c5f, 64:#f65e3b, 128:#edcf72, 256:#edcc61, 512:#edc850, 1024:#edc53f, 2048:#edc22e, 4096+:#3c3a32)
UX-DR2: Implement text color switching — dark text (#776e65) for tiles 2 and 4, white text (#f9f6f2) for tiles 8 and above
UX-DR3: Apply page background #faf8ef, grid background #bbada0, empty cell color #cdc1b4
UX-DR4: Implement Clear Sans font family with fallback chain (Helvetica Neue, Arial, sans-serif)
UX-DR5: Implement dynamic tile font sizing by digit count — 1 digit: 55px, 2 digits: 45px, 3 digits: 35px, 4 digits: 25px, 5+ digits: 15px (bold)
UX-DR6: Implement glow effect on 128+ tiles: box-shadow 0 0 30px 10px rgba(243, 215, 116, 0.4)
UX-DR7: Implement score box styling — background #bbada0, label #eee4da 13px uppercase, value #f9f6f2 25px bold
UX-DR8: Implement button styling — background #8f7a66, text #f9f6f2, 18px bold, hover lighten 10%, active darken 5%
UX-DR9: Implement game title at 80px bold in #776e65
UX-DR10: Implement responsive breakpoint at 520px — scale container from 500px to 280px, grid gap from 15px to 10px, tile fonts proportionally reduced
UX-DR11: Implement mobile font scaling — title 45px, tile 1-digit 30px, 2-digit 25px, 3-digit 20px, 4-digit 14px, score 16px, overlay 35px
UX-DR12: Implement ARIA roles — role="application" on game container, role="grid" on board, role="gridcell" on tiles, role="alertdialog" on overlays
UX-DR13: Implement aria-live="polite" on score display for screen reader announcements
UX-DR14: Implement focus management — auto-focus action button on overlay appear, trap focus within overlay, restore focus on dismiss
UX-DR15: Implement keyboard navigation — Tab to New Game button, Enter to activate buttons, visible focus indicator
UX-DR16: Implement overlay patterns — game over: rgba(238, 228, 218, 0.73) background, win: rgba(237, 194, 46, 0.5) background
UX-DR17: Implement non-blocking animation system — input queuing during transitions, moves execute after current animation completes
UX-DR18: Implement touch targets minimum 44x44px for New Game button and overlay action buttons
UX-DR19: Implement zero-chrome layout — grid as dominant element, header holds only title + scores + new game button
UX-DR20: Implement semantic HTML — use main, header, button elements (no divs-as-buttons)

### FR Coverage Map

| FR | Epic | Description |
|----|------|-------------|
| FR1 | Epic 1 | 4x4 grid rendering |
| FR2 | Epic 1 | Spawn 2 tiles at start |
| FR3 | Epic 1 | Spawn 1 tile per move (90/10) |
| FR4 | Epic 1 | Slide tiles in 4 directions |
| FR5 | Epic 1 | Leading-edge merge order |
| FR6 | Epic 1 | Once-per-move merge rule |
| FR7 | Epic 1 | Current score tracking |
| FR8 | Epic 2 | Best score display |
| FR9 | Epic 2 | Best score localStorage persistence |
| FR10 | Epic 1 | Game over detection |
| FR11 | Epic 1 | Win detection + overlay |
| FR12 | Epic 2 | Keep playing mode |
| FR13 | Epic 1 | New Game button |
| FR14 | Epic 1 | Arrow key input |
| FR15 | Epic 4 | WASD key input |
| FR16 | Epic 4 | Vim hjkl key input |
| FR17 | Epic 4 | Touch/swipe input |
| FR18 | Epic 1 | 12-tier tile colors |
| FR19 | Epic 3 | Slide animation (100ms) |
| FR20 | Epic 3 | Spawn pop animation (200ms) |
| FR21 | Epic 3 | Merge bounce animation (200ms) |
| FR22 | Epic 3 | Score float animation (600ms) |
| FR23 | Epic 2 | Game state persistence |
| FR24 | Epic 2 | Game state restore on load |
| FR25 | Epic 1 | Game over overlay |
| FR26 | Epic 1 | Win overlay |
| FR27 | Epic 3 | Overlay fade animation (800ms) |
| FR28 | Epic 4 | Responsive layout (520px breakpoint) |
| FR29 | Epic 5 | Tile glow on 128+ |
| FR30 | Epic 5 | Dynamic font sizing |
| FR31 | Epic 5 | GitHub Pages deployment |

## Epic List

### Epic 1: Play a Complete Game (Desktop)
Player can play 2048 from start to finish — slide tiles, merge numbers, track score, win or lose, and restart. Includes project scaffold as first story.
**FRs covered:** FR1, FR2, FR3, FR4, FR5, FR6, FR7, FR10, FR11, FR13, FR14, FR18, FR25, FR26

### Epic 2: Save Progress & Keep Playing
Player's game survives page refresh, best score persists across sessions, and they can continue playing past 2048.
**FRs covered:** FR8, FR9, FR12, FR23, FR24

### Epic 3: Smooth Animations & Game Feel
Every interaction feels satisfying with smooth slide, merge, spawn, score, and overlay animations matching original 2048 timings.
**FRs covered:** FR19, FR20, FR21, FR22, FR27

### Epic 4: Mobile & Multi-Input Support
Game is fully playable on mobile with touch/swipe and responsive layout, plus WASD and Vim key support on desktop.
**FRs covered:** FR15, FR16, FR17, FR28

### Epic 5: Visual Polish & Deployment
Final visual refinements (glow effects, dynamic font sizing) and public deployment to GitHub Pages.
**FRs covered:** FR29, FR30, FR31

## Epic 1: Play a Complete Game (Desktop)

Player can play 2048 from start to finish — slide tiles, merge numbers, track score, win or lose, and restart. Includes project scaffold as first story.

### Story 1.1: Project Scaffold & Dev Environment

As a developer,
I want a properly configured Svelte + Tailwind + Vite project with the correct folder structure,
So that all subsequent stories have a solid foundation to build on.

**Acceptance Criteria:**

**Given** no project exists
**When** the scaffold is created using `npm create vite@latest` with the Svelte template
**Then** the project builds and runs with `npm run dev`
**And** Tailwind CSS v4 is installed via `@tailwindcss/vite` plugin and `@import "tailwindcss"` works in `app.css`
**And** Vitest is installed as a dev dependency and `npx vitest` runs without error
**And** the folder structure matches Architecture: `src/lib/`, `src/components/`, `public/fonts/`
**And** `src/lib/constants.js` exists with GRID_SIZE (4), WIN_VALUE (2048), SPAWN_PROBABILITY (0.9), DIRECTIONS, and TILE_COLORS (12-tier hex values)
**And** Clear Sans font is placed in `public/fonts/` with `@font-face` declaration in `app.css`
**And** page background is set to `#faf8ef`

### Story 1.2: Game Logic Module

As a developer,
I want a pure JavaScript game logic module with complete unit tests,
So that all game mechanics are correct and independently testable before connecting to the UI.

**Acceptance Criteria:**

**Given** the constants module exists
**When** `initGame()` is called
**Then** it returns a game state with a 4x4 grid (2D array of zeros) with exactly 2 random tiles placed (90% chance value 2, 10% chance value 4)
**And** score is 0, won is false, keepPlaying is false

**Given** a valid game state
**When** `move(state, direction)` is called with a direction (up/down/left/right)
**Then** it returns a new state object (never mutates input) with tiles slid to the leading edge
**And** identical adjacent tiles in the movement path merge using leading-edge order
**And** each tile merges at most once per move (once-per-move rule enforced)
**And** score delta equals the sum of all merged tile values
**And** one new random tile (90/10 split) is added to a random empty cell

**Given** a game state where no tiles can move in the requested direction
**When** `move(state, direction)` is called
**Then** the original state is returned unchanged (no new tile spawned)

**Given** a game state
**When** `isGameOver(state)` is called
**Then** it returns true only when the board is full AND no adjacent tiles share the same value

**Given** a game state
**When** a merge creates a tile with value 2048
**Then** the won flag is set to true in the returned state

**And** all functions have passing Vitest unit tests covering edge cases (full board, corner merges, chain prevention)

### Story 1.3: Game Board & Tile Rendering

As a player,
I want to see a 4x4 game grid with colored numbered tiles,
So that I can visually understand the game state.

**Acceptance Criteria:**

**Given** the app loads
**When** the Grid component renders
**Then** a 4x4 grid with `#bbada0` background and 16 empty cell placeholders (`#cdc1b4`) is displayed
**And** the grid has `15px` gap and `15px` padding with `6px` border radius
**And** the grid container is `500px` wide and centered on the page

**Given** a game state with tiles
**When** the Tile component renders for each tile
**Then** each tile displays its numeric value centered in the cell
**And** tile background color matches the 12-tier color system (UX-DR1)
**And** text color is `#776e65` for values 2 and 4, `#f9f6f2` for values 8+ (UX-DR2)
**And** font family is Clear Sans with fallback chain (UX-DR4)
**And** tiles have `role="gridcell"` and `aria-label` with tile value (UX-DR12)
**And** the grid has `role="grid"` and `aria-label="Game board"` (UX-DR12)

### Story 1.4: Game Header, Score Display & New Game Button

As a player,
I want to see the game title, my current score, and a New Game button,
So that I can track my progress and restart anytime.

**Acceptance Criteria:**

**Given** the app loads
**When** the header renders
**Then** the game title "2048" is displayed at `80px` bold in `#776e65` (UX-DR9)
**And** a subtitle row shows "Join the numbers and get to the 2048 tile!" with the New Game button right-aligned
**And** the layout follows zero-chrome design — header holds only title + scores + new game (UX-DR19)
**And** semantic HTML is used: `<header>`, `<main>`, `<button>` elements (UX-DR20)

**Given** a ScoreBoard component
**When** it renders with score and bestScore props
**Then** two side-by-side boxes display "SCORE" and "BEST" labels (13px uppercase, `#eee4da`) with numeric values (`25px` bold, `#f9f6f2`) on `#bbada0` background (UX-DR7)
**And** score display has `aria-live="polite"` for screen reader updates (UX-DR13)

**Given** the New Game button
**When** it renders
**Then** it has `#8f7a66` background, `#f9f6f2` text, `18px` bold styling (UX-DR8)
**And** it has a visible focus indicator and is reachable via Tab key (UX-DR15)
**And** the button has minimum `44x44px` touch target (UX-DR18)

**Given** the player clicks New Game
**When** the click event fires
**Then** the game resets to a fresh state with 2 random tiles and score 0 (no confirmation dialog) (FR13)

### Story 1.5: Keyboard Input & Interactive Gameplay

As a player,
I want to press arrow keys to slide tiles and play the game interactively,
So that I can experience the core 2048 gameplay loop.

**Acceptance Criteria:**

**Given** the game is in playing state
**When** the player presses an arrow key (Up/Down/Left/Right)
**Then** the game logic `move()` is called with the corresponding direction
**And** the UI updates to reflect the new game state (tiles at new positions, new tile spawned)
**And** the current score updates to reflect any merges

**Given** the player presses an arrow key in a direction where no tiles can move
**When** the move is processed
**Then** no state change occurs, no new tile is spawned

**Given** the game container
**When** it renders
**Then** it has `role="application"` for game-specific keyboard behavior (UX-DR12)
**And** keyboard events are captured on the window

**Given** the input handler module (`input-handler.js`)
**When** a keyboard event fires
**Then** it translates the raw event to a direction string and passes it to the game logic
**And** non-game keys are ignored

### Story 1.6: Win & Game Over Overlays

As a player,
I want to see a clear message when I win or lose, with options to continue or restart,
So that I know the game outcome and can take my next action.

**Acceptance Criteria:**

**Given** the game detects no valid moves remaining (game over)
**When** the game over state is triggered
**Then** a GameMessage overlay appears over the grid with "Game over!" text
**And** the overlay background is `rgba(238, 228, 218, 0.73)` (UX-DR16)
**And** a "Try again" button is displayed (UX-DR8 styling)
**And** the overlay has `role="alertdialog"` and `aria-modal="true"` (UX-DR12)
**And** focus auto-moves to the "Try again" button (UX-DR14)

**Given** a merge creates the 2048 tile for the first time in this game
**When** the win state is triggered
**Then** a GameMessage overlay appears with "You win!" text
**And** the overlay background is `rgba(237, 194, 46, 0.5)` (UX-DR16)
**And** "Keep going" and "New Game" buttons are displayed
**And** focus auto-moves to the primary action button (UX-DR14)

**Given** the player clicks "Try again" or "New Game" on an overlay
**When** the click fires
**Then** the game resets to a fresh state (FR13)

**Given** the player clicks "Keep going" on the win overlay
**When** the click fires
**Then** the overlay dismisses and gameplay continues (win overlay will not trigger again this game)

## Epic 2: Save Progress & Keep Playing

Player's game survives page refresh, best score persists across sessions, and they can continue playing past 2048.

### Story 2.1: Best Score Tracking

As a player,
I want to see my best score alongside my current score,
So that I have a motivational anchor and can track my all-time progress.

**Acceptance Criteria:**

**Given** the game is running
**When** the current score exceeds the best score after a merge
**Then** the best score display updates immediately to match the current score

**Given** the player starts a new game
**When** the game resets
**Then** the best score remains unchanged (it persists across games within the session)

### Story 2.2: Game State Persistence

As a player,
I want my in-progress game to survive a page refresh,
So that I never lose my progress unexpectedly.

**Acceptance Criteria:**

**Given** the player makes a valid move
**When** the game state updates
**Then** the full game state is saved to localStorage under the `gameState` key as JSON: `{ grid, score, won, keepPlaying }`
**And** the best score is saved separately under the `bestScore` key as a single number

**Given** the player opens the app and a saved `gameState` exists in localStorage
**When** the app initializes
**Then** the game restores the saved grid, score, won, and keepPlaying values
**And** the best score is restored from the `bestScore` key
**And** the player sees their previous board state with no loading indicator (silent restore)

**Given** the player opens the app and no saved game exists (or localStorage data is corrupted)
**When** the app initializes
**Then** a fresh game starts with 2 random tiles and score 0 (silent recovery, no error shown)

**Given** the `storage.js` module
**When** `JSON.parse` fails on corrupted localStorage data
**Then** it catches the error silently and returns null (triggering fresh game start)

**Given** the player clicks New Game
**When** the game resets
**Then** the `gameState` key in localStorage is cleared
**And** the `bestScore` key is preserved

### Story 2.3: Keep Playing Mode

As a player,
I want to continue playing after reaching 2048,
So that I can push for higher tiles and a bigger score.

**Acceptance Criteria:**

**Given** the player has won and clicked "Keep going"
**When** gameplay resumes
**Then** the `keepPlaying` flag is set to true in game state
**And** subsequent merges creating 2048+ tiles do not trigger the win overlay again

**Given** the player is in keep-playing mode and closes the browser
**When** they reopen the app
**Then** the game restores with `keepPlaying: true` and no win overlay appears

**Given** the player is in keep-playing mode
**When** no valid moves remain
**Then** the game over overlay appears normally

## Epic 3: Smooth Animations & Game Feel

Every interaction feels satisfying with smooth slide, merge, spawn, score, and overlay animations matching original 2048 timings.

### Story 3.1: Tile Slide Animation

As a player,
I want tiles to slide smoothly to their new positions,
So that the game feels responsive and I can visually track tile movement.

**Acceptance Criteria:**

**Given** the player makes a valid move
**When** tiles change position
**Then** each tile animates from its old position to its new position using CSS `transform: translate` with a 100ms ease-in-out transition
**And** all movable tiles animate simultaneously
**And** the animation runs at 60fps (GPU-accelerated CSS transition)

**Given** an animation is in progress
**When** the player presses another arrow key
**Then** the input is queued and executes after the current animation completes (UX-DR17)
**And** the `isAnimating` flag prevents immediate processing

**Given** the user has `prefers-reduced-motion` enabled
**When** a move occurs
**Then** tiles appear instantly at their new positions with no transition

### Story 3.2: Tile Spawn Pop Animation

As a player,
I want new tiles to pop into existence,
So that I can easily spot where the new tile appeared.

**Acceptance Criteria:**

**Given** a new tile is spawned after a move
**When** the tile appears on the grid
**Then** it plays a pop animation scaling from 0 to 1.0 over 200ms using CSS `@keyframes`
**And** the pop animation begins after the slide animation completes (sequential: slide then spawn)

**Given** the user has `prefers-reduced-motion` enabled
**When** a new tile spawns
**Then** the tile appears instantly at full size with no animation

### Story 3.3: Tile Merge Bounce Animation

As a player,
I want merged tiles to bounce briefly,
So that I get satisfying visual feedback when tiles combine.

**Acceptance Criteria:**

**Given** two tiles merge during a move
**When** the merge occurs
**Then** the resulting tile plays a bounce animation scaling from 1.0 to 1.2 back to 1.0 over 200ms using CSS `@keyframes`
**And** the bounce animation can run concurrently with the score float animation

**Given** the user has `prefers-reduced-motion` enabled
**When** tiles merge
**Then** the merged tile appears at normal scale with no animation

### Story 3.4: Score Float Animation

As a player,
I want to see "+N" float up from the score when I earn points,
So that I feel the immediate reward of each merge.

**Acceptance Criteria:**

**Given** a merge occurs and the score increases
**When** the score updates
**Then** a "+N" text element appears near the score box (where N is the score delta)
**And** it animates upward and fades out over 600ms using CSS `@keyframes` (translate-y + opacity)
**And** the animation uses ease-out timing

**Given** multiple merges occur in a single move
**When** the score updates
**Then** a single "+N" float shows the total score delta for that move

**Given** the user has `prefers-reduced-motion` enabled
**When** the score updates
**Then** no float animation appears (score value still updates)

### Story 3.5: Win & Game Over Overlay Fade Animation

As a player,
I want win and game over overlays to fade in smoothly,
So that the transition feels polished rather than abrupt.

**Acceptance Criteria:**

**Given** the game reaches a win or game over state
**When** the overlay appears
**Then** it fades in with an 800ms opacity transition from 0 to 1
**And** the overlay uses `pointer-events: none` during fade-in, switching to `auto` when complete

**Given** the user has `prefers-reduced-motion` enabled
**When** a game-ending state triggers
**Then** the overlay appears instantly with no fade transition

## Epic 4: Mobile & Multi-Input Support

Game is fully playable on mobile with touch/swipe and responsive layout, plus WASD and Vim key support on desktop.

### Story 4.1: WASD & Vim Keyboard Support

As a desktop player,
I want to use WASD or Vim hjkl keys to control the game,
So that I can play with my preferred keyboard layout.

**Acceptance Criteria:**

**Given** the game is in playing state
**When** the player presses W/A/S/D keys
**Then** they map to Up/Left/Down/Right directions respectively and trigger a move

**Given** the game is in playing state
**When** the player presses h/j/k/l keys
**Then** they map to Left/Down/Up/Right directions respectively and trigger a move

**Given** the input handler
**When** any mapped key is pressed
**Then** it produces identical behavior to the corresponding arrow key (same game logic path)

### Story 4.2: Touch & Swipe Input

As a mobile player,
I want to swipe on the game board to slide tiles,
So that I can play the game naturally on a touchscreen.

**Acceptance Criteria:**

**Given** the player touches the game grid and swipes
**When** the swipe distance exceeds 10px minimum threshold
**Then** the dominant axis (larger delta between horizontal and vertical) determines the direction
**And** the corresponding move is executed

**Given** the player touches and lifts with less than 10px movement
**When** the touch event completes
**Then** no move is triggered (prevents accidental swipes)

**Given** a diagonal swipe
**When** the touch event completes
**Then** the axis with the larger delta wins (e.g., deltaX=30, deltaY=15 → horizontal → Left or Right based on sign)

**Given** an animation is in progress on mobile
**When** the player swipes again
**Then** the input is queued and executes after the current animation completes (same queuing as keyboard)

### Story 4.3: Responsive Layout

As a mobile player,
I want the game to fit my phone screen,
So that the board is fully visible and playable on smaller devices.

**Acceptance Criteria:**

**Given** the viewport width is greater than 520px
**When** the page renders
**Then** the game container is 500px wide, grid cells are ~106px, grid gap is 15px, grid padding is 15px

**Given** the viewport width is 520px or less
**When** the page renders
**Then** the game container scales to 280px wide, grid cells scale to ~57px, grid gap reduces to 10px, grid padding reduces to 10px (UX-DR10)

**Given** the mobile breakpoint is active
**When** text elements render
**Then** title scales to 45px, tile fonts scale proportionally (1-digit: 30px, 2-digit: 25px, 3-digit: 20px, 4-digit: 14px), score value to 16px, overlay message to 35px (UX-DR11)

**Given** buttons on mobile
**When** they render
**Then** all interactive buttons maintain minimum 44x44px touch target (UX-DR18)

**Given** any viewport size
**When** the game container renders
**Then** it is horizontally centered with `max-width: 500px` and `margin: auto`

## Epic 5: Visual Polish & Deployment

Final visual refinements (glow effects, dynamic font sizing) and public deployment to GitHub Pages.

### Story 5.1: Tile Glow Effects

As a player,
I want high-value tiles (128+) to glow,
So that I get visual feedback of my progress and milestone tiles feel special.

**Acceptance Criteria:**

**Given** a tile has a value of 128 or higher
**When** it renders on the grid
**Then** it displays a glow effect: `box-shadow: 0 0 30px 10px rgba(243, 215, 116, 0.4)` (UX-DR6)

**Given** a tile has a value below 128
**When** it renders on the grid
**Then** no glow effect is applied

**Given** a tile merges from 64+64 to 128
**When** the merge completes
**Then** the glow effect appears on the resulting tile

### Story 5.2: Dynamic Tile Font Sizing

As a player,
I want tile numbers to be clearly readable at any value,
So that I can always see tile values regardless of digit count.

**Acceptance Criteria:**

**Given** a tile with a 1-digit value (2, 4, 8)
**When** it renders
**Then** the font size is 55px bold (desktop) / 30px bold (mobile) (UX-DR5, UX-DR11)

**Given** a tile with a 2-digit value (16, 32, 64)
**When** it renders
**Then** the font size is 45px bold (desktop) / 25px bold (mobile)

**Given** a tile with a 3-digit value (128, 256, 512)
**When** it renders
**Then** the font size is 35px bold (desktop) / 20px bold (mobile)

**Given** a tile with a 4-digit value (1024, 2048, 4096, 8192)
**When** it renders
**Then** the font size is 25px bold (desktop) / 14px bold (mobile)

**Given** a tile with a 5+ digit value (16384, 32768, 65536)
**When** it renders
**Then** the font size is 15px bold (desktop) / proportionally scaled (mobile)

### Story 5.3: GitHub Pages Deployment

As a developer,
I want the game automatically deployed to GitHub Pages on push to main,
So that the game is publicly accessible without manual deployment steps.

**Acceptance Criteria:**

**Given** the Vite config
**When** the production build runs
**Then** the `base` option is set to the repository name for correct asset paths on GitHub Pages
**And** `npm run build` produces a `dist/` directory with the complete static site

**Given** a `.github/workflows/deploy.yml` workflow file
**When** code is pushed to the main branch
**Then** GitHub Actions runs `npm ci`, `npm run build`, and deploys the `dist/` directory to the `gh-pages` branch

**Given** the deployment completes
**When** a user visits the GitHub Pages URL
**Then** the game loads and is fully playable
**And** all assets (fonts, CSS, JS) load correctly via relative paths
**And** the production bundle is under 50KB gzipped (NFR4)
