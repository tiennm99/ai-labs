---
stepsCompleted: [1, 2, 3, 4, 5, 6, 7, 8]
lastStep: 8
status: 'complete'
completedAt: '2026-04-13'
inputDocuments:
  - '_bmad-output/planning-artifacts/prd.md'
  - '_bmad-output/planning-artifacts/ux-design-specification.md'
  - '_bmad-output/brainstorming/brainstorming-session-2026-04-12-001.md'
workflowType: 'architecture'
project_name: 'try-bmad'
user_name: 'MiTi'
date: '2026-04-12'
---

# Architecture Decision Document

_This document builds collaboratively through step-by-step discovery. Sections are appended as we work through each architectural decision together._

## Project Context Analysis

### Requirements Overview

**Functional Requirements:**
- 4x4 grid with directional tile sliding and merging (leading-edge order, once-per-move rule)
- Tile spawning: 2 at game start, 1 per move, 90/10 probability split (2 vs 4)
- Score tracking (current + best) with localStorage persistence
- Win detection (2048 tile, triggers once) with "Keep playing" mode
- Game over detection (no valid moves remaining)
- New Game restart (no confirmation dialog)
- Keyboard input: arrow keys, WASD, Vim hjkl
- Touch/swipe input with 10px minimum threshold, dominant-axis detection
- 5 animation types: slide (100ms), pop (200ms), bounce (200ms), score float (600ms), overlay fade (800ms)
- Responsive layout: 500px desktop, 280px mobile at 520px breakpoint

**Non-Functional Requirements:**
- Input latency < 16ms
- Animation framerate: 60fps CSS transitions
- Bundle size < 50KB gzipped
- Initial load < 1s
- WCAG AA accessibility compliance
- `prefers-reduced-motion` support
- Evergreen browser support (Chrome, Firefox, Safari, Edge)

**Scale & Complexity:**

- Primary domain: Frontend SPA (client-side only)
- Complexity level: Low
- Estimated architectural components: 5 Svelte components + 1 game logic module

### Technical Constraints & Dependencies

- **No backend** — fully client-side, static deployment to GitHub Pages
- **Tech stack locked** — Svelte + Tailwind CSS + Vite (decided in PRD/brainstorming)
- **Fidelity constraint** — must match original 2048 mechanics exactly (merge rules, spawn probability, animation timings)
- **No build-time SSR/SSG** — pure SPA, no server-side rendering needed
- **Font dependency** — Clear Sans (free Intel font) with fallback chain

### Cross-Cutting Concerns Identified

- **Animation timing** — affects Tile, Grid, ScoreBoard, GameMessage; must not block input; sequential dependencies (slide → spawn)
- **Input handling** — keyboard + touch must both feed into same game logic interface; input queuing during animations
- **State persistence** — localStorage save after every move; restore on page load; affects game state, score, best score
- **Responsive scaling** — all 5 components must adapt at 520px breakpoint; proportional dimension scaling
- **Accessibility** — ARIA roles, keyboard navigation, focus management, reduced motion — spans all components

## Starter Template Evaluation

### Primary Technology Domain

Frontend SPA — single-page client-side game with no backend, no routing, no SSR. Plain Svelte + Vite is the right fit (SvelteKit would add unnecessary complexity for a single-page game).

### Starter Options Considered

| Option | Pros | Cons | Verdict |
|--------|------|------|---------|
| `create-vite` + `svelte` template | Official, minimal, no bloat, latest Svelte 5 | Must add Tailwind manually (2 commands) | **Selected** |
| SvelteKit (`npx sv create`) | Full framework, built-in routing | Overkill — adds routing, SSR, adapters we don't need | Rejected |
| Community starters (degit templates) | Pre-configured Tailwind | Often outdated, not maintained, unclear Svelte 5 support | Rejected |
| Manual setup | Total control | Unnecessary effort for a standard stack | Rejected |

### Selected Starter: create-vite with Svelte template

