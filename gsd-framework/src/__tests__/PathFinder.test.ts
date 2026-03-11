// src/__tests__/PathFinder.test.ts - Tests for PathFinder class
import { describe, it, expect, beforeEach } from 'vitest';
import { PathNode, MatchResult, Tile, TilePosition } from '../types';
import { PathFinder } from '../matching/PathFinder';
import { CONFIG } from '../config';

// Helper function to create a test grid
function createTestGrid(clearedPositions: TilePosition[][]): Tile[][] {
  const grid: Tile[][] = [];
  for (let row = 0; row < CONFIG.grid.rows; row++) {
    grid[row] = [];
    for (let col = 0; col < CONFIG.grid.cols; col++) {
      // Check if this position should be cleared
      const isCleared = clearedPositions.some(pos => pos[0].row === row && pos[0].col === col);
      grid[row][col] = {
        id: `tile-${row}-${col}`,
        type: 0,
        position: { row, col },
        cleared: isCleared
      };
    }
  }
  return grid;
}

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

describe('PathFinder', () => {
  describe('Test 1: Direct horizontal path (0 turns)', () => {
    it('should find path when tiles are on same row with cleared tiles between', () => {
      // Create grid with cleared path from (0,0) to (0,4)
      const clearedPositions = [
        [{ row: 0, col: 0 }, { row: 0, col: 1 }, { row: 0, col: 2 }, { row: 0, col: 3 }, { row: 0, col: 4 }]
      ];
      const grid = createTestGrid(clearedPositions);

      const start = { row: 0, col: 0 };
      const end = { row: 0, col: 4 };

      const result = PathFinder.findPath(start, end, grid);

      expect(result).not.toBeNull();
      expect(result!.turns).toBe(0);
      expect(result!.path).toHaveLength(5);
      expect(result!.path[0]).toEqual(start);
      expect(result!.path[4]).toEqual(end);
    });
  });

  describe('Test 2: Direct vertical path (0 turns)', () => {
    it('should find path when tiles are on same column with cleared tiles between', () => {
      const clearedPositions = [
        [{ row: 0, col: 0 }, { row: 1, col: 0 }, { row: 2, col: 0 }, { row: 3, col: 0 }, { row: 4, col: 0 }]
      ];
      const grid = createTestGrid(clearedPositions);

      const start = { row: 0, col: 0 };
      const end = { row: 4, col: 0 };

      const result = PathFinder.findPath(start, end, grid);

      expect(result).not.toBeNull();
      expect(result!.turns).toBe(0);
      expect(result!.path).toHaveLength(5);
      expect(result!.path[0]).toEqual(start);
      expect(result!.path[4]).toEqual(end);
    });
  });

  describe('Test 3: L-shaped path (1 turn)', () => {
    it('should find path with one turn around a corner', () => {
      // Create L-shaped path: (0,0) -> (0,2) -> (2,2)
      const clearedPositions = [
        [{ row: 0, col: 0 }, { row: 0, col: 1 }, { row: 0, col: 2 }],
        [{ row: 1, col: 2 }],
        [{ row: 2, col: 2 }]
      ];
      const grid = createTestGrid(clearedPositions);

      const start = { row: 0, col: 0 };
      const end = { row: 2, col: 2 };

      const result = PathFinder.findPath(start, end, grid);

      expect(result).not.toBeNull();
      expect(result!.turns).toBe(1);
      expect(result!.path[0]).toEqual(start);
      expect(result!.path[result!.path.length - 1]).toEqual(end);
    });
  });

  describe('Test 4: Z-shaped path (2 turns)', () => {
    it('should find path with two turns (Z-shaped)', () => {
      // Create Z-shaped path: (0,0) -> (0,2) -> (2,2) -> (2,4)
      const clearedPositions = [
        [{ row: 0, col: 0 }, { row: 0, col: 1 }, { row: 0, col: 2 }],
        [{ row: 1, col: 2 }],
        [{ row: 2, col: 2 }, { row: 2, col: 3 }, { row: 2, col: 4 }]
      ];
      const grid = createTestGrid(clearedPositions);

      const start = { row: 0, col: 0 };
      const end = { row: 2, col: 4 };

      const result = PathFinder.findPath(start, end, grid);

      expect(result).not.toBeNull();
      expect(result!.turns).toBe(2);
      expect(result!.path[0]).toEqual(start);
      expect(result!.path[result!.path.length - 1]).toEqual(end);
    });
  });

  describe('Test 5: Path with 3 turns is rejected', () => {
    it('should return null when path requires 3 or more turns', () => {
      // Create a path that requires 3 turns
      const clearedPositions = [
        [{ row: 0, col: 0 }, { row: 0, col: 1 }],
        [{ row: 1, col: 1 }, { row: 2, col: 1 }],
        [{ row: 2, col: 2 }],
        [{ row: 3, col: 2 }, { row: 4, col: 2 }]
      ];
      const grid = createTestGrid(clearedPositions);

      const start = { row: 0, col: 0 };
      const end = { row: 4, col: 2 };

      const result = PathFinder.findPath(start, end, grid, 2);

      expect(result).toBeNull();
    });
  });

  describe('Test 6: Path through uncleared tile is rejected', () => {
    it('should return null when direct path is blocked by uncleared tile', () => {
      // Clear only start and end, but not the middle
      const clearedPositions = [
        [{ row: 0, col: 0 }],
        [{ row: 0, col: 2 }]
      ];
      const grid = createTestGrid(clearedPositions);

      const start = { row: 0, col: 0 };
      const end = { row: 0, col: 2 };

      const result = PathFinder.findPath(start, end, grid);

      expect(result).toBeNull();
    });
  });

  describe('Test 7: No path exists returns null', () => {
    it('should return null when no valid path exists', () => {
      // Clear only isolated tiles with no connection
      const clearedPositions = [
        [{ row: 0, col: 0 }],
        [{ row: 5, col: 5 }]
      ];
      const grid = createTestGrid(clearedPositions);

      const start = { row: 0, col: 0 };
      const end = { row: 5, col: 5 };

      const result = PathFinder.findPath(start, end, grid);

      expect(result).toBeNull();
    });
  });

  describe('Test 8: Returns path including start and end positions', () => {
    it('should include both start and end positions in the path', () => {
      const clearedPositions = [
        [{ row: 0, col: 0 }, { row: 0, col: 1 }, { row: 0, col: 2 }]
      ];
      const grid = createTestGrid(clearedPositions);

      const start = { row: 0, col: 0 };
      const end = { row: 0, col: 2 };

      const result = PathFinder.findPath(start, end, grid);

      expect(result).not.toBeNull();
      expect(result!.path[0]).toEqual(start);
      expect(result!.path[result!.path.length - 1]).toEqual(end);
    });
  });

  describe('Test 9: Correctly counts turns (direction changes only)', () => {
    it('should count only direction changes as turns', () => {
      // Path: right 3 steps, down 1 step, right 2 steps = 1 turn
      const clearedPositions = [
        [{ row: 0, col: 0 }, { row: 0, col: 1 }, { row: 0, col: 2 }, { row: 0, col: 3 }],
        [{ row: 1, col: 3 }],
        [{ row: 1, col: 4 }, { row: 1, col: 5 }]
      ];
      const grid = createTestGrid(clearedPositions);

      const start = { row: 0, col: 0 };
      const end = { row: 1, col: 5 };

      const result = PathFinder.findPath(start, end, grid);

      expect(result).not.toBeNull();
      expect(result!.turns).toBe(1); // Only one direction change (right -> down)
    });
  });

  describe('Test 10: Start position with direction=-1 has 0 turns', () => {
    it('should not count the first move as a turn', () => {
      // Moving in any direction from start should be 0 turns initially
      const clearedPositions = [
        [{ row: 0, col: 0 }, { row: 0, col: 1 }]
      ];
      const grid = createTestGrid(clearedPositions);

      const start = { row: 0, col: 0 };
      const end = { row: 0, col: 1 };

      const result = PathFinder.findPath(start, end, grid);

      expect(result).not.toBeNull();
      expect(result!.turns).toBe(0); // First move doesn't count as turn
    });
  });
});
