import type { Vec2 } from './vec';
import { add, dot, len, normalize, scale, sub, vec } from './vec';

export interface Circle {
  readonly center: Vec2;
  readonly radius: number;
}

export function circle(cx: number, cy: number, r: number): Circle {
  return { center: vec(cx, cy), radius: r };
}

export function projectToCircle(point: Vec2, c: Circle): Vec2 {
  const dir = sub(point, c.center);
  const d = len(dir);
  if (d === 0) {
    // Point is at the center; pick the +x direction by convention.
    return add(c.center, vec(c.radius, 0));
  }
  return add(c.center, scale(normalize(dir), c.radius));
}

export function pointOnCircle(c: Circle, angleDeg: number): Vec2 {
  const rad = (angleDeg * Math.PI) / 180;
  return vec(c.center.x + c.radius * Math.cos(rad), c.center.y + c.radius * Math.sin(rad));
}

export function angleAtVertex(a: Vec2, vertex: Vec2, b: Vec2): number {
  // Returns the unsigned angle at `vertex` of triangle (a, vertex, b), in degrees.
  // Range: [0, 180]. Returns 0 if `vertex` coincides with `a` or `b`.
  const va = sub(a, vertex);
  const vb = sub(b, vertex);
  const lenA = len(va);
  const lenB = len(vb);
  if (lenA === 0 || lenB === 0) return 0;
  // Clamp guards against float drift outside [-1, 1] which would NaN the acos.
  const cosTheta = Math.max(-1, Math.min(1, dot(va, vb) / (lenA * lenB)));
  return (Math.acos(cosTheta) * 180) / Math.PI;
}
