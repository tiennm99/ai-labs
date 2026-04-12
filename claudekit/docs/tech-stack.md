# Tech Stack

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
docs/              Documentation
```
