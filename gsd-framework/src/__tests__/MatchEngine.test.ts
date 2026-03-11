// src/__tests__/MatchEngine.test.ts - Test suite for MatchEngine
import { describe, it, expect, beforeEach } from 'vitest';
import { MatchEngine } from '../matching/MatchEngine';
import { GridManager } from '../managers/GridManager';
import { TypedEventEmitter } from '../game/EventEmitter';
import { GameEvents, Tile, TilePosition } from '../types';
import { CONFIG } from '../config';

describe('MatchEngine', () => {
  let gridManager: GridManager;
  let events: TypedEventEmitter<GameEvents>;
  let matchEngine: MatchEngine;
  let grid: Tile[][];

  beforeEach(() => {
    events = new TypedEventEmitter<GameEvents>();
    gridManager = new GridManager(events);
    gridManager.initializeGrid();
    matchEngine = new MatchEngine(gridManager, events);
    grid = gridManager.getAllTiles();
  });

  describe('validateMatch', () => {
    it('should return valid=false with reason different-type for different tile types', () => {
      const tile1 = grid[0][0]; // type 0
      const tile2 = grid[0][1]; // type 1

      const result = matchEngine.validateMatch(tile1, tile2);

      expect(result.valid).toBe(false);
      expect(result.reason).toBe('different-type');
    });

    it('should return valid=false with reason same-tile for same tile ID', () => {
      const tile1 = grid[0][0];
      const tile2 = grid[0][0]; // Same tile

      const result = matchEngine.validateMatch(tile1, tile2);

      expect(result.valid).toBe(false);
      expect(result.reason).toBe('same-tile');
    });

    it('should return valid=true with path and turns=0 for matching tiles with valid 0-turn path', () => {
      // Create two tiles of same type in same row with cleared tiles between
      const tile1 = grid[0][0];
      const tile2 = grid[0][1];

      // Make them same type
      (tile2 as any).type = tile1.type;

      // Clear tiles between them (they're adjacent, so no tiles between)
      // Mark destination as cleared so it's passable
      (tile2 as any).cleared = true;

      const result = matchEngine.validateMatch(tile1, tile2);

      expect(result.valid).toBe(true);
      expect(result.path).toBeDefined();
      expect(result.turns).toBe(0);
      expect(result.score).toBeDefined();
    });

    it('should return valid=true with path and turns=1 for matching tiles with valid 1-turn path', () => {
      // Create L-shaped path scenario
      const tile1 = grid[0][0];
      const tile2 = grid[1][1];

      // Make them same type
      (tile2 as any).type = tile1.type;

      // Clear the path: (0,0) -> (0,1) -> (1,1)
      grid[0][1].cleared = true;
      tile2.cleared = true;

      const result = matchEngine.validateMatch(tile1, tile2);

      expect(result.valid).toBe(true);
      expect(result.path).toBeDefined();
      expect(result.turns).toBe(1);
      expect(result.score).toBeDefined();
    });

    it('should return valid=true with path and turns=2 for matching tiles with valid 2-turn path', () => {
      // Create Z-shaped path scenario
      const tile1 = grid[0][0];
      const tile2 = grid[2][1];

      // Make them same type
      (tile2 as any).type = tile1.type;

      // Clear the path: (0,0) -> (0,1) -> (1,1) -> (2,1)
      grid[0][1].cleared = true;
      grid[1][1].cleared = true;
      tile2.cleared = true;

      const result = matchEngine.validateMatch(tile1, tile2);

      expect(result.valid).toBe(true);
      expect(result.path).toBeDefined();
      expect(result.turns).toBe(2);
      expect(result.score).toBeDefined();
    });

    it('should return valid=false with reason too-many-turns for matching tiles with 3+ turn path', () => {
      // Create a path that requires 3 turns
      const tile1 = grid[0][0];
      const tile2 = grid[2][2];

      // Make them same type
      (tile2 as any).type = tile1.type;

      // Clear a winding path that requires 3 turns
      grid[0][1].cleared = true;
      grid[0][2].cleared = true;
      grid[1][2].cleared = true;
      tile2.cleared = true;

      const result = matchEngine.validateMatch(tile1, tile2);

      expect(result.valid).toBe(false);
      expect(result.reason).toBe('too-many-turns');
      expect(result.turns).toBeGreaterThan(2);
    });

    it('should return valid=false with reason no-path for matching tiles with no valid path (blocked)', () => {
      const tile1 = grid[0][0];
      const tile2 = grid[0][2];

      // Make them same type
      (tile2 as any).type = tile1.type;

      // Don't clear any tiles - path is blocked
      // Only destination is cleared
      tile2.cleared = true;

      const result = matchEngine.validateMatch(tile1, tile2);

      expect(result.valid).toBe(false);
      expect(result.reason).toBe('no-path');
    });

    it('should calculate correct score for valid matches', () => {
      const tile1 = grid[0][0];
      const tile2 = grid[0][1];

      // Make them same type
      (tile2 as any).type = tile1.type;
      tile2.cleared = true;

      const result = matchEngine.validateMatch(tile1, tile2);

      expect(result.valid).toBe(true);
      expect(result.score).toBe(150); // 0-turn = 150 points
    });
  });
});
