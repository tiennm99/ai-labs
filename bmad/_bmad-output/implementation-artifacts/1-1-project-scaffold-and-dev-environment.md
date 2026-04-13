# Story 1.1: Project Scaffold & Dev Environment

Status: review

## Story

As a developer,
I want a properly configured Svelte + Tailwind + Vite project with the correct folder structure,
so that all subsequent stories have a solid foundation to build on.

## Acceptance Criteria

1. Project created using `npm create vite@latest` with Svelte template, builds and runs with `npm run dev`
2. Tailwind CSS v4 installed via `@tailwindcss/vite` plugin; `@import "tailwindcss"` works in `app.css`
3. Vitest installed as dev dependency; `npx vitest` runs without error
4. Folder structure matches Architecture: `src/lib/`, `src/components/`, `public/fonts/`
5. `src/lib/constants.js` exists with GRID_SIZE (4), WIN_VALUE (2048), SPAWN_PROBABILITY (0.9), DIRECTIONS enum, and TILE_COLORS (12-tier hex map)
6. Clear Sans font placed in `public/fonts/` with `@font-face` declaration in `app.css`
7. Page background set to `#faf8ef`

## Tasks / Subtasks

- [x] Task 1: Initialize project (AC: #1)
  - [x] Run `npm create vite@latest try-bmad -- --template svelte` (or init in current directory)
  - [x] Verify `npm run dev` starts dev server at localhost:5173
  - [x] Remove default Svelte demo content (Counter component, default styles, Svelte/Vite logos)

- [x] Task 2: Install and configure Tailwind CSS v4 (AC: #2)
  - [x] Run `npm install tailwindcss @tailwindcss/vite`
  - [x] Add `tailwindcss()` plugin to `vite.config.js` plugins array
  - [x] Replace content in `src/app.css` with `@import "tailwindcss";`
  - [x] Verify Tailwind utilities work in App.svelte (e.g., a `bg-red-500` class renders correctly)

- [x] Task 3: Install Vitest (AC: #3)
  - [x] Run `npm install -D vitest`
  - [x] Add `"test": "vitest"` script to `package.json`
  - [x] Create a placeholder test file `src/lib/game-logic.test.js` with a single passing test
  - [x] Verify `npx vitest run` passes

- [x] Task 4: Create folder structure (AC: #4)
  - [x] Create `src/lib/` directory (for pure JS game logic modules)
  - [x] Create `src/components/` directory (for Svelte UI components)
  - [x] Create `public/fonts/` directory (for Clear Sans font files)

- [x] Task 5: Create constants module (AC: #5)
  - [x] Create `src/lib/constants.js` with all game constants:
    - `GRID_SIZE = 4`
    - `WIN_VALUE = 2048`
    - `SPAWN_PROBABILITY = 0.9` (probability of spawning a 2 vs 4)
    - `DIRECTIONS = { UP: 'up', DOWN: 'down', LEFT: 'left', RIGHT: 'right' }`
    - `TILE_COLORS` map with all 12 tiers

- [x] Task 6: Add Clear Sans font (AC: #6)
  - [x] Download Clear Sans woff2 from @fontsource/clear-sans npm package
  - [x] Place `ClearSans-Bold.woff2` and `ClearSans-Regular.woff2` in `public/fonts/`
  - [x] Add `@font-face` declarations in `src/app.css` for both bold and regular weights

- [x] Task 7: Set page background and base styles (AC: #7)
  - [x] In `src/app.css`, add base body style with background #faf8ef and Clear Sans font family
  - [x] Clean up `App.svelte` to render a minimal "2048" heading confirming styles work

## Dev Notes

### Architecture Compliance

- **Stack:** Svelte 5 + Vite 9 + Tailwind CSS v4 + Vitest (vanilla JS, NOT TypeScript)
- **Svelte version:** Use Svelte 5 with runes reactivity (`$state`, `$derived`) — NOT Svelte 4 stores
- **Tailwind v4:** Uses `@tailwindcss/vite` plugin directly — NO PostCSS config, NO `tailwind.config.js` needed for basic setup
- **No SvelteKit:** This is plain Svelte + Vite. Do NOT use `npx sv create` or add routing/SSR/adapters
- **JavaScript only:** Do NOT add TypeScript. All files use `.js` and `.svelte` extensions

### Critical Anti-Patterns (DO NOT)

- DO NOT use SvelteKit (no `+page.svelte`, no `load` functions, no adapters)
- DO NOT add TypeScript (no `.ts` files, no `tsconfig.json`)
- DO NOT use Svelte stores (`writable`, `readable`) — project uses props-down pattern
- DO NOT install PostCSS — Tailwind v4 handles everything via Vite plugin
- DO NOT create a `tailwind.config.js` yet — will be needed later for custom theme but not in this story

### Naming Conventions

- Svelte components: `PascalCase.svelte` (e.g., `App.svelte`, `Grid.svelte`)
- JS modules: `kebab-case.js` (e.g., `game-logic.js`, `constants.js`)
- Functions: `camelCase` (e.g., `initGame`, `moveTiles`)
- Constants: `UPPER_SNAKE_CASE` (e.g., `GRID_SIZE`, `WIN_VALUE`)

### References

- [Source: _bmad-output/planning-artifacts/architecture.md#Starter Template Evaluation]
- [Source: _bmad-output/planning-artifacts/architecture.md#Implementation Patterns & Consistency Rules]
- [Source: _bmad-output/planning-artifacts/architecture.md#Project Structure & Boundaries]
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md#Color System]
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md#Typography System]

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6 (1M context)

### Debug Log References

- Scaffolded to temp directory and copied files (current directory was non-empty)
- Clear Sans font sourced from @fontsource/clear-sans npm package, copied static woff2 files to public/fonts

### Completion Notes List

- Project scaffolded with Svelte 5.55.1 + Vite 8.0.4
- Tailwind CSS v4.2.2 configured via @tailwindcss/vite plugin
- Vitest v4.1.4 installed with 5 passing constants tests
- Constants module created with all 12-tier tile colors, directions, and game values
- Clear Sans Bold + Regular fonts placed in public/fonts with @font-face declarations
- Page background #faf8ef set, minimal App.svelte with 2048 heading
- Production build: 24KB JS + 11KB CSS (well under 50KB gzipped target)

### File List

- index.html (from scaffold)
- package.json (configured with project name, test script)
- vite.config.js (Svelte + Tailwind plugins)
- jsconfig.json (from scaffold)
- svelte.config.js (from scaffold)
- src/main.js (from scaffold)
- src/app.css (Tailwind import + @font-face + body styles)
- src/App.svelte (minimal 2048 heading)
- src/lib/constants.js (game constants)
- src/lib/game-logic.test.js (constants validation tests)
- public/fonts/ClearSans-Bold.woff2
- public/fonts/ClearSans-Regular.woff2
- public/favicon.svg (from scaffold)
