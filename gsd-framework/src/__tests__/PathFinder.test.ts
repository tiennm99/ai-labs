// src/__tests__/PathFinder.test.ts - Tests for PathFinder class
import { describe, it, expect } from 'vitest';
import { PathNode, MatchResult } from '../types';

describe('PathFinder Types', () => {
  describe('PathNode interface', () => {
    it('should have row property', () => {
      const node: PathNode = {
        row: 0,
        col: 0,
        direction: -1,
        turns: 0,
        path: []
      };
      expect(node.row).toBeDefined();
      expect(typeof node.row).toBe('number');
    });

    it('should have col property', () => {
      const node: PathNode = {
        row: 0,
        col: 0,
        direction: -1,
        turns: 0,
        path: []
      };
      expect(node.col).toBeDefined();
      expect(typeof node.col).toBe('number');
    });

    it('should have direction property', () => {
      const node: PathNode = {
        row: 0,
        col: 0,
        direction: -1,
        turns: 0,
        path: []
      };
      expect(node.direction).toBeDefined();
      expect(typeof node.direction).toBe('number');
    });

    it('should have turns property', () => {
      const node: PathNode = {
        row: 0,
        col: 0,
        direction: -1,
        turns: 0,
        path: []
      };
      expect(node.turns).toBeDefined();
      expect(typeof node.turns).toBe('number');
    });

    it('should have path property', () => {
      const node: PathNode = {
        row: 0,
        col: 0,
        direction: -1,
        turns: 0,
        path: []
      };
      expect(node.path).toBeDefined();
      expect(Array.isArray(node.path)).toBe(true);
    });
  });

  describe('MatchResult interface', () => {
    it('should have valid property', () => {
      const result: MatchResult = {
        valid: true,
        path: [],
        turns: 0
      };
      expect(result.valid).toBeDefined();
      expect(typeof result.valid).toBe('boolean');
    });

    it('should have optional reason property', () => {
      const result: MatchResult = {
        valid: false,
        reason: 'Invalid match'
      };
      expect(result.reason).toBeDefined();
      expect(typeof result.reason).toBe('string');
    });

    it('should have optional path property', () => {
      const result: MatchResult = {
        valid: true,
        path: [{ row: 0, col: 0 }],
        turns: 0
      };
      expect(result.path).toBeDefined();
      expect(Array.isArray(result.path)).toBe(true);
    });

    it('should have optional turns property', () => {
      const result: MatchResult = {
        valid: true,
        path: [],
        turns: 2
      };
      expect(result.turns).toBeDefined();
      expect(typeof result.turns).toBe('number');
    });
  });
});