**Rationale:**
- Official Vite scaffolding — always up-to-date with latest Svelte 5 (5.55.0) and Vite 9
- Minimal footprint — no routing, no SSR, no adapters; exactly what a single-page game needs
- Tailwind CSS v4 adds cleanly via `@tailwindcss/vite` plugin (no PostCSS config)
- Matches PRD tech stack exactly: Svelte + Tailwind CSS + Vite

**Initialization Commands:**

```bash
npm create vite@latest try-bmad -- --template svelte
cd try-bmad
npm install tailwindcss @tailwindcss/vite
```

**Architectural Decisions Provided by Starter:**

**Language & Runtime:**
- JavaScript (vanilla JS per PRD — not TypeScript)
- Svelte 5 with runes reactivity system
- Node.js 20.19+ or 22.12+

**Styling Solution:**
- Tailwind CSS v4 via `@tailwindcss/vite` plugin
- No PostCSS configuration needed — Vite plugin handles everything
- `@import "tailwindcss"` in app.css

**Build Tooling:**
- Vite 9 for dev server and production builds
- Svelte compiler via `@sveltejs/vite-plugin-svelte`
- Static output for GitHub Pages deployment

**Testing Framework:**
- Not included by default — will add Vitest for game logic unit tests

**Code Organization:**
- `src/` — application source
- `src/lib/` — game logic module (pure JS, testable independently)
- `src/components/` — Svelte UI components
- `public/` — static assets (fonts, favicon)
- `index.html` — single entry point

**Development Experience:**
- Hot module replacement (HMR) via Vite
- Fast dev server with instant start
- Optimized production builds with tree-shaking

**Note:** Project initialization using these commands should be the first implementation story.

## Core Architectural Decisions

### Decision Priority Analysis

**Critical Decisions (Block Implementation):**
1. State management approach — Svelte 5 runes (built-in)
2. Game logic separation — pure JS module, decoupled from UI
3. Deployment target — GitHub Pages with Vite static build

**Important Decisions (Shape Architecture):**
4. Testing strategy — Vitest for game logic unit tests
5. Animation approach — CSS transitions + Svelte reactivity
6. localStorage schema — JSON serialization of game state

**Deferred Decisions (Post-MVP):**
- CI/CD pipeline — can deploy manually initially, automate in Phase 3

### Data Architecture

**Not applicable** — no database, no backend API. All data is client-side.

**localStorage Schema:**
- Key: `gameState` — stores `{ grid: number[][], score: number, won: boolean, keepPlaying: boolean }`
- Key: `bestScore` — stores single number
- Serialization: `JSON.stringify` / `JSON.parse`
- Save trigger: after every valid move
- Restore trigger: on page load

### Authentication & Security

**Not applicable** — no user accounts, no authentication, no server-side security. Game is fully client-side with no sensitive data.

### API & Communication Patterns

**Not applicable** — no server communication. All logic runs in browser.

### Frontend Architecture

**State Management: Svelte 5 Runes**
- `$state` for mutable game state (grid, score, gameStatus)
- `$derived` for computed values (isGameOver, hasWon, availableMoves)
- No external state library (Zustand, Redux) — Svelte reactivity is sufficient
- Single source of truth in `App.svelte`, passed to children via props

**Component Architecture:**
- 5 Svelte components (App, Grid, Tile, ScoreBoard, GameMessage)
- Props-down pattern — App owns state, children are presentational
- No component-level state — all state flows from App
- Event callbacks up (onNewGame, onKeepGoing) via props

**Game Logic Module:**
- `src/lib/game-logic.js` — pure functions, zero dependencies
- Functions: `initGame()`, `move(state, direction)`, `canMove(state)`, `isGameOver(state)`, `addRandomTile(grid)`
- Input: game state + direction → Output: new game state + score delta
- Immutable: returns new state objects, never mutates input

**Animation Approach:**
- CSS `transition` for tile sliding (transform, 100ms)
- CSS `@keyframes` for pop (new tile) and bounce (merge)
- Svelte reactive updates trigger CSS transitions automatically
- No animation library — pure CSS + Svelte reactivity

