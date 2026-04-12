import Matter from 'matter-js';
import { FRUITS } from './fruits.js';
import {
  CANVAS_WIDTH,
  CONTAINER_WIDTH,
  CONTAINER_HEIGHT,
  CONTAINER_X,
  CONTAINER_Y,
  WALL_THICKNESS,
  GRAVITY,
  FRUIT_BODY_OPTIONS,
} from './constants.js';

const { Engine, Bodies, Composite } = Matter;

export function createEngine() {
  return Engine.create({ gravity: GRAVITY });
}

export function createWalls() {
  const leftX = CONTAINER_X - WALL_THICKNESS / 2;
  const rightX = CONTAINER_X + CONTAINER_WIDTH + WALL_THICKNESS / 2;
  const wallHeight = CONTAINER_HEIGHT;
  const wallY = CONTAINER_Y + CONTAINER_HEIGHT / 2;

  const floorY = CONTAINER_Y + CONTAINER_HEIGHT + WALL_THICKNESS / 2;
  const floorWidth = CONTAINER_WIDTH + WALL_THICKNESS * 2;

  const wallOptions = { isStatic: true, friction: 0.5, render: { visible: false } };

  const leftWall = Bodies.rectangle(leftX, wallY, WALL_THICKNESS, wallHeight, wallOptions);
  const rightWall = Bodies.rectangle(rightX, wallY, WALL_THICKNESS, wallHeight, wallOptions);
  const floor = Bodies.rectangle(CANVAS_WIDTH / 2, floorY, floorWidth, WALL_THICKNESS, wallOptions);

  return [leftWall, rightWall, floor];
}

export function createFruitBody(tier, x, y) {
  const fruit = FRUITS[tier];
  const body = Bodies.circle(x, y, fruit.radius, {
    ...FRUIT_BODY_OPTIONS,
    label: `fruit_${tier}`,
  });
  body.fruitTier = tier;
  body.removing = false;
  body.dropTime = Date.now();
  return body;
}

export function addToWorld(engine, ...bodies) {
  Composite.add(engine.world, bodies.flat());
}

export function removeFromWorld(engine, ...bodies) {
  Composite.remove(engine.world, bodies.flat());
}

export function getAllBodies(engine) {
  return Composite.allBodies(engine.world);
}

export function stepEngine(engine, delta) {
  Engine.update(engine, delta);
}
