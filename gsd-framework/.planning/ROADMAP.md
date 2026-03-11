# Roadmap: Pikachu Match

## Overview

Build a minimal, playable tile-matching puzzle game where players connect matching Pokemon tiles using paths with 3 or fewer straight lines. The journey starts with project foundation and game loop, builds up through grid rendering and input handling, implements the core path-finding algorithm, adds game state management and win/lose detection, ensures solvable boards with shuffle recovery, and finishes with visual polish for a smooth player experience.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [x] **Phase 1: Core Foundation** - Project setup, game loop, event system, and basic types
- [x] **Phase 2: Grid and Input** - Rendered game board with clickable tiles
- [x] **Phase 3: Core Matching Mechanics** - Path-finding algorithm and tile matching (completed 2026-03-11)
- [ ] **Phase 4: Game State Management** - Win/lose detection and score tracking
- [ ] **Phase 5: Board Generation and Recovery** - Solvable boards and shuffle feature
- [ ] **Phase 6: Polish and UX** - Animations, mobile touch, and responsive design

## Phase Details

### Phase 1: Core Foundation
**Goal**: Establish the project structure and fundamental architecture patterns that all other components build upon
**Depends on**: Nothing (first phase)
**Requirements**: CORE-01
**Success Criteria** (what must be TRUE):
  1. Developer can run `npm run dev` and see a blank Canvas with a colored background
  2. Game loop runs at 60fps using requestAnimationFrame with delta time tracking
  3. Event system allows components to subscribe to and emit typed events
  4. Basic Tile model exists with properties for id, type, position, and cleared state
**Plans**: 3 plans

Plans:
- [x] 01-01-PLAN.md — Project scaffolding with Vite + TypeScript + Canvas, config constants, and shared types
- [x] 01-02-PLAN.md — Game loop with delta time, typed event emitter, and Tile model class
- [x] 01-03-PLAN.md — Game orchestrator class, main entry point, and human verification

### Phase 2: Grid and Input
**Goal**: Players can see a grid of Pokemon tiles and interact with them via mouse and touch
**Depends on**: Phase 1
**Requirements**: CORE-02, CORE-03
**Success Criteria** (what must be TRUE):
  1. Player sees a grid of colorful tiles arranged in rows and columns on screen
  2. Player can click or tap a tile to select it (tile shows visual highlight)
  3. Player can click or tap a second tile to attempt a match (both tiles highlighted)
  4. Grid scales appropriately for different screen sizes (desktop and mobile)
**Plans**: 3 plans

Plans:
- [x] 02-01-PLAN.md — Grid manager with 2D tile array and selection state management
- [x] 02-02-PLAN.md — Canvas renderer for drawing tiles and selection highlights with fade-in animations
- [x] 02-03-PLAN.md — Input handler for mouse and touch events with coordinate-to-tile mapping

### Phase 3: Core Matching Mechanics
**Goal**: Players can match and clear tiles by connecting them with valid paths (3 or fewer straight lines)
**Depends on**: Phase 2
**Requirements**: CORE-04, CORE-05, CORE-06, CORE-07, BOARD-02
**Success Criteria** (what must be TRUE):
  1. Two matching tiles disappear when connected by a valid path (0, 1, or 2 turns)
  2. Match fails with visual feedback when tiles do not match or path requires more than 2 turns
  3. Player sees score increase immediately after successful match
  4. Cleared tiles become empty space that allows paths to pass through
  5. Player can continue matching remaining tiles after each successful match
**Plans**: 3 plans

Plans:
- [x] 03-01-PLAN.md — Path-finding algorithm with 3-line constraint (BFS with turn counting)
- [x] 03-02-PLAN.md — Match engine and scoring system (validation pipeline + score display)
- [x] 03-03-PLAN.md — Visual feedback for matches (success and failure shake animations)

### Phase 4: Game State Management
**Goal**: Game detects and responds to win condition and no-moves state appropriately
**Depends on**: Phase 3
**Requirements**: CORE-08, CORE-09
**Success Criteria** (what must be TRUE):
  1. Player sees win message when all tiles are cleared from the board
  2. Game detects when no valid moves remain and notifies the player
  3. Game state machine handles transitions between idle, selected, matching, and game over states
  4. Player can restart the game after win or game over
**Plans**: 3 plans

Plans:
- [x] 04-01-PLAN.md — State machine with game states (IDLE, SELECTING, MATCHING, GAME_OVER) and transition validation
- [ ] 04-02-PLAN.md — Win/lose detection with game over overlay and no-moves detector
- [ ] 04-03-PLAN.md — Restart functionality with full game state reset

### Phase 5: Board Generation and Recovery
**Goal**: Game generates solvable boards and provides shuffle when stuck
**Depends on**: Phase 4
**Requirements**: BOARD-01
**Success Criteria** (what must be TRUE):
  1. New game starts with a board that is guaranteed to be solvable
  2. Player can trigger shuffle when no moves are available
  3. Shuffle redistributes remaining tiles while preserving pairs
  4. Player sees shuffle button or prompt when stuck with no valid moves
**Plans**: TBD

Plans:
- [ ] 05-01: Board generation with solvability validation
- [ ] 05-02: Shuffle utility for redistributing tiles
- [ ] 05-03: No-moves prompt and shuffle trigger

### Phase 6: Polish and UX
**Goal**: Game feels smooth and responsive with satisfying visual feedback on all devices
**Depends on**: Phase 5
**Requirements**: UX-01, UX-02, UX-03
**Success Criteria** (what must be TRUE):
  1. Matched tiles animate smoothly before disappearing (scale, fade, or similar effect)
  2. Game responds accurately to touch input on mobile devices without lag
  3. Grid layout adapts responsively to phone and desktop screen sizes
  4. Connection path is drawn visually when a match succeeds
**Plans**: TBD

Plans:
- [ ] 06-01: Tile match animations and visual effects
- [ ] 06-02: Connection path visualization
- [ ] 06-03: Mobile touch optimization
- [ ] 06-04: Responsive grid layout refinements

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3 → 4 → 5 → 6

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Core Foundation | 3/3 | Complete | 01-01, 01-02, 01-03 |
| 2. Grid and Input | 3/3 | Complete | 02-01, 02-02, 02-03 |
| 3. Core Matching Mechanics | 3/3 | Complete   | 2026-03-11 |
| 4. Game State Management | 3/5 | In Progress|  |
| 5. Board Generation and Recovery | 0/3 | Not started | - |
| 6. Polish and UX | 0/4 | Not started | - |

---
*Roadmap created: 2026-03-10*
*Granularity: standard*
*Last updated: 2026-03-11 after Phase 4 planning*
