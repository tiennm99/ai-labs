import Matter from 'matter-js';
import { FRUITS } from './fruits.js';
import { createFruitBody, addToWorld, removeFromWorld } from './physics.js';

const { Events } = Matter;

export function setupMergeHandler(engine, getState, addScore) {
  const pendingMerges = [];

  Events.on(engine, 'collisionStart', (event) => {
    for (const pair of event.pairs) {
      const { bodyA, bodyB } = pair;

      if (
        bodyA.fruitTier !== undefined &&
        bodyB.fruitTier !== undefined &&
        bodyA.label === bodyB.label &&
        !bodyA.removing &&
        !bodyB.removing
      ) {
        bodyA.removing = true;
        bodyB.removing = true;
        pendingMerges.push({ bodyA, bodyB, tier: bodyA.fruitTier });
      }
    }
  });

  function flushMerges() {
    for (const { bodyA, bodyB, tier } of pendingMerges) {
      const midX = (bodyA.position.x + bodyB.position.x) / 2;
      const midY = (bodyA.position.y + bodyB.position.y) / 2;

      removeFromWorld(engine, bodyA, bodyB);

      if (tier < 10) {
        const newFruit = createFruitBody(tier + 1, midX, midY);
        addToWorld(engine, newFruit);
      }

      const points = FRUITS[tier + 1]?.points ?? 66;
      addScore(points);
    }
    pendingMerges.length = 0;
  }

  return { flushMerges };
}

export function computeMergePoints(tier) {
  return FRUITS[tier + 1]?.points ?? 66;
}

export function computeMidpoint(bodyA, bodyB) {
  return {
    x: (bodyA.position.x + bodyB.position.x) / 2,
    y: (bodyA.position.y + bodyB.position.y) / 2,
  };
}
