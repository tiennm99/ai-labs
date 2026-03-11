// src/__tests__/GridManager.test.ts - GridManager unit tests
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { GridManager } from '../managers/GridManager';
import { Tile } from '../models/Tile';
import { TypedEventEmitter } from '../game/EventEmitter';
import { GameEvents } from '../types';

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
});
