# Suika Game (Watermelon Game)

**Status**: Draft
**Authors**: Claude Code, 2026-04-12
**Type**: Feature

---

## Overview

A browser-based clone of the Suika Game (Watermelon Game) -- a physics-based puzzle game where players drop fruits into a container. When two identical fruits collide, they merge into the next larger fruit in the chain. The goal is to create the largest fruit (watermelon) and achieve the highest score without overflowing the container.

## Background / Problem Statement

This is a greenfield project with no existing application code. The repository currently contains only ClaudeKit tooling configuration. The goal is to build a complete, playable Suika Game as a web application using modern frontend tooling.

## Goals

- Deliver a fully playable Suika Game in the browser
- Implement realistic 2D physics (gravity, collision, settling)
- Support the complete 11-fruit progression chain with merging
- Provide score tracking and game-over detection
- Responsive design that works on both desktop (mouse) and mobile (touch)
- Clean, maintainable JavaScript codebase

## Non-Goals

- Multiplayer or networked play
- Persistent leaderboards or backend/database integration
- Sound effects or music (can be added later)
- Animations beyond basic physics (no particle effects, screen shakes, etc.)
- User accounts or authentication
- PWA / offline support

## Technical Dependencies

| Dependency | Version | Purpose |
|---|---|---|
| [Matter.js](https://brm.io/matter-js/) | ^0.20.0 | 2D rigid-body physics engine |
| [Vite](https://vitejs.dev/) | ^6.x | Build tooling and dev server |

No framework (React, etc.) is needed -- this will be a vanilla JavaScript + Canvas2D application to keep it simple and performant.

## Detailed Design

### Architecture

```
src/
  main.js              # Entry point: initializes game, attaches event listeners
  game.js              # Game class: orchestrates engine, renderer, input, state
  physics.js           # Matter.js engine setup, world configuration, walls
  renderer.js          # Canvas2D rendering: fruits, walls, UI overlay
  input.js             # Mouse/touch input handling, drop control
  fruits.js            # Fruit definitions (sizes, colors, labels, progression)
  merger.js            # Collision detection callback, merge logic, scoring
  constants.js         # Game dimensions, physics tuning, timing constants
index.html             # Single HTML page with canvas element
```

### Fruit Progression Chain

11 fruits from smallest to largest. Only the 5 smallest can be randomly selected for dropping.

| Tier | Fruit | Radius (px) | Color | Merge Points |
|------|-------|-------------|-------|-------------|
| 0 | Cherry | 12 | #E74C3C | 1 |
| 1 | Strawberry | 16 | #FF6B6B | 3 |
| 2 | Grapes | 20 | #9B59B6 | 6 |
| 3 | Dekopon | 26 | #F39C12 | 10 |
| 4 | Persimmon | 32 | #E67E22 | 15 |
| 5 | Apple | 36 | #E74C3C | 21 |
| 6 | Pear | 42 | #A8D648 | 28 |
| 7 | Peach | 48 | #FDCB6E | 36 |
| 8 | Pineapple | 57 | #F1C40F | 45 |
| 9 | Melon | 64 | #2ECC71 | 55 |
| 10 | Watermelon | 77 | #27AE60 | 66 |

When two tier-10 watermelons merge, they disappear (bonus points, no new fruit spawned).

### Container / World Setup

```
  ┌─────────────────────────┐  ← danger line (Y threshold)
  │                         │
  │     drop zone           │
  │                         │
  ├─────────────────────────┤  ← top of container walls
  │                         │
  │                         │
  │    ●  ●                 │
  │   ●●●  ●●              │
  │  ●●●●●●●●●             │
  └─────────────────────────┘  ← floor
```

- **Container**: U-shaped static body (left wall, right wall, floor)
- **Dimensions**: 400px wide x 600px tall container, centered on canvas
- **Canvas size**: 500px x 700px (with padding for UI)
- **Danger line**: ~50px below the top of the container walls

### Physics Configuration (Matter.js)

```javascript
const engine = Engine.create({
  gravity: { x: 0, y: 1.5 },
});

// Fruit body defaults
const fruitBodyOptions = {
  restitution: 0.2,   // low bounce
  friction: 0.5,      // moderate friction
  frictionAir: 0.01,  // slight air drag
  density: 0.001,     // consistent density
};
```

### Core Game Loop

1. **Idle state**: Next fruit shown at top, follows cursor/touch X position
2. **Drop**: On click/tap, fruit is released with gravity enabled
3. **Cooldown**: 500ms before the next fruit can be dropped
4. **Collision check**: On every `collisionStart` event from Matter.js:
   - If two bodies share the same fruit tier label and neither is flagged for removal:
     - Flag both bodies for removal
     - Calculate midpoint of the two bodies
     - If tier < 10: spawn new fruit at midpoint with tier + 1
     - If tier == 10: no spawn (watermelons vanish)
     - Add merge points to score
5. **Game-over check**: Each frame, check if any settled fruit (not newly dropped within the last 1s) has its top edge above the danger line

### Merge Logic (Critical Path)

```javascript
// Collision handler
Events.on(engine, "collisionStart", (event) => {
  for (const pair of event.pairs) {
    const { bodyA, bodyB } = pair;
    if (bodyA.label === bodyB.label && !bodyA.removing && !bodyB.removing) {
      bodyA.removing = true;
      bodyB.removing = true;

      const tier = bodyA.fruitTier;
      const midX = (bodyA.position.x + bodyB.position.x) / 2;
      const midY = (bodyA.position.y + bodyB.position.y) / 2;

      World.remove(engine.world, [bodyA, bodyB]);

      if (tier < 10) {
        const newFruit = createFruitBody(tier + 1, midX, midY);
        World.add(engine.world, newFruit);
      }

      score += FRUITS[tier + 1]?.points ?? 66;
    }
  }
});
```

### Input Handling

- **Desktop**: `mousemove` on canvas for positioning, `click` to drop
- **Mobile**: `touchmove` for positioning, `touchend` to drop
- Clamp X position to stay within container walls minus fruit radius
- During cooldown, input is accepted for positioning but drop is disabled

### Rendering (Canvas2D)

Each frame via `requestAnimationFrame`:

1. Clear canvas
2. Draw container walls (gray rectangles)
3. Draw danger line (dashed red line)
4. For each fruit body in the world:
   - Draw filled circle at body position with fruit color
   - Draw fruit label text (emoji or name) centered
5. Draw "next fruit" preview at cursor position (semi-transparent during cooldown)
6. Draw score in top corner
7. If game over, draw overlay with final score and "Click to restart" prompt

### State Management

```javascript
// Game state object
const state = {
  score: 0,
  nextFruitTier: 0,       // 0-4 (random from droppable set)
  isDropCooldown: false,
  isGameOver: false,
  cursorX: 0,             // current drop position
};
```

No external state library needed. The `Game` class owns the state and passes it to the renderer each frame.

## User Experience

1. Page loads -> canvas renders with empty container and a fruit preview following cursor
2. Player clicks/taps to drop the fruit
3. Fruit falls, settles, and may merge with matching neighbors
4. Merged fruit creates satisfying chain reactions as larger fruits collide
5. Score updates in real-time at the top
6. When a fruit settles above the danger line, "Game Over" overlay appears with final score
7. Clicking "Restart" resets the game

## Testing Strategy

### Unit Tests (Vitest)

- **`fruits.test.js`**: Verify fruit definitions are consistent (radii increase monotonically, all 11 tiers defined, points are correct)
- **`merger.test.js`**: Test merge logic in isolation -- given two same-tier fruits, verify correct tier+1 output, midpoint calculation, and score delta. Test watermelon+watermelon produces no new fruit.
- **`input.test.js`**: Test X-clamping logic keeps fruit within container bounds
- **`game.test.js`**: Test state transitions: drop sets cooldown, game-over triggers on threshold breach, restart resets state

### Integration Tests (Vitest)

- **Physics + merge**: Create a Matter.js engine, drop two same-tier fruits so they collide, verify the collision handler produces the correct merged fruit
- **Game-over detection**: Simulate a stack that crosses the danger line, verify game-over flag is set

### Manual / E2E Testing

- Play through a full game in the browser to verify feel, responsiveness, and chain reactions
- Test on mobile viewport (Chrome DevTools device mode)
- Verify no fruit escapes the container walls

### Test Documentation

Each test file should include a top-level comment explaining what module it validates and why. Each test case should have a descriptive name that explains the scenario being tested (e.g., `"merging two tier-3 dekopon produces a tier-4 persimmon"`).

## Performance Considerations

- **Physics step rate**: Matter.js default (60Hz) is sufficient; no need for sub-stepping
- **Rendering**: Canvas2D with simple circle drawing is very lightweight
- **Body count**: Maximum ~40-50 fruits in container at once. Matter.js handles this easily
- **Memory**: Remove merged bodies immediately from the world to prevent leaks
- **Mobile**: Touch events have no performance concern; canvas size is small enough for any device

## Security Considerations

- No user input beyond mouse/touch coordinates -- no injection vectors
- No network requests, no backend, no data storage
- No third-party scripts loaded at runtime (Matter.js bundled via Vite)
- Score is client-side only -- no need to prevent tampering

## Documentation

- **README.md**: Update with project description, setup instructions (`npm install`, `npm run dev`), how to play, and screenshot
- No API docs needed (no backend)

## Implementation Phases

### Phase 1: Core Game (MVP)

1. Initialize Vite project (`npm create vite@latest . -- --template vanilla`)
2. Install Matter.js
3. Implement `constants.js` and `fruits.js` (data definitions)
4. Implement `physics.js` (engine, walls, container)
5. Implement `renderer.js` (canvas drawing for fruits, walls, score)
6. Implement `input.js` (mouse/touch positioning and drop trigger)
7. Implement `merger.js` (collision-based merge logic and scoring)
8. Implement `game.js` (game loop, state management, game-over detection)
9. Wire everything together in `main.js`
10. Verify playability in browser

### Phase 2: Polish

1. Add "next fruit" preview indicator
2. Add drop cooldown visual feedback (e.g., dimmed preview)
3. Add game-over overlay with score and restart button
4. Responsive canvas scaling for different screen sizes
5. Add fruit emoji or simple sprite rendering instead of plain circles

### Phase 3: Testing and Quality

1. Set up Vitest
2. Write unit tests for fruit definitions, merge logic, clamping
3. Write integration tests for physics + merge flow
4. Manual playtesting and tuning (gravity, restitution, fruit sizes)

## Open Questions

1. **Fruit visuals**: Use colored circles with text labels (simpler) or emoji/sprites (prettier)? Recommend starting with colored circles, upgrading in Phase 2.
2. **Difficulty tuning**: The physics constants (gravity, restitution, fruit sizes) may need adjustment after playtesting. These should be easy to tweak in `constants.js`.
3. **Canvas scaling**: Fixed pixel size or scale to viewport? Recommend fixed size with CSS centering for Phase 1, responsive scaling in Phase 2.

## References

- [Suika Game - Wikipedia](https://en.wikipedia.org/wiki/Suika_Game)
- [Matter.js Documentation](https://brm.io/matter-js/docs/)
- [Matter.js GitHub](https://github.com/liabru/matter-js)
- [Vite Getting Started](https://vitejs.dev/guide/)
- [Suika Game Fruits & Points](https://suikagame.com/games/suika-game-fruits-points-list/)
- [Example clone: sgbj/suika-clone (Phaser + Matter.js + TS)](https://github.com/sgbj/suika-clone)
- [Example clone: TomboFry/suika-game (plain JS + Matter.js)](https://github.com/TomboFry/suika-game)
