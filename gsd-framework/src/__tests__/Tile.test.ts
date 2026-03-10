// src/__tests__/Tile.test.ts - Unit tests for Tile model class
import { describe, it, expect } from 'vitest';
import { Tile } from '../models/Tile';
import { TilePosition } from '../types';
import { CONFIG } from '../config';

describe('Tile', () => {
  describe('constructor', () => {
    it('should set id, type, and position properties', () => {
      const position: TilePosition = { row: 0, col: 1 };
      const tile = new Tile('tile-1', 0, position);

      expect(tile.id).toBe('tile-1');
      expect(tile.type).toBe(0);
      expect(tile.position).toEqual(position);
    });

    it('should set cleared property to false by default', () => {
      const tile = new Tile('tile-1', 0, { row: 0, col: 0 });
      expect(tile.cleared).toBe(false);
    });

    it('should allow cleared to be set to true', () => {
      const tile = new Tile('tile-1', 0, { row: 0, col: 0 });
      tile.cleared = true;
      expect(tile.cleared).toBe(true);
    });
  });

  describe('emoji getter', () => {
    it('should return correct emoji for type 0', () => {
      const tile = new Tile('tile-1', 0, { row: 0, col: 0 });
      expect(tile.emoji).toBe(CONFIG.emojis[0]);
    });

    it('should return correct emoji for type 7', () => {
      const tile = new Tile('tile-1', 7, { row: 0, col: 0 });
      expect(tile.emoji).toBe(CONFIG.emojis[7]);
    });

    it('should return correct emoji for type 15 (last)', () => {
      const tile = new Tile('tile-1', 15, { row: 0, col: 0 });
      expect(tile.emoji).toBe(CONFIG.emojis[15]);
    });

    it('should return all 16 emojis correctly', () => {
      for (let i = 0; i < 16; i++) {
        const tile = new Tile(`tile-${i}`, i, { row: 0, col: 0 });
        expect(tile.emoji).toBe(CONFIG.emojis[i]);
      }
    });
  });

  describe('isAdjacent()', () => {
    it('should return true for tiles adjacent horizontally', () => {
      const tile1 = new Tile('tile-1', 0, { row: 0, col: 0 });
      const tile2 = new Tile('tile-2', 0, { row: 0, col: 1 });
      expect(tile1.isAdjacent(tile2)).toBe(true);
      expect(tile2.isAdjacent(tile1)).toBe(true);
    });

    it('should return true for tiles adjacent vertically', () => {
      const tile1 = new Tile('tile-1', 0, { row: 0, col: 0 });
      const tile2 = new Tile('tile-2', 0, { row: 1, col: 0 });
      expect(tile1.isAdjacent(tile2)).toBe(true);
      expect(tile2.isAdjacent(tile1)).toBe(true);
    });

    it('should return false for diagonal tiles', () => {
      const tile1 = new Tile('tile-1', 0, { row: 0, col: 0 });
      const tile2 = new Tile('tile-2', 0, { row: 1, col: 1 });
      expect(tile1.isAdjacent(tile2)).toBe(false);
      expect(tile2.isAdjacent(tile1)).toBe(false);
    });

    it('should return false for tiles with gap of 2', () => {
      const tile1 = new Tile('tile-1', 0, { row: 0, col: 0 });
      const tile2 = new Tile('tile-2', 0, { row: 0, col: 2 });
      expect(tile1.isAdjacent(tile2)).toBe(false);
    });

    it('should return false for the same tile', () => {
      const tile = new Tile('tile-1', 0, { row: 0, col: 0 });
      expect(tile.isAdjacent(tile)).toBe(false);
    });

    it('should return false for tiles far apart', () => {
      const tile1 = new Tile('tile-1', 0, { row: 0, col: 0 });
      const tile2 = new Tile('tile-2', 0, { row: 5, col: 3 });
      expect(tile1.isAdjacent(tile2)).toBe(false);
    });

    it('should handle edge positions correctly', () => {
      // Bottom right corner
      const cornerTile = new Tile('tile-1', 0, { row: 9, col: 15 });
      const adjacentLeft = new Tile('tile-2', 0, { row: 9, col: 14 });
      const adjacentTop = new Tile('tile-3', 0, { row: 8, col: 15 });

      expect(cornerTile.isAdjacent(adjacentLeft)).toBe(true);
      expect(cornerTile.isAdjacent(adjacentTop)).toBe(true);
    });
  });

  describe('readonly properties', () => {
    it('should have readonly id', () => {
      const tile = new Tile('tile-1', 0, { row: 0, col: 0 });
      // TypeScript enforces readonly at compile time
      // This test confirms the property exists and has correct value
      expect(tile.id).toBe('tile-1');
    });

    it('should have readonly type', () => {
      const tile = new Tile('tile-1', 5, { row: 0, col: 0 });
      expect(tile.type).toBe(5);
    });

    it('should have readonly position', () => {
      const tile = new Tile('tile-1', 0, { row: 3, col: 7 });
      expect(tile.position.row).toBe(3);
      expect(tile.position.col).toBe(7);
    });
  });
});
