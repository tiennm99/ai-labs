# Project Research Summary

**Project:** Pikachu Match
**Domain:** Web-based tile-matching puzzle game (Onet Connect / Pikachu Kawai style)
**Researched:** 2026-03-10
**Confidence:** HIGH

## Executive Summary

Pikachu Match is a 2D tile-matching puzzle game where players connect matching Pokemon tiles using paths with no more than 3 straight lines (2 turns). This is a well-established genre with proven patterns - the core mechanic has been validated across dozens of successful implementations (Onet Connect, Pikachu Kawai, various mobile apps).

Research strongly recommends a minimal, vanilla approach: **Vite + TypeScript + HTML5 Canvas** with no game framework. The scope is small enough that Phaser or PixiJS would add unnecessary complexity and bundle size. The path-finding algorithm (3-line constraint) is the primary technical challenge - it requires careful implementation with exhaustive unit tests covering edge cases like boundary paths and paths through cleared tiles.

Key risks include incorrect path-finding logic (breaks game feel), unsolvable board generation (frustrates players), and dead-end detection failures (players get stuck). All three can be mitigated through proper algorithm design, comprehensive testing, and implementing the shuffle recovery feature from the start.

## Key Findings

### Recommended Stack

Use a minimal, framework-free approach optimized for fast development and tiny bundle size.

**Core technologies:**
- **Vite 7.3.x** (build tool & dev server) - Fastest HMR, minimal config, native TypeScript support
- **TypeScript 5.x** (type safety) - Prevents runtime errors in path-finding algorithm and game state
- **HTML5 Canvas** (2D rendering) - Native browser API, zero dependencies, direct pixel control for smooth animations
- **Vanilla JS/TS** (game logic) - No framework needed for this scope; keeping it framework-free reduces bundle size

**Target bundle size:** <10KB gzipped (vanilla approach)

**Avoid:** React/Vue/Svelte (DOM-based frameworks add unnecessary overhead for Canvas games), Phaser/PixiJS for v1 (add 80-250KB overhead, only needed if scope expands significantly), game engines like Unity/Godot (massive overkill for 2D tile puzzle)

### Expected Features

**Must have (table stakes):**
- Grid of paired tiles (even count, matched pairs) - Core mechanic
- Click-to-select two matching tiles - Standard interaction
- Path validation (max 3 straight lines / 2 turns) - Core rule
- Matched tiles disappear with animation - Visual feedback
- Score display - Performance tracking
- Timer with lose condition - Time pressure
- Win condition (board cleared) - Success state
- No moves detection + shuffle - Recovery mechanism
- Responsive grid (desktop + mobile) - Platform requirement

**Should have (competitive):**
- Hint system (limited uses) - Prevents frustration
- Visual connection preview - Helps learn rules
- Local high score (localStorage) - Persistence without backend
- Sound effects - Audio satisfaction
- Tutorial overlay for first-time players - Onboarding

**Defer (v2+):**
- Multiple tile themes - Visual variety
- Level progression with difficulty scaling - Long-term engagement
- Combo multipliers - Depth for skilled players
- Dark/light theme toggle - Accessibility
- Keyboard controls - Accessibility

### Architecture Approach

Follow a layered architecture with clear separation of concerns: Presentation Layer (Renderer, Animator, UI Overlay), Game Logic Layer (Game Loop, Input Handler, PathFinder, Grid Manager, Score System), State Layer (Idle, Selected, Matching, GameOver states), and Data Layer (Tile Model, Game State, Config).

**Major components:**
1. **Game Loop** - Orchestrates update/render cycle using requestAnimationFrame with delta time
2. **Grid Manager** - Owns tile grid, handles tile state, generates layouts (2D array of tile objects)
3. **PathFinder** - Validates connections using BFS/DFS with turn counting (3-line algorithm)
4. **Input Handler** - Captures clicks/touches, translates to grid coordinates
5. **Renderer** - Draws grid, tiles, connection lines, animations using Canvas 2D API
6. **State Machine** - Manages game states (idle, selected, matching, animating, game over) with explicit transitions
7. **Score System** - Tracks points, combos, game progress
8. **Animation Manager** - Handles tile disappear, connection line, UI effects

**Key patterns:** Game Loop (frame-based updates), State Machine (discrete game states), Observer/Event Emitter (loose coupling between components)

### Critical Pitfalls

1. **Incorrect Path-Finding Algorithm Implementation** - Implement path check as: straight line (0 turns), one-turn path (L-shape), two-turn path (U-shape or Z-shape). Test exhaustively with unit tests covering all path types and edge cases.

2. **Unsolvable Board Generation** - Generate boards by placing pairs in reverse (start with empty board, add matched pairs in positions that are guaranteed connectable) OR validate solvability after random generation and regenerate if unsolvable.

3. **Dead-End Detection Failure** - Implement efficient dead-end check: for each tile, check if ANY matching tile has a valid path. Cache results and re-check only when tiles are cleared. When dead-end detected, offer shuffle.

4. **Grid Coordinate System Confusion** - Choose ONE coordinate system and document it clearly. Create helper functions for coordinate conversion (screen-to-grid, grid-to-screen). Use consistent naming: (row, col) or (x, y) - never mix.

5. **Poor Visual Feedback for Connections** - From the start, draw the connecting path (even as a simple line) when a match succeeds. Show a visual indicator (shake, red flash) when a match fails.

## Implications for Roadmap

Based on research, suggested phase structure:

### Phase 1: Core Foundation
**Rationale:** These components have no dependencies and everything else builds on them. Establishes the fundamental architecture patterns.
**Delivers:** Project structure, configuration, event system, basic game loop
**Addresses:** Grid coordinate system (pitfall #4)
**Components:** GameConfig/Constants, EventEmitter, GameLoop, Tile model

### Phase 2: Grid and Input
**Rationale:** Establishes the game board and basic interaction. Need grid before implementing matching logic.
**Delivers:** Rendered grid with tiles, basic click/touch input handling
**Uses:** Vite + TypeScript + Canvas (from STACK.md)
**Implements:** Grid Manager, InputHandler, basic Renderer
**Addresses:** Responsive grid scaling (pitfall #6), Touch vs mouse input (pitfall #7)

### Phase 3: Core Matching Mechanics
**Rationale:** Implements the core game loop - the path-finding algorithm is the heart of the game and most complex component.
**Delivers:** Playable game where tiles can be matched and removed
**Components:** PathFinder, SelectedState, MatchingState, MatchEngine
**Addresses:** Incorrect path-finding (pitfall #1), Poor visual feedback (pitfall #5)
**Critical:** Exhaustive unit tests for path-finding covering all edge cases

### Phase 4: Game State Management
**Rationale:** With core mechanics working, add proper state transitions, win/lose conditions, and score tracking.
**Delivers:** Complete game loop with all states, scoring system
**Components:** StateMachine (full), IdleState, AnimatingState, ScoreSystem, MoveDetector, GameOverState
**Addresses:** Dead-end detection failure (pitfall #3)

### Phase 5: Board Generation and Recovery
**Rationale:** Implement proper board generation with solvability validation and shuffle feature for dead-end recovery.
**Delivers:** Solvable boards, shuffle feature when stuck
**Components:** Board generation logic, Shuffle utility, No moves detection
**Addresses:** Unsolvable board generation (pitfall #2)

### Phase 6: Polish and UX
**Rationale:** Enhance the core loop with animations, hints, and responsive design refinements.
**Delivers:** Smooth animations, hint system, tutorial, responsive design tested on multiple devices
**Components:** AnimationManager, HintSystem, tutorial overlay, responsive grid refinements
**Addresses:** Performance degradation (pitfall #8), Tile asset loading (pitfall #9)

### Phase Ordering Rationale

- **Foundation first:** Config, events, and game loop are dependencies for everything else
- **Grid before matching:** Need a visible board before implementing interaction logic
- **Path-finding early:** The 3-line algorithm is the most complex component and needs extensive testing
- **State management after mechanics:** State transitions only make sense once matching works
- **Board generation after state:** Need game-over detection to validate solvability
- **Polish last:** Animations and hints enhance but don't change core functionality

This ordering ensures each phase builds on working components from previous phases, minimizing rework and enabling early testing of critical path-finding logic.

### Research Flags

Phases likely needing deeper research during planning:
- **Phase 3 (Core Matching Mechanics):** Path-finding algorithm with 3-line constraint has nuanced edge cases - consider researching established implementations or algorithm references
- **Phase 5 (Board Generation):** Solvability validation is non-trivial - may need to research constraint satisfaction or backtracking algorithms

Phases with standard patterns (skip research-phase):
- **Phase 1 (Core Foundation):** Well-documented patterns for game loop, event emitter
- **Phase 2 (Grid and Input):** Standard Canvas rendering and input handling
- **Phase 6 (Polish):** Animation and responsive design are well-documented web development patterns

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | Industry standard in 2026, verified via npm, clear rationale for minimal approach |
| Features | MEDIUM | Based on competitor analysis and domain knowledge; web research limited |
| Architecture | HIGH | Well-documented game development patterns (Game Loop, State Machine, Component) |
| Pitfalls | MEDIUM | Based on domain knowledge; web research was limited but pitfalls align with known game development challenges |

**Overall confidence:** HIGH

The core technical approach (Vite + TypeScript + Canvas) is well-established and low-risk. The path-finding algorithm is the primary technical challenge but has documented patterns. The main uncertainty is in feature prioritization and competitive landscape, which should be validated through playtesting.

### Gaps to Address

- **Path-finding algorithm implementation details:** While BFS/DFS with turn counting is the standard approach, specific edge cases (paths along board boundaries, through cleared areas) need careful implementation. Plan to create comprehensive unit tests during Phase 3.

- **Board solvability validation:** The research recommends generating boards backward or validating after generation, but specific algorithms for either approach need investigation during Phase 5 planning.

- **Mobile performance optimization:** Research suggests dirty rectangle rendering for large grids, but specific implementation details should be addressed if performance issues arise during testing.

- **Touch input edge cases:** Research mentions handling touch latency and accidental multi-touch, but specific strategies should be refined during mobile testing in Phase 6.

## Sources

### Primary (HIGH confidence)
- **npm/package/phaser** - Version 3.90.0, features, bundle size
- **npm/package/vite** - Version 7.3.1, features
- **pixijs.com** - Version 8.x, installation, features
- **MDN Web Docs (Canvas API)** - Standard reference for Canvas rendering
- **MDN Game Development** - Game anatomy and game loop patterns
- **Game Programming Patterns by Robert Nystrom** - Game Loop, Component, State patterns
- **Vite documentation** - Build tool features, TypeScript support

### Secondary (MEDIUM confidence)
- **Onet Connect Classic - CrazyGames** - Feature analysis: timer, hints, shuffle, themes, levels
- **Phaser documentation** - Framework capabilities, when to use
- **Domain knowledge** - Tile-matching game development patterns, path-finding algorithms

### Tertiary (LOW confidence - needs validation)
- **Pikachu Kawai reference** - Classic implementation patterns (inferred from domain knowledge)
- **Mobile web game development** - Touch handling, responsive design (general best practices)

---
*Research completed: 2026-03-10*
*Ready for roadmap: yes*
