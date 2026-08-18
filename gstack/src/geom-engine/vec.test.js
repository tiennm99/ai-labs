import { describe, expect, it } from 'vitest';
import {
  add,
  approxEqualLen,
  dist,
  dot,
  EPSILON_LEN,
  len,
  normalize,
  scale,
  sub,
  vec,
} from './vec';

describe('add', () => {
  it('is commutative', () => {
    const a = vec(2, 3);
    const b = vec(-1, 4);
    expect(add(a, b)).toEqual(add(b, a));
  });

  it('returns a new object (does not mutate)', () => {
    const a = vec(1, 2);
    const b = vec(3, 4);
    const before = { ...a };
    add(a, b);
    expect(a).toEqual(before);
  });
});

describe('sub', () => {
  it('is the inverse of add', () => {
    const a = vec(5, 7);
    const b = vec(2, 1);
    expect(sub(add(a, b), b)).toEqual(a);
  });
});

describe('scale', () => {
  it('multiplies both components by k', () => {
    expect(scale(vec(2, 3), 4)).toEqual(vec(8, 12));
  });

  it('handles k = 0', () => {
    expect(scale(vec(7, -3), 0)).toEqual(vec(0, 0));
  });
});

describe('dot', () => {
  it('computes the standard inner product', () => {
    expect(dot(vec(1, 2), vec(3, 4))).toBe(11);
  });

  it('returns 0 for orthogonal vectors', () => {
    expect(dot(vec(1, 0), vec(0, 1))).toBe(0);
  });
});

describe('len and dist', () => {
  it('len of (3,4) is 5', () => {
    expect(len(vec(3, 4))).toBe(5);
  });

  it('dist is symmetric', () => {
    const a = vec(1, 2);
    const b = vec(4, 6);
    expect(dist(a, b)).toBeCloseTo(dist(b, a));
  });

  it('dist of a point with itself is 0', () => {
    expect(dist(vec(7, -3), vec(7, -3))).toBe(0);
  });
});

describe('normalize', () => {
  it('returns a unit vector for non-zero input', () => {
    const n = normalize(vec(3, 4));
    expect(len(n)).toBeCloseTo(1, 10);
  });

  it('returns the zero vector for the zero vector', () => {
    expect(normalize(vec(0, 0))).toEqual(vec(0, 0));
  });

  it('preserves direction', () => {
    const n = normalize(vec(2, 0));
    expect(n).toEqual(vec(1, 0));
  });
});

describe('approxEqualLen with EPSILON_LEN', () => {
  it('treats values within epsilon as equal', () => {
    expect(approxEqualLen(10, 10 + EPSILON_LEN / 2)).toBe(true);
  });

  it('rejects values outside epsilon', () => {
    expect(approxEqualLen(10, 10 + EPSILON_LEN * 2)).toBe(false);
  });

  it('uses 0.5 as the default tolerance (per autoplan eng decision)', () => {
    expect(EPSILON_LEN).toBe(0.5);
  });
});
