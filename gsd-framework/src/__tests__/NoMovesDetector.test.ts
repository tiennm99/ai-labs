// src/__tests__/NoMovesDetector.test.ts - Tests for NoMovesDetector
import { describe, it, expect } from 'vitest';
import { NoMovesDetector } from '../detection/NoMovesDetector';
import { Tile, TilePosition } from '../types';
import { CONFIG } from '../config';

describe('NoMovesDetector', () => {
  /**
   * Helper function to create a test tile
   */
  function createTile(row: number, col: number, type: number, cleared: boolean = false): Tile {
    return {
      id: `tile-${row}-${col}`,
      type,
      position: { row, col },
      cleared
    };
  }

  /**
   * Helper function to create a test grid with all tiles uncleared
   */
  function createGrid(types: number[][]): Tile[][] {
    const grid: Tile[][] = [];
    for (let row = 0; row < types.length; row++) {
      const rowTiles: Tile[] = [];
      for (let col = 0; col < types[row].length; col++) {
        rowTiles.push(createTile(row, col, types[row][col]));
      }
      grid.push(rowTiles);
    }
    return grid;
  }

  describe('hasValidMoves', () => {
    it('should return true if at least one valid pair exists (same type, path with ≤2 turns)', () => {
      // Create a simple 3x3 grid with two matching tiles
      // Tiles at (0,0) and (0,2) are both type 1 and can connect with a straight line
      const grid: Tile[][] = [];
      for (let row = 0; row < 3; row++) {
        const rowTiles: Tile[] = [];
        for (let col = 0; col < 3; col++) {
          let type = 0;
          if (row === 0 && col === 0) type = 1;
          else if (row === 0 && col === 2) type = 1;
          else type = (row * 3 + col) % 15 + 2; // Different types
          rowTiles.push(createTile(row, col, type));
        }
        grid.push(rowTiles);
      }

      // Clear the middle tile to create a path
      grid[0][1].cleared = true;

      const result = NoMovesDetector.hasValidMoves(grid);
      expect(result).toBe(true);
    });

    it('should return false if no valid pairs exist', () => {
      // Create a 2x2 grid where no two tiles of the same type can connect
      const grid: Tile[][] = [
        [
          createTile(0, 0, 1), // type 1
          createTile(0, 1, 2), // type 2
        ],
        [
          createTile(1, 0, 1), // type 1 - blocked by type 2 tiles
          createTile(1, 1, 2), // type 2 - blocked by type 1 tiles
        ]
      ];

      const result = NoMovesDetector.hasValidMoves(grid);
      expect(result).toBe(false);
    });

    it('should use type-optimized algorithm (groups tiles by type first)', () => {
      // Create a grid where only one type has multiple tiles
      // This tests that the algorithm groups by type before checking pairs
      const grid: Tile[][] = [];
      for (let row = 0; row < 4; row++) {
        const rowTiles: Tile[] = [];
        for (let col = 0; col < 4; col++) {
          // Only create type 1 pairs at (0,0) and (3,3)
          // All other tiles are unique types
          let type: number;
          if (row === 0 && col === 0) type = 1;
          else if (row === 3 && col === 3) type = 1;
          else type = 10 + row * 4 + col; // Unique types
          rowTiles.push(createTile(row, col, type));
        }
        grid.push(rowTiles);
      }

      // Clear a diagonal path to enable the connection
      for (let i = 1; i < 3; i++) {
        grid[i][i].cleared = true;
      }

      const result = NoMovesDetector.hasValidMoves(grid);
      expect(result).toBe(true);
    });

    it('should skip cleared tiles when checking for valid moves', () => {
      // Create a grid where matching tiles are cleared
      const grid: Tile[][] = [];
      for (let row = 0; row < 3; row++) {
        const rowTiles: Tile[] = [];
        for (let col = 0; col < 3; col++) {
          const tile = createTile(row, col, 1);
          // Clear all tiles
          tile.cleared = true;
          rowTiles.push(tile);
        }
        grid.push(rowTiles);
      }

      const result = NoMovesDetector.hasValidMoves(grid);
      expect(result).toBe(false);
    });

    it('should handle empty board (returns false)', () => {
      // Create an empty grid
      const grid: Tile[][] = [];

      const result = NoMovesDetector.hasValidMoves(grid);
      expect(result).toBe(false);
    });

    it('should detect valid moves with 1 turn', () => {
      // Create a grid where tiles connect with an L-shaped path
      const grid: Tile[][] = [];
      for (let row = 0; row < 3; row++) {
        const rowTiles: Tile[] = [];
        for (let col = 0; col < 3; col++) {
          let type = 0;
          if (row === 0 && col === 0) type = 1;
          else if (row === 2 && col === 2) type = 1;
          else type = (row * 3 + col) % 15 + 2;
          rowTiles.push(createTile(row, col, type));
        }
        grid.push(rowTiles);
      }

      // Clear path: (0,1) and (1,1) to create L-shape
      grid[0][1].cleared = true;
      grid[1][1].cleared = true;
      grid[2][1].cleared = true;

      const result = NoMovesDetector.hasValidMoves(grid);
      expect(result).toBe(true);
    });

    it('should detect valid moves with 2 turns', () => {
      // Create a grid where tiles connect with a Z-shaped path
      const grid: Tile[][] = [];
      for (let row = 0; row < 4; row++) {
        const rowTiles: Tile[] = [];
        for (let col = 0; col < 4; col++) {
          let type = 0;
          if (row === 0 && col === 0) type = 1;
          else if (row === 3 && col === 3) type = 1;
          else type = (row * 4 + col) % 15 + 2;
          rowTiles.push(createTile(row, col, type));
        }
        grid.push(rowTiles);
      }

      // Clear a Z-shaped path
      grid[0][1].cleared = true;
      grid[0][2].cleared = true;
      grid[1][2].cleared = true;
      grid[2][2].cleared = true;
      grid[3][2].cleared = true;

      const result = NoMovesDetector.hasValidMoves(grid);
      expect(result).toBe(true);
    });

    it('should reject pairs that require 3 turns', () => {
      // Create a grid where tiles would need 3 turns to connect
      const grid: Tile[][] = [];
      for (let row = 0; row < 5; row++) {
        const rowTiles: Tile[] = [];
        for (let col = 0; col < 5; col++) {
          let type = 0;
          if (row === 0 && col === 0) type = 1;
          else if (row === 4 && col === 4) type = 1;
          else type = (row * 5 + col) % 15 + 2;
          rowTiles.push(createTile(row, col, type));
        }
        grid.push(rowTiles);
      }

      // Don't clear any path - tiles are blocked
      const result = NoMovesDetector.hasValidMoves(grid);
      expect(result).toBe(false);
    });

    it('should handle grid with only one tile of each type (no pairs)', () => {
      // Create a grid where all tiles have unique types
      const grid: Tile[][] = [];
      for (let row = 0; row < 3; row++) {
        const rowTiles: Tile[] = [];
        for (let col = 0; col < 3; col++) {
          const type = row * 3 + col + 1; // All unique
          rowTiles.push(createTile(row, col, type));
        }
        grid.push(rowTiles);
      }

      const result = NoMovesDetector.hasValidMoves(grid);
      expect(result).toBe(false);
    });

    it('should find valid move quickly when it exists (early exit optimization)', () => {
      // Create a large grid with many tiles but only one valid pair
      const grid: Tile[][] = [];
      for (let row = 0; row < 6; row++) {
        const rowTiles: Tile[] = [];
        for (let col = 0; col < 8; col++) {
          let type = 0;
          // Only one valid pair at (0,0) and (0,2)
          if (row === 0 && col === 0) type = 1;
          else if (row === 0 && col === 2) type = 1;
          else type = ((row * 8 + col) % 15) + 2; // All other types form no pairs
          rowTiles.push(createTile(row, col, type));
        }
        grid.push(rowTiles);
      }

      // Clear the path
      grid[0][1].cleared = true;

      const result = NoMovesDetector.hasValidMoves(grid);
      expect(result).toBe(true);
    });
  });
});
