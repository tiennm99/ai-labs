import type { Vec2 } from './vec';
import { dist, EPSILON_LEN } from './vec';

export interface Triangle {
  readonly a: Vec2;
  readonly b: Vec2;
  readonly c: Vec2;
}

export function triangle(a: Vec2, b: Vec2, c: Vec2): Triangle {
  return { a, b, c };
}

export interface SideLengths {
  readonly ab: number;
  readonly bc: number;
  readonly ca: number;
}

export function sides(t: Triangle): SideLengths {
  return {
    ab: dist(t.a, t.b),
    bc: dist(t.b, t.c),
    ca: dist(t.c, t.a),
  };
}

// Position-strict SSS: corresponding sides must match (AB↔A'B', BC↔B'C', CA↔C'A').
// SGK pedagogy treats vertex labels as defining the correspondence — a permuted
// match would still be the same shape but a different theorem case. We want the
// strict labeled version so the UI's color/tick pairing has unambiguous meaning.
export function congruentSSS(t1: Triangle, t2: Triangle, eps = EPSILON_LEN): boolean {
  const s1 = sides(t1);
  const s2 = sides(t2);
  return (
    Math.abs(s1.ab - s2.ab) < eps &&
    Math.abs(s1.bc - s2.bc) < eps &&
    Math.abs(s1.ca - s2.ca) < eps
  );
}
