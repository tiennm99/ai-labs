import { DIRECTIONS } from './constants.js';

const KEY_MAP = {
  ArrowUp: DIRECTIONS.UP,
  ArrowDown: DIRECTIONS.DOWN,
  ArrowLeft: DIRECTIONS.LEFT,
  ArrowRight: DIRECTIONS.RIGHT,
  // WASD
  w: DIRECTIONS.UP,
  W: DIRECTIONS.UP,
  a: DIRECTIONS.LEFT,
  A: DIRECTIONS.LEFT,
  s: DIRECTIONS.DOWN,
  S: DIRECTIONS.DOWN,
  d: DIRECTIONS.RIGHT,
  D: DIRECTIONS.RIGHT,
  // Vim hjkl
  h: DIRECTIONS.LEFT,
  H: DIRECTIONS.LEFT,
  j: DIRECTIONS.DOWN,
  J: DIRECTIONS.DOWN,
  k: DIRECTIONS.UP,
  K: DIRECTIONS.UP,
  l: DIRECTIONS.RIGHT,
  L: DIRECTIONS.RIGHT,
};

export function getDirectionFromKey(key) {
  return KEY_MAP[key] || null;
}

const SWIPE_THRESHOLD = 10;

export function getDirectionFromSwipe(startX, startY, endX, endY) {
  const deltaX = endX - startX;
  const deltaY = endY - startY;
  const absDeltaX = Math.abs(deltaX);
  const absDeltaY = Math.abs(deltaY);

  if (absDeltaX < SWIPE_THRESHOLD && absDeltaY < SWIPE_THRESHOLD) {
    return null;
  }

  if (absDeltaX >= absDeltaY) {
    return deltaX < 0 ? DIRECTIONS.LEFT : DIRECTIONS.RIGHT;
  } else {
    return deltaY < 0 ? DIRECTIONS.UP : DIRECTIONS.DOWN;
  }
}
