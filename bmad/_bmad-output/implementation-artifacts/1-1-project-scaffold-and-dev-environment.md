# Story 1.1: Project Scaffold & Dev Environment

Status: ready-for-dev

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

- [ ] Task 1: Initialize project (AC: #1)
  - [ ] Run `npm create vite@latest try-bmad -- --template svelte` (or init in current directory)
  - [ ] Verify `npm run dev` starts dev server at localhost:5173
  - [ ] Remove default Svelte demo content (Counter component, default styles, Svelte/Vite logos)

- [ ] Task 2: Install and configure Tailwind CSS v4 (AC: #2)
  - [ ] Run `npm install tailwindcss @tailwindcss/vite`
  - [ ] Add `tailwindcss()` plugin to `vite.config.js` plugins array
  - [ ] Replace content in `src/app.css` with `@import "tailwindcss";`
  - [ ] Verify Tailwind utilities work in App.svelte (e.g., a `bg-red-500` class renders correctly)

- [ ] Task 3: Install Vitest (AC: #3)
  - [ ] Run `npm install -D vitest`
  - [ ] Add `"test": "vitest"` script to `package.json`
  - [ ] Create a placeholder test file `src/lib/game-logic.test.js` with a single passing test
  - [ ] Verify `npx vitest run` passes

- [ ] Task 4: Create folder structure (AC: #4)
  - [ ] Create `src/lib/` directory (for pure JS game logic modules)
  - [ ] Create `src/components/` directory (for Svelte UI components)
  - [ ] Create `public/fonts/` directory (for Clear Sans font files)

- [ ] Task 5: Create constants module (AC: #5)
  - [ ] Create `src/lib/constants.js` with all game constants:
    - `GRID_SIZE = 4`
    - `WIN_VALUE = 2048`
    - `SPAWN_PROBABILITY = 0.9` (probability of spawning a 2 vs 4)
    - `DIRECTIONS = { UP: 'up', DOWN: 'down', LEFT: 'left', RIGHT: 'right' }`
    - `TILE_COLORS` map: `{ 2: { bg: '#eee4da', text: '#776e65' }, 4: { bg: '#ede0c8', text: '#776e65' }, 8: { bg: '#f2b179', text: '#f9f6f2' }, 16: { bg: '#f59563', text: '#f9f6f2' }, 32: { bg: '#f67c5f', text: '#f9f6f2' }, 64: { bg: '#f65e3b', text: '#f9f6f2' }, 128: { bg: '#edcf72', text: '#f9f6f2' }, 256: { bg: '#edcc61', text: '#f9f6f2' }, 512: { bg: '#edc850', text: '#f9f6f2' }, 1024: { bg: '#edc53f', text: '#f9f6f2' }, 2048: { bg: '#edc22e', text: '#f9f6f2' }, super: { bg: '#3c3a32', text: '#f9f6f2' } }`

- [ ] Task 6: Add Clear Sans font (AC: #6)
  - [ ] Download Clear Sans woff2 from Intel's open-source release or a CDN
  - [ ] Place `ClearSans-Bold.woff2` (and regular weight if available) in `public/fonts/`
  - [ ] Add `@font-face` declaration in `src/app.css` after the Tailwind import:
    ```css
    @font-face {
      font-family: 'Clear Sans';
      src: url('/fonts/ClearSans-Bold.woff2') format('woff2');
      font-weight: bold;
      font-style: normal;
      font-display: swap;
    }
    ```

- [ ] Task 7: Set page background and base styles (AC: #7)
  - [ ] In `src/app.css`, add base body style: `body { background: #faf8ef; font-family: 'Clear Sans', 'Helvetica Neue', Arial, sans-serif; margin: 0; }`
  - [ ] Clean up `App.svelte` to render a minimal placeholder (e.g., "2048" heading) confirming styles work

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

### Project Structure After This Story

```
try-bmad/
├── index.html
├── package.json
├── vite.config.js
├── .gitignore
├── public/
│   └── fonts/
│       └── ClearSans-Bold.woff2
├── src/
│   ├── main.js
│   ├── App.svelte
│   ├── app.css
│   ├── components/          (empty, ready for Story 1.3+)
│   └── lib/
│       ├── constants.js
│       └── game-logic.test.js  (placeholder)
```

### References

- [Source: _bmad-output/planning-artifacts/architecture.md#Starter Template Evaluation]
- [Source: _bmad-output/planning-artifacts/architecture.md#Implementation Patterns & Consistency Rules]
- [Source: _bmad-output/planning-artifacts/architecture.md#Project Structure & Boundaries]
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md#Color System]
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md#Typography System]

## Dev Agent Record

### Agent Model Used

### Debug Log References

### Completion Notes List

### File List
