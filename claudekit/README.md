# Suika Game (Watermelon Game)

A browser-based clone of the [Suika Game](https://en.wikipedia.org/wiki/Suika_Game) — a physics-based puzzle game where you drop fruits into a container. When two identical fruits collide, they merge into the next larger fruit. The goal is to create a watermelon and get the highest score.

Built with [ClaudeKit](https://github.com/carlrannaberg/claudekit).

## Tech Stack

| Category | Tool | Version | Purpose |
|----------|------|---------|---------|
| **Runtime** | [Matter.js](https://brm.io/matter-js/) | ^0.20.0 | 2D rigid-body physics engine |
| **Rendering** | Canvas2D | (built-in) | Fruit drawing, UI overlay, game-over screen |
| **Build** | [Vite](https://vitejs.dev/) | ^8.0.4 | Dev server, ES module bundling, production builds |
| **Testing** | [Vitest](https://vitest.dev/) | ^4.1.4 | Unit and integration tests |
| **Language** | JavaScript (ES Modules) | — | Vanilla JS, no framework |
| **Dev Tooling** | [ClaudeKit](https://github.com/carlrannaberg/claudekit) | — | Git hooks for linting, type-checking, testing, self-review |

## Project Structure

```
src/
  main.js          Entry point: initializes game, attaches event listeners
  game.js          Game class: orchestrates engine, renderer, input, state
  physics.js       Matter.js engine setup, world configuration, walls
  renderer.js      Canvas2D rendering: fruits, walls, UI overlay
  input.js         Mouse/touch input handling, drop control
  fruits.js        Fruit definitions (sizes, colors, labels, progression)
  merger.js        Collision detection callback, merge logic, scoring
  constants.js     Game dimensions, physics tuning, timing constants
  style.css        Page styling
  *.test.js        Vitest test files
index.html         Single HTML page with canvas element
specs/             Feature and bugfix specifications
```

## Getting Started

```bash
npm install
npm run dev
```

Open the URL shown in the terminal (default: http://localhost:5173).

## How to Play

1. Move your mouse (or touch on mobile) to position the fruit
2. Click/tap to drop it into the container
3. When two identical fruits touch, they merge into the next larger fruit
4. The fruit chain goes: Cherry → Strawberry → Grapes → Dekopon → Persimmon → Apple → Pear → Peach → Pineapple → Melon → Watermelon
5. Game ends when fruits stack above the danger line

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server with HMR |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Preview the production build |
| `npm test` | Run all tests once |
| `npm run test:watch` | Run tests in watch mode |
