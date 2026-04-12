import { describe, it, expect } from 'vitest';
import Matter from 'matter-js';
import {
  createEngine,
  createWalls,
  createFruitBody,
  addToWorld,
  getAllBodies,
  stepEngine,
} from './physics.js';

describe('physics integration', () => {
  it('creates an engine with correct gravity', () => {
    const engine = createEngine();
    expect(engine.gravity.x).toBe(0);
    expect(engine.gravity.y).toBe(1.5);
  });

  it('creates walls as static bodies', () => {
    const walls = createWalls();
    expect(walls).toHaveLength(3);
    walls.forEach((wall) => {
      expect(wall.isStatic).toBe(true);
    });
  });

  it('creates fruit body with correct tier and label', () => {
    const body = createFruitBody(3, 250, 100);
    expect(body.fruitTier).toBe(3);
    expect(body.label).toBe('fruit_3');
    expect(body.removing).toBe(false);
  });

  it('fruit falls under gravity when engine steps', () => {
    const engine = createEngine();
    const walls = createWalls();
    addToWorld(engine, walls);

    const fruit = createFruitBody(0, 250, 100);
    addToWorld(engine, fruit);

    const initialY = fruit.position.y;

    // Step the engine several times
    for (let i = 0; i < 10; i++) {
      stepEngine(engine, 1000 / 60);
    }

    expect(fruit.position.y).toBeGreaterThan(initialY);
  });

  it('same-tier fruit collision triggers merge via collision event', () => {
    const engine = createEngine();
    const walls = createWalls();
    addToWorld(engine, walls);

    // Place two same-tier fruits very close so they collide
    const fruitA = createFruitBody(2, 250, 400);
    const fruitB = createFruitBody(2, 252, 400);
    addToWorld(engine, fruitA, fruitB);

    let mergeDetected = false;
    Matter.Events.on(engine, 'collisionStart', (event) => {
      for (const pair of event.pairs) {
        if (pair.bodyA.label === pair.bodyB.label &&
            pair.bodyA.fruitTier !== undefined) {
          mergeDetected = true;
        }
      }
    });

    // Step engine to trigger collision
    for (let i = 0; i < 60; i++) {
      stepEngine(engine, 1000 / 60);
    }

    expect(mergeDetected).toBe(true);
  });
});