**Bundle Optimization:**
- Tailwind CSS v4 purges unused utilities automatically
- Svelte compiles to vanilla JS — no framework runtime
- Target: < 50KB gzipped total
- Single chunk — no code splitting needed for a single-page game

### Infrastructure & Deployment

**Hosting: GitHub Pages**
- Static site deployment — `vite build` → `dist/` directory
- Vite `base` config set to repo name for correct asset paths
- GitHub Actions workflow for build + deploy to `gh-pages` branch

**Environment Configuration:**
- No environment variables needed — no API keys, no secrets
- Vite `base` in `vite.config.js` is the only deployment-specific config

**Monitoring & Logging:**
- None required — client-side game with no server to monitor
- Browser DevTools sufficient for debugging during development

### Decision Impact Analysis

**Implementation Sequence:**
1. Project scaffold (create-vite + Tailwind) — foundation for everything
2. Game logic module — pure JS, testable independently
3. Grid + Tile components — render game state
4. App component — orchestrate state + input + components
5. ScoreBoard + GameMessage — supporting UI
6. localStorage persistence — save/restore
7. Animations — CSS transitions + keyframes
8. Touch input — swipe handling
9. Responsive layout — 520px breakpoint
10. GitHub Pages deployment

**Cross-Component Dependencies:**
- Game logic module has ZERO dependencies — can be built and tested first
- All 5 components depend on game state shape (defined by game logic module)
- Animation timing affects Tile, ScoreBoard — coordinate via CSS, not JS
- localStorage interacts only with App (save/restore game state)

## Implementation Patterns & Consistency Rules

### Pattern Categories Defined

**Critical Conflict Points Identified:** 5 areas where AI agents could make different choices

### Naming Patterns

**File Naming:**
- Svelte components: `PascalCase.svelte` — `App.svelte`, `Grid.svelte`, `Tile.svelte`, `ScoreBoard.svelte`, `GameMessage.svelte`
- JS modules: `kebab-case.js` — `game-logic.js`, `input-handler.js`, `storage.js`
- CSS files: `kebab-case.css` — `app.css`
- Config files: standard names — `vite.config.js`, `tailwind.config.js`

**Function Naming:**
- Game logic functions: `camelCase` — `initGame()`, `moveTiles()`, `canMove()`, `addRandomTile()`
- Event handlers in Svelte: `handleX` prefix — `handleKeydown`, `handleTouchStart`, `handleNewGame`
- Utility functions: `camelCase` — `cloneGrid()`, `getEmptyCells()`, `serializeState()`

**Variable Naming:**
- Svelte state: `camelCase` — `gameState`, `bestScore`, `isAnimating`
- Constants: `UPPER_SNAKE_CASE` — `GRID_SIZE`, `WIN_VALUE`, `SPAWN_PROBABILITY`
- CSS classes: Tailwind utilities (no custom class naming needed beyond Tailwind config keys)

### Structure Patterns

**Project Organization:**
```
src/
├── App.svelte              # Root component, state owner
├── app.css                 # Global styles + Tailwind import
├── main.js                 # Entry point, mounts App
├── components/
│   ├── Grid.svelte         # Game board
│   ├── Tile.svelte         # Individual tile
│   ├── ScoreBoard.svelte   # Score display
│   └── GameMessage.svelte  # Win/game-over overlay
└── lib/
    ├── game-logic.js       # Pure game logic functions
    ├── input-handler.js    # Keyboard + touch input
    └── storage.js          # localStorage save/restore
```

**Test Organization:**
- Co-located test files: `src/lib/game-logic.test.js` next to `game-logic.js`
- Only game logic module gets unit tests — UI testing via manual browser testing
- Test file naming: `{module-name}.test.js`

### Format Patterns

**localStorage Data Format:**
```json
{
  "gameState": {
    "grid": [[0,0,2,0],[0,4,0,0],[0,0,0,0],[0,0,0,0]],
    "score": 8,
    "won": false,
    "keepPlaying": false
  },
  "bestScore": 21504
}
```
- Grid: 2D array of numbers (0 = empty cell)
- All JSON keys: `camelCase`
- Boolean values: `true`/`false` (native JSON)

