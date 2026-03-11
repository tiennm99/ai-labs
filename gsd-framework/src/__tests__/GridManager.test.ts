// src/__tests__/GridManager.test.ts - GridManager unit tests
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { GridManager } from '../managers/GridManager';
import { Tile } from '../models/Tile';
import { TypedEventEmitter } from '../game/EventEmitter';
import { GameEvents } from '../types';
import { NoMovesDetector } from '../detection/NoMovesDetector';

describe('GridManager', () => {
  let gridManager: GridManager;
  let mockEmitter: TypedEventEmitter<GameEvents>;

  beforeEach(() => {
    mockEmitter = new TypedEventEmitter<GameEvents>();
    gridManager = new GridManager(mockEmitter);
  });

  describe('initializeGrid', () => {
    it('should create a 10x16 grid of Tile objects (160 total)', () => {
      gridManager.initializeGrid();
      let totalTiles = 0;
      for (let row = 0; row < 10; row++) {
        for (let col = 0; col < 16; col++) {
          const tile = gridManager.getTileAt(row, col);
          expect(tile).not.toBeNull();
          if (tile) totalTiles++;
        }
      }
      expect(totalTiles).toBe(160);
    });

    it('should assign unique IDs to all tiles', () => {
      gridManager.initializeGrid();
      const ids = new Set<string>();
      for (let row = 0; row < 10; row++) {
        for (let col = 0; col < 16; col++) {
          const tile = gridManager.getTileAt(row, col);
          expect(tile).not.toBeNull();
          if (tile) {
            expect(ids.has(tile.id)).toBe(false);
            ids.add(tile.id);
          }
        }
      }
      expect(ids.size).toBe(160);
    });
  });

  describe('getTileAt', () => {
    beforeEach(() => {
      gridManager.initializeGrid();
    });

    it('should return the correct tile at valid coordinates', () => {
      const tile = gridManager.getTileAt(5, 8);
      expect(tile).not.toBeNull();
      expect(tile?.position.row).toBe(5);
      expect(tile?.position.col).toBe(8);
    });

    it('should return null for out-of-bounds coordinates', () => {
      expect(gridManager.getTileAt(-1, 0)).toBeNull();
      expect(gridManager.getTileAt(0, -1)).toBeNull();
      expect(gridManager.getTileAt(10, 0)).toBeNull();
      expect(gridManager.getTileAt(0, 16)).toBeNull();
    });
  });

  describe('selectTile', () => {
    beforeEach(() => {
      gridManager.initializeGrid();
    });

    it('should add first tile to selection', () => {
      const tile = gridManager.getTileAt(0, 0);
      expect(tile).not.toBeNull();
      if (tile) {
        gridManager.selectTile(tile);
        expect(gridManager.selectedTilesList.length).toBe(1);
        expect(gridManager.selectedTilesList[0]).toBe(tile);
      }
    });

    it('should add second tile to selection', () => {
      const tile1 = gridManager.getTileAt(0, 0);
      const tile2 = gridManager.getTileAt(0, 1);
      expect(tile1 && tile2).not.toBeNull();
      if (tile1 && tile2) {
        gridManager.selectTile(tile1);
        gridManager.selectTile(tile2);
        expect(gridManager.selectedTilesList.length).toBe(2);
        expect(gridManager.selectedTilesList[0]).toBe(tile1);
        expect(gridManager.selectedTilesList[1]).toBe(tile2);
      }
    });

    it('should toggle deselect when same tile clicked', () => {
      const tile = gridManager.getTileAt(0, 0);
      expect(tile).not.toBeNull();
      if (tile) {
        gridManager.selectTile(tile);
        expect(gridManager.selectedTilesList.length).toBe(1);
        gridManager.selectTile(tile); // Click same tile again
        expect(gridManager.selectedTilesList.length).toBe(0);
      }
    });

    it('should ignore cleared tiles', () => {
      const tile1 = gridManager.getTileAt(0, 0);
      const tile2 = gridManager.getTileAt(0, 1);
      expect(tile1 && tile2).not.toBeNull();
      if (tile1 && tile2) {
        gridManager.selectTile(tile1);
        tile2.cleared = true;
        gridManager.selectTile(tile2);
        expect(gridManager.selectedTilesList.length).toBe(1);
        expect(gridManager.selectedTilesList[0]).toBe(tile1);
      }
    });

    it('should emit tilesSelected event when 2 tiles selected', () => {
      const tile1 = gridManager.getTileAt(0, 0);
      const tile2 = gridManager.getTileAt(0, 1);
      expect(tile1 && tile2).not.toBeNull();

      const emitSpy = vi.spyOn(mockEmitter, 'emit');
      if (tile1 && tile2) {
        gridManager.selectTile(tile1);
        gridManager.selectTile(tile2);
        expect(emitSpy).toHaveBeenCalledWith('tilesSelected', {
          tile1: tile1,
          tile2: tile2,
        });
      }
    });

    it('should block selection of 3rd tile when 2 already selected', () => {
      const tile1 = gridManager.getTileAt(0, 0);
      const tile2 = gridManager.getTileAt(0, 1);
      const tile3 = gridManager.getTileAt(0, 2);
      expect(tile1 && tile2 && tile3).not.toBeNull();

      if (tile1 && tile2 && tile3) {
        gridManager.selectTile(tile1);
        gridManager.selectTile(tile2);
        gridManager.selectTile(tile3); // Should be ignored
        expect(gridManager.selectedTilesList.length).toBe(2);
        expect(gridManager.selectedTilesList[0]).toBe(tile1);
        expect(gridManager.selectedTilesList[1]).toBe(tile2);
      }
    });
  });

  describe('deselectAll', () => {
    beforeEach(() => {
      gridManager.initializeGrid();
    });

    it('should clear all selected tiles', () => {
      const tile1 = gridManager.getTileAt(0, 0);
      const tile2 = gridManager.getTileAt(0, 1);
      expect(tile1 && tile2).not.toBeNull();
      if (tile1 && tile2) {
        gridManager.selectTile(tile1);
        gridManager.selectTile(tile2);
        expect(gridManager.selectedTilesList.length).toBe(2);
        gridManager.deselectAll();
        expect(gridManager.selectedTilesList.length).toBe(0);
      }
    });
  });

  describe('initial selection state', () => {
    it('should have empty selection initially (0 tiles selected)', () => {
      gridManager.initializeGrid();
      expect(gridManager.selectedTilesList.length).toBe(0);
    });
  });

  describe('random board generation', () => {
    it('should create a grid with exactly 10 pairs of each of the 16 types', () => {
      gridManager.initializeGrid();
      const typeCounts = new Map<number, number>();

      for (let row = 0; row < 10; row++) {
        for (let col = 0; col < 16; col++) {
          const tile = gridManager.getTileAt(row, col);
          expect(tile).not.toBeNull();
          if (tile) {
            const count = typeCounts.get(tile.type) || 0;
            typeCounts.set(tile.type, count + 1);
          }
        }
      }

      // Should have exactly 16 types
      expect(typeCounts.size).toBe(16);

      // Each type should have exactly 10 pairs (20 tiles each)
      for (const [type, count] of typeCounts.entries()) {
        expect(count).toBe(10);
      }
    });

    it('should produce different tile arrangements on successive calls (statistical)', () => {
      // Generate two boards and compare first row arrangements
      gridManager.initializeGrid();
      const firstBoard: number[] = [];
      for (let col = 0; col < 16; col++) {
        const tile = gridManager.getTileAt(0, col);
        if (tile) firstBoard.push(tile.type);
      }

      gridManager.initializeGrid();
      const secondBoard: number[] = [];
      for (let col = 0; col < 16; col++) {
        const tile = gridManager.getTileAt(0, col);
        if (tile) secondBoard.push(tile.type);
      }

      // Arrays should be different (statistically very unlikely to be same with shuffle)
      expect(firstBoard).not.toEqual(secondBoard);
    });

    it('should assign correct positions to all tiles', () => {
      gridManager.initializeGrid();

      for (let row = 0; row < 10; row++) {
        for (let col = 0; col < 16; col++) {
          const tile = gridManager.getTileAt(row, col);
          expect(tile).not.toBeNull();
          if (tile) {
            expect(tile.position.row).toBe(row);
            expect(tile.position.col).toBe(col);
          }
        }
      }
    });

    it('should emit board:generated event with solvable=true when solvable board found', () => {
      const emitSpy = vi.spyOn(mockEmitter, 'emit');

      gridManager.initializeGrid();

      // Should have emitted board:generated event
      const calls = emitSpy.mock.calls.filter(call => call[0] === 'board:generated');
      expect(calls.length).toBeGreaterThanOrEqual(1);

      // Check event payload structure
      const eventPayload = calls[0][1] as { solvable: boolean; attempts: number };
      expect(eventPayload).toHaveProperty('solvable');
      expect(eventPayload).toHaveProperty('attempts');
      expect(typeof eventPayload.solvable).toBe('boolean');
      expect(typeof eventPayload.attempts).toBe('number');
    });

    it('should emit board:generated event with attempts count', () => {
      const emitSpy = vi.spyOn(mockEmitter, 'emit');

      gridManager.initializeGrid();

      const calls = emitSpy.mock.calls.filter(call => call[0] === 'board:generated');
      expect(calls.length).toBeGreaterThanOrEqual(1);

      const eventPayload = calls[0][1] as { solvable: boolean; attempts: number };
      expect(eventPayload.attempts).toBeGreaterThanOrEqual(1);
      expect(eventPayload.attempts).toBeLessThanOrEqual(100);
    });

    it('should generate solvable boards when possible, or fallback to last board', () => {
      // This test verifies the board generation logic works correctly
      // Either a solvable board is found OR the fallback mechanism is used

      const emitSpy = vi.spyOn(mockEmitter, 'emit');

      gridManager.initializeGrid();

      const calls = emitSpy.mock.calls.filter(call => call[0] === 'board:generated');
      expect(calls.length).toBeGreaterThanOrEqual(1);

      const eventPayload = calls[0][1] as { solvable: boolean; attempts: number };

      // Verify the event was emitted with valid data
      expect(typeof eventPayload.solvable).toBe('boolean');
      expect(eventPayload.attempts).toBeGreaterThanOrEqual(1);
      expect(eventPayload.attempts).toBeLessThanOrEqual(100);

      // If solvable, verify the board actually has valid moves
      if (eventPayload.solvable) {
        const tiles = gridManager.getAllTiles();
        const hasValidMoves = NoMovesDetector.hasValidMoves(tiles);
        expect(hasValidMoves).toBe(true);
      }

      // If not solvable (fallback), verify attempts = 100
      if (!eventPayload.solvable) {
        expect(eventPayload.attempts).toBe(100);
      }
    });
  });

  describe('shuffleTiles', () => {
    beforeEach(() => {
      gridManager.initializeGrid();
    });

    it('should collect all uncleared tiles and preserve tile count', () => {
      const beforeCount = gridManager.getAllTiles().flat().filter(t => !t.cleared).length;

      gridManager.shuffleTiles();

      const afterCount = gridManager.getAllTiles().flat().filter(t => !t.cleared).length;
      expect(afterCount).toBe(beforeCount);
    });

    it('should preserve type distribution (same count of each type)', () => {
      // Get type distribution before shuffle
      const beforeCounts = new Map<number, number>();
      for (let row = 0; row < 10; row++) {
        for (let col = 0; col < 16; col++) {
          const tile = gridManager.getTileAt(row, col);
          if (tile && !tile.cleared) {
            const count = beforeCounts.get(tile.type) || 0;
            beforeCounts.set(tile.type, count + 1);
          }
        }
      }

      gridManager.shuffleTiles();

      // Get type distribution after shuffle
      const afterCounts = new Map<number, number>();
      for (let row = 0; row < 10; row++) {
        for (let col = 0; col < 16; col++) {
          const tile = gridManager.getTileAt(row, col);
          if (tile && !tile.cleared) {
            const count = afterCounts.get(tile.type) || 0;
            afterCounts.set(tile.type, count + 1);
          }
        }
      }

      // Compare distributions
      expect(afterCounts.size).toBe(beforeCounts.size);
      for (const [type, count] of beforeCounts.entries()) {
        expect(afterCounts.get(type)).toBe(count);
      }
    });

    it('should produce different type arrangements on successive calls (statistical)', () => {
      // Get types before shuffle
      const beforeTypes: number[] = [];
      for (let row = 0; row < 10; row++) {
        for (let col = 0; col < 16; col++) {
          const tile = gridManager.getTileAt(row, col);
          if (tile) beforeTypes.push(tile.type);
        }
      }

      gridManager.shuffleTiles();

      // Get types after shuffle
      const afterTypes: number[] = [];
      for (let row = 0; row < 10; row++) {
        for (let col = 0; col < 16; col++) {
          const tile = gridManager.getTileAt(row, col);
          if (tile) afterTypes.push(tile.type);
        }
      }

      // Arrays should be different (statistically very unlikely to be same with Fisher-Yates)
      expect(afterTypes).not.toEqual(beforeTypes);
    });

    it('should clear selection (selectedTilesList is empty after)', () => {
      // Select some tiles first
      const tile1 = gridManager.getTileAt(0, 0);
      const tile2 = gridManager.getTileAt(0, 1);
      if (tile1 && tile2) {
        gridManager.selectTile(tile1);
        gridManager.selectTile(tile2);
        expect(gridManager.selectedTilesList.length).toBe(2);
      }

      gridManager.shuffleTiles();

      expect(gridManager.selectedTilesList.length).toBe(0);
    });

    it('should emit board:shuffling event before shuffle', () => {
      const emitSpy = vi.spyOn(mockEmitter, 'emit');

      gridManager.shuffleTiles();

      // Should have emitted board:shuffling event
      const shufflingCalls = emitSpy.mock.calls.filter(call => call[0] === 'board:shuffling');
      expect(shufflingCalls.length).toBe(1);

      // Check event payload
      const payload = shufflingCalls[0][1] as { tilesRemaining: number };
      expect(payload).toHaveProperty('tilesRemaining');
      expect(payload.tilesRemaining).toBe(160);
    });

    it('should emit board:shuffled event after shuffle', () => {
      const emitSpy = vi.spyOn(mockEmitter, 'emit');

      gridManager.shuffleTiles();

      // Should have emitted board:shuffled event
      const shuffledCalls = emitSpy.mock.calls.filter(call => call[0] === 'board:shuffled');
      expect(shuffledCalls.length).toBe(1);

      // Check event payload
      const payload = shuffledCalls[0][1] as { tilesRemaining: number };
      expect(payload).toHaveProperty('tilesRemaining');
      expect(payload.tilesRemaining).toBe(160);
    });

    it('should emit events in correct order (shuffling before shuffled)', () => {
      const emitSpy = vi.spyOn(mockEmitter, 'emit');

      gridManager.shuffleTiles();

      // Get all board:shuffl* events (note: 'board:shuffle' won't match 'board:shuffling')
      const shuffleEvents = emitSpy.mock.calls
        .filter(call => call[0] === 'board:shuffling' || call[0] === 'board:shuffled')
        .map(call => call[0]);

      expect(shuffleEvents[0]).toBe('board:shuffling');
      expect(shuffleEvents[1]).toBe('board:shuffled');
    });

    it('should preserve tile positions (tiles stay in same grid locations)', () => {
      // Store original positions
      const originalPositions: Map<string, { row: number; col: number }> = new Map();
      for (let row = 0; row < 10; row++) {
        for (let col = 0; col < 16; col++) {
          const tile = gridManager.getTileAt(row, col);
          if (tile) {
            originalPositions.set(tile.id, { ...tile.position });
          }
        }
      }

      gridManager.shuffleTiles();

      // Verify positions are unchanged
      for (let row = 0; row < 10; row++) {
        for (let col = 0; col < 16; col++) {
          const tile = gridManager.getTileAt(row, col);
          if (tile) {
            const original = originalPositions.get(tile.id);
            expect(original).toBeDefined();
            expect(tile.position.row).toBe(original!.row);
            expect(tile.position.col).toBe(original!.col);
          }
        }
      }
    });

    it('should handle partially cleared board (skip cleared tiles)', () => {
      // Clear some tiles first
      const tile1 = gridManager.getTileAt(0, 0);
      const tile2 = gridManager.getTileAt(0, 1);
      if (tile1 && tile2) {
        tile1.cleared = true;
        tile2.cleared = true;
      }

      const remainingBefore = gridManager.getAllTiles().flat().filter(t => !t.cleared).length;
      expect(remainingBefore).toBe(158);

      const emitSpy = vi.spyOn(mockEmitter, 'emit');

      gridManager.shuffleTiles();

      // Check tilesRemaining in events reflects cleared tiles
      const shufflingCalls = emitSpy.mock.calls.filter(call => call[0] === 'board:shuffling');
      const payload = shufflingCalls[0][1] as { tilesRemaining: number };
      expect(payload.tilesRemaining).toBe(158);

      // Verify cleared tiles are still cleared
      expect(tile1?.cleared).toBe(true);
      expect(tile2?.cleared).toBe(true);

      // Verify remaining count unchanged
      const remainingAfter = gridManager.getAllTiles().flat().filter(t => !t.cleared).length;
      expect(remainingAfter).toBe(158);
    });
  });
});
