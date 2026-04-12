import {
  createEngine,
  createWalls,
  createFruitBody,
  addToWorld,
  getAllBodies,
  stepEngine,
} from './physics.js';
import { setupMergeHandler } from './merger.js';
import { render } from './renderer.js';
import { clampX } from './input.js';
import { FRUITS, getRandomDroppableTier } from './fruits.js';
import {
  CANVAS_WIDTH,
  CONTAINER_Y,
  DANGER_LINE_Y,
  DROP_COOLDOWN_MS,
  NEW_FRUIT_GRACE_MS,
} from './constants.js';

export class Game {
  constructor(ctx) {
    this.ctx = ctx;
    this.engine = null;
    this.mergeHandler = null;
    this.state = null;
    this.lastTime = 0;
    this.animFrameId = null;
    this.cooldownTimer = null;
    this.init();
  }

  init() {
    this.engine = createEngine();
    const walls = createWalls();
    addToWorld(this.engine, walls);

    this.state = {
      score: 0,
      nextFruitTier: getRandomDroppableTier(),
      isDropCooldown: false,
      isGameOver: false,
      cursorX: CANVAS_WIDTH / 2,
    };

    this.mergeHandler = setupMergeHandler(
      this.engine,
      () => this.state,
      (points) => { this.state.score += points; }
    );
  }

  start() {
    this.lastTime = performance.now();
    this.loop(this.lastTime);
  }

  loop(time) {
    const delta = time - this.lastTime;
    this.lastTime = time;

    if (!this.state.isGameOver) {
      stepEngine(this.engine, delta);
      this.mergeHandler.flushMerges();
      this.checkGameOver();
    }

    const bodies = getAllBodies(this.engine);
    render(this.ctx, bodies, this.state);

    this.animFrameId = requestAnimationFrame((t) => this.loop(t));
  }

  setCursorX(x) {
    this.state.cursorX = clampX(x, this.state.nextFruitTier);
  }

  drop() {
    if (this.state.isDropCooldown || this.state.isGameOver) return;

    const tier = this.state.nextFruitTier;
    const x = this.state.cursorX;
    const y = CONTAINER_Y - 5;

    const fruit = createFruitBody(tier, x, y);
    addToWorld(this.engine, fruit);

    this.state.nextFruitTier = getRandomDroppableTier();
    this.state.isDropCooldown = true;

    this.cooldownTimer = setTimeout(() => {
      this.state.isDropCooldown = false;
    }, DROP_COOLDOWN_MS);
  }

  checkGameOver() {
    const now = Date.now();
    const bodies = getAllBodies(this.engine);

    for (const body of bodies) {
      if (body.fruitTier === undefined || body.isStatic || body.removing) continue;

      // Grace period for newly dropped fruits
      if (now - body.dropTime < NEW_FRUIT_GRACE_MS) continue;

      const fruit = FRUITS[body.fruitTier];
      const topEdge = body.position.y - fruit.radius;
      if (topEdge < DANGER_LINE_Y) {
        this.state.isGameOver = true;
        return;
      }
    }
  }

  restart() {
    if (this.cooldownTimer) clearTimeout(this.cooldownTimer);
    if (this.animFrameId) cancelAnimationFrame(this.animFrameId);
    // createEngine() in init() creates a fresh engine object;
    // old engine is abandoned and GC'd with its event listeners.
    this.init();
    this.start();
  }
}
