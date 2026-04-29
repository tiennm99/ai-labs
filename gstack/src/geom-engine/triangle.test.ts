import { describe, expect, it } from 'vitest';
import { congruentSSS, sides, triangle } from './triangle';
import { EPSILON_LEN, vec } from './vec';

describe('sides', () => {
  it('returns the three side lengths in the AB / BC / CA order', () => {
    const t = triangle(vec(0, 0), vec(3, 0), vec(0, 4));
    const s = sides(t);
    expect(s.ab).toBe(3);
    expect(s.bc).toBe(5);
    expect(s.ca).toBe(4);
  });

  it('handles degenerate (collinear) triangles without crashing', () => {
    const t = triangle(vec(0, 0), vec(1, 0), vec(2, 0));
    const s = sides(t);
    expect(s.ab).toBe(1);
    expect(s.bc).toBe(1);
    expect(s.ca).toBe(2);
  });
});

describe('congruentSSS', () => {
  const t1 = triangle(vec(0, 0), vec(3, 0), vec(0, 4));

  it('detects identical triangles', () => {
    expect(congruentSSS(t1, t1)).toBe(true);
  });

  it('detects translated congruent triangles (translation preserves congruence)', () => {
    const t2 = triangle(vec(10, 10), vec(13, 10), vec(10, 14));
    expect(congruentSSS(t1, t2)).toBe(true);
  });

  it('rejects similar-but-not-congruent triangles (2x scale)', () => {
    const t2 = triangle(vec(0, 0), vec(6, 0), vec(0, 8));
    expect(congruentSSS(t1, t2)).toBe(false);
  });

  it('rejects triangles with different shape', () => {
    const t2 = triangle(vec(0, 0), vec(3, 0), vec(2, 5));
    expect(congruentSSS(t1, t2)).toBe(false);
  });

  it('treats matches within EPSILON_LEN as congruent', () => {
    const t2 = triangle(vec(0, 0), vec(3 + EPSILON_LEN / 2, 0), vec(0, 4));
    expect(congruentSSS(t1, t2)).toBe(true);
  });

  it('rejects matches just outside EPSILON_LEN', () => {
    const t2 = triangle(vec(0, 0), vec(3 + EPSILON_LEN * 2, 0), vec(0, 4));
    expect(congruentSSS(t1, t2)).toBe(false);
  });

  it('is position-strict: permuted side-length sets do NOT count as congruent', () => {
    // Same side-length set {3, 4, 5} but in a different label order.
    // Strict SSS: AB(t1)=3, AB(t2)=4 → not congruent under our convention.
    const t2 = triangle(vec(0, 0), vec(0, 4), vec(3, 4));
    expect(congruentSSS(t1, t2)).toBe(false);
  });

  it('is symmetric: congruentSSS(t1, t2) === congruentSSS(t2, t1)', () => {
    const t2 = triangle(vec(7, 7), vec(10, 7), vec(7, 11));
    expect(congruentSSS(t1, t2)).toBe(congruentSSS(t2, t1));
  });
});
