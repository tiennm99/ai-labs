// Game dimensions
export const CANVAS_WIDTH = 500;
export const CANVAS_HEIGHT = 700;

export const CONTAINER_WIDTH = 400;
export const CONTAINER_HEIGHT = 600;
export const CONTAINER_X = (CANVAS_WIDTH - CONTAINER_WIDTH) / 2;
export const CONTAINER_Y = CANVAS_HEIGHT - CONTAINER_HEIGHT - 20;

export const WALL_THICKNESS = 10;

// Danger line: ~50px below the top of the container walls
export const DANGER_LINE_Y = CONTAINER_Y + 50;

// Physics
export const GRAVITY = { x: 0, y: 1.5 };
export const FRUIT_BODY_OPTIONS = {
  restitution: 0.2,
  friction: 0.5,
  frictionAir: 0.01,
  density: 0.001,
};

// Timing
export const DROP_COOLDOWN_MS = 500;
export const NEW_FRUIT_GRACE_MS = 1000;
