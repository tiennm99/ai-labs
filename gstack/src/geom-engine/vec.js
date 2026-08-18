/**
 * @typedef {{ readonly x: number, readonly y: number }} Vec2
 */

export const EPSILON_LEN = 0.5;
export const EPSILON_ANGLE_DEG = 0.5;

/**
 * @param {number} x
 * @param {number} y
 * @returns {Vec2}
 */
export function vec(x, y) {
  return { x, y };
}

/**
 * @param {Vec2} a
 * @param {Vec2} b
 * @returns {Vec2}
 */
export function add(a, b) {
  return { x: a.x + b.x, y: a.y + b.y };
}

/**
 * @param {Vec2} a
 * @param {Vec2} b
 * @returns {Vec2}
 */
export function sub(a, b) {
  return { x: a.x - b.x, y: a.y - b.y };
}

/**
 * @param {Vec2} a
 * @param {number} k
 * @returns {Vec2}
 */
export function scale(a, k) {
  // `+ 0` normalizes IEEE-754 -0 back to +0 so consumers comparing coordinates
  // with === or Object.is don't see a signed-zero ghost from k=0 paths.
  return { x: a.x * k + 0, y: a.y * k + 0 };
}

/**
 * @param {Vec2} a
 * @param {Vec2} b
 * @returns {number}
 */
export function dot(a, b) {
  return a.x * b.x + a.y * b.y;
}

/**
 * @param {Vec2} a
 * @returns {number}
 */
export function len(a) {
  return Math.hypot(a.x, a.y);
}

/**
 * @param {Vec2} a
 * @param {Vec2} b
 * @returns {number}
 */
export function dist(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

/**
 * @param {Vec2} a
 * @returns {Vec2}
 */
export function normalize(a) {
  const l = len(a);
  if (l === 0) return { x: 0, y: 0 };
  return { x: a.x / l, y: a.y / l };
}

/**
 * @param {number} a
 * @param {number} b
 * @param {number} [eps]
 * @returns {boolean}
 */
export function approxEqualLen(a, b, eps = EPSILON_LEN) {
  return Math.abs(a - b) < eps;
}
