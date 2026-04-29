export interface Vec2 {
  readonly x: number;
  readonly y: number;
}

export const EPSILON_LEN = 0.5;
export const EPSILON_ANGLE_DEG = 0.5;

export function vec(x: number, y: number): Vec2 {
  return { x, y };
}

export function add(a: Vec2, b: Vec2): Vec2 {
  return { x: a.x + b.x, y: a.y + b.y };
}

export function sub(a: Vec2, b: Vec2): Vec2 {
  return { x: a.x - b.x, y: a.y - b.y };
}

export function scale(a: Vec2, k: number): Vec2 {
  // `+ 0` normalizes IEEE-754 -0 back to +0 so consumers comparing coordinates
  // with === or Object.is don't see a signed-zero ghost from k=0 paths.
  return { x: a.x * k + 0, y: a.y * k + 0 };
}

export function dot(a: Vec2, b: Vec2): number {
  return a.x * b.x + a.y * b.y;
}

export function len(a: Vec2): number {
  return Math.hypot(a.x, a.y);
}

export function dist(a: Vec2, b: Vec2): number {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

export function normalize(a: Vec2): Vec2 {
  const l = len(a);
  if (l === 0) return { x: 0, y: 0 };
  return { x: a.x / l, y: a.y / l };
}

export function approxEqualLen(a: number, b: number, eps = EPSILON_LEN): boolean {
  return Math.abs(a - b) < eps;
}
