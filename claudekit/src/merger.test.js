import { describe, it, expect } from 'vitest';
import { computeMergePoints, computeMidpoint } from './merger.js';
import { FRUITS } from './fruits.js';

describe('merger', () => {
  describe('computeMergePoints', () => {
    it('returns points of the next tier fruit', () => {
      expect(computeMergePoints(0)).toBe(FRUITS[1].points); // Cherry -> Strawberry points
      expect(computeMergePoints(3)).toBe(FRUITS[4].points); // Dekopon -> Persimmon points
      expect(computeMergePoints(9)).toBe(FRUITS[10].points); // Melon -> Watermelon points
    });

    it('returns 66 when merging two watermelons (tier 10)', () => {
      expect(computeMergePoints(10)).toBe(66);
    });
  });

  describe('computeMidpoint', () => {
    it('calculates the midpoint of two bodies', () => {
      const bodyA = { position: { x: 100, y: 200 } };
      const bodyB = { position: { x: 300, y: 400 } };
      const mid = computeMidpoint(bodyA, bodyB);
      expect(mid.x).toBe(200);
      expect(mid.y).toBe(300);
    });

    it('handles same position', () => {
      const bodyA = { position: { x: 150, y: 250 } };
      const bodyB = { position: { x: 150, y: 250 } };
      const mid = computeMidpoint(bodyA, bodyB);
      expect(mid.x).toBe(150);
      expect(mid.y).toBe(250);
    });
  });
});
