import { add, dot, len, normalize, scale, sub, vec } from './vec';

/** @typedef {import('./vec').Vec2} Vec2 */

/**
 * @typedef {{ readonly center: Vec2, readonly radius: number }} Circle
 */

/**
 * @param {number} cx
 * @param {number} cy
 * @param {number} r
 * @returns {Circle}
 */
export function circle(cx, cy, r) {
  return { center: vec(cx, cy), radius: r };
}

/**
 * @param {Vec2} point
 * @param {Circle} c
 * @returns {Vec2}
 */
export function projectToCircle(point, c) {
  const dir = sub(point, c.center);
  const d = len(dir);
  if (d === 0) {
    // Point is at the center; pick the +x direction by convention.
    return add(c.center, vec(c.radius, 0));
  }
  return add(c.center, scale(normalize(dir), c.radius));
}

/**
 * @param {Circle} c
 * @param {number} angleDeg
 * @returns {Vec2}
 */
export function pointOnCircle(c, angleDeg) {
  const rad = (angleDeg * Math.PI) / 180;
  return vec(c.center.x + c.radius * Math.cos(rad), c.center.y + c.radius * Math.sin(rad));
}

/**
 * Returns the unsigned angle at `vertex` of triangle (a, vertex, b), in degrees.
 * Range: [0, 180]. Returns 0 if `vertex` coincides with `a` or `b`.
 * @param {Vec2} a
 * @param {Vec2} vertex
 * @param {Vec2} b
 * @returns {number}
 */
export function angleAtVertex(a, vertex, b) {
  const va = sub(a, vertex);
  const vb = sub(b, vertex);
  const lenA = len(va);
  const lenB = len(vb);
  if (lenA === 0 || lenB === 0) return 0;
  // Clamp guards against float drift outside [-1, 1] which would NaN the acos.
  const cosTheta = Math.max(-1, Math.min(1, dot(va, vb) / (lenA * lenB)));
  return (Math.acos(cosTheta) * 180) / Math.PI;
}
