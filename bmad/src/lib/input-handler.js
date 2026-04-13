import { DIRECTIONS } from './constants.js';

const KEY_MAP = {
  ArrowUp: DIRECTIONS.UP,
  ArrowDown: DIRECTIONS.DOWN,
  ArrowLeft: DIRECTIONS.LEFT,
  ArrowRight: DIRECTIONS.RIGHT,
};

export function getDirectionFromKey(key) {
  return KEY_MAP[key] || null;
}