**Game State Shape (canonical):**
```javascript
{
  grid: number[][],       // 4x4, 0 = empty
  score: number,          // current game score
  won: boolean,           // has player created 2048 tile
  keepPlaying: boolean,   // playing past 2048
  tiles: TileData[],      // for rendering: { id, value, row, col, isNew, isMerged }
}
```

### Communication Patterns

**State Management:**
- Immutable updates only — game logic returns NEW state objects, never mutates input
- Single direction: App → children via props; children → App via callback props
- No Svelte stores — props-down pattern is sufficient for 5 components

**Direction Enum:**
```javascript
const DIRECTIONS = { UP: 'up', DOWN: 'down', LEFT: 'left', RIGHT: 'right' };
```
- String constants, not numbers
- Used consistently across input handler and game logic

### Process Patterns

**Error Handling:**
- Game logic: no try/catch — pure functions with guaranteed valid output for valid input
- localStorage: wrap `JSON.parse` in try/catch; on failure, start fresh game (silent recovery)
- No user-facing error messages — the game either works or silently resets

**Animation State:**
- `isAnimating` flag in App prevents input processing during slide transition
- After slide animation (100ms), flag clears and queued input fires
- CSS handles all animation — no JS `setTimeout` for animation sequencing

**Input Processing:**
- Input handler translates raw events to direction strings
- Game logic receives direction, returns new state
- App updates state → Svelte reactivity triggers re-render → CSS transitions animate

### Enforcement Guidelines

**All AI Agents MUST:**
- Use the canonical game state shape — never add fields without updating this document
- Keep game logic in `src/lib/game-logic.js` as pure functions — no Svelte imports, no DOM access
- Use props-down pattern — never use Svelte stores or context for this project
- Match animation timings exactly: slide 100ms, pop 200ms, bounce 200ms, float 600ms, fade 800ms
- Use Tailwind utilities for all styling — no custom CSS except `@keyframes` animations

**Anti-Patterns:**
- DO NOT use Svelte stores (`writable`, `readable`) — props are sufficient
- DO NOT mutate game state directly — always return new objects from game logic
- DO NOT use `setTimeout` for animation sequencing — use CSS `transition` + `transitionend` events
- DO NOT add TypeScript — this project uses vanilla JS per PRD
- DO NOT add SvelteKit features (routing, load functions, adapters) — this is plain Svelte + Vite

## Project Structure & Boundaries

### Complete Project Directory Structure

```
try-bmad/
├── index.html                  # Single entry point, mounts #app
├── package.json                # Dependencies: svelte, tailwindcss, vite
├── vite.config.js              # Svelte plugin + Tailwind plugin + base path
├── .gitignore                  # node_modules, dist
├── README.md                   # Project description
├── public/
│   └── fonts/
│       └── clear-sans.woff2    # Clear Sans font file
├── src/
│   ├── main.js                 # App mount: new App({ target: document.getElementById('app') })
│   ├── App.svelte              # Root: state owner, input listener, layout orchestrator
│   ├── app.css                 # @import "tailwindcss" + @font-face + @keyframes
│   ├── components/
│   │   ├── Grid.svelte         # 4x4 board: empty cells + positioned Tiles
│   │   ├── Tile.svelte         # Single tile: value, color, position, animations
│   │   ├── ScoreBoard.svelte   # Score + Best score boxes + float animation
│   │   └── GameMessage.svelte  # Win/game-over overlay with action buttons
│   └── lib/
│       ├── game-logic.js       # Pure functions: initGame, move, canMove, isGameOver, addRandomTile
│       ├── game-logic.test.js  # Vitest unit tests for all game logic
│       ├── input-handler.js    # Keyboard mapping + touch/swipe detection → direction
│       ├── storage.js          # localStorage save/restore with JSON serialization
│       └── constants.js        # GRID_SIZE, WIN_VALUE, SPAWN_PROBABILITY, DIRECTIONS, TILE_COLORS
├── dist/                       # Vite build output (gitignored, deployed to gh-pages)
└── .github/
    └── workflows/
        └── deploy.yml          # GitHub Actions: build + deploy to gh-pages
```

