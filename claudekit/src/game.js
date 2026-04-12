import {
  createEngine,
  createWalls,
  createFruitBody,
  addToWorld,
  removeFromWorld,
  getAllBodies,
  stepEngine,
} from './physics.js';
import { setupMergeHandler } from './merger.js';
import { render } from './renderer.js';
import { clampX } from './input.js';
import { FRUITS, getRandomDroppableTier } from './fruits.js';
import {
  CANVAS_WIDTH,
  CONTAINER_X,
  CONTAINER_WIDTH,
  CONTAINER_Y,
  CONTAINER_HEIGHT,
  DANGER_LINE_Y,
  DROP_COOLDOWN_MS,
  NEW_FRUIT_GRACE_MS,
  PHYSICS_STEP_MS,
  MAX_SUB_STEPS,
} from './constants.js';

export class Game {
  constructor(ctx) {
    this.ctx = ctx;
    this.engine = null;
    this.mergeHandler = null;
    this.state = null;
    this.lastTime = 0;
    this.accumulator = 0;
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
      // Fixed-step sub-stepping: accumulate time and run physics in
      // consistent small steps to prevent tunneling through walls/floor.
      this.accumulator += delta;
      const maxAccumulated = PHYSICS_STEP_MS * MAX_SUB_STEPS;
      if (this.accumulator > maxAccumulated) {
        this.accumulator = maxAccumulated;
      }

      while (this.accumulator >= PHYSICS_STEP_MS) {
        stepEngine(this.engine, PHYSICS_STEP_MS);
        this.mergeHandler.flushMerges();
        this.accumulator -= PHYSICS_STEP_MS;
      }

      this.removeEscapedBodies();
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

  removeEscapedBodies() {
    const bodies = getAllBodies(this.engine);
    const margin = 100;
    const minX = CONTAINER_X - margin;
    const maxX = CONTAINER_X + CONTAINER_WIDTH + margin;
    const maxY = CONTAINER_Y + CONTAINER_HEIGHT + margin;

    for (const body of bodies) {
      if (body.fruitTier === undefined || body.isStatic) continue;
      const { x, y } = body.position;
      if (x < minX || x > maxX || y > maxY) {
        removeFromWorld(this.engine, body);
      }
    }
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
