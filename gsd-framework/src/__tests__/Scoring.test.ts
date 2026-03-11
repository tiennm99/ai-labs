// src/__tests__/Scoring.test.ts - Test suite for Scoring system
import { describe, it, expect } from 'vitest';
import { Scoring } from '../matching/Scoring';

describe('Scoring', () => {
  describe('calculate', () => {
    it('should return base score of 100 for 2-turn match', () => {
      const score = Scoring.calculate(2);
      expect(score).toBe(100);
    });

    it('should return 150 (50% bonus) for 0-turn match', () => {
      const score = Scoring.calculate(0);
      expect(score).toBe(150);
    });

    it('should return 125 (25% bonus) for 1-turn match', () => {
      const score = Scoring.calculate(1);
      expect(score).toBe(125);
    });

    it('should default to base score for invalid turn count', () => {
      const score = Scoring.calculate(5);
      expect(score).toBe(100);
    });

    it('should return integer scores (no floating point)', () => {
      const score = Scoring.calculate(0);
      expect(Number.isInteger(score)).toBe(true);
      expect(score).toBe(150);
    });
  });
});