### Architectural Boundaries

**Component Boundaries:**
- `App.svelte` is the ONLY component that owns state and handles input
- `Grid`, `Tile`, `ScoreBoard`, `GameMessage` are purely presentational — receive props, emit callbacks
- No component imports from another component (flat hierarchy under App)

**Logic Boundaries:**
- `src/lib/` contains ALL business logic — zero Svelte imports allowed
- `game-logic.js` is pure: `(state, direction) → newState` — no side effects
- `input-handler.js` translates DOM events to direction strings — no game logic
- `storage.js` handles localStorage I/O — no game logic, no UI knowledge
- `constants.js` is read-only shared data — imported by both lib and components

**Build Boundaries:**
- `src/` → Vite compiles to `dist/` (single JS bundle + CSS + HTML)
- `public/` → copied as-is to `dist/` (fonts)
- No server-side code anywhere in the project

### Requirements to Structure Mapping

**Phase 1 — MVP (Core Gameplay):**

| Requirement | File(s) |
|-------------|---------|
| Grid rendering | `Grid.svelte`, `Tile.svelte` |
| Tile sliding + merging | `game-logic.js` (move, merge functions) |
| Tile spawning (90/10) | `game-logic.js` (addRandomTile) |
| Score tracking | `ScoreBoard.svelte`, `App.svelte` (state) |
| Win/lose detection | `game-logic.js` (isGameOver, checkWin) |
| Keyboard input | `input-handler.js`, `App.svelte` (listener) |
| Tile colors | `constants.js` (TILE_COLORS), `Tile.svelte` |
| New Game button | `App.svelte` (handler) |

**Phase 2 — Growth:**

| Requirement | File(s) |
|-------------|---------|
| localStorage persistence | `storage.js`, `App.svelte` (save/restore) |
| Touch/swipe input | `input-handler.js` (touch handlers) |
| Slide animation | `Tile.svelte` (CSS transition) |
| Pop/bounce animation | `app.css` (@keyframes), `Tile.svelte` |
| Score float animation | `ScoreBoard.svelte` |
| WASD/Vim keys | `input-handler.js` (key mapping) |
| Keep playing mode | `game-logic.js`, `GameMessage.svelte` |

**Phase 3 — Polish:**

| Requirement | File(s) |
|-------------|---------|
| Responsive layout | All components (Tailwind breakpoint) |
| Tile glow effects | `Tile.svelte` (conditional box-shadow) |
| Dynamic font sizing | `Tile.svelte` (digit count → size class) |
| Overlay fade animation | `GameMessage.svelte`, `app.css` |
| GitHub Pages deploy | `.github/workflows/deploy.yml`, `vite.config.js` |

### Data Flow

```
User Input (keyboard/touch)
    ↓
input-handler.js → direction string
    ↓
App.svelte → calls game-logic.js(state, direction)
    ↓
game-logic.js → returns { newState, scoreDelta }
    ↓
App.svelte → updates $state → saves to localStorage
    ↓
Svelte reactivity → re-renders Grid, Tile, ScoreBoard, GameMessage
    ↓
CSS transitions → animate tile positions, merges, spawns
```

### Development Workflow

- **Dev Server:** `npm run dev` → Vite HMR at localhost:5173
- **Build:** `npm run build` → `dist/` with optimized bundle
- **Test:** `npx vitest` → runs `game-logic.test.js`
- **Deploy:** Push to main → GitHub Actions builds + deploys to gh-pages

## Architecture Validation Results

### Coherence Validation

**Decision Compatibility:** All technology choices verified compatible:
- Svelte 5.55.0 + Vite 9.0.4 + `@sveltejs/vite-plugin-svelte` — official integration
- Tailwind CSS v4 + `@tailwindcss/vite` — native Vite plugin, no PostCSS conflicts
- Vitest works natively with Vite configuration — zero additional setup

