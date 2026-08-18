import { dist, EPSILON_LEN } from './vec';

/** @typedef {import('./vec').Vec2} Vec2 */

/**
 * @typedef {{ readonly a: Vec2, readonly b: Vec2, readonly c: Vec2 }} Triangle
 */

/**
 * @param {Vec2} a
 * @param {Vec2} b
 * @param {Vec2} c
 * @returns {Triangle}
 */
export function triangle(a, b, c) {
  return { a, b, c };
}

/**
 * @typedef {{ readonly ab: number, readonly bc: number, readonly ca: number }} SideLengths
 */

/**
 * @param {Triangle} t
 * @returns {SideLengths}
 */
export function sides(t) {
  return {
    ab: dist(t.a, t.b),
    bc: dist(t.b, t.c),
    ca: dist(t.c, t.a),
  };
}

/**
 * Position-strict SSS: corresponding sides must match (AB↔A'B', BC↔B'C', CA↔C'A').
 * SGK pedagogy treats vertex labels as defining the correspondence — a permuted
 * match would still be the same shape but a different theorem case. We want the
 * strict labeled version so the UI's color/tick pairing has unambiguous meaning.
 * @param {Triangle} t1
 * @param {Triangle} t2
 * @param {number} [eps]
 * @returns {boolean}
 */
export function congruentSSS(t1, t2, eps = EPSILON_LEN) {
  const s1 = sides(t1);
  const s2 = sides(t2);
  return (
    Math.abs(s1.ab - s2.ab) < eps &&
    Math.abs(s1.bc - s2.bc) < eps &&
    Math.abs(s1.ca - s2.ca) < eps
  );
}