**Pattern Consistency:** All patterns align:
- camelCase JS + PascalCase Svelte + kebab-case files — standard Svelte conventions
- Props-down pattern matches Svelte 5 runes reactivity model
- Immutable game logic returns match `$state` update pattern
- CSS transitions work with Svelte's reactive DOM updates

**Structure Alignment:** Project structure supports all decisions:
- `src/lib/` separation enforces pure logic boundary
- `src/components/` flat hierarchy matches props-down pattern
- Co-located tests align with Vitest auto-discovery
- Single `app.css` for @keyframes centralizes animation definitions

### Requirements Coverage Validation

**Functional Requirements:** 100% coverage — all 3 phases mapped to specific files in structure
**Non-Functional Requirements:** All addressed:
- Input latency <16ms → native JS event handling, no framework overhead
- 60fps animations → CSS transitions (GPU-accelerated)
- <50KB bundle → Svelte compiles away, Tailwind purges unused
- WCAG AA → ARIA roles specified per component in UX spec
- Reduced motion → `prefers-reduced-motion` media query in `app.css`

### Implementation Readiness Validation

**Decision Completeness:** All critical decisions documented with verified versions
**Structure Completeness:** Every file listed with purpose; no placeholder directories
**Pattern Completeness:** Naming, structure, format, communication, and process patterns all defined with examples and anti-patterns

### Gap Analysis Results

**Critical Gaps:** None
**Important Gaps:** None
**Minor Gaps:**
- Vitest needs explicit `npm install -D vitest` in setup — noted for first implementation story
- Clear Sans font file needs sourcing — available from Intel's open-source releases

### Architecture Completeness Checklist

**Requirements Analysis**
- [x] Project context thoroughly analyzed
- [x] Scale and complexity assessed (low)
- [x] Technical constraints identified (no backend, fidelity requirement)
- [x] Cross-cutting concerns mapped (animation, input, persistence, responsive, a11y)

**Architectural Decisions**
- [x] Critical decisions documented with versions
- [x] Technology stack fully specified (Svelte 5 + Vite 9 + Tailwind v4)
- [x] State management defined (Svelte 5 runes, props-down)
- [x] Deployment strategy defined (GitHub Pages via GitHub Actions)

**Implementation Patterns**
- [x] Naming conventions established (PascalCase components, camelCase functions, kebab-case modules)
- [x] Structure patterns defined (src/lib for logic, src/components for UI)
- [x] Communication patterns specified (props-down, callback-up, immutable state)
- [x] Process patterns documented (error handling, animation state, input processing)

**Project Structure**
- [x] Complete directory structure defined (all files listed)
- [x] Component boundaries established (App owns state, children presentational)
- [x] Logic boundaries defined (src/lib has zero Svelte imports)
- [x] Requirements to structure mapping complete (3 phases mapped)

### Architecture Readiness Assessment

**Overall Status:** READY FOR IMPLEMENTATION

**Confidence Level:** High — low-complexity project with well-understood problem domain, proven tech stack, and complete architectural coverage

**Key Strengths:**
- Clean separation of game logic (pure JS) from UI (Svelte) enables independent testing
- Minimal tech stack — no unnecessary dependencies or abstractions
- Every requirement mapped to specific files — no ambiguity for implementers
- Anti-patterns explicitly documented — prevents common AI agent mistakes

**Areas for Future Enhancement:**
- E2E testing with Playwright (post-MVP, if needed)
- PWA service worker for true offline support (not required per PRD)
- Performance profiling with Lighthouse (Phase 3 polish)

### Implementation Handoff

**AI Agent Guidelines:**
- Follow all architectural decisions exactly as documented
- Use implementation patterns consistently across all components
- Respect project structure and boundaries — especially src/lib purity
- Refer to this document for all architectural questions

**First Implementation Priority:**
```bash
npm create vite@latest try-bmad -- --template svelte
cd try-bmad
npm install tailwindcss @tailwindcss/vite
npm install -D vitest
```
